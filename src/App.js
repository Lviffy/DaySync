import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './contexts/UserContext';
import Auth from './components/Auth/Auth';
import TodoApp from './components/TodoApp';
import AuthCallback from './pages/auth/AuthCallback';

function RequireAuth({ children }) {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={
            <RequireAuth>
              <TodoApp />
            </RequireAuth>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
