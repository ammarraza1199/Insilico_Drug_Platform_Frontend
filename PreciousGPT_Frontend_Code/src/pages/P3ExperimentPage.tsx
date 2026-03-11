import React from 'react';
import P3ExperimentPanel from '../modules/p3/P3ExperimentPanel';

const P3ExperimentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">WallahGPT3 — Drug Discovery Engine</h1>
      </div>
      <P3ExperimentPanel />
    </div>
  );
};

export default P3ExperimentPage;
