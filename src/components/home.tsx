import React from "react";
import DashboardLayout from "./Dashboard/DashboardLayout";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Minimalist Productivity Dashboard</title>
        <meta
          name="description"
          content="A clean, monochromatic productivity hub featuring a digital clock, search functionality, and task management."
        />
      </Helmet>

      <main>
        <DashboardLayout />
      </main>
    </div>
  );
};

export default Home;
