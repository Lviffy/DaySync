import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { StrictModeDisabler } from './components/utils/StrictModeDisabler';

function App() {
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
