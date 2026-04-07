import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import jsonData from "../xhtml_removed_cleaned_map.json";

export default function WebsiteGraphCanvasHover() {
  const canvasRef = useRef(null);
  const hoverNodeRef = useRef(null); // currently hovered node

  useEffect(() => {
    if (!jsonData || !canvasRef.current) return;

    const pages = Object.keys(jsonData).map(page => ({
      id: page.slice(27),
      links: jsonData[page].map(link => link.slice(27))
    }));

    let  links = [];
    const allNodeIds = new Set();

    pages.forEach(p => {
      allNodeIds.add(p.id);
      p.links.forEach(target => {
        links.push({ source: p.id, target });
        allNodeIds.add(target);
      });
    });
      links.filter(x => !x.target.includes(".xhtml"));
      links.filter(x => !x.source.includes(".xhtml"));

    allNodeIds.add("/N/A");
    allNodeIds.add("/books");

      let nodes = Array.from(allNodeIds).map(id => ({ id, group: 1 }));
      console.log(nodes.length);
      nodes = nodes.filter(x => !x.id.includes(".xhtml"));

    const width = 1000;
    const height = 600;

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody().strength(-100))
        .force("x", d3.forceX(width / 2).strength(0.2))   // pull to center
       .force("y", d3.forceY(height / 2).strength(0.2)); // pull to center

    // Zoom/pan
    let transform = d3.zoomIdentity;
    const zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        transform = event.transform;
        draw();
      });
    d3.select(canvas).call(zoom);

    function draw() {
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(transform.x, transform.y);
      context.scale(transform.k, transform.k);

      // Draw links
      context.strokeStyle = "#d1d5db";
      context.beginPath();
      links.forEach(d => {
        context.moveTo(d.source.x, d.source.y);
        context.lineTo(d.target.x, d.target.y);
      });
      context.stroke();

      // Draw nodes
      nodes.forEach(d => {
        context.beginPath();
        context.arc(d.x, d.y, 5, 0, 2 * Math.PI);
        context.fillStyle = "#3b82f6";
        context.fill();
      });

      // Draw hovered node label
      if (hoverNodeRef.current) {
        context.fillStyle = "#36002d";
        context.font = "12px sans-serif";
        context.textAlign = "center";
        context.fillText(hoverNodeRef.current.id, hoverNodeRef.current.x, hoverNodeRef.current.y - 10);
      }

      context.restore();
    }

    simulation.on("tick", draw);

    // Track hover
    canvas.addEventListener("mousemove", (event) => {
      const [mx, my] = d3.pointer(event);
      const x = (mx - transform.x) / transform.k;
      const y = (my - transform.y) / transform.k;

      const hovered = nodes.find(n => Math.hypot(n.x - x, n.y - y) < 200 / transform.k);
        hoverNodeRef.current = hovered || null; 
        draw();
    });

    canvas.addEventListener("mouseleave", () => {
        hoverNodeRef.current = null;
        draw();
    });
      

    return () => simulation.stop();
  }, [jsonData]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '600px', border: '1px solid #ccc' }} />;
}