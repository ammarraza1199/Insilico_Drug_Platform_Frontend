import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface AgingDistributionChartProps {
  predicted: number;
  chronological: number;
}

const AgingDistributionChart: React.FC<AgingDistributionChartProps> = ({ predicted, chronological }) => {
  // Generate a mock normal distribution curve centered around the tissue-specific age average
  const generateData = () => {
    const data = [];
    const mean = 55;
    const stdDev = 15;
    
    for (let x = 0; x <= 110; x += 2) {
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
      data.push({ age: x, frequency: y });
    }
    return data;
  };

  const data = generateData();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis 
          dataKey="age" 
          tick={{ fontSize: 11, fill: '#6B7280' }}
          axisLine={false}
          tickLine={false}
          label={{ value: 'Age (years)', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#9CA3AF' }}
        />
        <YAxis hide />
        <Tooltip
          labelFormatter={(val: any) => `Age: ${val} years`}
          formatter={(val: any) => [`${(Number(val) * 100).toFixed(1)}%`, 'Proportion']}
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: 'none', 
            borderRadius: '8px',
            color: '#F9FAFB',
            fontSize: '12px'
          }}
          itemStyle={{ color: '#F9FAFB' }}
        />
        <Area 
          type="monotone" 
          dataKey="frequency" 
          stroke="#2563EB" 
          fillOpacity={1} 
          fill="url(#colorFreq)" 
          isAnimationActive={false}
        />
        <ReferenceLine 
          x={chronological} 
          stroke="#9CA3AF" 
          strokeDasharray="3 3" 
          label={{ value: 'Chronological', position: 'top', fontSize: 10, fill: '#6B7280' }} 
        />
        <ReferenceLine 
          x={predicted} 
          stroke="#DC2626" 
          strokeWidth={2}
          label={{ value: 'Predicted', position: 'top', fontSize: 10, fill: '#DC2626', fontWeight: 'bold' }} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AgingDistributionChart;
