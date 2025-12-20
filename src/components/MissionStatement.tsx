import React from "react";

const MissionStatement: React.FC = () => (
  <section className="w-full bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl lg:text-6xl font-extrabold mb-8 text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">Our Mission</h2>
      <div className="text-lg lg:text-xl text-gray-700 text-center max-w-5xl mx-auto leading-relaxed space-y-6">
        <p className="font-medium text-xl lg:text-2xl text-gray-900">
          Diary of an OFW is dedicated to capturing the raw, unfiltered journeys of Overseas Filipino Workers across the globe.
        </p>
        <p>
          We shine a light on the extraordinary achievements and untold stories of Filipinos who have carved out greatness far from home.
        </p>
        <p>
          Through intimate conversations with notable individuals—especially those thriving in foreign lands—we uncover hidden truths, life-changing lessons, and meaningful insights.
        </p>
        <p className="text-xl lg:text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pt-4">
          Our mission is to inspire, uplift, and empower our audience to live with greater joy, purpose, and fulfillment by sharing the voices and victories of the global Filipino community.
        </p>
      </div>
    </div>
  </section>
);

export default MissionStatement;
