import { supabaseAdmin } from './supabase.service.js';

class DrawService {
  // Generate random draw numbers
  generateDrawNumbers() {
    const numbers = [];
    while (numbers.length < 5) {
      const num = Math.floor(Math.random() * 50) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    return numbers.sort((a, b) => a - b);
  }

  // Create a new draw
  async createDraw(prizePool = 1000, createdBy = null) {
    try {
      const numbers = this.generateDrawNumbers();
      
      const { data, error } = await supabaseAdmin
        .from('draws')
        .insert({
          numbers: numbers,
          status: 'pending',
          prize_pool: prizePool,
          created_by: createdBy,
          date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, draw: data };
    } catch (error) {
      console.error('Create draw error:', error);
      return { success: false, error: error.message };
    }
  }

  // Execute a draw and determine winners
  async executeDraw(drawId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('draws')
        .update({ status: 'completed' })
        .eq('id', drawId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Get winners after draw completion
      const { data: winners } = await supabaseAdmin
        .from('winners_view')
        .select('*')
        .eq('draw_id', drawId)
        .order('match_count', { ascending: false });
      
      return { 
        success: true, 
        draw: data, 
        winners: winners || [] 
      };
    } catch (error) {
      console.error('Execute draw error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get active draw
  async getActiveDraw() {
    try {
      const { data, error } = await supabaseAdmin
        .from('draws')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return { success: true, draw: data || null };
    } catch (error) {
      console.error('Get active draw error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get draw statistics
  async getDrawStats() {
    try {
      // Total draws
      const { count: totalDraws } = await supabaseAdmin
        .from('draws')
        .select('*', { count: 'exact', head: true });
      
      // Completed draws
      const { count: completedDraws } = await supabaseAdmin
        .from('draws')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      
      // Total entries
      const { count: totalEntries } = await supabaseAdmin
        .from('draw_entries')
        .select('*', { count: 'exact', head: true });
      
      // Total prize awarded
      const { data: prizes } = await supabaseAdmin
        .from('winners')
        .select('prize_amount');
      
      const totalPrizeAwarded = prizes?.reduce((sum, p) => sum + p.prize_amount, 0) || 0;
      
      // Average participants per draw
      const { data: entriesByDraw } = await supabaseAdmin
        .from('draw_entries')
        .select('draw_id', { count: 'exact' });
      
      const avgParticipants = totalDraws > 0 
        ? Math.round((totalEntries || 0) / totalDraws) 
        : 0;
      
      return {
        success: true,
        stats: {
          totalDraws: totalDraws || 0,
          completedDraws: completedDraws || 0,
          pendingDraws: (totalDraws || 0) - (completedDraws || 0),
          totalEntries: totalEntries || 0,
          totalPrizeAwarded,
          avgParticipantsPerDraw: avgParticipants
        }
      };
    } catch (error) {
      console.error('Get draw stats error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new DrawService();