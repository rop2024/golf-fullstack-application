import { createClient } from '@supabase/supabase-js';
import stripe from '../config/stripe.js';
import { createSubscriptionRecord, updateSubscriptionRecord } from './supabase.service.js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Price ID mappings
const PRICE_PLANS = {
  [process.env.STRIPE_PRICE_PREMIUM_MONTHLY]: { plan: 'premium', duration: 'monthly' },
  [process.env.STRIPE_PRICE_PRO_MONTHLY]: { plan: 'pro', duration: 'monthly' },
  [process.env.STRIPE_PRICE_PREMIUM_YEARLY]: { plan: 'premium', duration: 'yearly' },
  [process.env.STRIPE_PRICE_PRO_YEARLY]: { plan: 'pro', duration: 'yearly' }
};

// Calculate expiry date
const calculateExpiryDate = (duration) => {
  const now = new Date();
  if (duration === 'yearly') {
    now.setFullYear(now.getFullYear() + 1);
  } else {
    now.setMonth(now.getMonth() + 1);
  }
  return now.toISOString();
};

// Handle checkout session completed
export const handleCheckoutCompleted = async (session) => {
  try {
    const customerId = session.customer;
    const priceId = session.line_items?.data[0]?.price?.id;

    if (!customerId || !priceId) {
      throw new Error('Missing customer ID or price ID');
    }

    // Find user by Stripe customer ID
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId);

    if (profileError) throw profileError;

    if (!profiles || profiles.length === 0) {
      throw new Error(`User not found for customer ID: ${customerId}`);
    }

    const userId = profiles[0].id;
    const planInfo = PRICE_PLANS[priceId];

    if (!planInfo) {
      throw new Error(`Unknown price ID: ${priceId}`);
    }

    const startDate = new Date();
    const endDate = calculateExpiryDate(planInfo.duration);

    // Insert subscription record
    const subscriptionData = {
      user_id: userId,
      stripe_subscription_id: session.subscription,
      plan: planInfo.duration,
      status: 'active',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      stripe_customer_id: customerId
    };

    const { subscription: subRecord, error: subError } = await createSubscriptionRecord(subscriptionData);

    if (subError) throw subError;

    // Update profiles table for current status
    const { data: profile, error: profError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: planInfo.plan,
        subscription_expires_at: endDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (profError) throw profError;

    console.log(`Created subscription for user ${userId}: ${planInfo.plan} ${planInfo.duration} until ${endDate}`);
    return { success: true };

  } catch (error) {
    console.error('Error handling checkout completed:', error);
    return { success: false, error: error.message };
  }
};

// Handle invoice payment succeeded (renewal)
export const handleInvoicePaymentSucceeded = async (invoice) => {
  try {
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0].price.id;

    const planInfo = PRICE_PLANS[priceId];
    if (!planInfo) {
      throw new Error(`Unknown price ID: ${priceId}`);
    }

    // Find user by Stripe customer ID
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId);

    if (profileError) throw profileError;

    if (!profiles || profiles.length === 0) {
      throw new Error(`User not found for customer ID: ${customerId}`);
    }

    const userId = profiles[0].id;
    const newEndDate = calculateExpiryDate(planInfo.duration);

    // Update subscription record
    const { subscription: subData, error: subError } = await updateSubscriptionRecord(
      null,
      { end_date: newEndDate.toISOString() },
      subscriptionId
    );

    if (subError) throw subError;

    // Update profiles table
    const { data: profData, error: profError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_expires_at: newEndDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (profError) throw profError;

    console.log(`Renewed subscription for user ${userId} until ${newEndDate}`);
    return { success: true };

  } catch (error) {
    console.error('Error handling invoice payment:', error);
    return { success: false, error: error.message };
  }
};

// Handle subscription deleted
export const handleSubscriptionDeleted = async (subscription) => {
  try {
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;

    // Find user by Stripe customer ID
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId);

    if (profileError) throw profileError;

    if (!profiles || profiles.length === 0) {
      throw new Error(`User not found for customer ID: ${customerId}`);
    }

    const userId = profiles[0].id;

    // Update subscription record
    const { subscription: subData, error: subError } = await updateSubscriptionRecord(
      null,
      {
        status: 'cancelled',
        end_date: new Date().toISOString()
      },
      subscriptionId
    );

    if (subError) throw subError;

    // Update profiles table
    const { data: profData, error: profError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_status: 'free',
        subscription_expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (profError) throw profError;

    console.log(`Cancelled subscription for user ${userId}`);
    return { success: true };

  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    return { success: false, error: error.message };
  }
};