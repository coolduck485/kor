import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FloatingNotification {
  id: string;
  title: string;
  description: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number; // Auto-dismiss duration in ms, 0 = no auto-dismiss
}

interface NotificationContextType {
  notifications: FloatingNotification[];
  addNotification: (notification: Omit<FloatingNotification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<FloatingNotification[]>([]);

  const addNotification = useCallback((notification: Omit<FloatingNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: FloatingNotification = {
      id,
      duration: 5000, // Default 5 seconds
      type: 'info',
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss if duration is set
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      <FloatingNotificationContainer />
    </NotificationContext.Provider>
  );
};

const FloatingNotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none">
      <div className="flex flex-col gap-3 w-full max-w-sm sm:max-w-md">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <FloatingNotificationItem
              key={notification.id}
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface FloatingNotificationItemProps {
  notification: FloatingNotification;
  onClose: () => void;
}

const FloatingNotificationItem: React.FC<FloatingNotificationItemProps> = ({ notification, onClose }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, isNear: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);
    
    setMousePosition({
      x,
      y,
      isNear: distance < 150,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0, isNear: false });
  };

  const getTypeColors = (type: FloatingNotification['type']) => {
    switch (type) {
      case 'success':
        return {
          border: 'rgba(34, 197, 94, 0.3)',
          glow: 'rgba(34, 197, 94, 0.2)',
          accent: 'rgba(34, 197, 94, 0.6)',
        };
      case 'warning':
        return {
          border: 'rgba(245, 158, 11, 0.3)',
          glow: 'rgba(245, 158, 11, 0.2)',
          accent: 'rgba(245, 158, 11, 0.6)',
        };
      case 'error':
        return {
          border: 'rgba(239, 68, 68, 0.3)',
          glow: 'rgba(239, 68, 68, 0.2)',
          accent: 'rgba(239, 68, 68, 0.6)',
        };
      default:
        return {
          border: 'rgba(73, 146, 255, 0.3)',
          glow: 'rgba(73, 146, 255, 0.2)',
          accent: 'rgba(73, 146, 255, 0.6)',
        };
    }
  };

  const colors = getTypeColors(notification.type);

  return (
    <motion.div
      layout
      initial={{ 
        opacity: 0, 
        scale: 0.8, 
        x: 100,
        filter: "blur(10px)"
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        x: 0,
        filter: "blur(0px)"
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.9, 
        x: 100,
        filter: "blur(5px)",
        transition: { duration: 0.2 }
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className="relative group pointer-events-auto animate-float"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        willChange: "transform",
      }}
    >
      {/* Dynamic Border Effect */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300"
        style={{
          background: mousePosition.isNear
            ? `conic-gradient(from ${(Math.atan2(mousePosition.y, mousePosition.x) * 180) / Math.PI + 90}deg, ${colors.accent} 0deg, ${colors.border} 90deg, rgba(255, 255, 255, 0.1) 180deg, rgba(255, 255, 255, 0.1) 270deg, ${colors.accent} 360deg)`
            : `conic-gradient(from 0deg, ${colors.border} 0deg, ${colors.border} 360deg)`,
          padding: "1px",
          borderRadius: "inherit",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Main notification content */}
      <div
        className={cn(
          "relative backdrop-blur-xl rounded-xl p-4 pr-10 shadow-2xl transition-all duration-300",
          "hover:shadow-glow-intense group-hover:scale-[1.02]",
          "border border-transparent"
        )}
        style={{
          background: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(20px)",
          boxShadow: `
            0 0 50px ${colors.glow},
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-30"
              style={{
                left: `${10 + (i * 15) % 80}%`,
                top: `${20 + (i * 25) % 60}%`,
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                background: colors.accent,
                animation: `gentleFloat ${2 + (i % 3)}s ease-in-out infinite ${i * 0.5}s`,
                filter: "blur(0.5px)",
              }}
            />
          ))}
        </div>

        {/* Close button */}
        <motion.button
          onClick={onClose}
          className={cn(
            "absolute top-3 right-3 p-1 rounded-md",
            "text-white/60 hover:text-white",
            "hover:bg-white/10 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-white/20"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-4 w-4" />
        </motion.button>

        {/* Content */}
        <div className="space-y-1">
          <motion.h4 
            className={cn(
              "font-semibold text-white text-sm sm:text-base",
              "animate-text-glow-pulse"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {notification.title}
          </motion.h4>
          <motion.p 
            className="text-white/80 text-xs sm:text-sm leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {notification.description}
          </motion.p>
        </div>

        {/* Accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
};

// Utility function for easy notification usage
export const showNotification = (notification: Omit<FloatingNotification, 'id'>) => {
  // This will be used with the context
  console.warn('showNotification called outside of NotificationProvider. Use useNotifications().addNotification instead.');
};
