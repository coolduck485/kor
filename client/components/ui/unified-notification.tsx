import React from "react";
import { NotificationProvider } from "./floating-notification";
import { MobileNotificationProvider } from "./mobile-notification";
import { useDeviceType } from "@/hooks/use-device-type";

export const UnifiedNotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceType = useDeviceType();
  const isDesktop = deviceType === "desktop";

  if (isDesktop) {
    return <NotificationProvider>{children}</NotificationProvider>;
  }

  return <MobileNotificationProvider>{children}</MobileNotificationProvider>;
};

// Export a unified hook that works with both systems
export const useUnifiedNotifications = () => {
  const deviceType = useDeviceType();
  
  if (deviceType === "desktop") {
    // Re-export desktop notifications
    try {
      const { useFloatingNotifications } = require("@/hooks/use-floating-notifications");
      return useFloatingNotifications();
    } catch {
      // Fallback if hook not available
      return {
        showSuccess: () => {},
        showError: () => {},
        showWarning: () => {},
        showInfo: () => {},
        remove: () => {},
        clearAll: () => {},
        notifications: [],
        count: 0,
      };
    }
  } else {
    // Use mobile notifications for mobile/tablet
    try {
      const { useMobileNotificationHelpers } = require("./mobile-notification");
      return useMobileNotificationHelpers();
    } catch {
      // Fallback if hook not available
      return {
        showSuccess: () => {},
        showError: () => {},
        showWarning: () => {},
        showInfo: () => {},
        remove: () => {},
        clearAll: () => {},
        notifications: [],
        count: 0,
      };
    }
  }
};
