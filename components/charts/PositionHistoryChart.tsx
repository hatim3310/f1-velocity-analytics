import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RaceAnalysisData, Driver } from '../../types';

interface Props {
  data: RaceAnalysisData;
}

const PositionHistoryChart: React.FC<Props> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data || !containerRef.current || data.history.length === 0) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 80, bottom: 50, left: 50 };
    const width = containerRef.current.clientWidth;
    const height = 550;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .classed("w-full h-full", true);

    // Gradient Definitions
    const defs = svg.append("defs");
    
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Determine domains
    const maxLaps = d3.max(data.history, d => d.lap) || 60;
    const driversInRace = Array.from(new Set(data.history.map(d => d.driverId)));
    // We only want to show lines for drivers who have meaningful data
    
    const x = d3.scaleLinear()
      .domain([1, maxLaps])
      .range([0, innerWidth]);

    const y = d3.scaleLinear()
      .domain([1, Math.min(20, driversInRace.length)]) // Top 20 max
      .range([0, innerHeight]);

    // Group data by driver
    const driversMap = new Map<string, Driver>(data.drivers.map(d => [d.id, d]));
    const grouped = d3.group(data.history, d => d.driverId);

    // Grid lines (Vertical)
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(10).tickSize(-innerHeight).tickFormat(() => ""))
      .selectAll("line")
      .attr("stroke", "rgba(255,255,255,0.05)")
      .attr("stroke-dasharray", "4,4");
      
    g.selectAll(".domain").remove();

    // Axes Labels
    const xAxis = d3.axisBottom(x).ticks(10).tickFormat(d => `Lap ${d}`);
    const yAxis = d3.axisLeft(y).ticks(10);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight + 10})`)
      .call(xAxis)
      .attr("color", "#64748b")
      .style("font-family", "Orbitron")
      .style("font-size", "10px")
      .select(".domain").remove();

    g.append("g")
      .call(yAxis)
      .attr("color", "#64748b")
      .style("font-family", "Orbitron")
      .style("font-size", "12px")
      .select(".domain").remove();

    // Lines
    const line = d3.line<any>()
      .defined(d => d.position > 0 && d.position <= 20)
      .x(d => x(d.lap))
      .y(d => y(d.position))
      .curve(d3.curveMonotoneX); // Smooth curves for "flow" feel

    // Draw driver lines
    grouped.forEach((laps, driverId) => {
      const driver = driversMap.get(driverId);
      // Sort by lap to ensure line connects correctly
      laps.sort((a, b) => a.lap - b.lap);
      
      if (!driver || laps.length < 2) return;

      // Glow effect path (underneath)
      g.append("path")
        .datum(laps)
        .attr("fill", "none")
        .attr("stroke", driver.color)
        .attr("stroke-width", 4)
        .attr("stroke-opacity", 0.2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)
        .attr("class", "blur-sm");

      // Main path
      const path = g.append("path")
        .datum(laps)
        .attr("fill", "none")
        .attr("stroke", driver.color)
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)
        .attr("class", "transition-all duration-300 opacity-70 hover:opacity-100 hover:stroke-[4px] cursor-pointer");

      // Add Driver Label at the end of the line
      const lastLap = laps[laps.length - 1];
      if (lastLap && lastLap.position <= 20) {
          g.append("text")
            .attr("x", x(lastLap.lap) + 8)
            .attr("y", y(lastLap.position) + 4)
            .text(driver.code)
            .attr("fill", driver.color)
            .style("font-weight", "bold")
            .style("font-size", "10px")
            .style("font-family", "Inter")
            .style("text-shadow", "0 0 10px rgba(0,0,0,0.5)");
      }
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
      .text("POSITION EVOLUTION");

  }, [data]);

  return (
    <div ref={containerRef} className="w-full glass-card rounded-3xl p-4 shadow-2xl">
      <svg ref={svgRef} className="w-full h-[550px]"></svg>
    </div>
  );
};

export default PositionHistoryChart;