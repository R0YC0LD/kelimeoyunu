
import React from 'react';

const APP_PREFIX = 'chatapp_';

export const storage = {
  getItem: (key) => {
    try {
      const item = localStorage.getItem(APP_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(APP_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in localStorage', error);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(APP_PREFIX + key);
    } catch (error) {
      console.error('Error removing item from localStorage', error);
    }
  },
};
  