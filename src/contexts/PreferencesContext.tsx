import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr';
  dateFormat: 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'yyyy-MM-dd';
  timeFormat: '12h' | '24h';
  defaultView: 'dashboard' | 'classes' | 'reports';
  autoLogout: '15m' | '30m' | '1h' | '4h' | 'never';
  autoDeleteOldRecords?: boolean;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  classReminders: boolean;
  attendanceAlerts: boolean;
  weeklyReports: boolean;
  systemUpdates: boolean;
}

interface PreferencesContextType {
  preferences: AppPreferences;
  notifications: NotificationPreferences;
  updatePreferences: (updates: Partial<AppPreferences>) => void;
  updateNotifications: (updates: Partial<NotificationPreferences>) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  applyTheme: () => void;
}

const defaultPreferences: AppPreferences = {
  theme: 'light',
  language: 'en',
  dateFormat: 'MM/dd/yyyy',
  timeFormat: '12h',
  defaultView: 'dashboard',
  autoLogout: '30m'
};

const defaultNotifications: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: false,
  classReminders: true,
  attendanceAlerts: true,
  weeklyReports: false,
  systemUpdates: true
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);
  const [notifications, setNotifications] = useState<NotificationPreferences>(defaultNotifications);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('app-preferences');
    const savedNotifications = localStorage.getItem('notification-preferences');
    
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
    
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Apply theme when preferences change
  useEffect(() => {
    applyTheme();
  }, [preferences.theme]);

  const updatePreferences = (updates: Partial<AppPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('app-preferences', JSON.stringify(newPreferences));
    
    // Show success message for certain preference changes
    if (updates.theme) {
      toast.success(`Theme changed to ${updates.theme}`);
    }
    if (updates.language) {
      toast.success(`Language changed to ${getLanguageName(updates.language)}`);
    }
  };

  const updateNotifications = (updates: Partial<NotificationPreferences>) => {
    const newNotifications = { ...notifications, ...updates };
    setNotifications(newNotifications);
    localStorage.setItem('notification-preferences', JSON.stringify(newNotifications));
    toast.success('Notification preferences updated');
  };

  const getLanguageName = (code: string) => {
    const names = { en: 'English', es: 'Spanish', fr: 'French' };
    return names[code as keyof typeof names] || code;
  };

  const applyTheme = () => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (preferences.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(preferences.theme);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    switch (preferences.dateFormat) {
      case 'MM/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'dd/MM/yyyy':
        return `${day}/${month}/${year}`;
      case 'yyyy-MM-dd':
        return `${year}-${month}-${day}`;
      default:
        return date.toLocaleDateString();
    }
  };

  const formatTime = (date: Date): string => {
    if (preferences.timeFormat === '24h') {
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    }
  };

  const value: PreferencesContextType = {
    preferences,
    notifications,
    updatePreferences,
    updateNotifications,
    formatDate,
    formatTime,
    applyTheme
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

// Auto-logout functionality
export const useAutoLogout = () => {
  const { preferences } = usePreferences();
  
  useEffect(() => {
    if (preferences.autoLogout === 'never') return;
    
    const timeouts = {
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
    };
    
    const timeoutDuration = timeouts[preferences.autoLogout];
    let timeoutId: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        toast.info('Session expired. Please log in again.');
        // Auto logout logic would go here
        window.location.href = '/auth';
      }, timeoutDuration);
    };
    
    // Reset timeout on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });
    
    resetTimeout(); // Initialize timeout
    
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [preferences.autoLogout]);
};