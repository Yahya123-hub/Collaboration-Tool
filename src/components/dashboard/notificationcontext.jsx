import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from './usercontext'; 


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { email } = useUserContext(); 
  const [notifications, setNotifications] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000); // Fetch notifications every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/notifications/getnotis/${email}`);
      const newNotifications = response.data;

      if (newNotifications.length > notifications.length) {
        setAlert('New Task Alert');
        //window.alert('You have a new notification!'); // Show alert
        setTimeout(() => setAlert(null), 3000);
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const clearNotifications = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/notifications/clear/${email}`);
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => React.useContext(NotificationContext);
