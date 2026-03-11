import React from 'react';
import Plot from 'react-plotly.js';

const ExpressionHeatmap: React.FC = () => {
  const genes = ['MTOR', 'S6K1', '4EBP1', 'AKT1', 'PIK3CA', 'PTEN', 'TSC1', 'TSC2'];
  const compounds = ['Candidate A', 'Candidate B', 'Candidate C', 'Candidate D', 'Candidate E'];
  
  const zData = compounds.map(() => genes.map(() => Math.random() * 4 - 2));

  return (
    <Plot
      data={[{
        z: zData,
        x: genes,
        y: compounds,
        type: 'heatmap',
        colorscale: 'RdBu',
        reversescale: true,
        zmin: -2,
        zmax: 2,
        showscale: true,
      }]}
      layout={{
        autosize: true,
        margin: { l: 80, r: 20, t: 10, b: 40 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { tickangle: -45 },
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      config={{ displayModeBar: false }}
    />
  );
};

export default ExpressionHeatmap;
