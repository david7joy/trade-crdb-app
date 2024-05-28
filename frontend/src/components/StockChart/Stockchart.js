import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Stockchart = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      const data = [
        { month: 'January', value: 65 },
        { month: 'February', value: 59 },
        { month: 'March', value: 80 },
        { month: 'April', value: 81 },
        { month: 'May', value: 56 },
        { month: 'June', value: 55 },
        { month: 'July', value: 40 },
        { month: 'Aug', value: 82 },
      ];

      const margin = { top: 20, right: 30, bottom: 100, left: 40 };
      const width = 1000 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3.select(d3Container.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scalePoint()
        .domain(data.map(d => d.month))
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([30, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y).ticks(5).tickSize(-width))
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick:not(:first-of-type) line')
          .attr('stroke-opacity', 0.1)
          .attr('stroke-dasharray', '2,2'))
        .call(g => g.selectAll('.tick text').attr('x', -10).attr('dy', -4));

      const line = d3.line()
        .x(d => x(d.month))
        .y(d => y(d.value));

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2.5)
        .attr('d', line)
        .attr('gridlines','none');
    }
  }, []);

  return (
    <svg
      className="d3-component"
      ref={d3Container}
    />
  );
};

export default Stockchart;
