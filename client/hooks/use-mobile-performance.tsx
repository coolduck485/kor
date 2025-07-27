import { useIsMobile } from "./use-mobile";
import { useEffect, useState } from "react";

export function useMobilePerformance() {
  const isMobile = useIsMobile();
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setDeviceType("mobile");
      } else if (width <= 991) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  useEffect(() => {
    if (deviceType === "mobile") {
      // Mobile-specific performance optimizations
      document.documentElement.style.setProperty("--mobile-animation-duration", "0.3s");
      document.documentElement.style.setProperty("--mobile-blur-amount", "2px");
      document.documentElement.style.setProperty("--mobile-particle-count", "2");
    } else if (deviceType === "tablet") {
      // Tablet-specific performance optimizations
      document.documentElement.style.setProperty("--mobile-animation-duration", "0.5s");
      document.documentElement.style.setProperty("--mobile-blur-amount", "4px");
      document.documentElement.style.setProperty("--mobile-particle-count", "4");
    } else {
      // Desktop values
      document.documentElement.style.setProperty("--mobile-animation-duration", "1s");
      document.documentElement.style.setProperty("--mobile-blur-amount", "20px");
      document.documentElement.style.setProperty("--mobile-particle-count", "12");
    }
  }, [deviceType]);

  const getAnimationConfig = () => {
    switch (deviceType) {
      case "mobile":
        return {
          duration: 0.2,
          particleCount: 1,
          blurAmount: 1,
          enableComplexAnimations: false,
          enableBackgroundParticles: false,
          enableFloatingOrbs: false,
          enableGradientShifts: false,
          enableBackgroundEffects: false,
          enableFloatingElements: false,
          enableSVGAnimations: false,
          enableBoxShadows: false,
          enableBackdropBlur: false,
        };
      case "tablet":
        return {
          duration: 0.3,
          particleCount: 2,
          blurAmount: 2,
          enableComplexAnimations: false,
          enableBackgroundParticles: false,
          enableFloatingOrbs: false,
          enableGradientShifts: false,
          enableBackgroundEffects: false,
          enableFloatingElements: false,
          enableSVGAnimations: false,
          enableBoxShadows: false,
          enableBackdropBlur: false,
        };
      default:
        return {
          duration: 1,
          particleCount: 12,
          blurAmount: 20,
          enableComplexAnimations: true,
          enableBackgroundParticles: true,
          enableFloatingOrbs: true,
          enableGradientShifts: true,
          enableBackgroundEffects: true,
          enableFloatingElements: true,
          enableSVGAnimations: true,
          enableBoxShadows: true,
          enableBackdropBlur: true,
        };
    }
  };

  return {
    isMobile,
    isTablet: deviceType === "tablet",
    isMobileOrTablet: deviceType === "mobile" || deviceType === "tablet",
    deviceType,
    animationConfig: getAnimationConfig(),
  };
}
