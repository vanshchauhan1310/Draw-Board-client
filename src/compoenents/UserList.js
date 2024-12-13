import React from 'react';
import { UserCircle2 } from 'lucide-react';

function UserList({ users }) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
      {users.length === 0 ? (
        <div className="text-gray-500 text-sm italic text-center">
          No users connected
        </div>
      ) : (
        users.map((user, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm hover:bg-purple-100 transition-colors"
          >
            <UserCircle2 
              className="text-purple-500" 
              size={28} 
            />
            <span className="text-gray-700 font-medium truncate">
              {user}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default UserList;

