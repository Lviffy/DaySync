import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import './AuthCallback.css';

export default function AuthCallback() {
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    // This effect handles the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash;
        
        // Supabase should automatically handle the token exchange
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setMessage('Authentication failed. Please try again.');
        } else if (data?.session) {
          setMessage('Authentication successful! Redirecting...');
          // Redirect to the main page after successful authentication
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="auth-callback-container">
      <div className="auth-callback-message">
        <h2>{message}</h2>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
} 