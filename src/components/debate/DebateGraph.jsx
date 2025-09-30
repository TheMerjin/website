import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DebateGraph = ({ nodes, edges, width = 800, height = 600 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!nodes || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous graph

    // Set up the SVG
    svg.attr("width", width).attr("height", height);

    // Create a container group
    const container = svg.append("g");

    // Set up zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Create links
    const link = container.append("g")
      .selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", d => {
        const colors = {
          support: "#10b981", // green
          oppose: "#ef4444",  // red
          follows: "#3b82f6", // blue
          challenges: "#f59e0b" // yellow
        };
        return colors[d.type] || "#6b7280";
      })
      .attr("stroke-width", d => Math.sqrt(d.weight || 1) * 2)
      .attr("stroke-opacity", 0.8)
      .attr("marker-end", "url(#arrowhead)");

    // Create arrow markers
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#6b7280");

    // Create nodes
    const node = container.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation));

    // Add circles for nodes
    node.append("circle")
      .attr("r", d => {
        const baseRadius = 25;
        const weightFactor = (d.weight || 0) * 20;
        return baseRadius + weightFactor;
      })
      .attr("fill", d => {
        if (d.type === 'claim') {
          const weight = d.weight || 0;
          if (weight > 0.7) return "#10b981"; // green
          if (weight > 0.4) return "#f59e0b"; // yellow
          return "#ef4444"; // red
        }
        return "#3b82f6"; // blue for connections
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3)
      .attr("opacity", 0.9);

    // Add text labels
    node.append("text")
      .text(d => d.content.length > 30 ? d.content.substring(0, 30) + "..." : d.content)
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("fill", "#ffffff")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("pointer-events", "none");

    // Add type labels
    node.append("text")
      .text(d => d.type.toUpperCase())
      .attr("text-anchor", "middle")
      .attr("dy", 25)
      .attr("fill", "#6b7280")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("pointer-events", "none");

    // Add weight labels
    node.append("text")
      .text(d => `W: ${(d.weight || 0).toFixed(2)}`)
      .attr("text-anchor", "middle")
      .attr("dy", 40)
      .attr("fill", "#6b7280")
      .attr("font-size", "10px")
      .attr("pointer-events", "none");

    // Add tooltips
    node.append("title")
      .text(d => `${d.type.toUpperCase()}: ${d.content}\nWeight: ${(d.weight || 0).toFixed(2)}`);

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Drag behavior
    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, edges, width, height]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 border border-gray-200">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">No arguments to display</div>
          <div className="text-gray-400 text-sm">Add some claims to see the graph</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Argument Graph</h3>
        <div className="text-sm text-gray-500">
          {nodes.length} arguments, {edges.length} connections
        </div>
      </div>
      
      <div className="border border-gray-200 bg-white rounded overflow-hidden">
        <svg ref={svgRef} className="w-full"></svg>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Strong Claim (weight > 0.7)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Medium Claim (weight 0.4-0.7)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Weak Claim </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Connection</span>
        </div>
      </div>
    </div>
  );
};

export default DebateGraph;
