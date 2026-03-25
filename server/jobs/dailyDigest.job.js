import { supabaseAdmin } from '../services/supabase.service.js';
import notificationService from '../services/notification.service.js';

export const sendDailyDigest = async () => {
  console.log('📧 Sending daily digest...');
  
  try {
    // Get all users with email notifications enabled
    const { data: users } = await supabaseAdmin
      .from('profiles')
      .select('email, username, id');
    
    if (!users || users.length === 0) {
      console.log('No users found for digest');
      return { success: true, sent: 0 };
    }
    
    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    
    const { data: stats } = await supabaseAdmin
      .from('daily_stats')
      .select('*')
      .eq('date', today)
      .single();
    
    // Get active draw
    const { data: activeDraw } = await supabaseAdmin
      .from('draws')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    // Get recent winners
    const { data: recentWinners } = await supabaseAdmin
      .from('winners_view')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Prepare digest email
    const subject = `🎲 Daily Lottery Digest - ${new Date().toLocaleDateString()}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Daily Lottery Digest</h1>
          <p style="color: white; opacity: 0.9;">${new Date().toLocaleDateString()}</p>
        </div>
        <div style="padding: 30px; background: white; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          
          ${stats ? `
          <div style="background: #f7f7f7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0;">📊 Today's Statistics</h3>
            <p><strong>Active Users:</strong> ${stats.active_users}</p>
            <p><strong>Total Draws:</strong> ${stats.total_draws}</p>
            <p><strong>Total Entries:</strong> ${stats.total_entries}</p>
            <p><strong>Prizes Awarded:</strong> $${stats.total_prizes_awarded}</p>
          </div>
          ` : ''}
          
          ${activeDraw ? `
          <div style="background: #FFF3E0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0;">🎲 Active Draw</h3>
            <p><strong>Prize Pool:</strong> $${activeDraw.prize_pool}</p>
            <p><strong>Ends:</strong> ${new Date(activeDraw.date).toLocaleDateString()}</p>
            <a href="${process.env.APP_URL}/draw" style="display: inline-block; background: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Enter Now →
            </a>
          </div>
          ` : ''}
          
          ${recentWinners && recentWinners.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0;">🏆 Recent Winners</h3>
            ${recentWinners.map(winner => `
              <div style="border-bottom: 1px solid #e0e0e0; padding: 10px 0;">
                <p style="margin: 0;"><strong>${winner.username || 'Anonymous'}</strong> won <strong style="color: #4CAF50;">$${winner.prize_amount}</strong> with ${winner.match_count} matches!</p>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
          
          <div style="text-align: center;">
            <a href="${process.env.APP_URL}/draw" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
              Play Now
            </a>
          </div>
          
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
            You're receiving this because you have a Lottery App account.
            <br>
            <a href="${process.env.APP_URL}/settings/notifications" style="color: #999;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `;
    
    // Send emails in batches
    let sentCount = 0;
    for (const user of users) {
      const result = await notificationService.sendEmail(user.email, subject, html);
      if (result.success) sentCount++;
      await new Promise(resolve => setTimeout(resolve, 50)); // Rate limiting
    }
    
    console.log(`✅ Daily digest sent to ${sentCount} users`);
    
    return { success: true, sent: sentCount };
    
  } catch (error) {
    console.error('Daily digest failed:', error);
    throw error;
  }
};