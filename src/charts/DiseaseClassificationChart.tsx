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
import type { DiseaseClassification } from '../types/experiment.types';

interface DiseaseClassificationChartProps {
  data: DiseaseClassification;
}

const DiseaseClassificationChart: React.FC<DiseaseClassificationChartProps> = ({ data }) => {
  const chartData = [
    { name: "Alzheimer's", value: data.alzheimers },
    { name: "Parkinson's", value: data.parkinsons },
    { name: "Cardiovascular", value: data.cardiovascular },
    { name: "Type 2 Diabetes", value: data.type2diabetes },
    { name: "Cancer", value: data.cancer },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 11, fontWeight: 600, fill: '#6B7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          domain={[0, 1]} 
          tickFormatter={(val) => `${val * 100}%`}
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}%`, 'Risk Probability']}
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: 'none', 
            borderRadius: '8px',
            color: '#F9FAFB',
            fontSize: '12px'
          }}
          itemStyle={{ color: '#F9FAFB' }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.value > 0.4 ? '#DC2626' : entry.value > 0.2 ? '#D97706' : '#16A34A'} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DiseaseClassificationChart;
