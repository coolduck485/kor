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

// Import both notification systems
import { useFloatingNotifications } from "@/hooks/use-floating-notifications";
import { useMobileNotificationHelpers } from "./mobile-notification";

// Export a unified hook that works with both systems
export const useUnifiedNotifications = () => {
  const deviceType = useDeviceType();

  if (deviceType === "desktop") {
    return useFloatingNotifications();
  } else {
    return useMobileNotificationHelpers();
  }
};
