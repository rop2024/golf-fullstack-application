import { supabaseAdmin } from '../services/supabase.service.js';

export const cleanupOldData = async () => {
  console.log('🧹 Starting cleanup process...');
  
  try {
    // 1. Delete unclaimed prizes older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const { count: unclaimedDeleted } = await supabaseAdmin
      .from('winners')
      .delete()
      .eq('status', 'pending')
      .lt('created_at', ninetyDaysAgo.toISOString())
      .select('count');
    
    console.log(`  - Deleted ${unclaimedDeleted || 0} unclaimed prizes`);
    
    // 2. Delete old scores (older than 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const { count: scoresDeleted } = await supabaseAdmin
      .from('scores')
      .delete()
      .lt('created_at', sixMonthsAgo.toISOString())
      .select('count');
    
    console.log(`  - Deleted ${scoresDeleted || 0} old scores`);
    
    // 3. Archive old draws (completed draws older than 1 year)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const { count: drawsArchived } = await supabaseAdmin
      .from('draws')
      .update({ status: 'archived' })
      .eq('status', 'completed')
      .lt('created_at', oneYearAgo.toISOString())
      .select('count');
    
    console.log(`  - Archived ${drawsArchived || 0} old draws`);
    
    // 4. Delete expired sessions (if you have a sessions table)
    // const { count: sessionsDeleted } = await supabaseAdmin
    //   .from('sessions')
    //   .delete()
    //   .lt('expires_at', new Date().toISOString());
    
    // 5. Clean up orphaned data (draw entries with no draw)
    const { data: orphanedEntries } = await supabaseAdmin
      .from('draw_entries')
      .select('id')
      .not('draw_id', 'in', 
        supabaseAdmin.from('draws').select('id')
      );
    
    if (orphanedEntries && orphanedEntries.length > 0) {
      const { count: entriesDeleted } = await supabaseAdmin
        .from('draw_entries')
        .delete()
        .in('id', orphanedEntries.map(e => e.id));
      
      console.log(`  - Deleted ${entriesDeleted || 0} orphaned entries`);
    }
    
    console.log('✅ Cleanup completed successfully');
    
    return {
      success: true,
      stats: {
        unclaimedDeleted: unclaimedDeleted || 0,
        scoresDeleted: scoresDeleted || 0,
        drawsArchived: drawsArchived || 0,
        orphanedDeleted: orphanedEntries?.length || 0
      }
    };
    
  } catch (error) {
    console.error('Cleanup failed:', error);
    throw error;
  }
};