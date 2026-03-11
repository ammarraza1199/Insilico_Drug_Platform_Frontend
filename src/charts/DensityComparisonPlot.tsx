import React from 'react';
import Plot from 'react-plotly.js';

const DensityComparisonPlot: React.FC = () => {
  // Generate mock distribution data
  const generateDist = (mean: number, stdDev: number, n: number) => {
    const x = [];
    for (let i = 0; i < n; i++) {
      const val = mean + stdDev * (Math.random() + Math.random() + Math.random() + Math.random() - 2);
      x.push(val);
    }
    // Simple kernel density estimate placeholder
    return x.sort((a, b) => a - b);
  };

  const referenceData = generateDist(5, 1.5, 1000);
  const syntheticData = generateDist(5.2, 1.6, 1000);

  return (
    <Plot
      data={[
        {
          x: referenceData,
          type: 'histogram',
          name: 'Reference (GTEx)',
          histnorm: 'probability density',
          opacity: 0.5,
          marker: { color: '#6B7280' },
        },
        {
          x: syntheticData,
          type: 'histogram',
          name: 'Synthetic',
          histnorm: 'probability density',
          opacity: 0.5,
          marker: { color: '#0D9488' },
        }
      ]}
      layout={{
        autosize: true,
        margin: { l: 40, r: 20, t: 10, b: 40 },
        barmode: 'overlay',
        legend: { orientation: 'h', y: -0.2 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { gridcolor: '#E5E7EB', zeroline: false },
        yaxis: { gridcolor: '#E5E7EB', zeroline: false },
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      config={{ displayModeBar: false }}
    />
  );
};

export default DensityComparisonPlot;
