import { createClient } from '@supabase/supabase-js'

// For Vite, we need to use import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://apjznafcvoadgltxxntp.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwanpuYWZjdm9hZGdsdHh4bnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNDYzNjEsImV4cCI6MjA1ODgyMjM2MX0.g25Y6zQgHT4ujVJJHXR6i4nn_44z3qym3xcwrR4ge5g"

// Log for debugging - remove in production
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Key is set' : 'Key is missing')

// Ensure we have the required values before creating the client
if (!supabaseUrl) {
  console.error("Supabase URL is missing! Using fallback URL.")
}

if (!supabaseAnonKey) {
  console.error("Supabase Anon Key is missing! Using fallback key.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
