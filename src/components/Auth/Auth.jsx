import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Auth() {
  const [view, setView] = useState('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { signIn, signUp, signInWithGoogle, user } = useUser();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const showMessage = (text, isError = false) => {
    setMessage({ text, isError });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      // Successful login - redirect will happen via the useEffect
    } catch (error) {
      showMessage(`Error signing in: ${error.message}`, true);
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const { data, error } = await signUp(email, password);
      
      if (error) throw error;
      
      // Clear form and show success message
      setEmail('');
      setPassword('');
      setView('sign-in');
      showMessage('Account created! Please check your email for the confirmation link.', false);
      setLoading(false);
    } catch (error) {
      showMessage(`Error signing up: ${error.message}`, true);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      await signInWithGoogle();
      // For Google sign-in, redirect happens automatically via OAuth
    } catch (error) {
      showMessage('Error with Google sign in: ' + error.message, true);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#14161a] p-4">
      <div className="w-full max-w-md p-8 rounded-lg bg-[#1a1e24] shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {view === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="text-[#989aa2] mt-1">Welcome to DaySync</p>
        </div>
        
        {message && (
          <div className={`p-3 rounded mb-4 text-center ${message.isError ? 'bg-red-900/30 text-red-200' : 'bg-green-900/30 text-green-200'}`}>
            {message.text}
          </div>
        )}
        
        {/* Google Sign-in Button */}
        <button 
          onClick={handleGoogleSignIn} 
          disabled={loading} 
          className="w-full h-12 bg-white text-[#12141a] rounded flex items-center justify-center mb-4 hover:bg-gray-100 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"/>
          </svg>
        </button>
        
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-700"></div>
          <div className="px-4 text-sm text-gray-400">OR</div>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>
        
        <form onSubmit={view === 'sign-in' ? handleSignIn : handleSignUp}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-[#23262d] text-white border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-[#23262d] text-white border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-[#4285f4] text-white rounded font-medium hover:bg-[#3b78e7] transition-colors"
          >
            {loading ? 'Processing...' : view === 'sign-in' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-5 text-center text-sm text-gray-400">
          {view === 'sign-in' ? (
            <p>
              Don't have an account?{' '}
              <button className="text-[#4285f4] hover:underline" onClick={() => setView('sign-up')}>
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button className="text-[#4285f4] hover:underline" onClick={() => setView('sign-in')}>
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 