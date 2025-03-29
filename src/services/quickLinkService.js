import { supabase } from '../supabase/supabaseClient';

export const quickLinkService = {
  async checkQuickLinksTable() {
    try {
      console.log('Checking quick_links table existence...');
      // Try to query the quick_links table structure
      const { data, error } = await supabase
        .from('quick_links')
        .select('*')
        .limit(1);
      
      if (error) {
        console.error('Error checking quick_links table:', error);
        // Check for specific error types
        if (error.message.includes('relation "quick_links" does not exist')) {
          return { exists: false, error: 'Table does not exist', details: error.message };
        } else if (error.message.includes('permission denied')) {
          return { exists: false, error: 'Permission denied', details: error.message };
        }
        return { exists: false, error: error.message, details: error };
      }
      
      console.log('Quick links table exists:', data !== null);
      return { exists: true, error: null };
    } catch (err) {
      console.error('Unexpected error checking quick_links table:', err);
      return { exists: false, error: err.message, details: err };
    }
  },

  async fetchQuickLinks(userId) {
    try {
      // Check if table exists first
      const tableCheck = await this.checkQuickLinksTable();
      if (!tableCheck.exists) {
        throw new Error(`Quick links table does not exist: ${tableCheck.error}`);
      }
      
      console.log('Fetching quick links for userId:', userId);
      const { data, error } = await supabase
        .from('quick_links')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error in fetchQuickLinks:', error);
        throw error;
      }
      
      console.log('Fetched quick links:', data);
      return data || [];
    } catch (err) {
      console.error('Exception in fetchQuickLinks:', err);
      throw err;
    }
  },

  async addQuickLink(link, userId, retryCount = 0) {
    console.log('Adding quick link:', link);
    console.log('User ID:', userId);

    // Maximum number of retries
    const MAX_RETRIES = 2;

    try {
      // Check if table exists first
      const tableCheck = await this.checkQuickLinksTable();
      if (!tableCheck.exists) {
        console.error('Table check failed:', tableCheck);
        throw new Error(`Cannot add quick link: table does not exist - ${tableCheck.error}`);
      }

      // Ensure URL has protocol
      let url = link.url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      console.log('Processed URL:', url);

      // Get favicon from Google's favicon service
      const favicon = this.getFaviconUrl(url);
      console.log('Favicon URL:', favicon);

      const newLink = { 
        title: link.title, 
        url: url, 
        favicon: favicon,
        user_id: userId,
        created_at: new Date().toISOString() 
      };
      
      console.log('Link object being inserted:', newLink);
      
      // Add a small delay before making the request (helps with network timing issues)
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { data, error } = await supabase
        .from('quick_links')
        .insert([newLink])
        .select();
      
      if (error) {
        console.error('Supabase error in addQuickLink:', error);
        
        // Check if this is a network error and we should retry
        if (error.message.includes('network') && retryCount < MAX_RETRIES) {
          console.log(`Retrying addQuickLink (${retryCount + 1}/${MAX_RETRIES})...`);
          return this.addQuickLink(link, userId, retryCount + 1);
        }
        
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after insert operation');
      }
      
      console.log('Link added successfully, response data:', data);
      return data[0];
    } catch (err) {
      console.error('Error in addQuickLink:', err);
      
      // Check if this is a network error and we should retry
      if (err.message && err.message.includes('network') && retryCount < MAX_RETRIES) {
        console.log(`Retrying addQuickLink after error (${retryCount + 1}/${MAX_RETRIES})...`);
        // Add increasing delay for retries
        await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1)));
        return this.addQuickLink(link, userId, retryCount + 1);
      }
      
      throw err;
    }
  },

  async deleteQuickLink(id) {
    try {
      // Check if table exists first
      const tableCheck = await this.checkQuickLinksTable();
      if (!tableCheck.exists) {
        throw new Error(`Cannot delete quick link: table does not exist - ${tableCheck.error}`);
      }
      
      console.log('Deleting quick link with ID:', id);
      const { error } = await supabase
        .from('quick_links')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error in deleteQuickLink:', error);
        throw error;
      }
      
      console.log('Quick link deleted successfully');
      return true;
    } catch (err) {
      console.error('Exception in deleteQuickLink:', err);
      throw err;
    }
  },

  // Get favicon URL from domain
  getFaviconUrl(url) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      // If URL parsing fails, try with added protocol
      try {
        const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
        const domain = new URL(urlWithProtocol).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      } catch {
        // Default favicon if all else fails
        return 'https://www.google.com/s2/favicons?domain=example.com&sz=64';
      }
    }
  }
}; 