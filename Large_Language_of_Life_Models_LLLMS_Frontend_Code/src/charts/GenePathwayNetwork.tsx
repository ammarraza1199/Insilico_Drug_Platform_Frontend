import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const GenePathwayNetwork: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const nodes = [
    { id: 'MTOR', group: 1, val: 15 },
    { id: 'S6K1', group: 1, val: 10 },
    { id: '4EBP1', group: 1, val: 8 },
    { id: 'AKT1', group: 2, val: 12 },
    { id: 'PIK3CA', group: 2, val: 10 },
    { id: 'PTEN', group: 2, val: 9 },
    { id: 'TSC1', group: 3, val: 7 },
    { id: 'TSC2', group: 3, val: 7 },
    { id: 'ULK1', group: 4, val: 6 },
    { id: 'ATG13', group: 4, val: 5 },
  ];

  const links = [
    { source: 'MTOR', target: 'S6K1' },
    { source: 'MTOR', target: '4EBP1' },
    { source: 'AKT1', target: 'MTOR' },
    { source: 'PIK3CA', target: 'AKT1' },
    { source: 'PTEN', target: 'PIK3CA' },
    { source: 'TSC1', target: 'TSC2' },
    { source: 'TSC2', target: 'MTOR' },
    { source: 'MTOR', target: 'ULK1' },
    { source: 'ULK1', target: 'ATG13' },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll("*").remove(); // Clear previous

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#E5E7EB')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 2);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', (d: any) => d.val)
      .attr('fill', (d: any) => d.id === 'MTOR' ? '#7C3AED' : '#2563EB');

    node.append('text')
      .text((d: any) => d.id)
      .attr('x', 12)
      .attr('y', 4)
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#4B5563')
      .attr('stroke', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => { simulation.stop(); };
  }, []);

  return (
    <div className="w-full h-full bg-slate-50 cursor-move">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default GenePathwayNetwork;
