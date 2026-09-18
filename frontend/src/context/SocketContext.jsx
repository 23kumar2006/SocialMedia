import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { initSocket, disconnectSocket, getSocket } from '../services/socket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (user?._id || user?.id) {
      const userId = user._id || user.id;
      const socketInstance = initSocket(userId);
      setSocket(socketInstance);

      // Listen for global user status updates
      socketInstance.on('users:online', (usersList) => {
        setOnlineUsers(new Set(usersList));
      });

      return () => {
        disconnectSocket();
        setSocket(null);
      };
    } else {
      disconnectSocket();
      setSocket(null);
    }
  }, [user?._id, user?.id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isConnected: !!socket?.connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
