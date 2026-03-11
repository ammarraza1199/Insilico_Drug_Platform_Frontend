import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { ShapGene } from '../types/experiment.types';

interface ShapBarChartProps {
  data: ShapGene[];
}

const ShapBarChart: React.FC<ShapBarChartProps> = ({ data }) => {
  // Sort by absolute shap value for better visualization
  const sortedData = [...data].sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sortedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
        <XAxis type="number" hide />
        <YAxis 
          dataKey="gene" 
          type="category" 
          width={80}
          tick={{ fontSize: 12, fontWeight: 'bold', fill: '#1F2937' }}
        />
        <Tooltip
          cursor={{ fill: '#F3F4F6' }}
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: 'none', 
            borderRadius: '8px',
            color: '#F9FAFB',
            fontSize: '12px'
          }}
          itemStyle={{ color: '#F9FAFB' }}
        />
        <Bar dataKey="shapValue" radius={[0, 4, 4, 0]}>
          {sortedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.shapValue > 0 ? '#DC2626' : '#2563EB'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ShapBarChart;
