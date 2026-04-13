'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, Type, PenTool } from 'lucide-react';

export default function SignaturePad({ onSave, candidateName }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('draw'); // 'draw' or 'type'
  const [typedName, setTypedName] = useState(candidateName || '');

  useEffect(() => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
  }, [mode]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      onSave(dataUrl);
    } else {
      // In 'type' mode, we'd ideally convert text to canvas image
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.font = 'italic 30px cursive';
      ctx.fillText(typedName, 50, 60);
      onSave(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setMode('draw')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'draw' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <PenTool className="w-4 h-4" />
          <span>Draw</span>
        </button>
        <button 
          onClick={() => setMode('type')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'type' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Type className="w-4 h-4" />
          <span>Type</span>
        </button>
      </div>

      <div className="relative group">
        {mode === 'draw' ? (
          <canvas
            ref={canvasRef}
            width={500}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-[200px] bg-white border-2 border-dashed border-gray-200 rounded-2xl cursor-crosshair group-hover:border-blue-200 transition-colors"
          />
        ) : (
          <div className="relative">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full h-[200px] bg-white border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-4xl font-serif italic outline-none focus:border-blue-300 transition-all font-cursive"
              style={{ fontFamily: "'Dancing Script', cursive" }}
              placeholder="Type your name..."
            />
            <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet" />
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {mode === 'draw' && (
            <button 
              onClick={clear}
              className="p-2 bg-white shadow-md rounded-lg text-gray-500 hover:text-red-600 transition-colors"
              title="Clear signature"
            >
              <Eraser className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Check className="w-4 h-4" />
          <span>Confirm Signature</span>
        </button>
      </div>
    </div>
  );
}
