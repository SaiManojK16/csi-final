import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './AutomataCanvas.css';

const AutomataCanvas = forwardRef(({
  states,
  transitions,
  startState,
  selectedState,
  selectedTransition,
  mode,
  transitionStart,
  simulationState,
  onStateAdd,
  onStateSelect,
  onTransitionSelect,
  onStateMove,
  onStateToggleAccepting,
  onStateSetStart,
  onStateDelete,
  onTransitionStart,
  onTransitionAdd,
  onTransitionDelete
}, ref) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTransitionDialog, setShowTransitionDialog] = useState(false);
  const [transitionDialog, setTransitionDialog] = useState({ from: null, to: null, x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedStates, setSelectedStates] = useState(new Set()); // For group selection

  const STATE_RADIUS = 35; // Increased from 30 for better visibility
  const ARROW_SIZE = 10; // Increased from 8

  useImperativeHandle(ref, () => ({
    canvas: canvasRef.current
  }));

  // Get canvas context
  const getContext = () => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  };

  // Convert screen coordinates to canvas coordinates (accounting for zoom and pan)
  const getCanvasCoordinates = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    // Get screen coordinates relative to canvas
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    // Convert to world coordinates (accounting for zoom and pan)
    const worldX = (screenX - pan.x) / zoom;
    const worldY = (screenY - pan.y) / zoom;
    return {
      x: worldX,
      y: worldY
    };
  };

  // Find state at position
  const getStateAt = (x, y) => {
    for (const [id, state] of states) {
      const distance = Math.sqrt((x - state.x) ** 2 + (y - state.y) ** 2);
      if (distance <= STATE_RADIUS) {
        return id;
      }
    }
    return null;
  };

  // Draw arrow
  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - ARROW_SIZE * Math.cos(angle - Math.PI / 6),
      toY - ARROW_SIZE * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - ARROW_SIZE * Math.cos(angle + Math.PI / 6),
      toY - ARROW_SIZE * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  // Draw self-loop
  const drawSelfLoop = (ctx, state, symbols, isActive = false) => {
    const x = state.x;
    const y = state.y - STATE_RADIUS - 25; // Increased spacing
    const radius = 18; // Increased from 15 for better visibility
    
    // Draw loop - use circular path for better spacing
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    
    if (isActive) {
      ctx.strokeStyle = '#007AFF'; // Algorithm Blue for active transition
      ctx.lineWidth = 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#007AFF';
    } else {
      ctx.strokeStyle = '#1C1C1E'; // Deep black
      ctx.lineWidth = 3; // Increased from 2
      ctx.shadowBlur = 0;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Arrow for self-loop
    ctx.beginPath();
    ctx.moveTo(x + radius - 3, y - 3);
    ctx.lineTo(x + radius - 10, y - 10);
    ctx.moveTo(x + radius - 3, y - 3);
    ctx.lineTo(x + radius - 10, y + 3);
    ctx.strokeStyle = isActive ? '#007AFF' : '#1C1C1E';
    ctx.lineWidth = isActive ? 4 : 3;
    ctx.stroke();
    
    // Label with background - increased font size
    ctx.font = 'bold 18px Inter, Arial'; // Increased from 16px
    const textMetrics = ctx.measureText(symbols);
    const padding = 8; // Increased from 6
    const bgWidth = textMetrics.width + padding * 2;
    const bgHeight = 24 + padding * 2; // Increased
    
    const labelY = y - radius - 15; // More spacing
    ctx.fillStyle = isActive ? '#E6F3FF' : 'white'; // Algorithm blue bg when active
    ctx.fillRect(x - bgWidth/2, labelY - bgHeight/2, bgWidth, bgHeight);
    ctx.strokeStyle = isActive ? '#007AFF' : '#1C1C1E';
    ctx.lineWidth = isActive ? 3 : 2; // Thicker border when active
    ctx.strokeRect(x - bgWidth/2, labelY - bgHeight/2, bgWidth, bgHeight);
    
    ctx.fillStyle = isActive ? '#007AFF' : '#1C1C1E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px Inter, Arial';
    ctx.fillText(symbols, x, labelY);
  };

  // Draw transition
  const drawTransition = (ctx, transition) => {
    const fromState = states.get(transition.from);
    const toState = states.get(transition.to);
    
    if (!fromState || !toState) return;
    
    // Check if this transition is active during simulation
    // For self-loops, also check by matching from/to/symbols since ID might not be reliable
    const isActiveTransition = simulationState?.activeTransition && (
      simulationState.activeTransition.id === transition.id ||
      (simulationState.activeTransition.from === transition.from &&
       simulationState.activeTransition.to === transition.to &&
       simulationState.activeTransition.symbols === transition.symbols)
    );
    
    // Self-loop
    if (transition.from === transition.to) {
      drawSelfLoop(ctx, fromState, transition.symbols, isActiveTransition);
      return;
    }
    
    // Calculate edge points
    const angle = Math.atan2(toState.y - fromState.y, toState.x - fromState.x);
    const fromX = fromState.x + STATE_RADIUS * Math.cos(angle);
    const fromY = fromState.y + STATE_RADIUS * Math.sin(angle);
    const toX = toState.x - STATE_RADIUS * Math.cos(angle);
    const toY = toState.y - STATE_RADIUS * Math.sin(angle);
    
    // Draw line - highlight if active
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    
    if (isActiveTransition) {
      ctx.strokeStyle = 'var(--algorithm-blue)'; // Algorithm Blue for active transition
      ctx.lineWidth = 4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'var(--algorithm-blue)';
    } else {
      ctx.strokeStyle = '#1C1C1E'; // Deep black with high contrast
      ctx.lineWidth = 3; // Increased from 2 for better visibility
      ctx.shadowBlur = 0;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Draw arrow with better visibility
    drawArrow(ctx, fromX, fromY, toX, toY);
    
    // Draw label with background - increased font size and better contrast
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    // Draw background for label
    ctx.font = 'bold 18px Inter, Arial'; // Increased from 16px
    const textMetrics = ctx.measureText(transition.symbols);
    const padding = 8; // Increased from 6
    const bgWidth = textMetrics.width + padding * 2;
    const bgHeight = 24 + padding * 2; // Increased from 20
    
    ctx.fillStyle = isActiveTransition ? '#E6F3FF' : 'white'; // Algorithm blue bg
    ctx.fillRect(midX - bgWidth/2, midY - bgHeight/2 - 4, bgWidth, bgHeight);
    ctx.strokeStyle = isActiveTransition ? '#007AFF' : '#1C1C1E';
    ctx.lineWidth = isActiveTransition ? 3 : 2; // Thicker border
    ctx.strokeRect(midX - bgWidth/2, midY - bgHeight/2 - 4, bgWidth, bgHeight);
    
    // Draw text with better contrast
    ctx.fillStyle = isActiveTransition ? '#007AFF' : '#1C1C1E';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 18px Inter, Arial';
    ctx.fillText(transition.symbols, midX, midY);
  };

  // Draw start arrow
  const drawStartArrow = (ctx, state) => {
    const startX = state.x - STATE_RADIUS - 45; // Slightly further for better visibility
    const startY = state.y;
    const endX = state.x - STATE_RADIUS;
    const endY = state.y;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#1C1C1E'; // Deep black
    ctx.lineWidth = 3; // Increased from 2
    ctx.stroke();
    
    drawArrow(ctx, startX, startY, endX, endY);
    
    // "Start" label with better visibility
    ctx.fillStyle = '#1C1C1E';
    ctx.font = 'bold 14px Inter, Arial'; // Increased and bold
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Start', startX - 15, startY - 8);
  };

  // Draw state
  const drawState = (ctx, state) => {
    const isSelected = selectedState === state.id || selectedStates.has(state.id);
    const isStart = startState === state.id;
    const isTransitionSource = mode === 'addTransition' && transitionStart === state.id;
    const isHoveredForTransition = mode === 'addTransition' && !transitionStart && 
      Math.sqrt((mousePos.x - state.x) ** 2 + (mousePos.y - state.y) ** 2) <= STATE_RADIUS;
    const isActiveState = simulationState?.activeState === state.id; // Highlight during simulation
    const isAccepting = state.isAccepting === true; // Explicitly check for accepting state
    
    // OUTER CIRCLE (always drawn) - This is the main state circle
    ctx.beginPath();
    ctx.arc(state.x, state.y, STATE_RADIUS, 0, 2 * Math.PI);
    
    if (isActiveState) {
      // Active state during simulation - Algorithm Blue highlight
      ctx.fillStyle = '#E6F3FF'; // Algorithm blue background
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#007AFF';
    } else if (isTransitionSource) {
      ctx.fillStyle = '#dbeafe';
      ctx.shadowBlur = 0;
    } else if (isHoveredForTransition) {
      ctx.fillStyle = '#f0f9ff';
      ctx.shadowBlur = 0;
    } else if (isSelected) {
      ctx.fillStyle = '#dbeafe';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#3b82f6';
    } else if (isAccepting) {
      // Accepting states - same as regular states
      ctx.fillStyle = 'white';
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = 'white';
      ctx.shadowBlur = 0;
    }
    ctx.fill();
    
    // Outer circle stroke
    if (isActiveState) {
      ctx.strokeStyle = '#007AFF'; // Algorithm Blue for active state
      ctx.lineWidth = 3;
    } else if (isTransitionSource) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.shadowBlur = 0;
    } else if (isHoveredForTransition) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 0;
    } else if (isSelected) {
      ctx.strokeStyle = '#007AFF';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 0;
    } else if (isAccepting) {
      ctx.strokeStyle = '#1C1C1E'; // Deep black for accepting state outer circle
      ctx.lineWidth = 3;
      ctx.shadowBlur = 0;
    } else {
      ctx.strokeStyle = '#1C1C1E'; // Deep black for regular states
      ctx.lineWidth = 3;
      ctx.shadowBlur = 0;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // INNER CIRCLE (only for accepting states) - This creates the double circle effect
    // Draw inner circle AFTER outer circle to ensure both are visible
    if (isAccepting) {
      const innerRadius = STATE_RADIUS - 10; // Clear gap between circles
      
      // Draw inner circle background to match outer fill
      ctx.beginPath();
      ctx.arc(state.x, state.y, innerRadius, 0, 2 * Math.PI);
      if (isActiveState) {
        ctx.fillStyle = '#E6F3FF';
      } else if (isSelected) {
        ctx.fillStyle = '#dbeafe';
      } else {
        ctx.fillStyle = 'white'; // Same white fill for accepting states
      }
      ctx.fill();
      
      // Draw inner circle border - this is the second circle in BLACK
      ctx.beginPath();
      ctx.arc(state.x, state.y, innerRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#1C1C1E'; // Deep black for accepting state inner circle
      ctx.lineWidth = 4; // Thick stroke for visibility
      ctx.stroke();
      
      // Debug log
      // console.log(`Drawing accepting state ${state.id} with double circle`);
    }
    
    // State label - increased font size and better contrast (always black except when active)
    ctx.fillStyle = isActiveState ? '#007AFF' : '#1C1C1E';
    ctx.font = 'bold 18px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillText(state.label, state.x, state.y);
    ctx.shadowBlur = 0;
    
    // Start arrow
    if (isStart) {
      drawStartArrow(ctx, state);
    }
  };

  // Render canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    
    // Clear canvas completely
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    
    // Debug: Log accepting states
    // console.log('Rendering states:', Array.from(states.values()).map(s => ({ id: s.id, isAccepting: s.isAccepting })));
    
    // Draw grid with better visibility
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'; // Slightly darker grid for better visibility
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw transitions
    transitions.forEach(transition => {
      drawTransition(ctx, transition);
    });
    
    // Draw states
    states.forEach(state => {
      drawState(ctx, state);
    });
    
    // Draw temporary transition line when creating transition
    if (mode === 'addTransition' && transitionStart) {
      const fromState = states.get(transitionStart);
      if (fromState) {
        ctx.beginPath();
        ctx.moveTo(fromState.x, fromState.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Highlight the starting state
        ctx.beginPath();
        ctx.arc(fromState.x, fromState.y, STATE_RADIUS + 3, 0, 2 * Math.PI);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
    
    // Restore transformations
    ctx.restore();
    
    // Draw instructions for transition mode
    if (mode === 'addTransition') {
      const instruction = transitionStart ? 
        'Click the destination state to create transition' : 
        'Click the first state to start creating a transition';
      
      ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.fillRect(10, 10, ctx.measureText(instruction).width + 20, 30);
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.fillText(instruction, 20, 30);
    }
  }, [states, transitions, startState, selectedState, selectedTransition, mode, transitionStart, mousePos, simulationState, zoom, pan, selectedStates]);

  // Find transition at position (for selection) - including self-loops
  const getTransitionAt = (x, y) => {
    for (const transition of transitions) {
      const fromState = states.get(transition.from);
      const toState = states.get(transition.to);
      if (!fromState || !toState) continue;
      
      // Check for self-loops first
      if (transition.from === transition.to) {
        // Self-loop is drawn above the state
        const selfLoopY = fromState.y - STATE_RADIUS - 25;
        const selfLoopRadius = 18;
        const distance = Math.sqrt((x - fromState.x) ** 2 + (y - selfLoopY) ** 2);
        
        // Check if click is near the self-loop circle or its label
        if (distance < selfLoopRadius + 10) {
          return transition.id;
        }
        
        // Also check the label area
        const labelY = selfLoopY - selfLoopRadius - 15;
        const labelDistance = Math.sqrt((x - fromState.x) ** 2 + (y - labelY) ** 2);
        if (labelDistance < 40) { // Larger tolerance for label area
          return transition.id;
        }
        
        continue;
      }
      
      // Regular transition - calculate distance from point to line segment
      const dx = toState.x - fromState.x;
      const dy = toState.y - fromState.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const t = Math.max(0, Math.min(1, ((x - fromState.x) * dx + (y - fromState.y) * dy) / (length * length)));
      const projX = fromState.x + t * dx;
      const projY = fromState.y + t * dy;
      const distance = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);
      
      if (distance < 15) { // Click tolerance
        return transition.id;
      }
    }
    return null;
  };

  // Handle canvas click
  const handleCanvasClick = (event) => {
    // Don't process clicks on dialog or context menu
    if (event.target.closest('.transition-dialog') || event.target.closest('.context-menu')) {
      return;
    }
    
    const { x, y } = getCanvasCoordinates(event.clientX, event.clientY);
    const clickedState = getStateAt(x, y);
    const clickedTransition = clickedState ? null : getTransitionAt(x, y);
    
    if (mode === 'select') {
      // Group selection with Ctrl/Cmd key
      if (event.ctrlKey || event.metaKey) {
        if (clickedState) {
          const newSelection = new Set(selectedStates);
          if (newSelection.has(clickedState)) {
            newSelection.delete(clickedState);
          } else {
            newSelection.add(clickedState);
          }
          setSelectedStates(newSelection);
          // Still select for properties panel
          if (onStateSelect) onStateSelect(clickedState);
        }
      } else {
        // Single selection
        setSelectedStates(new Set());
        if (clickedState && onStateSelect) {
          onStateSelect(clickedState);
        } else if (clickedTransition && onTransitionSelect) {
          onTransitionSelect(clickedTransition);
        } else {
          // Deselect
          if (onStateSelect) onStateSelect(null);
          if (onTransitionSelect) onTransitionSelect(null);
        }
      }
    } else if (mode === 'addState' && !clickedState) {
      onStateAdd(x, y);
    } else if (mode === 'addTransition') {
      if (clickedState) {
        if (!transitionStart) {
          onTransitionStart(clickedState);
        } else {
          // Show transition dialog (including self-loops)
          setTransitionDialog({
            from: transitionStart,
            to: clickedState,
            x: event.clientX,
            y: event.clientY
          });
          setShowTransitionDialog(true);
        }
      } else {
        // Reset transition start when clicking empty space
        onTransitionStart(null);
      }
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (event) => {
    // Don't interfere with transition mode or add state mode
    if (mode === 'addTransition' || mode === 'addState') {
      return;
    }
    // Allow dragging in any mode (including default select mode or when no mode is active)
    
    const { x, y } = getCanvasCoordinates(event.clientX, event.clientY);
    const clickedState = getStateAt(x, y);
    
    if (clickedState) {
      const state = states.get(clickedState);
      setIsDragging(true);
      setDragOffset({
        x: x - state.x,
        y: y - state.y
      });
      
      // If part of group selection, prepare to move all
      const statesToMove = (event.ctrlKey || event.metaKey) && selectedStates.has(clickedState)
        ? Array.from(selectedStates)
        : [clickedState];
      
      // Store states to move for dragging
      if (!event.ctrlKey && !event.metaKey) {
        setSelectedStates(new Set([clickedState]));
      }
      
      if (onStateSelect) onStateSelect(clickedState);
    }
  };

  // Handle mouse move for dragging and transition preview
  const handleMouseMove = (event) => {
    const { x, y } = getCanvasCoordinates(event.clientX, event.clientY);
    
    // Update mouse position for transition preview
    setMousePos({ x, y });
    
    // Handle dragging - support group move
    if (isDragging && selectedState && mode === 'select') {
      const state = states.get(selectedState);
      if (state) {
        const newX = x - dragOffset.x;
        const newY = y - dragOffset.y;
        const deltaX = newX - state.x;
        const deltaY = newY - state.y;
        
        // Move selected state
        onStateMove(selectedState, newX, newY);
        
        // Move all states in group selection
        if (selectedStates.size > 1) {
          selectedStates.forEach(stateId => {
            if (stateId !== selectedState) {
              const s = states.get(stateId);
              if (s) {
                onStateMove(stateId, s.x + deltaX, s.y + deltaY);
              }
            }
          });
        }
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle right click for context menu
  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const { x, y } = getCanvasCoordinates(event.clientX, event.clientY);
    const clickedState = getStateAt(x, y);
    
    if (clickedState) {
      const state = states.get(clickedState);
      if (state) {
        // Get canvas position in viewport
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        // Calculate bottom-right position of the state node
        // Bottom-right means: x + radius (right edge), y + radius (bottom edge)
        // Add a small offset to position menu close to the state
        const offsetX = STATE_RADIUS + 5; // 5px gap from state edge
        const offsetY = STATE_RADIUS + 5; // 5px gap from state edge
        
        // Convert canvas coordinates to viewport coordinates
        let menuX = rect.left + state.x + offsetX;
        let menuY = rect.top + state.y + offsetY;
        
        // Ensure menu stays within viewport
        const menuWidth = 180; // min-width from CSS
        const menuHeight = 120; // approximate height
        if (menuX + menuWidth > window.innerWidth) {
          menuX = event.clientX - menuWidth; // Position to left of click
        }
        if (menuY + menuHeight > window.innerHeight) {
          menuY = event.clientY - menuHeight; // Position above click
        }
        
        setContextMenu({
          stateId: clickedState,
          x: menuX, // Bottom-right of state in viewport coordinates
          y: menuY  // Bottom-right of state in viewport coordinates
        });
      }
    } else {
      setContextMenu(null);
    }
  };

  // Handle transition dialog submit
  const handleTransitionSubmit = (symbol) => {
    if (transitionDialog.from && transitionDialog.to && symbol.trim()) {
      onTransitionAdd(transitionDialog.from, transitionDialog.to, symbol.trim());
      onTransitionStart(null);
    }
    setShowTransitionDialog(false);
    setTransitionDialog({ from: null, to: null, x: 0, y: 0 });
  };

  // Handle key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (selectedState && mode === 'select') {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          onStateDelete(selectedState);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedState, mode, onStateDelete]);

  // Auto-center automaton when canvas size changes
  const centerAutomaton = useCallback(() => {
    if (states.size === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Calculate bounding box of all states
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    states.forEach(state => {
      minX = Math.min(minX, state.x);
      maxX = Math.max(maxX, state.x);
      minY = Math.min(minY, state.y);
      maxY = Math.max(maxY, state.y);
    });
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    // Account for zoom when calculating canvas center
    const canvasCenterX = canvas.width / (2 * zoom);
    const canvasCenterY = canvas.height / (2 * zoom);
    
    // Calculate new pan to center the automaton
    const newPanX = (canvasCenterX - centerX) * zoom;
    const newPanY = (canvasCenterY - centerY) * zoom;
    
    // Only adjust if the difference is significant (>50px) to avoid jitter
    setPan(prev => {
      const offsetX = Math.abs(newPanX - prev.x);
      const offsetY = Math.abs(newPanY - prev.y);
      
      if (offsetX > 50 || offsetY > 50) {
        return { x: newPanX, y: newPanY };
      }
      return prev;
    });
  }, [states, zoom]);

  // Resize canvas with smooth transitions
  useEffect(() => {
    let resizeTimeout;
    let resizeObserver;
    
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      
      // Clear any pending resize
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      
      // Delay resize slightly to match CSS transitions (300ms)
      resizeTimeout = setTimeout(() => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        // Only resize if dimensions actually changed
        if (canvas.width !== newWidth || canvas.height !== newHeight) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Auto-center after resize if states exist
          if (states.size > 0) {
            // Small delay to ensure render happens first
            setTimeout(() => {
              centerAutomaton();
              render();
            }, 50);
          } else {
            render();
          }
        }
      }, 310); // Slightly longer than CSS transition (300ms)
    };
    
    resizeCanvas();
    
    // Use ResizeObserver for smoother container size tracking
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(containerRef.current);
    }
    
    // Also listen to window resize as fallback
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [render, centerAutomaton, states.size]);

  // Re-render when data changes
  useEffect(() => {
    render();
  }, [render]);

  // Close context menu on click outside or ESC key
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking on context menu itself
      if (e.target.closest('.context-menu')) {
        return;
      }
      setContextMenu(null);
    };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape' && contextMenu) {
        setContextMenu(null);
      }
    };
    
    if (contextMenu) {
      // Use setTimeout to avoid immediate closure on right-click
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside, true);
        document.addEventListener('contextmenu', handleClickOutside, true);
        document.addEventListener('keydown', handleEscape);
      }, 0);
      
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
        document.removeEventListener('contextmenu', handleClickOutside, true);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [contextMenu]);

  return (
    <div ref={containerRef} className="automata-canvas-container">
      <canvas
        ref={canvasRef}
        className="automata-canvas"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
        style={{ pointerEvents: 'auto' }}
        onWheel={(e) => {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          const newZoom = Math.max(0.5, Math.min(2, zoom + delta));
          setZoom(newZoom);
        }}
      />
      
      {/* Transition Dialog */}
      {showTransitionDialog && createPortal(
        <TransitionDialog
          x={transitionDialog.x}
          y={transitionDialog.y}
          onSubmit={handleTransitionSubmit}
          onCancel={() => {
            setShowTransitionDialog(false);
            onTransitionStart(null);
          }}
        />,
        document.body
      )}
      
      {/* Context Menu - Render in portal to avoid positioning issues */}
      {contextMenu && createPortal(
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          stateId={contextMenu.stateId}
          state={states.get(contextMenu.stateId)}
          isStart={startState === contextMenu.stateId}
          onToggleAccepting={() => {
            onStateToggleAccepting(contextMenu.stateId);
            setContextMenu(null);
          }}
          onSetStart={() => {
            onStateSetStart(contextMenu.stateId);
            setContextMenu(null);
          }}
          onRemoveStart={() => {
            // Remove start state by setting it to null
            onStateSetStart(null);
            setContextMenu(null);
          }}
          onDelete={() => {
            onStateDelete(contextMenu.stateId);
            setContextMenu(null);
          }}
          onClose={() => setContextMenu(null)}
        />,
        document.body
      )}
      
      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button
          className="zoom-btn"
          onClick={() => {
            const newZoom = Math.min(zoom + 0.1, 2);
            setZoom(newZoom);
          }}
          title="Zoom In"
        >
          <span>+</span>
        </button>
        <div className="zoom-value">{Math.round(zoom * 100)}%</div>
        <button
          className="zoom-btn"
          onClick={() => {
            const newZoom = Math.max(zoom - 0.1, 0.5);
            setZoom(newZoom);
          }}
          title="Zoom Out"
        >
          <span>−</span>
        </button>
        <button
          className="zoom-btn"
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="Reset Zoom"
        >
          <span>⌂</span>
        </button>
      </div>
    </div>
  );
});

// Transition Dialog Component
const TransitionDialog = ({ x, y, onSubmit, onCancel }) => {
  const [symbol, setSymbol] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSubmit(symbol);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };
  
  return (
    <div 
      className="transition-dialog"
      style={{ 
        left: Math.min(x, window.innerWidth - 250), 
        top: Math.min(y, window.innerHeight - 150) 
      }}
    >
      <div className="dialog-header">
        <h4>Add Transition</h4>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          Symbol:
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.replace(/[^01]/g, ''))}
            placeholder="0 or 1"
            maxLength="1"
            autoFocus
            onKeyDown={handleKeyPress}
          />
        </label>
        <div className="dialog-buttons">
          <button type="submit" disabled={!symbol.trim()}>
            Add Transition
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Context Menu Component
const ContextMenu = ({ 
  x, y, stateId, state, isStart, 
  onToggleAccepting, onSetStart, onRemoveStart, onDelete, onClose 
}) => {
  // Handle button clicks and stop propagation
  const handleButtonClick = (handler) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    handler();
  };
  
  return (
    <div 
      className="context-menu"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside menu from closing it
      onContextMenu={(e) => e.preventDefault()} // Prevent context menu on context menu
      style={{ 
        position: 'fixed',
        left: `${x}px`, 
        top: `${y}px`,
        transform: 'none', // Ensure no transforms are applied
        zIndex: 20000 // Higher than tutorial overlay
      }}
    >
      <button onClick={handleButtonClick(onToggleAccepting)}>
        {state?.isAccepting ? 'Remove Final/Accept' : 'Make Final/Accept'}
      </button>
      {isStart ? (
        <button onClick={handleButtonClick(onRemoveStart)}>
          Remove Start State
        </button>
      ) : (
        <button onClick={handleButtonClick(onSetStart)}>
          Make Start State
        </button>
      )}
      <button onClick={handleButtonClick(onDelete)} className="delete-option">
        Delete State
      </button>
    </div>
  );
};

export default AutomataCanvas;
