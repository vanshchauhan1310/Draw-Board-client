import React from 'react';

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#008080', '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#4B0082'
];

function ColorPicker({ color, onColorChange }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input 
          type="color" 
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-12 h-12 p-1 border-2 border-blue-200 rounded-lg cursor-pointer"
        />
        <div 
          className="flex-1 h-12 rounded-lg shadow-sm"
          style={{ backgroundColor: color }}
        ></div>
      </div>
      
      <div className="grid grid-cols-8 gap-2">
        {COLORS.map((paletteColor) => (
          <button
            key={paletteColor}
            onClick={() => onColorChange(paletteColor)}
            className={`w-8 h-8 rounded-full shadow-md transform hover:scale-110 transition-transform ${
              color === paletteColor ? 'ring-2 ring-blue-500 ring-offset-2' : ''
            }`}
            style={{ backgroundColor: paletteColor }}
            title={paletteColor}
          />
        ))}
      </div>
    </div>
  );
}

export default ColorPicker;

