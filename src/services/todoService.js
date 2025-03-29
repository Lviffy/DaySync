import { supabase } from '../supabase/supabaseClient';

export const todoService = {
  async fetchTodos(userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addTodo(todo, userId) {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ ...todo, user_id: userId }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateTodo(id, updates) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteTodo(id) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
