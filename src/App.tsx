import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Auth from "./components/Auth/Auth.jsx";
import { UserProvider } from "./contexts/UserContext.jsx"; 
import AuthCallback from "./pages/auth/AuthCallback";
import routes from "tempo-routes";
import { StrictModeDisabler } from './components/utils/StrictModeDisabler';

function App() {
  return (
    <UserProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* Make sure this exists */}
          {routes}
        </Routes>
      </Suspense>
    </UserProvider>
  );
}

export default App;
