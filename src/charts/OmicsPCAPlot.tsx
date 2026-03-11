import React from 'react';
import Plot from 'react-plotly.js';

const OmicsPCAPlot: React.FC = () => {
  // Generate mock PCA scatter data
  const n = 200;
  const generatePCA = (cx: number, cy: number, std: number) => {
    return {
      x: Array.from({ length: n }, () => cx + std * (Math.random() - 0.5)),
      y: Array.from({ length: n }, () => cy + std * (Math.random() - 0.5)),
    };
  };

  const groupA = generatePCA(2, 2, 4);
  const groupB = generatePCA(-2, -2, 4);

  return (
    <Plot
      data={[
        {
          x: groupA.x,
          y: groupA.y,
          mode: 'markers',
          type: 'scatter',
          name: 'Synthetic Samples',
          marker: { color: '#0D9488', size: 6, opacity: 0.6 },
        },
        {
          x: groupB.x,
          y: groupB.y,
          mode: 'markers',
          type: 'scatter',
          name: 'Reference Samples',
          marker: { color: '#6B7280', size: 6, opacity: 0.4 },
        }
      ]}
      layout={{
        autosize: true,
        margin: { l: 40, r: 20, t: 10, b: 40 },
        legend: { orientation: 'h', y: -0.2 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { title: { text: 'PC1 (34.2%)' }, gridcolor: '#E5E7EB', zeroline: false },
        yaxis: { title: { text: 'PC2 (18.1%)' }, gridcolor: '#E5E7EB', zeroline: false },
        hovermode: 'closest',
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      config={{ displayModeBar: false }}
    />
  );
};

export default OmicsPCAPlot;
