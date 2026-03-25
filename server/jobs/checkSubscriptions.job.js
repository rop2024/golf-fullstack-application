import { supabaseAdmin } from '../services/supabase.service.js';
import notificationService from '../services/notification.service.js';

export const checkExpiringSubscriptions = async () => {
  console.log('🔍 Checking expiring subscriptions...');
  
  try {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    // Find subscriptions expiring in the next 7 days
    const { data: expiringSubscriptions } = await supabaseAdmin
      .from('profiles')
      .select('id, email, username, subscription_expires_at')
      .eq('subscription_status', 'premium')
      .not('subscription_expires_at', 'is', null)
      .lte('subscription_expires_at', sevenDaysFromNow.toISOString())
      .gt('subscription_expires_at', today.toISOString());
    
    if (expiringSubscriptions && expiringSubscriptions.length > 0) {
      console.log(`  - Found ${expiringSubscriptions.length} expiring subscriptions`);
      
      for (const user of expiringSubscriptions) {
        await notificationService.sendSubscriptionExpiryReminder(
          user.id,
          user.subscription_expires_at
        );
        console.log(`    ✓ Reminder sent to ${user.email}`);
      }
    }
    
    // Find expired subscriptions and downgrade them
    const { data: expiredSubscriptions } = await supabaseAdmin
      .from('profiles')
      .select('id, email, username, subscription_expires_at')
      .eq('subscription_status', 'premium')
      .lt('subscription_expires_at', today.toISOString());
    
    if (expiredSubscriptions && expiredSubscriptions.length > 0) {
      console.log(`  - Found ${expiredSubscriptions.length} expired subscriptions to downgrade`);
      
      for (const user of expiredSubscriptions) {
        await supabaseAdmin
          .from('profiles')
          .update({ 
            subscription_status: 'free',
            subscription_expires_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        
        console.log(`    ✓ Downgraded user: ${user.email}`);
        
        // Send notification about downgrade
        await notificationService.sendEmail(
          user.email,
          'Your Premium Subscription Has Expired',
          `
          <div style="font-family: Arial, sans-serif;">
            <h2>Subscription Expired</h2>
            <p>Your premium subscription has expired. You've been downgraded to the free plan.</p>
            <p>Renew your subscription to continue enjoying premium benefits!</p>
            <a href="${process.env.APP_URL}/subscription">Upgrade Now</a>
          </div>
          `
        );
      }
    }
    
    console.log('✅ Subscription check completed');
    
    return {
      success: true,
      expiringCount: expiringSubscriptions?.length || 0,
      expiredCount: expiredSubscriptions?.length || 0
    };
    
  } catch (error) {
    console.error('Subscription check failed:', error);
    throw error;
  }
};