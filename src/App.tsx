import React from "react";
import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Auth from "./components/Auth/Auth.jsx";
import { UserProvider } from "./contexts/UserContext.jsx"; 
import AuthCallback from "./pages/auth/AuthCallback";
import routes from "tempo-routes";

function App() {
  // Log the current environment and base path for debugging
  console.log('App starting, environment:', import.meta.env.MODE);
  console.log('Current URL:', window.location.href);
  
  return (
    <UserProvider>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* Additional routes */}
          {routes}
        </Routes>
      </Suspense>
    </UserProvider>
  );
}

export default App;
