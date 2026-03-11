import React from 'react';
import ReactPlotly from 'react-plotly.js';
const Plot = (ReactPlotly as any).default || ReactPlotly;

const VolcanoPlot: React.FC = () => {
  const n = 1000;
  const lfc = Array.from({ length: n }, () => (Math.random() - 0.5) * 6);
  const pval = lfc.map(x => -Math.log10(Math.random() * Math.pow(10, -Math.abs(x) * 1.5)));

  return (
    <Plot
      data={[{
        x: lfc,
        y: pval,
        mode: 'markers',
        type: 'scatter',
        marker: {
          size: 5,
          color: lfc.map(x => x > 1 && pval[lfc.indexOf(x)] > 2 ? '#DC2626' : x < -1 && pval[lfc.indexOf(x)] > 2 ? '#2563EB' : '#9CA3AF'),
          opacity: 0.6,
        },
        text: lfc.map((_, i) => `Gene_${i}`),
      }]}
      layout={{
        autosize: true,
        margin: { l: 40, r: 20, t: 10, b: 40 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { title: { text: 'Log2 Fold Change' }, gridcolor: '#E5E7EB', zeroline: true, zerolinecolor: '#9CA3AF' },
        yaxis: { title: { text: '-Log10 P-value' }, gridcolor: '#E5E7EB', zeroline: false },
        hovermode: 'closest',
      }}
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      config={{ displayModeBar: false }}
    />
  );
};

export default VolcanoPlot;
