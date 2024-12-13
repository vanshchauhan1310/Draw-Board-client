import React, { useRef, useEffect, useState } from 'react';
import { Trash2, Download, Eraser } from 'lucide-react';

function Canvas({ socket, username, color, brushSize, className }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
        
        canvas.width = width;
        canvas.height = height;
        
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(tempCanvas, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    socket.on('draw', (drawData) => {
      drawOnCanvas(context, drawData);
    });

    socket.on('drawing_history', (history) => {
      history.forEach(drawData => {
        drawOnCanvas(context, drawData);
      });
    });

    return () => {
      socket.off('draw');
      socket.off('drawing_history');
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [socket]);

  const drawOnCanvas = (context, { x0, y0, x1, y1, color, brushSize, erase }) => {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = erase ? 'white' : color;
    context.lineWidth = brushSize;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.stroke();
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    setIsDrawing(true);
    lastPositionRef.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = getCoordinates(e);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    drawOnCanvas(context, {
      x0: lastPositionRef.current.x,
      y0: lastPositionRef.current.y,
      x1: offsetX,
      y1: offsetY,
      color: isErasing ? 'white' : color,
      brushSize,
      erase: isErasing
    });

    socket.emit('draw', {
      x0: lastPositionRef.current.x,
      y0: lastPositionRef.current.y,
      x1: offsetX,
      y1: offsetY,
      color,
      brushSize,
      username,
      erase: isErasing
    });

    lastPositionRef.current = { x: offsetX, y: offsetY };
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches && e.touches[0]) {
      return {
        offsetX: (e.touches[0].clientX - rect.left) * scaleX,
        offsetY: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    
    return {
      offsetX: (e.clientX - rect.left) * scaleX,
      offsetY: (e.clientY - rect.top) * scaleY
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    socket.emit('clear_canvas');
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  return (
    <div className="relative h-full">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className={`${className} w-full h-full cursor-crosshair touch-none`}
      />
      <div className="absolute top-4 right-4 flex space-x-4">
        <button 
          onClick={toggleEraser}
          className={`p-2 rounded-full transition-colors flex items-center ${
            isErasing ? 'bg-gray-600 text-white' : 'bg-white text-gray-600'
          }`}
          title={isErasing ? "Switch to Brush" : "Switch to Eraser"}
        >
          <Eraser size={20} />
        </button>
        <button 
          onClick={clearCanvas}
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors flex items-center"
          title="Clear Canvas"
        >
          <Trash2 size={20} />
        </button>
        <button 
          onClick={downloadCanvas}
          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors flex items-center"
          title="Download Drawing"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
}

export default Canvas;

