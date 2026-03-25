import drawService from '../services/draw.service.js';
import notificationService from '../services/notification.service.js';
import { supabaseAdmin } from '../services/supabase.service.js';

export const runMonthlyDraw = async () => {
  console.log('🎲 Starting monthly draw process...');
  
  try {
    // Step 1: Check if there's an active draw
    const activeDraw = await drawService.getActiveDraw();
    
    if (activeDraw.success && activeDraw.draw) {
      console.log('Active draw found, executing it first...');
      const result = await drawService.executeDraw(activeDraw.draw.id);
      if (result.success) {
        console.log(`✅ Previous draw executed with ${result.winners.length} winners`);
        
        // Notify winners
        for (const winner of result.winners) {
          await notificationService.notifyWinner(
            winner.user_id,
            winner.draw_id,
            winner.prize_amount,
            winner.match_count
          );
        }
      }
    }
    
    // Step 2: Calculate prize pool (base $1000 + 50% of last month's revenue)
    let prizePool = 1000;
    
    // Get last month's entries count for bonus calculation
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const { data: lastMonthEntries } = await supabaseAdmin
      .from('draw_entries')
      .select('count', { count: 'exact' })
      .gte('created_at', lastMonth.toISOString());
    
    if (lastMonthEntries) {
      // Add $10 for each entry from last month
      const bonus = (lastMonthEntries.length || 0) * 10;
      prizePool += Math.min(bonus, 5000); // Cap at $5000 bonus
    }
    
    // Step 3: Create new draw
    console.log(`Creating new draw with prize pool: $${prizePool}`);
    const newDraw = await drawService.createDraw(prizePool, 'system');
    
    if (!newDraw.success) {
      throw new Error('Failed to create new draw');
    }
    
    console.log(`✅ New draw created: ${newDraw.draw.id}`);
    
    // Step 4: Send notifications to all users about new draw
    const notificationResult = await notificationService.sendDrawReminder(
      newDraw.draw.id,
      newDraw.draw.date,
      prizePool
    );
    
    if (notificationResult.success) {
      console.log(`📧 Draw reminder sent to ${notificationResult.sent} users`);
    }
    
    // Step 5: Log the draw creation
    await supabaseAdmin
      .from('draws')
      .update({ 
        created_by: 'system',
        prize_pool: prizePool 
      })
      .eq('id', newDraw.draw.id);
    
    return {
      success: true,
      draw: newDraw.draw,
      prizePool,
      notificationsSent: notificationResult.sent || 0
    };
    
  } catch (error) {
    console.error('Monthly draw failed:', error);
    
    // Send alert email to admin
    if (process.env.ADMIN_EMAIL) {
      await notificationService.sendEmail(
        process.env.ADMIN_EMAIL,
        '❌ Monthly Draw Failed',
        `<p>The monthly draw job failed with error: ${error.message}</p>`
      );
    }
    
    throw error;
  }
};