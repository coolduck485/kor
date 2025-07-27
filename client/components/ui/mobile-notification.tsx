import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/use-device-type";

export interface MobileNotification {
  id: string;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number; // Auto-dismiss duration in ms, 0 = no auto-dismiss
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface MobileNotificationContextType {
  notifications: MobileNotification[];
  addNotification: (notification: Omit<MobileNotification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const MobileNotificationContext = createContext<MobileNotificationContextType | undefined>(
  undefined,
);

export const useMobileNotifications = () => {
  const context = useContext(MobileNotificationContext);
  if (!context) {
    throw new Error(
      "useMobileNotifications must be used within MobileNotificationProvider",
    );
  }
  return context;
};

export const MobileNotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<MobileNotification[]>([]);
  const deviceType = useDeviceType();

  const addNotification = useCallback(
    (notification: Omit<MobileNotification, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification: MobileNotification = {
        id,
        duration: 0, // Default no auto-dismiss
        type: "info",
        ...notification,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-dismiss if duration is set
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <MobileNotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
      {deviceType !== "desktop" && <MobileNotificationContainer />}
    </MobileNotificationContext.Provider>
  );
};

const MobileNotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useMobileNotifications();
  const deviceType = useDeviceType();

  const isMobile = deviceType === "mobile";

  return (
    <div
      className={cn(
        "notification-container fixed z-[100] pointer-events-none",
        isMobile
          ? "top-0 w-full flex max-h-screen flex-col-reverse p-4" // Match original mobile positioning
          : "bottom-0 right-0 top-auto flex-col max-w-[420px] p-4" // Match original tablet positioning
      )}
      style={{
        // Safe area handling for mobile devices
        paddingTop: isMobile ? "env(safe-area-inset-top)" : undefined,
        paddingBottom: isMobile ? "env(safe-area-inset-bottom)" : undefined,
      }}
    >
      <AnimatePresence
        mode="popLayout"
        initial={false}
      >
        {notifications.map((notification) => (
          <MobileNotificationItem
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
            isMobile={isMobile}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface MobileNotificationItemProps {
  notification: MobileNotification;
  onClose: () => void;
  isMobile: boolean;
}

const MobileNotificationItem: React.FC<MobileNotificationItemProps> = ({
  notification,
  onClose,
  isMobile,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Optimized exit timing for mobile
    const exitDuration = isMobile ? 200 : 250;
    setTimeout(() => {
      onClose();
    }, exitDuration);
  };

  const getTypeColors = (type: MobileNotification["type"]) => {
    switch (type) {
      case "success":
        return {
          border: "rgba(34, 197, 94, 0.3)",
          glow: "rgba(34, 197, 94, 0.2)",
          accent: "rgba(34, 197, 94, 0.6)",
        };
      case "warning":
        return {
          border: "rgba(245, 158, 11, 0.3)",
          glow: "rgba(245, 158, 11, 0.2)",
          accent: "rgba(245, 158, 11, 0.6)",
        };
      case "error":
        return {
          border: "rgba(239, 68, 68, 0.3)",
          glow: "rgba(239, 68, 68, 0.2)",
          accent: "rgba(239, 68, 68, 0.6)",
        };
      default:
        return {
          border: "rgba(73, 146, 255, 0.3)",
          glow: "rgba(73, 146, 255, 0.2)",
          accent: "rgba(73, 146, 255, 0.6)",
        };
    }
  };

  const colors = getTypeColors(notification.type);

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: isMobile ? -30 : -20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        y: isMobile ? -20 : -15,
        scale: 0.9,
        transition: {
          duration: 0.15,
          ease: "easeIn",
        },
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.3,
      }}
      className={cn(
        "mb-3 pointer-events-auto relative",
        "rounded-xl border backdrop-blur-md shadow-lg",
        "transform-gpu", // Force GPU acceleration
        getBackgroundColor(),
        isMobile ? "mx-0" : "mx-4"
      )}
      style={{
        willChange: "transform, opacity",
      }}
    >
      <div
        className={cn(
          "flex items-start gap-3",
          isMobile ? "p-3" : "p-4"
        )}
      >
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={cn(
            "font-medium text-gray-900 dark:text-gray-100",
            isMobile ? "text-sm" : "text-base"
          )}>
            {notification.title}
          </div>
          <div className={cn(
            "text-gray-700 dark:text-gray-300 mt-0.5",
            isMobile ? "text-xs leading-tight" : "text-sm"
          )}>
            {notification.message}
          </div>
          
          {/* Action button */}
          {notification.action && (
            <motion.button
              onClick={notification.action.onClick}
              className={cn(
                "mt-2 text-xs font-medium rounded-md px-2 py-1",
                "bg-white/50 dark:bg-gray-800/50",
                "hover:bg-white/80 dark:hover:bg-gray-800/80",
                "transition-colors duration-150",
                "border border-current/20"
              )}
              whileTap={{ scale: 0.95 }}
            >
              {notification.action.label}
            </motion.button>
          )}
        </div>

        {/* Close button */}
        <motion.button
          onClick={onClose}
          className={cn(
            "flex-shrink-0 rounded-md transition-colors duration-150",
            "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200",
            "hover:bg-white/50 dark:hover:bg-gray-800/50",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            isMobile ? "p-1 -mr-1 -mt-1" : "p-1.5"
          )}
          whileTap={{ scale: 0.9 }}
        >
          <X className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
        </motion.button>
      </div>

      {/* Progress bar for timed notifications */}
      {notification.duration && notification.duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current/30 rounded-b-xl"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{
            duration: notification.duration / 1000,
            ease: "linear",
          }}
        />
      )}
    </motion.div>
  );
};

// Helper hook for easy usage
export const useMobileNotificationHelpers = () => {
  const { addNotification, removeNotification, clearAll, notifications } = useMobileNotifications();

  const showSuccess = (title: string, description: string, duration: number = 0) => {
    addNotification({ title, message: description, type: "success", duration });
  };

  const showError = (title: string, description: string, duration: number = 0) => {
    addNotification({ title, message: description, type: "error", duration });
  };

  const showWarning = (title: string, description: string, duration: number = 0) => {
    addNotification({ title, message: description, type: "warning", duration });
  };

  const showInfo = (title: string, description: string, duration: number = 0) => {
    addNotification({ title, message: description, type: "info", duration });
  };

  const showWithAction = (
    title: string,
    message: string,
    actionLabel: string,
    actionCallback: () => void,
    type: MobileNotification["type"] = "info"
  ) => {
    addNotification({
      title,
      message,
      type,
      action: {
        label: actionLabel,
        onClick: actionCallback,
      },
    });
  };

  const show = (notification: Omit<MobileNotification, "id">) => {
    addNotification(notification);
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showWithAction,
    show,
    remove: removeNotification,
    clearAll,
    notifications,
    count: notifications.length,
  };
};
