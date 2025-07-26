import { useIsMobile } from "./use-mobile";
import { useEffect } from "react";

export function useMobilePerformance() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      // Add mobile-specific performance optimizations
      document.documentElement.style.setProperty('--mobile-animation-duration', '0.3s');
      document.documentElement.style.setProperty('--mobile-blur-amount', '4px');
      document.documentElement.style.setProperty('--mobile-particle-count', '3');
    } else {
      // Reset to desktop values
      document.documentElement.style.setProperty('--mobile-animation-duration', '1s');
      document.documentElement.style.setProperty('--mobile-blur-amount', '20px');
      document.documentElement.style.setProperty('--mobile-particle-count', '12');
    }
  }, [isMobile]);

  return {
    isMobile,
    // Return optimized animation configs for mobile
    animationConfig: isMobile ? {
      duration: 0.3,
      particleCount: 3,
      blurAmount: 4,
      enableComplexAnimations: false,
      enableBackgroundParticles: false,
      enableFloatingOrbs: false,
      enableGradientShifts: false,
    } : {
      duration: 1,
      particleCount: 12,
      blurAmount: 20,
      enableComplexAnimations: true,
      enableBackgroundParticles: true,
      enableFloatingOrbs: true,
      enableGradientShifts: true,
    }
  };
}
