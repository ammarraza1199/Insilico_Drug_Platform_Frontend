import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import type { EnrichedPathway } from '../types/experiment.types';

interface EnrichedPathwayChartProps {
  data: EnrichedPathway[];
}

const EnrichedPathwayChart: React.FC<EnrichedPathwayChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="pathway" 
          type="category" 
          width={90}
          tick={{ fontSize: 10, fontWeight: 'bold', fill: '#4B5563' }}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: 'none', 
            borderRadius: '8px',
            color: '#F9FAFB',
            fontSize: '12px'
          }}
          itemStyle={{ color: '#F9FAFB' }}
        />
        <Bar dataKey="enrichmentScore" radius={[0, 4, 4, 0]} fill="#7C3AED" barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EnrichedPathwayChart;
