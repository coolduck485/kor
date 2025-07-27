import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
      layout="position"
      layoutId={notification.id}
      initial={{
        opacity: 0,
        scale: isMobile ? 0.9 : 0.8,
        x: isMobile ? 0 : 100,
        y: isMobile ? -30 : 0,
        filter: isMobile ? "blur(2px)" : "blur(4px)",
      }}
      animate={
        isClosing
          ? {
              opacity: 0,
              scale: isMobile ? 0.85 : 0.9,
              x: isMobile ? 0 : 60,
              y: isMobile ? -20 : 0,
              filter: isMobile ? "blur(1px)" : "blur(2px)",
              transition: {
                duration: isMobile ? 0.2 : 0.25,
                ease: "easeInOut"
              },
            }
          : {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              filter: "blur(0px)",
            }
      }
      exit={{
        opacity: 0,
        scale: isMobile ? 0.75 : 0.8,
        x: isMobile ? 0 : 120,
        y: isMobile ? -25 : 0,
        filter: isMobile ? "blur(3px)" : "blur(6px)",
        transition: {
          duration: isMobile ? 0.2 : 0.25,
          ease: "easeInOut",
        },
      }}
      transition={{
        type: isMobile ? "tween" : "spring",
        stiffness: isMobile ? undefined : 280,
        damping: isMobile ? undefined : 25,
        duration: isMobile ? 0.3 : undefined,
        ease: isMobile ? "easeOut" : undefined,
      }}
      className={cn(
        "relative group notification-item pointer-events-auto",
        isMobile ? "mb-3 animate-enhanced-mobile-float-1" : "mb-3 animate-float"
      )}
      style={{
        willChange: "transform, opacity",
      }}
    >
      {/* Border Effect - matching original */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300"
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: "inherit",
        }}
      />

      {/* Main notification content - matching original styling */}
      <div
        className={cn(
          "relative rounded-xl shadow-2xl transition-all",
          isMobile
            ? "backdrop-blur-md duration-200 p-3 pr-10"
            : "backdrop-blur-xl duration-300 p-4 pr-12",
          "border border-transparent",
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
        {/* Minimal floating particles for mobile */}
        {isMobile && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full opacity-20"
                style={{
                  left: `${20 + (i * 50)}%`,
                  top: `${30 + (i * 40)}%`,
                  width: "2px",
                  height: "2px",
                  background: colors.accent,
                  animation: `enhanced-mobile-float-${i + 1} ${3 + i}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* Desktop particles */}
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full opacity-30"
                style={{
                  left: `${10 + ((i * 20) % 80)}%`,
                  top: `${20 + ((i * 30) % 60)}%`,
                  width: `${1 + (i % 2)}px`,
                  height: `${1 + (i % 2)}px`,
                  background: colors.accent,
                  animation: `gentleFloat ${2 + (i % 2)}s ease-in-out infinite ${i * 0.5}s`,
                  filter: "blur(0.5px)",
                }}
              />
            ))}
          </div>
        )}

        {/* Close button - optimized for mobile touch */}
        <motion.button
          onClick={handleClose}
          className={cn(
            "absolute rounded-md",
            "text-white/60 transition-all",
            "focus:outline-none flex items-center justify-center",
            "touch-manipulation", // Improve touch responsiveness
            isMobile
              ? "top-1 right-1 p-2 min-w-[40px] min-h-[40px] hover:bg-white/20 duration-150 active:scale-90"
              : "top-2 right-2 p-2 min-w-[44px] min-h-[44px] hover:text-white hover:bg-white/10 duration-200",
            isMobile
              ? "focus:ring-2 focus:ring-white/30"
              : "focus:ring-2 focus:ring-white/20"
          )}
          whileHover={isMobile ? undefined : { scale: 1.1, rotate: 90 }}
          whileTap={isMobile ? { scale: 0.85 } : { scale: 0.8, rotate: 180 }}
          animate={
            isClosing
              ? {
                  scale: isMobile ? 0.7 : 0.8,
                  rotate: isMobile ? 180 : 360,
                  opacity: 0.3,
                  transition: { duration: isMobile ? 0.2 : 0.3 },
                }
              : {}
          }
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <X className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
        </motion.button>

        {/* Content */}
        <div className={cn("space-y-1 relative z-10", isMobile ? "space-y-0.5" : "space-y-1")}>
          <motion.h4
            className={cn(
              "font-semibold text-white animate-text-glow-pulse",
              isMobile ? "text-xs" : "text-sm sm:text-base",
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {notification.title}
          </motion.h4>
          <motion.p
            className={cn(
              "text-white/80 leading-relaxed",
              isMobile
                ? "text-xs leading-tight"
                : "text-xs sm:text-sm leading-relaxed",
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {notification.message}
          </motion.p>

          {/* Action button */}
          {notification.action && (
            <motion.button
              onClick={notification.action.onClick}
              className={cn(
                "mt-2 text-xs font-medium rounded-md px-2 py-1",
                "bg-white/20 hover:bg-white/30 text-white",
                "transition-colors duration-150",
                "border border-white/20"
              )}
              whileTap={{ scale: 0.95 }}
            >
              {notification.action.label}
            </motion.button>
          )}
        </div>

        {/* Accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
          }}
        />

        {/* Progress bar for timed notifications */}
        {notification.duration && notification.duration > 0 && (
          <motion.div
            className="absolute bottom-0 left-0 h-1 rounded-b-xl"
            style={{ background: colors.accent }}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{
              duration: notification.duration / 1000,
              ease: "linear",
            }}
          />
        )}
      </div>
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
