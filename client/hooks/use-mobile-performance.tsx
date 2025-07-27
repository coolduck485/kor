import { useIsMobile } from "./use-mobile";
import { useEffect, useState } from "react";

export function useMobilePerformance() {
  const isMobile = useIsMobile();

  // Initialize device type synchronously to prevent flickering
  const getInitialDeviceType = () => {
    if (typeof window === "undefined") return "desktop";
    const width = window.innerWidth;
    if (width <= 640) return "mobile";
    if (width <= 991) return "tablet";
    return "desktop";
  };

  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    getInitialDeviceType(),
  );

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const newDeviceType = width <= 640 ? "mobile" : width <= 991 ? "tablet" : "desktop";

      // Only update if device type actually changed to prevent unnecessary re-renders
      if (newDeviceType !== deviceType) {
        setDeviceType(newDeviceType);
      }
    };

    window.addEventListener("resize", checkDeviceType);
    return () => window.removeEventListener("resize", checkDeviceType);
  }, [deviceType]);

  useEffect(() => {
    if (deviceType === "mobile") {
      // Aggressive mobile performance optimizations
      document.documentElement.style.setProperty(
        "--mobile-animation-duration",
        "0.2s",
      );
      document.documentElement.style.setProperty("--mobile-blur-amount", "0px");
      document.documentElement.style.setProperty(
        "--mobile-particle-count",
        "1",
      );
      document.documentElement.style.setProperty(
        "--mobile-shadow-amount",
        "none",
      );
      document.documentElement.style.setProperty(
        "--mobile-text-shadow",
        "none",
      );
      document.documentElement.style.setProperty("--mobile-text-glow", "none");
      document.documentElement.style.setProperty(
        "--mobile-backdrop-filter",
        "none",
      );
    } else if (deviceType === "tablet") {
      // Aggressive tablet performance optimizations
      document.documentElement.style.setProperty(
        "--mobile-animation-duration",
        "0.3s",
      );
      document.documentElement.style.setProperty("--mobile-blur-amount", "1px");
      document.documentElement.style.setProperty(
        "--mobile-particle-count",
        "2",
      );
      document.documentElement.style.setProperty(
        "--mobile-shadow-amount",
        "0 2px 4px rgba(0,0,0,0.1)",
      );
      document.documentElement.style.setProperty(
        "--mobile-text-shadow",
        "0 0 5px rgba(73, 146, 255, 0.3)",
      );
      document.documentElement.style.setProperty(
        "--mobile-text-glow",
        "0 0 10px rgba(73, 146, 255, 0.2)",
      );
      document.documentElement.style.setProperty(
        "--mobile-backdrop-filter",
        "blur(2px)",
      );
    } else {
      // Desktop values
      document.documentElement.style.setProperty(
        "--mobile-animation-duration",
        "1s",
      );
      document.documentElement.style.setProperty(
        "--mobile-blur-amount",
        "20px",
      );
      document.documentElement.style.setProperty(
        "--mobile-particle-count",
        "12",
      );
      document.documentElement.style.setProperty(
        "--mobile-shadow-amount",
        "0 0 20px rgba(73, 146, 255, 0.3)",
      );
      document.documentElement.style.setProperty(
        "--mobile-text-shadow",
        "0 0 20px rgba(73, 146, 255, 0.9), 0 0 30px rgba(63, 186, 255, 0.7), 0 0 45px rgba(57, 135, 227, 0.5)",
      );
      document.documentElement.style.setProperty(
        "--mobile-text-glow",
        "0 0 15px rgba(73, 146, 255, 0.8)",
      );
      document.documentElement.style.setProperty(
        "--mobile-backdrop-filter",
        "blur(20px)",
      );
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
          enableTextShadows: false,
          enableTextGlow: false,
          enableLetterAnimations: false,
          enableComplexTextEffects: false,
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
          enableTextShadows: true,
          enableTextGlow: true,
          enableLetterAnimations: false,
          enableComplexTextEffects: false,
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
          enableTextShadows: true,
          enableTextGlow: true,
          enableLetterAnimations: true,
          enableComplexTextEffects: true,
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
