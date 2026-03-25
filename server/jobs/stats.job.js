import { supabaseAdmin } from '../services/supabase.service.js';

export const generateStats = async () => {
  console.log('📊 Generating statistics...');
  
  try {
    // Create stats record for the day
    const stats = {
      date: new Date().toISOString().split('T')[0],
      
      // User stats
      total_users: await getUserCount(),
      active_users: await getActiveUserCount(),
      new_users_today: await getNewUsersToday(),
      
      // Draw stats
      total_draws: await getTotalDraws(),
      active_draws: await getActiveDraws(),
      completed_draws: await getCompletedDraws(),
      total_entries: await getTotalEntries(),
      avg_entries_per_draw: await getAvgEntriesPerDraw(),
      
      // Score stats
      total_scores: await getTotalScores(),
      avg_score: await getAvgScore(),
      highest_score: await getHighestScore(),
      
      // Prize stats
      total_prizes_awarded: await getTotalPrizesAwarded(),
      total_winners: await getTotalWinners(),
      highest_prize: await getHighestPrize(),
      
      // Revenue stats (if applicable)
      total_revenue: await getTotalRevenue(),
      
      created_at: new Date().toISOString()
    };
    
    // Insert stats into database
    const { error } = await supabaseAdmin
      .from('daily_stats')
      .insert(stats);
    
    if (error) {
      // Create table if it doesn't exist
      if (error.code === '42P01') {
        await createStatsTable();
        await supabaseAdmin.from('daily_stats').insert(stats);
      } else {
        throw error;
      }
    }
    
    console.log('✅ Statistics generated and saved');
    
    // Also log to console
    console.log('\n📈 Daily Statistics:');
    console.log(`  Users: ${stats.total_users} total, ${stats.new_users_today} new`);
    console.log(`  Draws: ${stats.active_draws} active, ${stats.completed_draws} completed`);
    console.log(`  Scores: ${stats.total_scores} total, avg: ${stats.avg_score}`);
    console.log(`  Prizes: $${stats.total_prizes_awarded} awarded to ${stats.total_winners} winners`);
    
    return { success: true, stats };
    
  } catch (error) {
    console.error('Stats generation failed:', error);
    throw error;
  }
};

// Helper functions
async function getUserCount() {
  const { count } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

async function getActiveUserCount() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { count } = await supabaseAdmin
    .from('scores')
    .select('user_id', { count: 'exact', head: true })
    .gt('created_at', thirtyDaysAgo.toISOString());
  
  return count || 0;
}

async function getNewUsersToday() {
  const today = new Date().toISOString().split('T')[0];
  
  const { count } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today);
  
  return count || 0;
}

async function getTotalDraws() {
  const { count } = await supabaseAdmin
    .from('draws')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

async function getActiveDraws() {
  const { count } = await supabaseAdmin
    .from('draws')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  return count || 0;
}

async function getCompletedDraws() {
  const { count } = await supabaseAdmin
    .from('draws')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');
  return count || 0;
}

async function getTotalEntries() {
  const { count } = await supabaseAdmin
    .from('draw_entries')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

async function getAvgEntriesPerDraw() {
  const totalDraws = await getTotalDraws();
  const totalEntries = await getTotalEntries();
  
  if (totalDraws === 0) return 0;
  return Math.round(totalEntries / totalDraws);
}

async function getTotalScores() {
  const { count } = await supabaseAdmin
    .from('scores')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

async function getAvgScore() {
  const { data } = await supabaseAdmin
    .from('scores')
    .select('value');
  
  if (!data || data.length === 0) return 0;
  
  const sum = data.reduce((acc, curr) => acc + curr.value, 0);
  return Math.round(sum / data.length);
}

async function getHighestScore() {
  const { data } = await supabaseAdmin
    .from('scores')
    .select('value')
    .order('value', { ascending: false })
    .limit(1);
  
  return data && data.length > 0 ? data[0].value : 0;
}

async function getTotalPrizesAwarded() {
  const { data } = await supabaseAdmin
    .from('winners')
    .select('prize_amount');
  
  if (!data) return 0;
  return data.reduce((sum, w) => sum + w.prize_amount, 0);
}

async function getTotalWinners() {
  const { count } = await supabaseAdmin
    .from('winners')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}

async function getHighestPrize() {
  const { data } = await supabaseAdmin
    .from('winners')
    .select('prize_amount')
    .order('prize_amount', { ascending: false })
    .limit(1);
  
  return data && data.length > 0 ? data[0].prize_amount : 0;
}

async function getTotalRevenue() {
  // Calculate revenue from premium subscriptions
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('subscription_status, created_at')
    .eq('subscription_status', 'premium');
  
  if (!data) return 0;
  
  // Assume $19.99 per month per premium user
  const premiumUsers = data.length;
  return premiumUsers * 19.99;
}

async function createStatsTable() {
  console.log('Creating daily_stats table...');
  
  await supabaseAdmin.query(`
    CREATE TABLE IF NOT EXISTS daily_stats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      date DATE NOT NULL UNIQUE,
      total_users INTEGER DEFAULT 0,
      active_users INTEGER DEFAULT 0,
      new_users_today INTEGER DEFAULT 0,
      total_draws INTEGER DEFAULT 0,
      active_draws INTEGER DEFAULT 0,
      completed_draws INTEGER DEFAULT 0,
      total_entries INTEGER DEFAULT 0,
      avg_entries_per_draw INTEGER DEFAULT 0,
      total_scores INTEGER DEFAULT 0,
      avg_score INTEGER DEFAULT 0,
      highest_score INTEGER DEFAULT 0,
      total_prizes_awarded DECIMAL(10, 2) DEFAULT 0,
      total_winners INTEGER DEFAULT 0,
      highest_prize DECIMAL(10, 2) DEFAULT 0,
      total_revenue DECIMAL(10, 2) DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
}