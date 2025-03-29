import { supabase } from '../supabase/supabaseClient';

export const taskService = {
  async fetchTasks(userId, taskType) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('task_type', taskType)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async addTask(task, userId, taskType) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ 
        label: task.label, 
        completed: task.completed, 
        user_id: userId,
        task_type: taskType,
        created_at: new Date().toISOString() 
      }])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateTask(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async toggleTaskCompletion(id, completed) {
    return this.updateTask(id, { completed: !completed });
  },

  async deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}; 