import { createClient } from '@supabase/supabase-js'

// For Vite, we need to use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log for debugging - remove in production
console.log('Supabase URL:', supabaseUrl ? 'URL is set' : 'URL is missing')
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Key is set' : 'Key is missing')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
