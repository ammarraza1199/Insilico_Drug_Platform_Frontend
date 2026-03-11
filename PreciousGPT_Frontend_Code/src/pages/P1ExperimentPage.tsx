import React from 'react';
import P1ExperimentPanel from '../modules/p1/P1ExperimentPanel';

const P1ExperimentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">WallahGPT1 — Biological Aging Clock</h1>
      </div>
      <P1ExperimentPanel />
    </div>
  );
};

export default P1ExperimentPage;
