import React, { useRef, useEffect } from 'react';
// import * as d3 from 'd3';

const VisualView = ({ memoryState, operation }) => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    if (!memoryState || !svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const { filePointer, data, structSize, structType } = memoryState;
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Layout calculations
    const blockWidth = 140;
    const blockHeight = 180;
    const gap = 30;
    const startX = 50;
    const startY = height / 2 - blockHeight / 2;
    
    // Create container group with zoom support
    const g = svg.append('g');
    
    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => g.attr('transform', event.transform));
    
    svg.call(zoom);
    
    // Draw memory blocks
    data.forEach((item, index) => {
      const x = startX + index * (blockWidth + gap);
      const isActive = Math.floor(filePointer / structSize) === index;
      const isPast = index < Math.floor(filePointer / structSize);
      
      const blockGroup = g.append('g')
        .attr('class', `memory-block ${isActive ? 'active' : ''}`)
        .attr('transform', `translate(${x}, ${startY})`);
      
      // Block background with gradient
      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', `grad-${index}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('style', `stop-color:${isActive ? '#2C3E50' : '#1A1A2E'};stop-opacity:1`);
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('style', `stop-color:${isActive ? '#34495E' : '#16213E'};stop-opacity:1`);
      
      // Main block rectangle
      blockGroup.append('rect')
        .attr('width', blockWidth)
        .attr('height', blockHeight)
        .attr('rx', 12)
        .attr('fill', `url(#grad-${index})`)
        .attr('stroke', isActive ? '#00D9FF' : isPast ? '#4ECDC4' : '#444')
        .attr('stroke-width', isActive ? 4 : 2)
        .style('filter', isActive ? 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.5))' : 'none');
      
      // Struct label
      blockGroup.append('text')
        .attr('x', blockWidth / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('fill', '#FFF')
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .text(`${structType || 'Struct'} ${index + 1}`);
      
      // Byte offset indicator
      blockGroup.append('text')
        .attr('x', blockWidth / 2)
        .attr('y', 45)
        .attr('text-anchor', 'middle')
        .attr('fill', '#888')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text(`Offset: ${index * structSize} bytes`);
      
      // Internal fields visualization
      if (item.fields) {
        item.fields.forEach((field, fIndex) => {
          const fieldY = 65 + fIndex * 30;
          
          // Field background
          blockGroup.append('rect')
            .attr('x', 10)
            .attr('y', fieldY)
            .attr('width', blockWidth - 20)
            .attr('height', 25)
            .attr('rx', 4)
            .attr('fill', '#0F1419')
            .attr('stroke', '#333')
            .attr('stroke-width', 1);
          
          // Field name
          blockGroup.append('text')
            .attr('x', 15)
            .attr('y', fieldY + 16)
            .attr('fill', '#4ECDC4')
            .attr('font-size', '10px')
            .attr('font-family', 'monospace')
            .text(`${field.name}:`);
          
          // Field value
          blockGroup.append('text')
            .attr('x', blockWidth - 15)
            .attr('y', fieldY + 16)
            .attr('text-anchor', 'end')
            .attr('fill', '#FFE66D')
            .attr('font-size', '10px')
            .attr('font-family', 'monospace')
            .text(field.value);
        });
      }
    });
    
    // File Pointer Arrow (Animated)
    const activeIndex = Math.floor(filePointer / structSize);
    const pointerX = startX + activeIndex * (blockWidth + gap) + blockWidth / 2;
    const pointerY = startY - 60;
    
    const arrowGroup = g.append('g')
      .attr('class', 'file-pointer');
    
    // Pulsing circle at arrow base
    arrowGroup.append('circle')
      .attr('cx', pointerX)
      .attr('cy', pointerY)
      .attr('r', 8)
      .attr('fill', '#FF006E')
      .append('animate')
      .attr('attributeName', 'r')
      .attr('values', '8;12;8')
      .attr('dur', '1s')
      .attr('repeatCount', 'indefinite');
    
    // Arrow line
    arrowGroup.append('line')
      .attr('x1', pointerX)
      .attr('y1', pointerY + 8)
      .attr('x2', pointerX)
      .attr('y2', startY - 10)
      .attr('stroke', '#FF006E')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowhead)');
    
    // Arrowhead definition
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#FF006E');
    
    // Pointer label
    arrowGroup.append('rect')
      .attr('x', pointerX - 35)
      .attr('y', pointerY - 35)
      .attr('width', 70)
      .attr('height', 22)
      .attr('rx', 4)
      .attr('fill', '#FF006E')
      .attr('opacity', 0.9);
    
    arrowGroup.append('text')
      .attr('x', pointerX)
      .attr('y', pointerY - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFF')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text('FILE* fp');
    
    // Byte position tooltip
    const byteOffset = filePointer % structSize;
    if (byteOffset > 0) {
      arrowGroup.append('text')
        .attr('x', pointerX)
        .attr('y', startY - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#FF006E')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .text(`+${byteOffset} bytes`);
    }
    
  }, [memoryState, operation]);

  return (
    <svg 
      ref={svgRef} 
      className="visual-view"
      width="100%" 
      height="100%"
      style={{ background: '#0D1117' }}
    />
  );
};

export default VisualView;