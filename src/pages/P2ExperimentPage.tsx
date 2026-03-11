import React from 'react';
import P2ExperimentPanel from '../modules/p2/P2ExperimentPanel';

const P2ExperimentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Precious2GPT — Synthetic Data Generator</h1>
      </div>
      <P2ExperimentPanel />
    </div>
  );
};

export default P2ExperimentPage;
