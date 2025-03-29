import { useEffect, useState } from 'react';
import { supabase } from '../../supabase/supabaseClient';
import './AuthCallback.css';

export default function AuthCallback() {
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    // This effect handles the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log('AuthCallback: Starting authentication process');
        
        // Supabase should automatically handle the token exchange
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setMessage('Authentication failed. Please try again.');
        } else if (data?.session) {
          console.log('AuthCallback: Authentication successful, session found');
          setMessage('Authentication successful! Redirecting...');
          
          // Redirect to the main page after successful authentication
          setTimeout(() => {
            // For Vercel deployment specifically use the production URL
            const redirectUrl = window.location.hostname.includes('vercel.app') 
              ? 'https://day-sync.vercel.app/' 
              : window.location.origin;
              
            console.log('AuthCallback: Redirecting to', redirectUrl);
            window.location.href = redirectUrl;
          }, 1500);
        } else {
          console.log('AuthCallback: No session found after authentication');
          setMessage('No session detected. Please try signing in again.');
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