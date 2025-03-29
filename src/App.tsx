import React, { useState, useEffect } from "react";
import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { StrictModeDisabler } from './components/utils/StrictModeDisabler';

function App() {
  // Initialize dark mode as true by default
  const [darkMode, setDarkMode] = useState(true);
  
  // Apply dark mode class when component mounts and when darkMode state changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="app-container">
        <StrictModeDisabler>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </StrictModeDisabler>
      </div>
    </Suspense>
  );
}

export default App;
