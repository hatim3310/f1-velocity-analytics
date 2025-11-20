import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RaceAnalysisData, Driver } from '../../types';

interface Props {
  data: RaceAnalysisData;
}

const LapPaceChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || !containerRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const width = containerRef.current.clientWidth;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .classed("w-full h-full", true);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Filter extremely slow laps (pit stops / safety car) for better visualization scale
    // Calculate median to find outliers
    const allTimes = data.history.map(d => d.time).sort(d3.ascending);
    const median = d3.median(allTimes) || 90;
    const cutoff = median * 1.15; // Cutoff at 115% of median pace
    
    const validLaps = data.history.filter(d => d.time < cutoff && d.time > median * 0.8); 
    
    const minTime = d3.min(validLaps, d => d.time) || median - 5;
    const maxTime = d3.max(validLaps, d => d.time) || median + 5;

    const x = d3.scaleLinear()
      .domain([1, d3.max(data.history, d => d.lap) || 60])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([minTime, maxTime])
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(x).ticks(10);
    const yAxis = d3.axisLeft(y).ticks(6).tickFormat(d => `${Number(d).toFixed(1)}s`);

    // Custom Grid
    const makeGrid = (selection: any) => {
        selection.selectAll("line")
            .attr("stroke", "rgba(255,255,255,0.05)")
            .attr("stroke-dasharray", "2,2");
        selection.select(".domain").remove();
    };

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(10).tickSize(-innerHeight).tickFormat(() => ""))
      .call(makeGrid);

    g.append("g")
      .call(d3.axisLeft(y).ticks(6).tickSize(-innerWidth).tickFormat(() => ""))
      .call(makeGrid);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight + 15})`)
      .call(xAxis)
      .attr("color", "#64748b")
      .style("font-family", "Orbitron");

    g.append("g")
      .call(yAxis)
      .attr("color", "#64748b")
      .style("font-family", "Orbitron");

    // Y Axis Label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - (innerHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .style("font-size", "12px")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "1px")
      .text("Lap Time (s)");

    // Data Points
    const driversMap = new Map<string, Driver>(data.drivers.map(d => [d.id, d]));
    
    // Add glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
        .attr("id", "glow");
    filter.append("feGaussianBlur")
        .attr("stdDeviation", "2.5")
        .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    g.selectAll("circle")
      .data(validLaps)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.lap))
      .attr("cy", d => y(d.time))
      .attr("r", 3)
      .attr("fill", d => driversMap.get(d.driverId)?.color || '#fff')
      .attr("fill-opacity", 0.8)
      .attr("stroke", "rgba(0,0,0,0.5)")
      .attr("stroke-width", 1)
      .style("filter", "url(#glow)")
      .on("mouseover", function() {
          d3.select(this).attr("r", 6).attr("fill-opacity", 1);
      })
      .on("mouseout", function() {
          d3.select(this).attr("r", 3).attr("fill-opacity", 0.8);
      });

    // Title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .style("font-family", "Orbitron")
      .style("font-size", "14px")
      .style("letter-spacing", "2px")
      .text("PACE DISPERSION");

  }, [data]);

  return (
    <div ref={containerRef} className="w-full glass-card rounded-3xl p-4 shadow-2xl mt-6">
      <svg ref={svgRef} className="w-full h-[500px]"></svg>
    </div>
  );
};

export default LapPaceChart;