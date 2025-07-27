import { useState, useEffect } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

// Breakpoints as specified
const MOBILE_MAX = 640;
const TABLET_MAX = 991;

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      
      if (width <= MOBILE_MAX) {
        setDeviceType("mobile");
      } else if (width <= TABLET_MAX) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    // Check on mount
    checkDeviceType();

    // Listen for resize events
    const handleResize = () => {
      checkDeviceType();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType;
}

export function useIsMobileOrTablet(): boolean {
  const deviceType = useDeviceType();
  return deviceType === "mobile" || deviceType === "tablet";
}
