import React, { useState, useEffect } from 'react';
import socket from './utils/socket';
import Canvas from './compoenents/Canvas';
import ColorPicker from './compoenents/ColorPicker';
import UserList from './compoenents/UserList';
import { Palette, Users, PaintBucket, Brush } from 'lucide-react';

function App() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);

  useEffect(() => {
    const name = prompt('Enter your username:') || `Guest${Math.floor(Math.random() * 1000)}`;
    setUsername(name);
    socket.emit('register_user', name);

    socket.on('update_users', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('update_users');
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
        <div className="flex items-center mb-8">
          <Brush className="mr-3 text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">DrawTogether</h1>
        </div>

        <div className="space-y-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Palette className="mr-2 text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-700">Color Palette</h2>
            </div>
            <ColorPicker 
              color={color} 
              onColorChange={(newColor) => setColor(newColor)} 
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <PaintBucket className="mr-2 text-green-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-700">Brush Size</h2>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-600">1px</span>
              <span className="text-sm font-medium text-gray-700">{brushSize}px</span>
              <span className="text-sm text-gray-600">20px</span>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Users className="mr-2 text-purple-600" size={24} />
              <h2 className="text-xl font-semibold text-gray-700">Connected Users</h2>
            </div>
            <UserList users={users} />
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4">
        <Canvas 
          socket={socket} 
          username={username}
          color={color}
          brushSize={brushSize}
          className="bg-white shadow-xl rounded-xl"
        />
      </div>
    </div>
  );
}

export default App;

