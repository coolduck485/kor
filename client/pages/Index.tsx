import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RetroToggle } from "@/components/ui/retro-toggle";
import { useTheme } from "@/hooks/use-theme";
import { useRetroMode } from "@/hooks/use-retro-mode";
import { useUnifiedNotifications } from "@/components/ui/unified-notification";
import { useMobilePerformance } from "@/hooks/use-mobile-performance";
import { useBrowserDetection } from "@/hooks/use-browser-detection";
import { useDeviceType } from "@/hooks/use-device-type";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Star,
  Code,
  Palette,
  Zap,
  Smartphone,
  Globe,
  Users,
} from "lucide-react";

export default function Index() {
  const { theme, setTheme } = useTheme();
  const { mode, toggleMode } = useRetroMode();
  const isPinkActive = false; // Temporary fix - pink theme removed
  const { showSuccess, showError, showWarning, showInfo } =
    useUnifiedNotifications();
  const { isMobile, animationConfig, deviceType } = useMobilePerformance();
  const { isSafari, isMobileSafari, isIOS } = useBrowserDetection();
  const currentDeviceType = useDeviceType();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [badgeMousePosition, setBadgeMousePosition] = useState({
    x: 0,
    y: 0,
    isNear: false,
  });
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [animationStep, setAnimationStep] = useState(6); // Skip to complete state

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previousMode, setPreviousMode] = useState(mode);
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);
  const hasShownWelcomeRef = useRef(false);
  const hasShownMobilePerformanceRef = useRef(false);

  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Performance optimization state
  const [isHighPerformance, setIsHighPerformance] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isScrollingActive, setIsScrollingActive] = useState(false);

  // Mobile Performance Wrapper Component
  const MobileOptimizedWrapper = ({
    children,
    condition = true,
  }: {
    children: React.ReactNode;
    condition?: boolean;
  }) => {
    if (isMobile && !condition) {
      return null; // Don't render expensive components on mobile
    }
    return <>{children}</>;
  };

  // Mobile-optimized animation config
  const getMobileAnimationProps = (desktopProps: any) => {
    if (!isMobile) return desktopProps;

    return {
      ...desktopProps,
      transition: {
        ...desktopProps.transition,
        duration: Math.min(desktopProps.transition?.duration || 0.5, 0.3),
        ease: "easeOut",
      },
    };
  };

  // Black transition animation state
  const [isBlackTransition, setIsBlackTransition] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [transitioningSectionIndex, setTransitioningSectionIndex] = useState(0);

  // Zoom warning modal state
  const [showZoomModal, setShowZoomModal] = useState(false);
  const hasShownZoomModalRef = useRef(false);

  // Function to close modal and scroll to top
  const closeModalAndScrollToTop = () => {
    // First restore the body scroll position
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";

    // Close the modal
    setShowZoomModal(false);

    // Immediately scroll to top (no need to restore previous position)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showZoomModal) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      // Targeted scroll prevention - only prevent if not from modal
      const preventBackgroundScroll = (e: WheelEvent | TouchEvent) => {
        const target = e.target as Element;
        // Check if the event comes from within the modal
        const isFromModal = target?.closest(".zoom-modal-scrollbar");

        if (!isFromModal) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      // Add targeted scroll prevention
      document.addEventListener("wheel", preventBackgroundScroll, {
        passive: false,
      });
      document.addEventListener("touchmove", preventBackgroundScroll, {
        passive: false,
      });

      return () => {
        // Remove event listeners
        document.removeEventListener("wheel", preventBackgroundScroll);
        document.removeEventListener("touchmove", preventBackgroundScroll);
      };
    } else {
      // Restore scroll position when modal closes (only if not already restored by closeModalAndScrollToTop)
      if (document.body.style.position === "fixed") {
        const scrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0") * -1);
        }
      }
    }
  }, [showZoomModal]);

  // Test notification removed

  // Welcome notification - shows immediately on all devices
  useEffect(() => {
    if (!hasShownWelcomeRef.current) {
      hasShownWelcomeRef.current = true;
      console.log("Showing welcome notification on all devices...");
      showInfo(
        "Welcome to KOR!",
        "Experience the future of modern web development. Click the X to dismiss.",
        0, // No auto-dismiss
      );
    }
  }, [showInfo]); // Shows once on load

  // Mobile/Tablet performance notification - shows immediately on mobile/tablet devices
  useEffect(() => {
    if (
      !hasShownMobilePerformanceRef.current &&
      (currentDeviceType === "mobile" || currentDeviceType === "tablet")
    ) {
      hasShownMobilePerformanceRef.current = true;

      console.log(
        "Performance check on load - device type:",
        currentDeviceType,
      );

      console.log(
        "🚀 Showing performance notification on mobile/tablet device!",
      );
      showWarning(
        "Mobile Performance Mode",
        "Visual effects and animations have been limited to improve performance.",
        0, // No auto-dismiss - user must click X
      );
    }
  }, [currentDeviceType, showWarning]); // React to device type changes

  // Zoom warning modal - show on all devices
  useEffect(() => {
    if (!hasShownZoomModalRef.current) {
      hasShownZoomModalRef.current = true;
      // Delay to let page load first
      setTimeout(() => {
        setShowZoomModal(true);
      }, 2000);
    }
  }, []); // Run once on mount

  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Type 'help' to see list of available commands.",
  ]);
  const [systemStats, setSystemStats] = useState({
    networkUp: 1.2,
    networkDown: 847,
  });

  // Optimized Framer Motion animation variants for 60fps
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.15,
        delayChildren: 0.05,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const slideInFromSide = (direction: "left" | "right") => ({
    hidden: {
      opacity: 0,
      x: direction === "left" ? -60 : 60,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  });

  const staggeredLetters = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const triggerLoadingSequence = () => {
    setIsLoading(true);
    setIsLoaded(false);
    setAnimationStep(0);

    // YouTube intro-style animation sequence - more dynamic and professional
    const animationSequence = [
      { delay: 200, step: 1 }, // Particles and background elements burst in
      { delay: 600, step: 2 }, // Central orb explodes into view with energy rings
      { delay: 1000, step: 3 }, // Text slides in with shine effects
      { delay: 1400, step: 4 }, // Buttons cascade in with bounce
      { delay: 1800, step: 5 }, // Navigation elements slide in
      { delay: 2200, step: 6 }, // Final polish - everything locks into place
    ];

    const timeouts = animationSequence.map(({ delay, step }) =>
      setTimeout(() => {
        setAnimationStep(step);
        if (step === 6) {
          setIsLoading(false);
          setTimeout(() => setIsLoaded(true), 300);
        }
      }, delay),
    );

    return timeouts;
  };

  // Optimized loading sequence for better performance
  const triggerOptimizedLoadingSequence = () => {
    setIsLoading(true);
    setIsLoaded(false);
    setAnimationStep(0);

    // Faster, optimized animation sequence with smoother transitions
    const optimizedSequence = [
      { delay: 100, step: 1 }, // Background elements (faster)
      { delay: 300, step: 2 }, // Central elements
      { delay: 500, step: 3 }, // Text animations
      { delay: 700, step: 4 }, // Buttons with smooth scaling
      { delay: 900, step: 5 }, // Navigation elements
      { delay: 1100, step: 6 }, // Final state
    ];

    const timeouts = optimizedSequence.map(({ delay, step }) =>
      setTimeout(() => {
        setAnimationStep(step);
        if (step === 6) {
          setIsLoading(false);
          setTimeout(() => setIsLoaded(true), 200); // Faster completion
        }
      }, delay),
    );

    return timeouts;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    // Performance optimization checks
    const checkPerformance = () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setReducedMotion(prefersReducedMotion);

      // Check device capabilities for high performance animations
      const isLowEnd =
        navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
      const isSlowConnection =
        navigator.connection &&
        navigator.connection.effectiveType === "slow-2g";
      setIsHighPerformance(
        !isLowEnd && !isSlowConnection && !prefersReducedMotion,
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    checkPerformance(); // Performance optimization check

    // Check current URL and scroll to appropriate section
    const checkInitialSection = () => {
      const currentPath = window.location.pathname;
      const sectionIndex = sections.findIndex(
        (section) =>
          currentPath === `/${section.id}` ||
          (currentPath === "/" && section.id === "home"),
      );

      if (sectionIndex !== -1 && sectionIndex !== 0) {
        // Delay to ensure elements are rendered
        setTimeout(() => {
          setCurrentSection(sectionIndex);
          const targetSection = sectionsRef.current[sectionIndex];
          if (targetSection) {
            targetSection.scrollIntoView({
              behavior: "auto", // Instant scroll on initial load
              block: "start",
            });
          }
        }, 100);
      }
    };

    // Skip loading sequence - go directly to checking initial section
    checkInitialSection();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Trigger loading animation when switching to retro mode
  useEffect(() => {
    if (previousMode !== mode) {
      setPreviousMode(mode);
      // Only trigger loading for retro mode
      if (mode === "retro" && previousMode !== null) {
        triggerLoadingSequence();
      }
    }
  }, [mode, previousMode]);

  // Dynamic network stats updates
  useEffect(() => {
    const updateStats = () => {
      setSystemStats({
        networkUp: Math.round((Math.random() * 0.8 + 0.8) * 10) / 10, // 0.8-1.6 GB/s
        networkDown: Math.floor(Math.random() * 300) + 700, // 700-1000 MB/s
      });
    };

    const interval = setInterval(updateStats, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handleBadgeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!badgeRef.current) return;

    const rect = badgeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    setBadgeMousePosition({
      x: mouseX,
      y: mouseY,
      isNear: true,
    });
  };

  const handleBadgeMouseLeave = () => {
    setBadgeMousePosition({ x: 0, y: 0, isNear: false });
  };

  // ========================================
  // SHINE ANIMATION CONFIGURATION
  // ========================================
  const SHINE_CONFIG = {
    direction: "right-to-left", // 'left-to-right' or 'right-to-left'
    duration: "4s", // Animation duration - slower consistent shine
    delay: "1s", // Initial delay
    interval: "8s", // Time between shine sweeps (total cycle time)
    intensity: 0.9, // Brightness of the shine (0-1)
    width: 30, // Width of the shine effect (percentage)
    showSparkles: true, // Enable/disable sparkles
    sparkleCount: 7, // Precise positioning like Figma design
  };

  // Section data
  const sections = [
    { id: "home", title: "Home", component: "home" },
    { id: "about", title: "About Us", component: "about" },
    { id: "services", title: "Services", component: "services" },
    { id: "portfolio", title: "Portfolio", component: "portfolio" },
    { id: "contact", title: "Contact Us", component: "contact" },
  ];

  // Scroll to section function with black transition
  const scrollToSection = (index: number) => {
    if (isScrolling || !containerRef.current) return;

    setIsScrolling(true);
    setIsScrollingActive(true);
    setTransitioningSectionIndex(index);

    // Start black transition animation
    setIsBlackTransition(true);
    setIsContentVisible(false);

    // Wait for fade to black, then change section
    setTimeout(() => {
      setCurrentSection(index);

      // Update URL based on section
      const sectionPath = index === 0 ? "/" : `/${sections[index].id}`;
      window.history.pushState({}, "", sectionPath);

      const targetSection = sectionsRef.current[index];
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "auto", // Instant scroll during black screen
          block: "start",
        });
      }

      // If returning to home section (index 0), trigger loading animation
      if (index === 0) {
        triggerOptimizedLoadingSequence();
      }

      // Start revealing new content after a cinematic pause
      setTimeout(() => {
        setIsBlackTransition(false);

        // Delay content visibility for dramatic effect
        setTimeout(() => {
          setIsContentVisible(true);

          // Complete the transition
          setTimeout(() => {
            setIsScrolling(false);
            setIsScrollingActive(false);
          }, 900); // Allow time for content to fully appear
        }, 150); // Small delay for content to start appearing
      }, 100); // Short delay to ensure scroll is complete
    }, 350); // Time for fade to black
  };

  // Handle wheel scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling || mode === "retro") return;

      e.preventDefault();

      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        scrollToSection(currentSection + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [currentSection, isScrolling, sections.length, mode]);

  // Handle touch scroll for mobile - Enhanced with better swipe detection
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchStartX = 0;
    let isSwiping = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (isScrolling || mode === "retro") return;

      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      isSwiping = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling || mode === "retro") return;

      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = Math.abs(touchY - touchStartY);
      const deltaX = Math.abs(touchX - touchStartX);

      // Determine if this is a vertical swipe (not horizontal)
      if (deltaY > 10 && deltaY > deltaX * 1.5) {
        isSwiping = true;
        e.preventDefault(); // Prevent default scrolling only during vertical swipes
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling || mode === "retro" || !isSwiping) return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const touchDuration = Date.now() - touchStartTime;
      const swipeVelocity = Math.abs(deltaY) / touchDuration;

      // Enhanced swipe detection: require minimum distance AND velocity
      const minSwipeDistance = 50;
      const minSwipeVelocity = 0.1; // pixels per millisecond

      if (
        Math.abs(deltaY) > minSwipeDistance &&
        swipeVelocity > minSwipeVelocity
      ) {
        if (deltaY > 0 && currentSection < sections.length - 1) {
          scrollToSection(currentSection + 1);
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }

      // Reset
      isSwiping = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });
      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [currentSection, isScrolling, sections.length, mode]);

  // Listen for scroll events from buttons
  useEffect(() => {
    const handleScrollToSection = (e: CustomEvent) => {
      scrollToSection(e.detail);
    };

    window.addEventListener(
      "scrollToSection",
      handleScrollToSection as EventListener,
    );
    return () =>
      window.removeEventListener(
        "scrollToSection",
        handleScrollToSection as EventListener,
      );
  }, []);

  // If retro mode is enabled, show retro version
  if (mode === "retro") {
    return (
      <div className="retro-container min-h-screen max-h-screen overflow-y-auto overflow-x-hidden">
        {/* Retro Loading Screen */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="fixed inset-0 z-[10000] bg-black flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 1, ease: "easeInOut" },
              }}
            >
              {/* Matrix-style background - reduced for performance */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`matrix-${i}`}
                    className="absolute text-green-400 font-mono text-xs opacity-20"
                    style={{
                      left: `${(i * 100) / 15}%`,
                      fontSize: "8px",
                    }}
                    animate={{
                      y: [-20, window.innerHeight + 20],
                    }}
                    transition={{
                      duration: 4 + (i % 2),
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "linear",
                    }}
                    style={{
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {Array.from({ length: 20 }, () =>
                      String.fromCharCode(0x30a0 + Math.random() * 96),
                    ).join("\n")}
                  </motion.div>
                ))}
              </div>

              {/* Central loading area */}
              <div className="relative z-10 text-center">
                {/* Loading KOR text in ASCII style */}
                <div className="mb-8">
                  <motion.div
                    className="font-mono text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl kor-text-large font-bold text-green-400"
                    style={{
                      textShadow: "0 0 10px #00ff41, 0 0 20px #00ff41",
                    }}
                  >
                    {/* K */}
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                      animate={
                        animationStep >= 1
                          ? {
                              opacity: 1,
                              scale: 1,
                              rotateY: 0,
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      K
                    </motion.span>

                    {/* o */}
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                      animate={
                        animationStep >= 2
                          ? {
                              opacity: 1,
                              scale: 1,
                              rotateY: 0,
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: 0.1,
                      }}
                    >
                      o
                    </motion.span>

                    {/* r */}
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
                      animate={
                        animationStep >= 3
                          ? {
                              opacity: 1,
                              scale: 1,
                              rotateY: 0,
                            }
                          : {}
                      }
                      transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: 0.2,
                      }}
                    >
                      r
                    </motion.span>
                  </motion.div>
                </div>

                {/* Loading subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={animationStep >= 3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="font-mono text-sm md:text-lg text-amber-400"
                  style={{
                    textShadow: "0 0 5px #ffaa00",
                  }}
                >
                  INITIALIZING DEVELOPMENT SYSTEMS...
                </motion.div>

                {/* Terminal loading indicator */}
                <motion.div
                  className="mt-8 flex justify-center items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <span className="text-green-400 font-mono text-sm">[</span>
                  {[...Array(10)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-green-400 font-mono text-sm"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    >
                      ���
                    </motion.span>
                  ))}
                  <span className="text-green-400 font-mono text-sm">]</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Retro Main Content - Only show after loading */}
        {!isLoading && (
          <>
            {/* Zoom Warning Modal - Retro Style */}
            <AnimatePresence>
              {showZoomModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="fixed inset-0 z-[9999999] flex items-center justify-center"
                  style={{
                    backdropFilter: "blur(20px) saturate(120%)",
                    WebkitBackdropFilter: "blur(20px) saturate(120%)",
                  }}
                >
                  {/* Enhanced Modal Backdrop */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-black/80 via-green-900/20 to-black/80"
                    onClick={closeModalAndScrollToTop}
                  />

                  {/* Retro Modal Content */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="relative max-w-xs sm:max-w-sm w-full mx-3 sm:mx-4 bg-black border-2 border-green-400 font-mono text-green-400 p-3 sm:p-4 max-h-[90vh] overflow-y-auto"
                    style={{
                      boxShadow:
                        "0 0 30px rgba(0, 255, 65, 0.5), inset 0 0 20px rgba(0, 255, 65, 0.1)",
                    }}
                  >
                    {/* Close Button - Retro Style */}
                    <button
                      onClick={closeModalAndScrollToTop}
                      className="absolute top-2 right-2 w-6 h-6 bg-green-400 text-black font-bold text-sm hover:bg-green-300 transition-colors"
                    >
                      X
                    </button>

                    {/* Modal Header - Retro Style */}
                    <div className="text-center mb-3">
                      <div className="text-lg sm:text-xl mb-1 text-amber-400">
                        {">>> WARNING <<<"}
                      </div>
                      <h2 className="text-sm sm:text-base font-bold mb-1 text-green-400">
                        ZOOM OUT REQUIRED
                      </h2>
                      <p className="text-xs text-amber-400">
                        CONTENT MAY BE CUT OFF
                      </p>
                    </div>

                    {/* Access Instructions - Retro Style */}
                    <div className="mb-3">
                      <div className="border border-green-400 bg-black p-2 text-center">
                        <div className="text-amber-400 mb-1">
                          ⚙️ BROWSER MENU:
                        </div>
                        <div className="text-green-400 text-xs space-y-0.5">
                          <div>1. CLICK MENU BUTTON (⋮)</div>
                          <div>2. FIND "ZOOM" SECTION</div>
                          <div>3. CLICK MINUS (-) BUTTON</div>
                        </div>
                      </div>
                      <p className="text-xs text-center mt-1 text-amber-400">
                        OR USE KEYBOARD COMMANDS BELOW
                      </p>
                    </div>

                    {/* Instructions - Terminal Style */}
                    <div className="text-xs space-y-1 text-green-400 mb-3">
                      <div className="text-amber-400 font-bold mb-1">
                        COMMANDS:
                      </div>
                      <div className="flex items-center justify-between">
                        <span>ZOOM OUT</span>
                        <span className="bg-green-400 text-black px-1 text-xs">
                          CTRL+-
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>RESET</span>
                        <span className="bg-green-400 text-black px-1 text-xs">
                          CTRL+0
                        </span>
                      </div>
                      <div className="text-amber-400 text-xs mt-1">
                        MAC: USE CMD
                      </div>
                    </div>

                    {/* Action Button - Terminal Style */}
                    <button
                      onClick={closeModalAndScrollToTop}
                      className="w-full py-2 bg-green-400 text-black font-bold hover:bg-green-300 transition-colors border border-green-400 text-sm"
                    >
                      OK
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle Buttons Container */}
            <div className="fixed top-6 right-6 z-[9999] pointer-events-auto">
              <div
                className="group relative"
                onMouseEnter={() => setIsTooltipDismissed(true)}
              >
                {/* Tooltip - only show in modern mode and if not dismissed */}
                {mode === "modern" && !isTooltipDismissed && (
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-1 sm:mr-2 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                    <div
                      className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border backdrop-blur-xl text-xs sm:text-sm font-medium max-w-[140px] sm:max-w-none sm:whitespace-nowrap border-green-300/30 bg-green-400/10 text-green-400"
                      style={{
                        background: `linear-gradient(135deg, rgba(0,255,65,0.1) 0%, rgba(0,255,65,0.05) 50%, transparent 100%)`,
                        boxShadow: "0 0 15px rgba(0, 255, 65, 0.3)",
                      }}
                    >
                      Click to change the site's appearance
                      {/* Tooltip arrow */}
                      <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-green-400/10" />
                    </div>
                  </div>
                )}

                {/* Container for existing toggles */}
                <div
                  className="rounded-xl sm:rounded-2xl border-2 backdrop-blur-2xl p-2 sm:p-4 border-green-300/30 bg-green-400/5"
                  style={{
                    background: `linear-gradient(135deg, rgba(0,255,65,0.1) 0%, rgba(0,255,65,0.05) 50%, transparent 100%)`,
                    boxShadow:
                      "0 0 25px rgba(0, 255, 65, 0.4), 0 0 50px rgba(0, 255, 65, 0.2)",
                  }}
                >
                  {/* Original Toggle Buttons */}
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <RetroToggle />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="retro-main">
              {/* ASCII Logo */}
              <motion.div
                className="retro-logo-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 2 }}
              >
                <pre
                  className="ascii-logo text-center mb-4 text-green-400 terminal-glow"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.05em",
                    lineHeight: "1",
                    fontSize: "1.2rem",
                  }}
                >
                  {`██��  ██╗ ██████���� ███����������█╗
██║ █��╔╝��█╔═�������═██╗█����╔����══██╗
█████╔╝ █������   █��║██����███╔���
█���╔═��█╗ █��║   ██║██╔══█��������
█���║  �����█╗╚███��██�����╝██║  �����█��
╚═��  ╚����� ╚═����═══╝ ╚═╝  ����═╝`}
                </pre>
                <div className="retro-subtitle">RETRO DEVELOPMENT SYSTEMS</div>
              </motion.div>

              {/* Terminal Window */}
              <motion.div
                className="terminal-window"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <div className="terminal-header">
                  <span>TERMINAL</span>
                </div>
                <div className="terminal-content">
                  <div className="text-amber-400 font-bold mb-1">
                    <span className="text-gray-500">$</span> system-info
                    --status
                  </div>
                  <div className="text-amber-400 font-bold mb-3 mt-2">
                    SYSTEM STATUS:{" "}
                    <span className="text-green-400 terminal-glow">
                      OPERATIONAL
                    </span>
                  </div>
                  <div className="terminal-line">
                    <span className="text-green-400">[ACTIVE]</span>&nbsp;CUSTOM
                    SOFTWARE SOLUTIONS
                  </div>
                  <div className="terminal-line">
                    <span className="text-green-400">[ACTIVE]</span>&nbsp;
                    <span className="text-cyan-400">
                      WEB APPLICATION DEVELOPMENT
                    </span>
                  </div>
                  <div className="terminal-line">
                    <span className="text-green-400">[ACTIVE]</span>&nbsp;AI/ML
                    INTEGRATION SERVICES
                  </div>
                  <div className="terminal-line mb-2">
                    <span className="text-green-400">[ACTIVE]</span>&nbsp;CLOUD
                    INFRASTRUCTURE DESIGN
                  </div>
                  <div className="terminal-line mb-2">
                    <span className="text-yellow-400">[PRIORITY]</span>&nbsp;
                    <span className="text-red-400 font-bold">
                      LEGACY SYSTEM MODERNIZATION
                    </span>
                  </div>
                  <div className="terminal-line mb-2">
                    <span className="text-green-400">[ACTIVE]</span>&nbsp;
                    <span className="text-purple-400">
                      ENTERPRISE AUTOMATION
                    </span>
                  </div>

                  <div className="terminal-line mb-4">
                    <span className="text-green-400 blink">█</span>
                  </div>
                  <div className="memory-section">
                    <div className="text-xs mb-2 text-cyan-400">
                      SYSTEM RESOURCES:
                    </div>
                    <div
                      className="text-xs text-green-400 mb-1"
                      style={{ lineHeight: "1.2", fontFamily: "monospace" }}
                    >
                      CPU: █��������█������█████����██████ 60%
                    </div>
                    <div
                      className="text-xs text-amber-400 mb-1"
                      style={{ lineHeight: "1.2", fontFamily: "monospace" }}
                    >
                      RAM: █���████��█��█████████��███ 50%
                    </div>
                    <div className="text-xs text-green-400 mt-1">
                      NETWORK: {systemStats.networkUp}GB/s ↑ |{" "}
                      {systemStats.networkDown}MB/s ↓
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Buttons */}
              <motion.div
                className="button-grid-single"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                <button
                  className="pixel-button"
                  onClick={() => setShowTerminal(true)}
                >
                  TERMINAL
                </button>
              </motion.div>

              {/* Social Media Buttons */}
              <motion.div
                className="social-button-grid"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
              >
                <button
                  className="pixel-button social-button"
                  onClick={() => window.open("https://instagram.com", "_blank")}
                >
                  INSTAGRAM
                </button>
                <button
                  className="pixel-button social-button"
                  onClick={() => window.open("https://discord.com", "_blank")}
                >
                  DISCORD
                </button>
                <button
                  className="pixel-button social-button"
                  onClick={() => window.open("https://telegram.org", "_blank")}
                >
                  TELEGRAM
                </button>
              </motion.div>

              {/* Status Bar */}
              <motion.div
                className="status-bar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
              >
                <div className="status-indicators">
                  <span className="status-dot text-red-400">●</span>
                  <span>READY</span>
                  <span className="status-dot text-amber-400">●</span>
                  <span>CONNECTED</span>
                  <span className="status-dot text-green-400 terminal-glow">
                    ●
                  </span>
                  <span>ONLINE</span>
                </div>

                <div className="continue-prompt">
                  <span className="text-cyan-400">[SYSTEM READY]</span>
                  <span className="text-green-400 ml-4">������◄►�����</span>
                </div>

                <div className="loading-indicators">
                  <span>█��▒░</span>
                  <span className="text-amber-400">PROCESSING...</span>
                  <span>░���▓█</span>
                </div>
              </motion.div>

              {/* Dimmed Background Overlay */}
              {showTerminal && (
                <motion.div
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setShowTerminal(false)}
                />
              )}

              {/* Interactive Terminal */}
              {showTerminal && (
                <motion.div
                  className="interactive-terminal"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="terminal-header">
                    <span>TERMINAL</span>
                    <button
                      className="close-terminal"
                      onClick={() => setShowTerminal(false)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="terminal-body">
                    <div className="terminal-output">
                      {terminalOutput.map((line, index) => (
                        <div key={index} className="terminal-line">
                          {line.startsWith(">") ? (
                            <>
                              <span className="prompt">&gt;</span>
                              <span className="command">{line.slice(1)}</span>
                            </>
                          ) : (
                            <span className="output">{line}</span>
                          )}
                        </div>
                      ))}
                      <div className="terminal-input-line">
                        <span className="prompt">&gt;</span>
                        <input
                          type="text"
                          className="terminal-input"
                          value={terminalInput}
                          onChange={(e) => setTerminalInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const command = terminalInput
                                .trim()
                                .toLowerCase();
                              const newOutput = [
                                ...terminalOutput,
                                `>${terminalInput}`,
                              ];

                              if (command === "help") {
                                newOutput.push("");
                                newOutput.push(
                                  "Switch back to the main website theme to explore",
                                );
                                newOutput.push(
                                  "my projects, services, and portfolio.",
                                );
                                newOutput.push(
                                  "Type 'help' to see list of available commands.",
                                );
                                newOutput.push("");
                              } else if (command === "clear") {
                                setTerminalOutput([
                                  "Type 'help' to see list of available commands.",
                                ]);
                                setTerminalInput("");
                                return;
                              } else if (command !== "") {
                                newOutput.push(
                                  `Command '${command}' not found.`,
                                );
                                newOutput.push("");
                                newOutput.push(
                                  "Type 'help' to see list of available commands.",
                                );
                              }
                              setTerminalOutput(newOutput);
                              setTerminalInput("");
                            }
                          }}
                          placeholder="Type command..."
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="retro-footer">
              <div className="text-green-400">
                COPYRIGHT (C) 2024 KOR SYSTEMS - ALL RIGHTS RESERVED
              </div>
              <div className="text-amber-400">
                TERMINAL EMULATION MODE - PHOSPHOR DISPLAY ACTIVE
              </div>
              <div className="text-red-400 blink">
                WARNING: RETRO MODE ENGAGED
              </div>
            </div>

            {/* Retro Styles */}
            <style>{`
          .retro-container {
            background: #0a0a0a;
            color: #00ff41;
            font-family: "JetBrains Mono", "Fira Code", monospace;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
            -webkit-font-smoothing: none;
            -moz-osx-font-smoothing: unset;
            position: relative;
            border: 4px solid #00ff41;
            margin: 8px;
            box-shadow:
              inset 0 0 50px rgba(0, 255, 65, 0.1),
              0 0 50px rgba(0, 255, 65, 0.3);
            height: calc(100vh - 16px);
            overflow-y: auto;
            overflow-x: hidden;
            scroll-behavior: smooth;
          }

          .retro-container::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 65, 0.03) 2px,
              rgba(0, 255, 65, 0.03) 4px
            );
            pointer-events: none;
            animation: scanlines 0.2s linear infinite;
            will-change: transform;
            transform: translateZ(0);
            z-index: 100;
          }

          @keyframes scanlines {
            0% {
              transform: translateY(0px);
            }
            100% {
              transform: translateY(4px);
            }
          }

          .retro-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            border-bottom: 2px solid #00ff41;
            background: #0a0a0a;
            position: relative;
            z-index: 110;
          }

          .pixel-dot {
            width: 12px;
            height: 12px;
            border-radius: 0;
          }

          .retro-main {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            min-height: calc(100vh - 160px);
            padding: 32px;
            position: relative;
            z-index: 105;
            padding-bottom: 100px;
          }

          .retro-logo-container {
            text-align: center;
            margin-bottom: 32px;
          }

          .ascii-logo {
            font-family: "JetBrains Mono", "Courier New", monospace;
            font-weight: 700;
            font-size: clamp(8px, 2.5vw, 18px);
            line-height: 1;
            color: #00ff41;
            text-shadow:
              0 0 8px #00ff41,
              0 0 15px #00ff41;
            margin: 0;
            white-space: pre;
            letter-spacing: 1px;
            position: relative;
          }

          .ascii-logo::after {
            content: "█";
            color: #00ff41;
            animation: terminal-cursor 1s infinite;
            margin-left: 8px;
          }

          @keyframes terminal-cursor {
            0%,
            50% {
              opacity: 1;
            }
            51%,
            100% {
              opacity: 0;
            }
          }

          .retro-subtitle {
            color: #ffaa00;
            font-size: clamp(12px, 3vw, 18px);
            font-weight: bold;
            margin-top: 12px;
            text-shadow:
              0 0 10px #ffaa00,
              0 0 20px #ffaa00,
              0 0 30px #ffaa00;
            letter-spacing: 2px;
          }

          .terminal-window {
            background: #0a0a0a;
            border: 2px solid #00ff41;
            width: 100%;
            max-width: 600px;
            margin-bottom: 32px;
            box-shadow:
              0 0 20px rgba(0, 255, 65, 0.3),
              inset 0 0 20px rgba(0, 255, 65, 0.1);
            position: relative;
            z-index: 106;
          }

          .terminal-header {
            background: #00ff41;
            color: #0a0a0a;
            padding: 6px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 12px;
          }

          .terminal-content {
            padding: 16px;
            font-size: 14px;
            line-height: 1.4;
          }

          .terminal-line {
            margin-bottom: 4px;
            display: flex;
            align-items: center;
          }

          .prompt {
            color: #00ff41;
            font-weight: bold;
            margin-right: 8px;
          }

          .cursor-text {
            color: #00ff41;
          }

          .typewriter {
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid #00ff41;
            animation:
              typewriter 2s steps(40) 1s both,
              blink 1s step-end infinite;
          }

          @keyframes typewriter {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }

          .memory-section {
            border-top: 1px solid #333;
            padding-top: 12px;
          }

          .loading-bar {
            background: #333;
            border: 1px solid #00ff41;
            height: 12px;
            position: relative;
            overflow: hidden;
          }

          .loading-bar::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: #00ff41;
            animation: random-memory-usage 8s ease-in-out infinite;
          }

          @keyframes random-memory-usage {
            0% {
              width: 25%;
            }
            10% {
              width: 28%;
            }
            20% {
              width: 35%;
            }
            30% {
              width: 32%;
            }
            40% {
              width: 45%;
            }
            50% {
              width: 42%;
            }
            60% {
              width: 38%;
            }
            70% {
              width: 55%;
            }
            80% {
              width: 48%;
            }
            90% {
              width: 30%;
            }
            100% {
              width: 48%;
            }
          }

          .button-grid-single {
            display: flex;
            justify-content: center;
            margin: 32px auto 16px;
            max-width: 600px;
            position: relative;
            z-index: 106;
          }

          .social-button-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            max-width: 500px;
            margin: 0 auto 32px;
            position: relative;
            z-index: 106;
          }

          @media (max-width: 640px) {
            .social-button-grid {
              grid-template-columns: repeat(1, 1fr);
              max-width: 300px;
            }
          }

          .pixel-button {
            background: #0a0a0a;
            border: 2px solid #00ff41;
            color: #00ff41;
            padding: 12px 16px;
            font-family: "JetBrains Mono", monospace;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            border-radius: 0;
            transition: background-color 0.2s ease;
            position: relative;
          }

          .pixel-button:hover {
            background: #00ff41;
            color: #0a0a0a;
          }

          .pixel-button:active {
            background: #00cc33;
          }

          .social-button {
            border: 2px solid #00ff41 !important;
            color: #00ff41 !important;
          }

          .social-button:hover {
            background: #00ff41 !important;
            color: #0a0a0a !important;
          }

          .interactive-terminal {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90% !important;
            max-width: 800px !important;
            height: 70% !important;
            max-height: 600px !important;
            background: #0a0a0a !important;
            border: 3px solid #00ff41 !important;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.4) !important;
            z-index: 9999 !important;
            overflow: hidden !important;
            margin: 0 !important;
          }

          .interactive-terminal .terminal-header {
            background: #00ff41;
            color: #0a0a0a;
            padding: 8px 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: "JetBrains Mono", monospace;
          }

          .close-terminal {
            background: none;
            border: none;
            color: #0a0a0a;
            font-size: 18px;
            cursor: pointer;
            font-weight: bold;
            padding: 4px 8px;
          }

          .close-terminal:hover {
            background: rgba(10, 10, 10, 0.2);
          }

          .terminal-body {
            height: calc(100% - 40px);
            padding: 16px;
            overflow-y: auto;
            background: #0a0a0a;
          }

          .terminal-output {
            margin-bottom: 16px;
            font-family: "JetBrains Mono", monospace;
            font-size: 14px;
            line-height: 1.4;
            min-height: 200px;
          }

          .terminal-output .terminal-line {
            margin-bottom: 4px;
          }

          .terminal-output .prompt {
            color: #00ff41;
            margin-right: 8px;
          }

          .terminal-output .command {
            color: #ffffff;
          }

          .terminal-output .output {
            color: #ffaa00;
          }

          .terminal-input-line {
            display: flex;
            align-items: center;
            font-family: "JetBrains Mono", monospace;
            font-size: 14px;
          }

          .terminal-input-line .prompt {
            color: #00ff41;
            margin-right: 8px;
          }

          .terminal-input {
            background: transparent;
            border: none;
            color: #ffffff;
            font-family: "JetBrains Mono", monospace;
            font-size: 14px;
            outline: none;
            flex: 1;
            caret-color: #00ff41;
          }

          .terminal-input::placeholder {
            color: #666;
          }

          .status-bar {
            text-align: center;
            space-y: 16px;
            position: relative;
            z-index: 106;
          }

          .status-indicators {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            font-size: 14px;
            margin-bottom: 16px;
          }

          .status-dot {
            font-size: 16px;
          }

          .continue-prompt {
            font-size: 12px;
            color: #ffaa00;
            margin-bottom: 16px;
          }

          .loading-indicators {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 12px;
          }

          .retro-footer {
            border-top: 2px solid #00ff41;
            padding: 16px;
            text-align: center;
            font-size: 10px;
            line-height: 1.4;
            background: #0a0a0a;
            position: relative;
            z-index: 110;
          }

          .retro-footer > div {
            margin-bottom: 4px;
          }

          .power-button {
            background: #ff4444;
            border: 2px solid #ff4444;
            color: white;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0;
            font-size: 14px;
          }

          .power-button:hover {
            animation: blink 0.5s infinite;
            background: white;
            color: #ff4444;
          }

          @keyframes blink {
            0%,
            50% {
              opacity: 1;
            }
            51%,
            100% {
              opacity: 0;
            }
          }

          .blink {
            animation: blink 1s infinite;
          }

          @keyframes terminal-glow {
            0%,
            100% {
              text-shadow: 0 0 10px currentColor;
            }
            50% {
              text-shadow:
                0 0 20px currentColor,
                0 0 30px currentColor;
            }
          }

          .terminal-glow {
            animation: terminal-glow 2s ease-in-out infinite;
          }

          @keyframes pixel-float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          @keyframes scanlines {
            0% {
              transform: translateY(-100%);
            }
            100% {
              transform: translateY(100vh);
            }
          }

          .retro-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 65, 0.03) 2px,
              rgba(0, 255, 65, 0.03) 4px
            );
            pointer-events: none;
            opacity: 0.8;
          }

          .retro-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(0, 255, 65, 0.1) 1px,
              rgba(0, 255, 65, 0.1) 2px,
              transparent 2px,
              transparent 8px
            );
            animation: scanlines 6s linear infinite;
            will-change: transform;
            transform: translateZ(0);
            pointer-events: none;
            opacity: 0.3;
          }
        `}</style>
          </>
        )}
      </div>
    );
  }

  // Modern mode - original design
  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-500 gpu-accelerated composite-layer scroll-optimized ${
        isScrollingActive ? "scroll-simplified" : ""
      } ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
          : "bg-black"
      }`}
      style={{
        height: "100vh",
        overflow: "hidden",
        maxWidth: "100vw",
        width: "100vw",
        position: "relative",
        willChange: isScrollingActive ? "auto" : "transform",
        contain: "layout style paint",
        pointerEvents: showZoomModal ? "none" : "auto",
      }}
    >
      {/* Zoom Warning Modal */}
      <AnimatePresence>
        {showZoomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999999] flex items-center justify-center"
            style={{
              backdropFilter: "blur(40px) saturate(200%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%)",
              pointerEvents: "auto",
            }}
          >
            {/* Enhanced Modal Backdrop */}
            <div
              className={`absolute inset-0 ${
                theme === "light"
                  ? "bg-gradient-to-br from-slate-100/60 via-blue-50/50 to-indigo-100/60"
                  : "bg-gradient-to-br from-black/60 via-gray-900/50 to-black/60"
              }`}
              onClick={closeModalAndScrollToTop}
            />

            {/* Enhanced Modal Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              className={`relative max-w-xs sm:max-w-sm md:max-w-md w-full mx-2 sm:mx-3 md:mx-4 rounded-xl sm:rounded-2xl md:rounded-3xl backdrop-blur-3xl border shadow-2xl max-h-[90vh] sm:max-h-[95vh] overflow-hidden ${
                theme === "light"
                  ? "bg-white/95 border-white/40 text-gray-800 shadow-blue-500/20"
                  : "bg-black/95 border-white/20 text-white shadow-blue-400/30"
              }`}
              onWheel={(e) => {
                // Modal scrolling is now handled naturally since we use .closest() check
                e.stopPropagation();
              }}
              onTouchMove={(e) => {
                // Modal scrolling is now handled naturally since we use .closest() check
                e.stopPropagation();
              }}
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 30%, rgba(239,246,255,0.95) 70%, rgba(255,255,255,0.98) 100%)"
                    : "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(15,23,42,0.9) 30%, rgba(30,41,59,0.85) 70%, rgba(0,0,0,0.98) 100%)",
                boxShadow:
                  theme === "light"
                    ? "0 32px 64px -12px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.4), 0 0 120px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.6)"
                    : "0 32px 64px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.15), 0 0 120px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                padding: "0.5rem",
                backdropFilter: "blur(40px) saturate(150%)",
                WebkitBackdropFilter: "blur(40px) saturate(150%)",
              }}
            >
              {/* Scrollable Content Wrapper */}
              <div
                className="max-h-[75vh] sm:max-h-[80vh] overflow-y-auto"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor:
                    theme === "light"
                      ? "#cbd5e1 transparent"
                      : "#64748b transparent",
                }}
              >
                {/* Close Button */}
                <button
                  onClick={closeModalAndScrollToTop}
                  className={`absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 sm:top-3 sm:right-3 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 group ${
                    theme === "light"
                      ? "bg-gray-100/80 hover:bg-red-50 text-gray-500 hover:text-red-500 border border-gray-200/50"
                      : "bg-white/5 hover:bg-red-500/10 text-white/60 hover:text-red-400 border border-white/10"
                  }`}
                  style={{
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span className="text-xs font-medium transition-transform duration-300 group-hover:scale-110">
                    ✕
                  </span>
                </button>

                {/* Modal Header */}
                <div className="text-center mb-2 sm:mb-3 md:mb-4">
                  <h2
                    className={`text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Need help seeing all content?
                  </h2>
                  <p
                    className={`text-xs sm:text-sm md:text-base leading-relaxed ${
                      theme === "light" ? "text-gray-600" : "text-white/70"
                    }`}
                  >
                    If parts of the website appear cut off, try zooming out your
                    browser.
                  </p>
                </div>

                {/* How to Access Zoom Menu */}
                <div className="mb-3 sm:mb-4">
                  <div
                    className={`relative rounded-xl border p-3 sm:p-4 ${
                      theme === "light"
                        ? "border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/30"
                        : "border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
                    }`}
                    style={{
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div
                      className={`text-center space-y-2 ${
                        theme === "light" ? "text-gray-700" : "text-white/90"
                      }`}
                    >
                      <div className="text-lg mb-3">⚙️</div>
                      <h3 className="font-bold text-sm sm:text-base mb-2">
                        How to access zoom options:
                      </h3>
                      <div className="text-xs sm:text-sm space-y-0.5">
                        <p>
                          <strong>1.</strong> Click the menu button (⋮ or ☰) in
                          your browser
                        </p>
                        <p>
                          <strong>2.</strong> Look for "Zoom" or "View" options
                        </p>
                        <p>
                          <strong>3.</strong> Click the minus (-) button to zoom
                          out
                        </p>
                      </div>
                    </div>
                  </div>
                  <p
                    className={`text-xs sm:text-sm text-center mt-2 font-medium ${
                      theme === "light" ? "text-gray-600" : "text-white/70"
                    }`}
                  >
                    Or use the faster keyboard shortcuts below
                  </p>
                </div>

                {/* Instructions */}
                <div
                  className={`space-y-2 sm:space-y-3 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}
                >
                  <div
                    className={`font-bold text-sm sm:text-base mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}
                  >
                    Quick shortcuts:
                  </div>
                  <div className="space-y-2">
                    <div
                      className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg ${
                        theme === "light"
                          ? "bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200/50"
                          : "bg-gradient-to-r from-white/5 to-blue-500/10 border border-white/10"
                      }`}
                    >
                      <span className="font-medium text-sm">Zoom out</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                          theme === "light"
                            ? "bg-white text-gray-700 border border-gray-300 shadow-sm"
                            : "bg-black/50 text-white border border-white/20"
                        }`}
                      >
                        Ctrl + -
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between p-2 sm:p-2.5 rounded-lg ${
                        theme === "light"
                          ? "bg-gradient-to-r from-gray-50 to-green-50/50 border border-gray-200/50"
                          : "bg-gradient-to-r from-white/5 to-green-500/10 border border-white/10"
                      }`}
                    >
                      <span className="font-medium text-sm">Reset zoom</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                          theme === "light"
                            ? "bg-white text-gray-700 border border-gray-300 shadow-sm"
                            : "bg-black/50 text-white border border-white/20"
                        }`}
                      >
                        Ctrl + 0
                      </span>
                    </div>
                  </div>
                  <div
                    className={`text-center text-xs sm:text-sm mt-2 p-2 rounded-lg ${
                      theme === "light"
                        ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                        : "bg-amber-500/10 text-amber-300 border border-amber-400/20"
                    }`}
                  >
                    💡 Mac users: use <strong>Cmd</strong> instead
                  </div>
                </div>
              </div>
              {/* Action Button */}
              <button
                onClick={closeModalAndScrollToTop}
                className={`w-full mt-3 sm:mt-4 py-2.5 sm:py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                  theme === "light"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    : "bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-300 hover:to-indigo-400 text-black"
                }`}
                style={{
                  boxShadow:
                    theme === "light"
                      ? "0 8px 20px rgba(59, 130, 246, 0.3), 0 3px 10px rgba(99, 102, 241, 0.2)"
                      : "0 8px 20px rgba(99, 102, 241, 0.4), 0 3px 10px rgba(139, 92, 246, 0.3)",
                }}
              >
                Got it! 👍
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Scroll Navigation */}
      {currentSection < sections.length - 1 && (
        <div
          className={`scroll-indicator fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
            isMobileMenuOpen ? "blur-sm" : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-3 animate-button-float">
            <span
              className={`font-inter text-sm font-medium animate-text-glow ${
                theme === "light" ? "text-gray-600" : "text-white/70"
              }`}
            >
              Scroll Down
            </span>

            {/* Mouse scroll indicator - now visible on all devices */}
            <div className="flex relative w-6 h-10 border-2 border-white/40 rounded-full justify-center backdrop-blur-sm bg-white/5">
              <div
                className={`w-1 h-3 rounded-full mt-2 animate-float shadow-lg ${
                  isPinkActive
                    ? "bg-gradient-to-b from-pink-400 to-pink-200"
                    : "bg-gradient-to-b from-glow-blue to-white/80"
                }`}
                style={{
                  boxShadow: "0 0 10px rgba(73, 146, 255, 0.5)",
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Scroll Up Indicator - Last Section */}
      {currentSection === sections.length - 1 && (
        <div
          className={`scroll-indicator fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
            isMobileMenuOpen ? "blur-sm" : ""
          }`}
        >
          <div className="flex flex-col items-center space-y-3 animate-button-float">
            <span
              className={`font-inter text-sm font-medium animate-text-glow ${
                theme === "light" ? "text-gray-600" : "text-white/70"
              }`}
            >
              Scroll Up
            </span>

            {/* Mouse scroll indicator - pointing up - now visible on all devices */}
            <div className="flex relative w-6 h-10 border-2 border-white/40 rounded-full justify-center backdrop-blur-sm bg-white/5">
              <div
                className={`w-1 h-3 rounded-full mb-2 animate-float shadow-lg ${
                  isPinkActive
                    ? "bg-gradient-to-t from-pink-400 to-pink-200"
                    : "bg-gradient-to-t from-glow-blue to-white/80"
                }`}
                style={{
                  boxShadow: "0 0 10px rgba(73, 146, 255, 0.5)",
                  alignSelf: "flex-end",
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/10 to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button - All sections except first */}
      {currentSection > 0 && (
        <div
          className={`back-to-top fixed bottom-8 right-4 sm:right-8 z-50 transition-all duration-300 ${
            isMobileMenuOpen ? "blur-sm" : ""
          }`}
        >
          <button
            onClick={() => scrollToSection(0)}
            className={`group relative p-3 sm:p-4 rounded-full border-2 backdrop-blur-lg transition-all duration-300 hover:scale-110 ${
              isPinkActive
                ? "border-pink-400/50 bg-pink-500/10 hover:bg-pink-500/20"
                : theme === "light"
                  ? "border-blue-400/40 bg-white/80 hover:bg-white/90"
                  : "border-blue-300/30 bg-blue-400/10 hover:bg-blue-400/20"
            }`}
            style={{
              background:
                theme === "light"
                  ? `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)`
                  : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
              boxShadow: isPinkActive
                ? "0 0 20px rgba(236, 72, 153, 0.4)"
                : "0 0 20px rgba(73, 146, 255, 0.3)",
            }}
          >
            {/* Icon */}
            <ChevronUp
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                isPinkActive
                  ? "text-pink-400 group-hover:text-pink-300"
                  : theme === "light"
                    ? "text-blue-600 group-hover:text-blue-700"
                    : "text-white group-hover:text-blue-300"
              }`}
            />

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100" />

            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-events-none">
              <div
                className={`px-3 py-1.5 rounded-lg border backdrop-blur-sm text-xs font-medium whitespace-nowrap ${
                  theme === "light"
                    ? "border-blue-400/40 bg-white/90 text-gray-800"
                    : "border-blue-300/30 bg-black/80 text-white"
                }`}
              >
                Back to Top
                <div
                  className={`absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent ${
                    theme === "light"
                      ? "border-l-white/90"
                      : "border-l-black/80"
                  }`}
                />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Mobile Hamburger Menu - Only show in home section */}
      {currentSection === 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="relative pointer-events-auto">
            <MobileHamburgerMenu
              isOpen={isMobileMenuOpen}
              setIsOpen={setIsMobileMenuOpen}
              theme={theme}
            />
          </div>
        </div>
      )}

      {/* Black Transition Overlay with Cinematic Effects */}
      <AnimatePresence>
        {isBlackTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="fixed inset-0 z-[9999] pointer-events-none black-overlay-enhanced"
            style={{
              willChange: "opacity",
              transform: "translateZ(0)",
            }}
          >
            {/* Simple black overlay */}
            <div className="absolute inset-0 bg-black" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections Container */}
      <div className="h-full">
        {/* Home Section */}
        <motion.div
          ref={(el) => (sectionsRef.current[0] = el!)}
          className={`relative min-h-screen max-w-full overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? "blur-sm" : ""
          } ${
            theme === "light"
              ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
              : "bg-black"
          }`}
          style={{
            display: currentSection === 0 ? "block" : "none",
            width: "100vw",
            maxWidth: "100vw",
            boxSizing: "border-box",
          }}
        >
          {/* Main Content - Always visible with orchestrated animations */}
          {/* Left Corner Visual Elements for Mobile Balance */}
          <div className="fixed top-6 left-6 z-40 block sm:hidden"></div>

          {/* Theme Toggle Container with Tooltip */}
          <div
            className={`fixed top-6 right-6 z-50 transition-all duration-300 ${
              isMobileMenuOpen ? "blur-sm" : ""
            }`}
          >
            <div
              className="group relative"
              onMouseEnter={() => setIsTooltipDismissed(true)}
            >
              {/* Tooltip - only show in modern mode and if not dismissed and not on mobile */}
              {mode === "modern" && !isTooltipDismissed && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-1 sm:mr-2 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none hidden sm:block">
                  <div
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border backdrop-blur-xl text-xs sm:text-sm font-medium max-w-[140px] sm:max-w-none sm:whitespace-nowrap ${
                      theme === "light"
                        ? "border-blue-400/40 bg-white/80 text-gray-800"
                        : "border-blue-300/30 bg-blue-400/10 text-white/90"
                    }`}
                    style={{
                      background:
                        theme === "light"
                          ? `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)`
                          : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
                      boxShadow: "0 0 15px rgba(73, 146, 255, 0.3)",
                    }}
                  >
                    Click any theme to change the site's appearance
                    {/* Tooltip arrow */}
                    <div
                      className={`absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent ${
                        theme === "light"
                          ? "border-l-white/80"
                          : "border-l-blue-400/10"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Container for existing toggles */}
              <div
                className={`rounded-xl sm:rounded-2xl border-2 backdrop-blur-2xl p-2 sm:p-4 ${
                  isPinkActive
                    ? "border-pink-400/50 bg-pink-500/10"
                    : theme === "light"
                      ? "border-blue-400/40 bg-white/30"
                      : "border-blue-300/30 bg-blue-400/5"
                }`}
                style={{
                  background:
                    theme === "light"
                      ? `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`
                      : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
                  boxShadow: isPinkActive
                    ? "0 0 25px rgba(236, 72, 153, 0.5), 0 0 50px rgba(236, 72, 153, 0.3)"
                    : "0 0 25px rgba(73, 146, 255, 0.4), 0 0 50px rgba(73, 146, 255, 0.2)",
                }}
              >
                {/* Original Toggle Buttons */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  <ThemeToggle />
                  <RetroToggle />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Background Elements - Performance optimized */}

          {/* Large Blue Orb Background for Mobile and Tablet */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:hidden">
            <div
              className="w-[200vw] h-[200vw] sm:w-[150vw] sm:h-[150vw] rounded-full opacity-60 blur-[2px]"
              style={{
                background: `
                  radial-gradient(circle at center,
                    rgba(73, 146, 255, 0.8) 0%,
                    rgba(99, 162, 255, 0.6) 15%,
                    rgba(125, 178, 255, 0.4) 30%,
                    rgba(151, 194, 255, 0.25) 45%,
                    rgba(177, 210, 255, 0.15) 60%,
                    rgba(203, 226, 255, 0.08) 75%,
                    rgba(229, 242, 255, 0.03) 85%,
                    transparent 95%
                  )
                `,
                animation: "gentle-pulse 8s ease-in-out infinite",
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            />
          </div>

          {/* Animated Noise Texture - Now on all devices */}
          {isHighPerformance && (
            <div
              className="absolute inset-0 opacity-5 animate-noise gpu-accelerated"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
              }}
            />
          )}

          {/* Enhanced Spectacular Full-Width Wavy Aurora Curtains - Desktop Only (992px+) */}
          {isHighPerformance && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 hidden lg:block">
              {/* Primary aurora curtain - Top layer */}
              <div
                className="absolute aurora-curtain-1"
                style={{
                  top: "20%",
                  left: "-5%",
                  right: "-5%",
                  height: "120px",
                  background: isPinkActive
                    ? "linear-gradient(90deg, transparent 0%, rgba(236, 72, 153, 0.4) 15%, rgba(244, 114, 182, 0.5) 30%, rgba(251, 113, 133, 0.4) 50%, rgba(236, 72, 153, 0.5) 70%, rgba(244, 114, 182, 0.4) 85%, transparent 100%)"
                    : "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.4) 15%, rgba(20, 184, 166, 0.5) 30%, rgba(34, 197, 94, 0.4) 50%, rgba(6, 182, 212, 0.5) 70%, rgba(20, 184, 166, 0.4) 85%, transparent 100%)",
                  borderRadius: "40% 60% 80% 20% / 60% 40% 80% 20%",
                  filter: "blur(15px)",
                  animation: "aurora-wave-subtle-1 28s ease-in-out infinite",
                  transform: "skewY(-1deg)",
                }}
              />
              {/* Secondary aurora curtain - Middle layer */}
              <div
                className="absolute aurora-curtain-2"
                style={{
                  top: "45%",
                  left: "-8%",
                  right: "-8%",
                  height: "140px",
                  background: isPinkActive
                    ? "linear-gradient(90deg, transparent 0%, rgba(251, 113, 133, 0.35) 10%, rgba(236, 72, 153, 0.45) 25%, rgba(244, 114, 182, 0.4) 40%, rgba(190, 24, 93, 0.45) 60%, rgba(251, 113, 133, 0.4) 75%, rgba(236, 72, 153, 0.35) 90%, transparent 100%)"
                    : "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.35) 10%, rgba(6, 182, 212, 0.45) 25%, rgba(16, 185, 129, 0.4) 40%, rgba(20, 184, 166, 0.45) 60%, rgba(34, 197, 94, 0.4) 75%, rgba(6, 182, 212, 0.35) 90%, transparent 100%)",
                  borderRadius: "30% 70% 40% 60% / 70% 30% 60% 40%",
                  filter: "blur(18px)",
                  animation: "aurora-wave-subtle-2 34s ease-in-out infinite",
                  transform: "skewY(0.5deg)",
                }}
              />
              {/* Tertiary aurora curtain - Back layer */}
              <div
                className="absolute aurora-curtain-3"
                style={{
                  top: "70%",
                  left: "-10%",
                  right: "-10%",
                  height: "100px",
                  background: isPinkActive
                    ? "linear-gradient(90deg, transparent 0%, rgba(244, 114, 182, 0.3) 20%, rgba(251, 113, 133, 0.4) 35%, rgba(236, 72, 153, 0.35) 50%, rgba(244, 114, 182, 0.4) 65%, rgba(190, 24, 93, 0.3) 80%, transparent 100%)"
                    : "linear-gradient(90deg, transparent 0%, rgba(20, 184, 166, 0.3) 20%, rgba(34, 197, 94, 0.4) 35%, rgba(6, 182, 212, 0.35) 50%, rgba(16, 185, 129, 0.4) 65%, rgba(20, 184, 166, 0.3) 80%, transparent 100%)",
                  borderRadius: "60% 40% 80% 20% / 40% 60% 20% 80%",
                  filter: "blur(20px)",
                  animation: "aurora-wave-subtle-3 40s ease-in-out infinite",
                  transform: "skewY(-0.5deg)",
                }}
              />
              {/* Ultra-wide flowing base curtain */}
              <div
                className="absolute aurora-base-flow"
                style={{
                  top: "30%",
                  left: "-12%",
                  right: "-12%",
                  height: "160px",
                  background: isPinkActive
                    ? "linear-gradient(90deg, transparent 0%, rgba(236, 72, 153, 0.25) 12%, rgba(251, 113, 133, 0.3) 25%, rgba(244, 114, 182, 0.28) 37%, rgba(190, 24, 93, 0.3) 50%, rgba(236, 72, 153, 0.28) 62%, rgba(251, 113, 133, 0.25) 75%, rgba(244, 114, 182, 0.22) 87%, transparent 100%)"
                    : "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.25) 12%, rgba(34, 197, 94, 0.3) 25%, rgba(20, 184, 166, 0.28) 37%, rgba(16, 185, 129, 0.3) 50%, rgba(6, 182, 212, 0.28) 62%, rgba(34, 197, 94, 0.25) 75%, rgba(20, 184, 166, 0.22) 87%, transparent 100%)",
                  borderRadius: "50% 80% 30% 70% / 80% 20% 70% 30%",
                  filter: "blur(25px)",
                  animation: "aurora-base-flow-subtle 46s ease-in-out infinite",
                  transform: "skewY(0.3deg)",
                }}
              />

              {/* NEW DESKTOP EYE CANDY - Enhanced Effects */}

              {/* Floating Energy Orbs - Desktop Only */}
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={`desktop-orb-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${8 + ((i * 7) % 84)}%`,
                      top: `${12 + ((i * 11) % 76)}%`,
                      width: `${6 + (i % 4) * 2}px`,
                      height: `${6 + (i % 4) * 2}px`,
                      background: [
                        "radial-gradient(circle, rgba(34, 197, 94, 0.9) 0%, rgba(34, 197, 94, 0.2) 60%, transparent 80%)",
                        "radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(59, 130, 246, 0.2) 60%, transparent 80%)",
                        "radial-gradient(circle, rgba(147, 51, 234, 0.9) 0%, rgba(147, 51, 234, 0.2) 60%, transparent 80%)",
                        "radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, rgba(236, 72, 153, 0.2) 60%, transparent 80%)",
                        "radial-gradient(circle, rgba(6, 182, 212, 0.9) 0%, rgba(6, 182, 212, 0.2) 60%, transparent 80%)",
                        "radial-gradient(circle, rgba(245, 158, 11, 0.9) 0%, rgba(245, 158, 11, 0.2) 60%, transparent 80%)",
                      ][i % 6],
                      animation: `desktop-float-${(i % 4) + 1} ${4 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
                      filter: `blur(${1 + (i % 2) * 0.5}px)`,
                      boxShadow: `0 0 ${12 + (i % 3) * 6}px currentColor`,
                    }}
                  />
                ))}
              </div>

              {/* Pulsing Corner Accents - Desktop Enhanced */}
              <div className="absolute top-8 left-8 w-24 h-24 rounded-full opacity-40">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(59, 130, 246, 0.6) 40%, rgba(147, 51, 234, 0.3) 70%, transparent 90%)",
                    animation: "desktop-pulse-corner 4s ease-in-out infinite",
                    filter: "blur(6px)",
                  }}
                />
              </div>
              <div className="absolute top-8 right-8 w-20 h-20 rounded-full opacity-35">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(236, 72, 153, 0.6) 40%, rgba(59, 130, 246, 0.3) 70%, transparent 90%)",
                    animation:
                      "desktop-pulse-corner 3.5s ease-in-out infinite 0.7s",
                    filter: "blur(5px)",
                  }}
                />
              </div>
              <div className="absolute bottom-8 left-8 w-28 h-28 rounded-full opacity-45">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(34, 197, 94, 0.6) 40%, rgba(6, 182, 212, 0.3) 70%, transparent 90%)",
                    animation:
                      "desktop-pulse-corner 4.5s ease-in-out infinite 1.2s",
                    filter: "blur(7px)",
                  }}
                />
              </div>
              <div className="absolute bottom-8 right-8 w-22 h-22 rounded-full opacity-38">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(245, 158, 11, 0.6) 40%, rgba(34, 197, 94, 0.3) 70%, transparent 90%)",
                    animation:
                      "desktop-pulse-corner 3.8s ease-in-out infinite 0.4s",
                    filter: "blur(4px)",
                  }}
                />
              </div>

              {/* Animated Wave Patterns - Desktop Only */}
              <div className="absolute inset-0">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`desktop-wave-${i}`}
                    className="absolute w-full h-40 opacity-30"
                    style={{
                      top: `${15 + i * 20}%`,
                      background: `linear-gradient(120deg,
                        transparent 0%,
                        rgba(34, 197, 94, ${0.25 + i * 0.08}) 20%,
                        rgba(59, 130, 246, ${0.35 + i * 0.08}) 40%,
                        rgba(147, 51, 234, ${0.3 + i * 0.08}) 60%,
                        rgba(236, 72, 153, ${0.25 + i * 0.08}) 80%,
                        transparent 100%)`,
                      borderRadius: `${50 + i * 15}% ${70 - i * 8}% ${40 + i * 12}% ${80 - i * 12}% / ${60 + i * 10}% ${30 - i * 4}% ${50 + i * 8}% ${70 - i * 15}%`,
                      filter: `blur(${10 + i * 3}px)`,
                      animation: `desktop-wave-${i + 1} ${8 + i * 2}s ease-in-out infinite`,
                      transform: `skewY(${-1.5 + i * 0.5}deg) rotate(${i * 1.5}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Desktop shimmer scanlines removed */}
            </div>
          )}

          {/* Custom Mobile/Tablet Effects - Lively and Energetic (Under 992px) */}
          {isHighPerformance && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden lg:hidden">
              {/* Animated Gradient Waves - Mobile/Tablet Only */}
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`mobile-wave-${i}`}
                    className="absolute w-full h-32 opacity-40"
                    style={{
                      top: `${20 + i * 25}%`,
                      background: `linear-gradient(90deg,
                        transparent 0%,
                        rgba(34, 197, 94, ${0.3 + i * 0.1}) 25%,
                        rgba(59, 130, 246, ${0.4 + i * 0.1}) 50%,
                        rgba(147, 51, 234, ${0.3 + i * 0.1}) 75%,
                        transparent 100%)`,
                      borderRadius: `${60 + i * 10}% ${40 - i * 5}% ${30 + i * 15}% ${70 - i * 10}% / ${50 + i * 20}% ${30 - i * 5}% ${40 + i * 10}% ${60 - i * 15}%`,
                      filter: `blur(${8 + i * 2}px)`,
                      animation: `mobile-wave-${i + 1} ${4 + i}s ease-in-out infinite`,
                      transform: `skewY(${-2 + i}deg) rotate(${i * 2}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Enhanced Floating Energy Dots - Mobile/Tablet Only */}
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={`mobile-dot-${i}`}
                    className="absolute rounded-full mobile-lively-particle"
                    style={{
                      left: `${10 + ((i * 11) % 80)}%`,
                      top: `${15 + ((i * 13) % 70)}%`,
                      width: `${4 + (i % 3)}px`,
                      height: `${4 + (i % 3)}px`,
                      background: [
                        "radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, transparent 70%)",
                        "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)",
                        "radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, transparent 70%)",
                        "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, transparent 70%)",
                      ][i % 4],
                      animation: `mobile-float-${(i % 3) + 1} ${3 + (i % 2)}s ease-in-out infinite ${i * 0.2}s`,
                      filter: `blur(${0.5 + (i % 2) * 0.5}px)`,
                      boxShadow: `0 0 ${8 + (i % 3) * 4}px currentColor`,
                    }}
                  />
                ))}
              </div>

              {/* Pulsing Corner Accents - Mobile/Tablet Only */}
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full opacity-60">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, rgba(59, 130, 246, 0.4) 50%, transparent 80%)",
                    animation: "mobile-pulse-corner 3s ease-in-out infinite",
                    filter: "blur(4px)",
                  }}
                />
              </div>
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full opacity-50">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, rgba(236, 72, 153, 0.4) 50%, transparent 80%)",
                    animation:
                      "mobile-pulse-corner 2.5s ease-in-out infinite 0.5s",
                    filter: "blur(3px)",
                  }}
                />
              </div>
              <div className="absolute bottom-4 left-4 w-14 h-14 rounded-full opacity-55">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(34, 197, 94, 0.4) 50%, transparent 80%)",
                    animation:
                      "mobile-pulse-corner 3.5s ease-in-out infinite 1s",
                    filter: "blur(5px)",
                  }}
                />
              </div>

              {/* Enhanced Mobile/Tablet Aurora-like Effects */}
              <div className="absolute inset-0 opacity-50">
                {/* Mobile Aurora Curtain 1 */}
                <div
                  className="absolute"
                  style={{
                    top: "25%",
                    left: "-2%",
                    right: "-2%",
                    height: window.innerWidth <= 640 ? "80px" : "100px",
                    background:
                      window.innerWidth <= 640
                        ? "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.4) 30%, rgba(59, 130, 246, 0.5) 50%, rgba(147, 51, 234, 0.4) 70%, transparent 100%)"
                        : "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.5) 25%, rgba(59, 130, 246, 0.6) 40%, rgba(147, 51, 234, 0.5) 60%, rgba(236, 72, 153, 0.4) 75%, transparent 100%)",
                    borderRadius: "50% 80% 40% 60% / 60% 40% 80% 20%",
                    filter: `blur(${window.innerWidth <= 640 ? "12px" : "15px"})`,
                    animation: "mobile-aurora-1 20s ease-in-out infinite",
                    transform: "skewY(-0.5deg)",
                  }}
                />
                {/* Mobile Aurora Curtain 2 */}
                <div
                  className="absolute"
                  style={{
                    top: "55%",
                    left: "-5%",
                    right: "-5%",
                    height: window.innerWidth <= 640 ? "70px" : "90px",
                    background:
                      window.innerWidth <= 640
                        ? "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.4) 35%, rgba(34, 197, 94, 0.5) 50%, rgba(59, 130, 246, 0.4) 65%, transparent 100%)"
                        : "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.5) 20%, rgba(34, 197, 94, 0.6) 35%, rgba(147, 51, 234, 0.5) 50%, rgba(236, 72, 153, 0.4) 65%, rgba(245, 158, 11, 0.3) 80%, transparent 100%)",
                    borderRadius: "40% 70% 60% 30% / 70% 30% 40% 80%",
                    filter: `blur(${window.innerWidth <= 640 ? "10px" : "14px"})`,
                    animation: "mobile-aurora-2 25s ease-in-out infinite 5s",
                    transform: "skewY(0.8deg)",
                  }}
                />
              </div>

              {/* Enhanced Floating Orbs - Different sizes for Mobile vs Tablet */}
              <div className="absolute inset-0">
                {[...Array(window.innerWidth <= 640 ? 6 : 10)].map((_, i) => (
                  <div
                    key={`enhanced-mobile-orb-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${8 + ((i * 12) % 84)}%`,
                      top: `${10 + ((i * 15) % 80)}%`,
                      width:
                        window.innerWidth <= 640
                          ? `${6 + (i % 3) * 2}px`
                          : `${8 + (i % 4) * 2}px`,
                      height:
                        window.innerWidth <= 640
                          ? `${6 + (i % 3) * 2}px`
                          : `${8 + (i % 4) * 2}px`,
                      background: [
                        "radial-gradient(circle, rgba(34, 197, 94, 0.9) 0%, rgba(34, 197, 94, 0.3) 50%, transparent 80%)",
                        "radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 80%)",
                        "radial-gradient(circle, rgba(147, 51, 234, 0.9) 0%, rgba(147, 51, 234, 0.3) 50%, transparent 80%)",
                        "radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, rgba(236, 72, 153, 0.3) 50%, transparent 80%)",
                        "radial-gradient(circle, rgba(6, 182, 212, 0.9) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 80%)",
                        "radial-gradient(circle, rgba(245, 158, 11, 0.9) 0%, rgba(245, 158, 11, 0.3) 50%, transparent 80%)",
                      ][i % 6],
                      animation: `enhanced-mobile-float-${(i % 3) + 1} ${4 + (i % 3)}s ease-in-out infinite ${i * 0.4}s`,
                      filter: `blur(${1 + (i % 2) * 0.5}px)`,
                      boxShadow: `0 0 ${10 + (i % 3) * 4}px currentColor`,
                    }}
                  />
                ))}
              </div>

              {/* Enhanced Corner Pulse Effects */}
              <div className="absolute top-6 left-6 w-20 h-20 rounded-full opacity-50">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(59, 130, 246, 0.5) 40%, rgba(147, 51, 234, 0.2) 70%, transparent 90%)",
                    animation:
                      "enhanced-mobile-pulse 3.5s ease-in-out infinite",
                    filter: "blur(6px)",
                  }}
                />
              </div>
              <div className="absolute top-6 right-6 w-16 h-16 rounded-full opacity-45">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(236, 72, 153, 0.5) 40%, rgba(245, 158, 11, 0.2) 70%, transparent 90%)",
                    animation:
                      "enhanced-mobile-pulse 3s ease-in-out infinite 0.8s",
                    filter: "blur(5px)",
                  }}
                />
              </div>
              <div className="absolute bottom-6 left-6 w-18 h-18 rounded-full opacity-55">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(34, 197, 94, 0.5) 40%, rgba(59, 130, 246, 0.2) 70%, transparent 90%)",
                    animation:
                      "enhanced-mobile-pulse 4s ease-in-out infinite 1.5s",
                    filter: "blur(7px)",
                  }}
                />
              </div>
              <div className="absolute bottom-6 right-6 w-14 h-14 rounded-full opacity-48">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(245, 158, 11, 0.5) 40%, rgba(34, 197, 94, 0.2) 70%, transparent 90%)",
                    animation:
                      "enhanced-mobile-pulse 3.2s ease-in-out infinite 0.3s",
                    filter: "blur(4px)",
                  }}
                />
              </div>

              {/* Enhanced Wave Patterns for Mobile/Tablet */}
              <div className="absolute inset-0">
                {[...Array(window.innerWidth <= 640 ? 2 : 3)].map((_, i) => (
                  <div
                    key={`enhanced-mobile-wave-${i}`}
                    className="absolute w-full opacity-35"
                    style={{
                      top: `${15 + i * 30}%`,
                      height: window.innerWidth <= 640 ? "120px" : "140px",
                      background:
                        window.innerWidth <= 640
                          ? `linear-gradient(110deg,
                            transparent 0%,
                            rgba(34, 197, 94, ${0.3 + i * 0.1}) 30%,
                            rgba(59, 130, 246, ${0.4 + i * 0.1}) 50%,
                            rgba(147, 51, 234, ${0.3 + i * 0.1}) 70%,
                            transparent 100%)`
                          : `linear-gradient(115deg,
                            transparent 0%,
                            rgba(34, 197, 94, ${0.35 + i * 0.1}) 25%,
                            rgba(59, 130, 246, ${0.45 + i * 0.1}) 40%,
                            rgba(147, 51, 234, ${0.4 + i * 0.1}) 55%,
                            rgba(236, 72, 153, ${0.35 + i * 0.1}) 70%,
                            rgba(6, 182, 212, ${0.3 + i * 0.1}) 85%,
                            transparent 100%)`,
                      borderRadius: `${55 + i * 10}% ${45 - i * 8}% ${35 + i * 15}% ${75 - i * 12}% / ${65 + i * 8}% ${25 - i * 5}% ${45 + i * 12}% ${80 - i * 20}%`,
                      filter: `blur(${12 + i * 3}px)`,
                      animation: `enhanced-mobile-wave-${i + 1} ${6 + i * 2}s ease-in-out infinite`,
                      transform: `skewY(${-1 + i * 0.7}deg) rotate(${i * 1.2}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Scanlines removed for mobile/tablet devices */}
            </div>
          )}

          {/* Pink Theme Exclusive Background Effects */}
          {isPinkActive && isHighPerformance && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Pink Aurora Curtains - Desktop */}
              <div className="hidden lg:block opacity-70">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`pink-aurora-${i}`}
                    className="absolute"
                    style={{
                      top: `${15 + i * 20}%`,
                      left: "-20%",
                      right: "-20%",
                      height: `${100 + i * 20}px`,
                      background: `linear-gradient(90deg,
                        transparent 0%,
                        rgba(236, 72, 153, ${0.4 + i * 0.1}) 20%,
                        rgba(244, 114, 182, ${0.5 + i * 0.1}) 40%,
                        rgba(251, 113, 133, ${0.6 + i * 0.1}) 60%,
                        rgba(190, 24, 93, ${0.4 + i * 0.1}) 80%,
                        transparent 100%)`,
                      borderRadius: `${40 + i * 15}% ${80 - i * 10}% ${60 + i * 12}% ${30 - i * 8}% / ${70 + i * 8}% ${40 - i * 5}% ${50 + i * 10}% ${90 - i * 15}%`,
                      filter: `blur(${12 + i * 4}px)`,
                      animation: `pink-floating-orbs ${25 + i * 5}s ease-in-out infinite ${i * 2}s`,
                      transform: `skewY(${-2 + i * 0.8}deg) rotate(${i * 2}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Pink Floating Hearts - All Devices */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`pink-heart-bg-${i}`}
                    className="absolute"
                    style={{
                      left: `${10 + ((i * 80) % 85)}%`,
                      top: `${15 + ((i * 60) % 70)}%`,
                      width: `${12 + (i % 4) * 4}px`,
                      height: `${12 + (i % 4) * 4}px`,
                      animation: `pink-heartbeat ${3 + (i % 3)}s ease-in-out infinite ${i * 0.7}s`,
                      transform: "translateZ(0)",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        background: `rgba(236, 72, 153, ${0.6 + (i % 3) * 0.1})`,
                        clipPath:
                          "polygon(50% 10%, 83% 25%, 100% 60%, 50% 100%, 0% 60%, 17% 25%)",
                        boxShadow: "0 0 8px rgba(236, 72, 153, 0.5)",
                        filter: "blur(1px)",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Pink Sparkle Effects */}
              <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                  <div
                    key={`pink-sparkle-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${5 + ((i * 70) % 90)}%`,
                      top: `${10 + ((i * 50) % 80)}%`,
                      width: `${2 + (i % 3)}px`,
                      height: `${2 + (i % 3)}px`,
                      background: [
                        "rgba(236, 72, 153, 0.9)",
                        "rgba(244, 114, 182, 0.8)",
                        "rgba(251, 113, 133, 0.7)",
                        "rgba(190, 24, 93, 0.9)",
                      ][i % 4],
                      animation: `pink-pulse ${2 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
                      boxShadow: "0 0 6px currentColor",
                      filter: "blur(0.5px)",
                      transform: "translateZ(0)",
                    }}
                  />
                ))}
              </div>

              {/* Pink Mobile/Tablet Wave Effects */}
              <div className="lg:hidden absolute inset-0 opacity-60">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={`pink-mobile-wave-${i}`}
                    className="absolute w-full"
                    style={{
                      top: `${20 + i * 25}%`,
                      height: "100px",
                      background: `linear-gradient(90deg,
                        transparent 0%,
                        rgba(236, 72, 153, ${0.3 + i * 0.1}) 30%,
                        rgba(244, 114, 182, ${0.4 + i * 0.1}) 50%,
                        rgba(251, 113, 133, ${0.3 + i * 0.1}) 70%,
                        transparent 100%)`,
                      borderRadius: `${50 + i * 10}% ${70 - i * 5}% ${40 + i * 8}% ${80 - i * 12}% / ${60 + i * 15}% ${30 - i * 3}% ${50 + i * 7}% ${70 - i * 10}%`,
                      filter: `blur(${8 + i * 2}px)`,
                      animation: `pink-floating-particles ${15 + i * 3}s linear infinite ${i * 1.5}s`,
                      transform: `skewY(${-1.5 + i * 0.5}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Optimized Floating Ambient Particles - Reduced count for 60fps */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden will-change-transform"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {[...Array(animationConfig.enableBackgroundParticles ? 15 : 0)].map(
              (_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full opacity-70 gpu-accelerated"
                  style={{
                    left: `${5 + ((i * 60) % 95)}%`,
                    top: `${10 + ((i * 35) % 85)}%`,
                    width: `${3 + (i % 4)}px`,
                    height: `${3 + (i % 4)}px`,
                    background: (() => {
                      if (isPinkActive) {
                        const pinkPalettes = [
                          `radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, rgba(244, 114, 182, 0.5) 70%, transparent 90%)`, // Pink
                          `radial-gradient(circle, rgba(244, 114, 182, 0.8) 0%, rgba(251, 113, 133, 0.4) 70%, transparent 90%)`, // Light Pink
                          `radial-gradient(circle, rgba(251, 113, 133, 0.8) 0%, rgba(236, 72, 153, 0.4) 70%, transparent 90%)`, // Rose Pink
                          `radial-gradient(circle, rgba(190, 24, 93, 0.8) 0%, rgba(244, 114, 182, 0.4) 70%, transparent 90%)`, // Dark Pink
                          `radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, rgba(190, 24, 93, 0.5) 70%, transparent 90%)`, // Pink-Dark Pink
                          `radial-gradient(circle, rgba(244, 114, 182, 0.8) 0%, rgba(236, 72, 153, 0.4) 70%, transparent 90%)`, // Light-Pink Mix
                        ];
                        return pinkPalettes[i % pinkPalettes.length];
                      } else {
                        const colorPalettes = [
                          `radial-gradient(circle, rgba(255, 100, 200, 0.8) 0%, rgba(255, 150, 100, 0.4) 70%, transparent 90%)`, // Pink-Orange
                          `radial-gradient(circle, rgba(100, 255, 150, 0.8) 0%, rgba(100, 200, 255, 0.4) 70%, transparent 90%)`, // Green-Blue
                          `radial-gradient(circle, rgba(200, 100, 255, 0.8) 0%, rgba(255, 200, 100, 0.4) 70%, transparent 90%)`, // Purple-Yellow
                          `radial-gradient(circle, rgba(100, 200, 255, 0.8) 0%, rgba(200, 255, 150, 0.4) 70%, transparent 90%)`, // Blue-Green
                          `radial-gradient(circle, rgba(255, 200, 100, 0.8) 0%, rgba(200, 100, 255, 0.4) 70%, transparent 90%)`, // Orange-Purple
                          `radial-gradient(circle, rgba(255, 150, 200, 0.8) 0%, rgba(150, 255, 200, 0.4) 70%, transparent 90%)`, // Pink-Mint
                        ];
                        return colorPalettes[i % colorPalettes.length];
                      }
                    })(),
                    animation: isScrollingActive
                      ? "none"
                      : `gentleFloat ${4 + (i % 3)}s ease-in-out infinite ${i * 0.4}s, sparkle ${8 + (i % 4)}s ease-in-out infinite ${i * 0.5}s`,
                    willChange: isScrollingActive ? "auto" : "transform",
                    transform: `translateZ(0) scale(${0.8 + (i % 2) * 0.4})`,
                    filter: `drop-shadow(0 0 4px currentColor) blur(0.5px)`,
                    boxShadow: `0 0 ${4 + (i % 3) * 2}px rgba(255, 255, 255, 0.3)`,
                  }}
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    ease: "backOut",
                    type: "spring",
                    stiffness: 200,
                  }}
                />
              ),
            )}
          </motion.div>

          {/* Animated Geometric Patterns - Now on all devices */}
          {isHighPerformance && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
              <svg
                className="absolute w-full h-full gpu-accelerated"
                viewBox="0 0 1200 800"
              >
                {/* Animated hexagon grid - Reduced count */}
                {[...Array(4)].map((_, i) => (
                  <polygon
                    key={`hex-${i}`}
                    points="100,20 140,40 140,80 100,100 60,80 60,40"
                    fill="none"
                    stroke="rgba(73, 146, 255, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="10 5"
                    style={{
                      transform: `translate(${100 + i * 250}px, ${100 + (i % 2) * 150}px)`,
                      animation: `geometric-pulse ${10 + i * 2}s ease-in-out infinite ${i * 0.8}s`,
                    }}
                  />
                ))}
                {/* Animated connecting lines - Reduced count */}
                {[...Array(2)].map((_, i) => (
                  <line
                    key={`line-${i}`}
                    x1={50 + i * 400}
                    y1={200}
                    x2={300 + i * 400}
                    y2={400}
                    stroke="rgba(63, 186, 255, 0.2)"
                    strokeWidth="1"
                    strokeDasharray="15 10"
                    style={{
                      animation: `geometric-pulse ${12 + i * 3}s ease-in-out infinite ${i * 1}s`,
                    }}
                  />
                ))}
              </svg>
            </div>
          )}

          {/* Optimized Breathing Orbs - Reduced count for performance - Responsive for mobile/tablet */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden scale-75 sm:scale-85 lg:scale-100">
            {[...Array(animationConfig.enableFloatingOrbs ? 6 : 0)].map(
              (_, i) => (
                <div
                  key={`breath-orb-${i}`}
                  className="absolute rounded-full gpu-accelerated"
                  style={{
                    left: `${15 + ((i * 80) % 70)}%`,
                    top: `${20 + ((i * 60) % 60)}%`,
                    width: `${25 + (i % 2) * 15}px`,
                    height: `${25 + (i % 2) * 15}px`,
                    background: `radial-gradient(circle, rgba(${73 + i * 15}, ${146 + i * 8}, 255, 0.4) 0%, transparent 70%)`,
                    animation: `breath ${8 + (i % 3)}s ease-in-out infinite ${i * 0.6}s`,
                    filter: `blur(${3 + (i % 2)}px)`,
                    willChange: "transform, opacity",
                    transform: "translateZ(0)",
                  }}
                />
              ),
            )}
          </div>

          {/* Dynamic Background Waves */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `
              radial-gradient(circle at 20% 80%, rgba(73, 146, 255, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(63, 186, 255, 0.2) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(57, 135, 227, 0.1) 0%, transparent 50%)
            `,
                animation: "subtle-glow 12s ease-in-out infinite alternate",
              }}
            />
          </div>

          {/* Aurora-like Moving Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute w-96 h-96 rounded-full opacity-15"
              style={{
                left: "10%",
                top: "20%",
                background:
                  "linear-gradient(45deg, rgba(73, 146, 255, 0.4), rgba(63, 186, 255, 0.2))",
                filter: "blur(60px)",
                animation: "aurora 12s ease-in-out infinite",
              }}
            />
            <div
              className="absolute w-80 h-80 rounded-full opacity-10"
              style={{
                right: "15%",
                bottom: "25%",
                background:
                  "linear-gradient(-45deg, rgba(57, 135, 227, 0.3), rgba(73, 146, 255, 0.1))",
                filter: "blur(80px)",
                animation: "aurora 15s ease-in-out infinite 3s",
              }}
            />
          </div>

          {/* Interactive Glass Badge at Top */}
          <div
            className="absolute top-8 sm:top-28 left-0 right-0 flex justify-center z-20 animate-gentleBounce scale-75 sm:scale-100"
            style={{
              marginTop: "var(--badge-margin-top, 140px)",
            }}
          >
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3 py-2 md:py-3 rounded-full backdrop-blur-xs hover:bg-white/15 transition-all duration-500 hover:scale-105 relative overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "2px solid transparent",
                backgroundClip: "padding-box",
              }}
              onMouseMove={handleBadgeMouseMove}
              onMouseLeave={handleBadgeMouseLeave}
            >
              {/* Dynamic Border Effect */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none transition-all duration-300"
                style={{
                  background: badgeMousePosition.isNear
                    ? `conic-gradient(from ${(Math.atan2(badgeMousePosition.y, badgeMousePosition.x) * 180) / Math.PI + 90}deg, rgba(73, 146, 255, 0.8) 0deg, rgba(73, 146, 255, 0.4) 90deg, rgba(255, 255, 255, 0.2) 180deg, rgba(255, 255, 255, 0.2) 270deg, rgba(73, 146, 255, 0.8) 360deg)`
                    : "conic-gradient(from 0deg, rgba(255, 255, 255, 0.2) 0deg, rgba(255, 255, 255, 0.2) 360deg)",
                  padding: "2px",
                  borderRadius: "inherit",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "xor",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                }}
              />
              {/* Animated Sparkle Icon */}
              <svg
                className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 animate-sparkle"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3.5L10.088 9.313C9.99015 9.61051 9.82379 9.88088 9.60234 10.1023C9.38088 10.3238 9.11051 10.4901 8.813 10.588L3 12.5L8.813 14.412C9.11051 14.5099 9.38088 14.6762 9.60234 14.8977C9.82379 15.1191 9.99015 15.3895 10.088 15.687L12 21.5L13.912 15.687C14.0099 15.3895 14.1762 15.1191 14.3977 14.8977C14.6191 14.6762 14.8895 14.5099 15.187 14.412L21 12.5L15.187 10.588C14.8895 10.4901 14.6191 10.3238 14.3977 10.1023C14.1762 9.88088 14.0099 9.61051 13.912 9.313L12 3.5Z"
                  stroke={theme === "light" ? "#3B82F6" : "#22D3EE"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 3.5V7.5"
                  stroke={theme === "light" ? "#3B82F6" : "#22D3EE"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19 17.5V21.5"
                  stroke={theme === "light" ? "#3B82F6" : "#22D3EE"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 5.5H7"
                  stroke={theme === "light" ? "#3B82F6" : "#22D3EE"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 19.5H21"
                  stroke={theme === "light" ? "#3B82F6" : "#22D3EE"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className={`font-inter text-xs sm:text-xs md:text-sm font-normal text-center animate-textGlow ${
                  theme === "light" ? "text-gray-700" : "text-white/80"
                }`}
              >
                Future-Ready Solutions, Custom-Built
              </span>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="relative flex items-center justify-center min-h-screen">
            {/* Energy Rings Around Orb - Optimized for performance */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`ring-${i}`}
                  className="absolute rounded-full border opacity-20 gpu-accelerated"
                  style={{
                    width: `${400 + i * 120}px`,
                    height: `${400 + i * 120}px`,
                    border: `1px solid rgba(73, 146, 255, ${0.4 - i * 0.1})`,
                    animation: `energy-ripple 3s ease-out infinite ${i * 0.5}s`,
                    willChange: "transform, opacity",
                    transform: "translateZ(0)",
                  }}
                />
              ))}
            </div>

            {/* Optimized Rotating Light Beams */}
            {!isMobile && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div
                  className="absolute w-1 h-96 bg-gradient-to-t from-transparent via-blue-400/25 to-transparent gpu-accelerated"
                  style={{
                    animation: "spin 15s linear infinite",
                    transformOrigin: "center 50%",
                    willChange: "transform",
                    transform: "translateZ(0)",
                  }}
                />
                <div
                  className="absolute w-1 h-96 bg-gradient-to-t from-transparent via-cyan-400/20 to-transparent gpu-accelerated"
                  style={{
                    animation: "spin 20s linear infinite reverse",
                    transformOrigin: "center 50%",
                    willChange: "transform",
                    transform: "translateZ(0)",
                  }}
                />
              </div>
            )}

            {/* Left Side Visual Balance Elements */}
            <div className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 pointer-events-none">
              {/* Floating geometric indicators */}
              <div className="space-y-4 sm:space-y-8">
                {/* Primary indicator */}
                <motion.div
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-400/30 animate-gentle-pulse"
                  initial={{ opacity: 0, x: -50, scale: 0 }}
                  animate={
                    animationStep >= 4 ? { opacity: 1, x: 0, scale: 1 } : {}
                  }
                  transition={{
                    delay: 0.2,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                  }}
                />
                {/* Secondary indicators */}
                <motion.div
                  className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-blue-300/20 animate-gentle-pulse"
                  initial={{ opacity: 0, x: -50, scale: 0 }}
                  animate={
                    animationStep >= 4 ? { opacity: 1, x: 0, scale: 1 } : {}
                  }
                  transition={{
                    delay: 0.4,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                  }}
                  style={{ animationDelay: "1s" }}
                />
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-200/25 animate-gentle-pulse"
                  initial={{ opacity: 0, x: -50, scale: 0 }}
                  animate={
                    animationStep >= 4 ? { opacity: 1, x: 0, scale: 1 } : {}
                  }
                  transition={{
                    delay: 0.6,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                  }}
                  style={{ animationDelay: "2s" }}
                />
              </div>

              {/* Vertical progress line */}
              <motion.div
                className={`absolute left-1/2 -translate-x-1/2 top-12 sm:top-16 w-px h-16 sm:h-24 ${
                  isPinkActive
                    ? "bg-gradient-to-b from-pink-400/50 via-pink-300/25 to-transparent"
                    : "bg-gradient-to-b from-blue-400/40 via-blue-300/20 to-transparent"
                }`}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={animationStep >= 1 ? { opacity: 1, scaleY: 1 } : {}}
                transition={{ delay: 3, duration: 1.5 }}
              />

              {/* Connecting line to center (desktop only) */}
              <motion.div
                className={`hidden lg:block absolute top-8 left-4 w-32 h-px ${
                  isPinkActive
                    ? "bg-gradient-to-r from-pink-400/40 to-transparent"
                    : "bg-gradient-to-r from-blue-400/30 to-transparent"
                }`}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={animationStep >= 1 ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ delay: 3.5, duration: 1 }}
              />
            </div>

            {/* Right Side Balance Elements */}
            <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none">
              {/* Floating geometric indicators mirrored */}
              <div className="space-y-4 sm:space-y-8">
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-400/25 animate-gentle-pulse"
                  initial={{ opacity: 0, x: 20 }}
                  animate={animationStep >= 1 ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 2.2, duration: 1 }}
                  style={{ animationDelay: "0.5s" }}
                />
                <motion.div
                  className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-purple-300/20 animate-gentle-pulse"
                  initial={{ opacity: 0, x: 20 }}
                  animate={animationStep >= 1 ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 2.5, duration: 1 }}
                  style={{ animationDelay: "1.5s" }}
                />
                <motion.div
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-200/30 animate-gentle-pulse"
                  initial={{ opacity: 0, x: 20 }}
                  animate={animationStep >= 1 ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 2.8, duration: 1 }}
                  style={{ animationDelay: "2.5s" }}
                />
              </div>
            </div>

            {/* Central Glowing Orb - SVG Based with Magnetic Effect - YouTube Intro Style */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative animate-float cursor-pointer group pointer-events-none gpu-accelerated will-change-transform"
                initial={{
                  opacity: 0,
                  scale: 0,
                  y: -100,
                  filter: "blur(15px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const centerX = rect.left + rect.width / 2;
                  const centerY = rect.top + rect.height / 2;
                  const deltaX = (e.clientX - centerX) * 0.1;
                  const deltaY = (e.clientY - centerY) * 0.1;
                  e.currentTarget.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translate(0px, 0px) scale(1)";
                }}
                style={{
                  transition: "transform 0.3s ease-out",
                }}
              >
                <svg
                  width="292"
                  height="308"
                  viewBox="0 0 1284 810"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[25rem] h-[25rem] sm:w-[35rem] sm:h-[35rem] md:w-[45rem] md:h-[45rem] lg:w-[75rem] lg:h-[75rem] xl:w-[90rem] xl:h-[90rem] pointer-events-none"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <defs>
                    <filter
                      id="orbFilter"
                      x="0.820007"
                      y="-259.18"
                      width="1282.36"
                      height="1298.36"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="11.79" />
                      <feColorMatrix
                        type="matrix"
                        values={
                          isPinkActive
                            ? "0 0 0 0 0.925 0 0 0 0 0.282 0 0 0 0 0.596 0 0 0 1 0"
                            : "0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
                        }
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="41.265" />
                      <feColorMatrix
                        type="matrix"
                        values={
                          isPinkActive
                            ? "0 0 0 0 0.925 0 0 0 0 0.282 0 0 0 0 0.596 0 0 0 1 0"
                            : "0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
                        }
                      />
                      <feBlend
                        mode="normal"
                        in2="effect1_dropShadow"
                        result="effect2_dropShadow"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="82.53" />
                      <feColorMatrix
                        type="matrix"
                        values={
                          isPinkActive
                            ? "0 0 0 0 0.925 0 0 0 0 0.282 0 0 0 0 0.596 0 0 0 1 0"
                            : "0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
                        }
                      />
                      <feBlend
                        mode="normal"
                        in2="effect2_dropShadow"
                        result="effect3_dropShadow"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="141.48" />
                      <feColorMatrix
                        type="matrix"
                        values={
                          isPinkActive
                            ? "0 0 0 0 0.925 0 0 0 0 0.282 0 0 0 0 0.596 0 0 0 1 0"
                            : "0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
                        }
                      />
                      <feBlend
                        mode="normal"
                        in2="effect3_dropShadow"
                        result="effect4_dropShadow"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="247.59" />
                      <feColorMatrix
                        type="matrix"
                        values={
                          isPinkActive
                            ? "0 0 0 0 0.925 0 0 0 0 0.282 0 0 0 0 0.596 0 0 0 1 0"
                            : "0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
                        }
                      />
                      <feBlend
                        mode="normal"
                        in2="effect4_dropShadow"
                        result="effect5_dropShadow"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect5_dropShadow"
                        result="shape"
                      />
                      <feGaussianBlur
                        stdDeviation="17.5"
                        result="effect6_foregroundBlur"
                      />
                    </filter>
                    <linearGradient
                      id="orbGradient"
                      x1="496"
                      y1="449.231"
                      x2="853.699"
                      y2="451.438"
                      gradientUnits="userSpaceOnUse"
                    >
                      {isPinkActive ? (
                        <>
                          <stop stopColor="#F472B6" />
                          <stop offset="0.493374" stopColor="#EC4899" />
                          <stop offset="1" stopColor="#BE185D" />
                        </>
                      ) : (
                        <>
                          <stop stopColor="#3FBAFF" />
                          <stop offset="0.493374" stopColor="#4992FF" />
                          <stop offset="1" stopColor="#3987E3" />
                        </>
                      )}
                    </linearGradient>
                  </defs>
                  <g filter="url(#orbFilter)">
                    <ellipse
                      cx="642"
                      cy="390"
                      rx="146"
                      ry="154"
                      fill="url(#orbGradient)"
                    />
                    <ellipse
                      cx="642"
                      cy="390"
                      rx="146"
                      ry="154"
                      stroke="black"
                    />
                  </g>
                </svg>
              </motion.div>
            </div>

            {/* Text Content - YouTube Intro Style */}
            <motion.div
              className="relative z-10 px-4 -mt-16 gpu-accelerated will-change-transform"
              initial={{
                opacity: 0,
              }}
              animate={
                animationStep >= 3
                  ? {
                      opacity: 1,
                    }
                  : {}
              }
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: 0.3,
              }}
            >
              {/* Kor - mobile: 50px left + 30px down + bigger, desktop: moved further to the left */}
              <div
                className="text-center transform -translate-x-[50px] translate-y-[30px] sm:-translate-x-6 sm:translate-y-0 md:-translate-x-12 lg:-translate-x-16 xl:-translate-x-20"
                style={{ marginLeft: "-5px" }}
              >
                <h1
                  className={`font-poppins text-6xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight relative mobile-lively-text ${
                    isPinkActive
                      ? "text-pink-300 animate-pink-neon-glow"
                      : theme === "light"
                        ? "text-gray-900"
                        : "text-white"
                  }`}
                  style={
                    isPinkActive
                      ? {
                          textShadow:
                            "0 0 10px rgba(236, 72, 153, 0.8), 0 0 20px rgba(244, 114, 182, 0.6), 0 0 30px rgba(251, 113, 133, 0.4)",
                          filter:
                            "drop-shadow(0 0 15px rgba(236, 72, 153, 0.5))",
                        }
                      : {}
                  }
                >
                  <span className="inline-block relative warm-glow-text animate-warm-glow-pulse animate-wavy-text">
                    K
                  </span>
                  <span
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse animate-wavy-text"
                    style={{
                      animationDelay: "0.3s",
                    }}
                  >
                    o
                  </span>
                  <span
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse animate-wavy-text"
                    style={{
                      animationDelay: "0.6s",
                    }}
                  >
                    r
                  </span>
                </h1>
              </div>

              {/* Development services - Fade in second with delay */}
              <motion.div
                className="text-center transform translate-x-[10px] translate-y-[10px] sm:translate-x-8 sm:translate-y-0 md:translate-x-12 lg:translate-x-16 mt-2 md:mt-4"
                style={{ marginLeft: "5px", marginTop: "-5px" }}
                initial={{ opacity: 0 }}
                animate={animationStep >= 3 ? { opacity: 1 } : { opacity: 0 }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                  delay: 1.5,
                }}
              >
                <div className="relative">
                  {/* Background glow effect */}
                  <div
                    className="absolute inset-0 blur-3xl opacity-30 animate-pulse-glow"
                    style={{
                      background: isPinkActive
                        ? "radial-gradient(ellipse, rgba(236, 72, 153, 0.4) 0%, rgba(244, 114, 182, 0.3) 50%, transparent 70%)"
                        : theme === "light"
                          ? "radial-gradient(ellipse, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 50%, transparent 70%)"
                          : "radial-gradient(ellipse, rgba(73, 146, 255, 0.6) 0%, rgba(34, 211, 238, 0.4) 50%, transparent 70%)",
                      transform: "scale(1.5)",
                    }}
                  />

                  {/* Optimized floating energy particles around text */}
                  {!isPinkActive &&
                    [...Array(8)].map((_, i) => (
                      <div
                        key={`energy-${i}`}
                        className="absolute rounded-full pointer-events-none gpu-accelerated"
                        style={{
                          left: `${20 + ((i * 80) % 160)}%`,
                          top: `${30 + ((i * 50) % 60)}%`,
                          width: `${4 + (i % 2)}px`,
                          height: `${4 + (i % 2)}px`,
                          background:
                            theme === "light"
                              ? `rgba(${59 + ((i * 30) % 60)}, ${130 + ((i * 20) % 50)}, 246, ${0.7 + (i % 2) * 0.2})`
                              : `rgba(${73 + ((i * 20) % 50)}, ${146 + ((i * 10) % 30)}, 255, ${0.7 + (i % 2) * 0.2})`,
                          animation: `energy-float ${4 + (i % 2)}s ease-in-out infinite ${i * 0.5}s`,
                          willChange: "transform, opacity",
                          transform: "translateZ(0)",
                        }}
                      />
                    ))}

                  {/* Pink Theme Floating Bubbles with Pink Outlines */}
                  {isPinkActive &&
                    [...Array(12)].map((_, i) => (
                      <div
                        key={`pink-bubble-${i}`}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          left: `${10 + ((i * 70) % 180)}%`,
                          top: `${20 + ((i * 60) % 80)}%`,
                          width: `${6 + (i % 4) * 2}px`,
                          height: `${6 + (i % 4) * 2}px`,
                          background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(236, 72, 153, 0.2) 40%, rgba(236, 72, 153, 0.1))`,
                          border: "1px solid rgba(236, 72, 153, 0.6)",
                          animation: `gentle-float ${4 + (i % 3)}s ease-in-out infinite ${i * 0.5}s`,
                          boxShadow:
                            "0 0 12px rgba(236, 72, 153, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)",
                          willChange: "transform, opacity",
                          transform: "translateZ(0)",
                          backdropFilter: "blur(1px)",
                        }}
                      />
                    ))}

                  {/* Pink Theme Heart Shapes */}
                  {isPinkActive &&
                    [...Array(6)].map((_, i) => (
                      <div
                        key={`pink-heart-${i}`}
                        className="absolute pointer-events-none"
                        style={{
                          left: `${15 + ((i * 90) % 170)}%`,
                          top: `${25 + ((i * 45) % 70)}%`,
                          width: "8px",
                          height: "8px",
                          animation: `pink-heartbeat ${2 + (i % 2)}s ease-in-out infinite ${i * 0.6}s`,
                          willChange: "transform",
                          transform: "translateZ(0)",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "rgba(236, 72, 153, 0.9)",
                            transform: "rotate(45deg)",
                            borderRadius: "0 50% 50% 50%",
                            boxShadow: "0 0 6px rgba(236, 72, 153, 0.7)",
                          }}
                        />
                      </div>
                    ))}

                  <div className="font-poppins text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold relative z-10">
                    <span
                      className={`relative inline-block mobile-lively-glow ${
                        isPinkActive
                          ? "text-pink-200"
                          : theme === "light"
                            ? "text-gray-900"
                            : "text-white"
                      } ${isPinkActive ? "animate-pink-neon-glow" : "animate-text-pop"}`}
                      style={
                        isPinkActive
                          ? {
                              filter:
                                "drop-shadow(0 0 12px rgba(236, 72, 153, 0.7)) drop-shadow(0 0 25px rgba(244, 114, 182, 0.5))",
                              textShadow: "0 0 8px rgba(236, 72, 153, 0.6)",
                            }
                          : {
                              filter:
                                theme === "light"
                                  ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(147, 51, 234, 0.4))`
                                  : `drop-shadow(0 0 20px rgba(73, 146, 255, 0.8)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.5))`,
                            }
                      }
                    >
                      {/* Warm glow text with iOS-inspired styling */}
                      <span className="warm-glow-text animate-warm-glow-pulse">
                        {"Development services".split("").map((letter, i) => (
                          <span
                            key={i}
                            className="animate-letter-float animate-dev-services-text"
                            style={{
                              animationDelay: `${i * 0.15}s`,
                            }}
                          >
                            {letter === " " ? "\u00A0" : letter}
                          </span>
                        ))}
                      </span>

                      {/* Optimized sparkles for better performance */}
                      {SHINE_CONFIG.showSparkles &&
                        [
                          { x: 95, y: -35, size: 0.8, type: "star" },
                          { x: 75, y: -10, size: 0.6, type: "diamond" },
                          { x: 120, y: 50, size: 0.7, type: "plus" },
                          { x: 90, y: 80, size: 0.9, type: "star" },
                          { x: 25, y: 85, size: 0.5, type: "diamond" },
                          { x: -40, y: 60, size: 0.6, type: "plus" },
                          { x: 165, y: 15, size: 1.0, type: "star" },
                          { x: -20, y: -20, size: 0.7, type: "diamond" },
                        ].map((sparkle, i) => (
                          <div
                            key={`enhanced-sparkle-${i}`}
                            className="absolute pointer-events-none gpu-accelerated"
                            style={{
                              left: `calc(50% + ${sparkle.x}px)`,
                              top: `calc(50% + ${sparkle.y}px)`,
                              animation: `sparkle-enhanced ${6 + (i % 3)}s ease-in-out infinite ${i * 0.5}s`,
                              transform: `translateZ(0) scale(${sparkle.size})`,
                              opacity: 0.6,

                              zIndex: -1,
                              willChange: "transform, opacity",
                            }}
                          >
                            {sparkle.type === "star" && (
                              <div
                                className="w-6 h-6"
                                style={{
                                  background: (() => {
                                    const colors = [
                                      "radial-gradient(circle, rgba(255, 100, 150, 0.8) 0%, rgba(255, 180, 100, 0.5) 70%, transparent 90%)", // Pink-Orange
                                      "radial-gradient(circle, rgba(100, 255, 200, 0.8) 0%, rgba(100, 200, 255, 0.5) 70%, transparent 90%)", // Mint-Blue
                                      "radial-gradient(circle, rgba(200, 100, 255, 0.8) 0%, rgba(255, 150, 200, 0.5) 70%, transparent 90%)", // Purple-Pink
                                      "radial-gradient(circle, rgba(255, 200, 100, 0.8) 0%, rgba(200, 255, 150, 0.5) 70%, transparent 90%)", // Orange-Green
                                    ];
                                    return colors[i % colors.length];
                                  })(),
                                  clipPath:
                                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                                  animation: isMobile
                                    ? "spin-slow 8s linear infinite"
                                    : "spin-slow 15s linear infinite",
                                  filter: "drop-shadow(0 0 8px currentColor)",
                                }}
                              />
                            )}
                            {sparkle.type === "diamond" && (
                              <div
                                className="w-4 h-4"
                                style={{
                                  background: (() => {
                                    const colors = [
                                      "linear-gradient(45deg, rgba(255, 100, 200, 0.7), rgba(100, 255, 150, 0.6))", // Pink-Green
                                      "linear-gradient(45deg, rgba(150, 100, 255, 0.7), rgba(255, 200, 100, 0.6))", // Purple-Orange
                                      "linear-gradient(45deg, rgba(100, 200, 255, 0.7), rgba(255, 150, 100, 0.6))", // Blue-Orange
                                      "linear-gradient(45deg, rgba(200, 255, 100, 0.7), rgba(255, 100, 150, 0.6))", // Green-Pink
                                    ];
                                    return colors[i % colors.length];
                                  })(),
                                  clipPath:
                                    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                                  animation: isMobile
                                    ? "gentle-pulse 3s ease-in-out infinite"
                                    : "gentle-pulse 4s ease-in-out infinite",
                                  filter: "drop-shadow(0 0 6px currentColor)",
                                }}
                              />
                            )}
                            {sparkle.type === "plus" && (
                              <div
                                className="w-5 h-5"
                                style={{
                                  background: (() => {
                                    const colors = [
                                      "conic-gradient(from 0deg, rgba(255, 150, 100, 0.7), rgba(100, 255, 200, 0.6), rgba(200, 100, 255, 0.7), rgba(255, 200, 150, 0.6))", // Warm Rainbow
                                      "conic-gradient(from 90deg, rgba(100, 255, 150, 0.7), rgba(255, 100, 200, 0.6), rgba(150, 200, 255, 0.7), rgba(255, 180, 100, 0.6))", // Cool Rainbow
                                      "conic-gradient(from 180deg, rgba(200, 150, 255, 0.7), rgba(255, 200, 100, 0.6), rgba(100, 255, 180, 0.7), rgba(255, 150, 200, 0.6))", // Pastel Rainbow
                                      "conic-gradient(from 270deg, rgba(255, 200, 150, 0.7), rgba(150, 255, 200, 0.6), rgba(200, 150, 255, 0.7), rgba(255, 180, 150, 0.6))", // Sunset Rainbow
                                    ];
                                    return colors[i % colors.length];
                                  })(),
                                  clipPath:
                                    "polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)",
                                  animation: isMobile
                                    ? "rotate-slow 8s linear infinite"
                                    : "rotate-slow 12s linear infinite",
                                  filter: "drop-shadow(0 0 10px currentColor)",
                                }}
                              />
                            )}
                          </div>
                        ))}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Desktop Orb-Floating Navigation Buttons - positioned relative to orb */}
            <motion.div
              className="flex absolute inset-0 items-center justify-center"
              initial={{
                opacity: 0,
                scale: 0.8,
                filter: "blur(5px)",
              }}
              animate={
                animationStep >= 3
                  ? {
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                    }
                  : {}
              }
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3,
              }}
            >
              <div className="relative">
                {/* Animated Connection Lines Between Buttons */}
                <svg
                  className="absolute inset-0 pointer-events-none"
                  width="600"
                  height="600"
                  style={{ left: "-300px", top: "-300px" }}
                >
                  <circle
                    cx="300"
                    cy="300"
                    r="280"
                    fill="none"
                    stroke="rgba(73, 146, 255, 0.1)"
                    strokeWidth="1"
                    strokeDasharray="5 10"
                    style={{
                      animation: "geometric-pulse 15s ease-in-out infinite",
                    }}
                  />
                  <circle
                    cx="300"
                    cy="300"
                    r="320"
                    fill="none"
                    stroke="rgba(63, 186, 255, 0.08)"
                    strokeWidth="1"
                    strokeDasharray="8 15"
                    style={{
                      animation: "geometric-pulse 20s ease-in-out infinite 2s",
                    }}
                  />
                </svg>
                <OrbFloatingButtons animationStep={animationStep} />
              </div>
            </motion.div>
          </div>

          {/* Floating Decorative Elements */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{
              opacity: 0,
              filter: "blur(10px)",
            }}
            animate={
              animationStep >= 4
                ? {
                    opacity: 1,
                    filter: "blur(0px)",
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.4,
            }}
          >
            {/* Top corner accent lights */}
            <div
              className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(73, 146, 255, 0.2) 0%, transparent 70%)",
                animation: "gentle-glow 8s ease-in-out infinite",
              }}
            />
            <div
              className="absolute top-20 right-16 w-24 h-24 rounded-full opacity-25"
              style={{
                background:
                  "radial-gradient(circle, rgba(63, 186, 255, 0.3) 0%, transparent 70%)",
                animation: "gentle-glow 10s ease-in-out infinite 2s",
              }}
            />

            {/* Bottom corner lights */}
            <div
              className="absolute bottom-16 left-20 w-28 h-28 rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle, rgba(57, 135, 227, 0.4) 0%, transparent 70%)",
                animation: "gentle-glow 14s ease-in-out infinite 4s",
              }}
            />
            <div
              className="absolute bottom-12 right-12 w-20 h-20 rounded-full opacity-35"
              style={{
                background:
                  "radial-gradient(circle, rgba(73, 146, 255, 0.3) 0%, transparent 70%)",
                animation: "gentle-glow 12s ease-in-out infinite 1s",
              }}
            />
          </motion.div>
        </motion.div>

        {/* About Us Section */}
        <motion.div
          className={`max-w-full ${isMobileMenuOpen ? "blur-sm" : ""}`}
          style={{
            display: currentSection === 1 ? "block" : "none",
            width: "100vw",
            maxWidth: "100vw",
            boxSizing: "border-box",
          }}
        >
          <AboutUsSection
            ref={(el) => (sectionsRef.current[1] = el!)}
            theme={theme}
            isVisible={currentSection === 1}
            isMobile={isMobile}
            animationConfig={animationConfig}
          />
        </motion.div>

        {/* Services Section */}
        <motion.div
          className={`max-w-full ${isMobileMenuOpen ? "blur-sm" : ""}`}
          style={{
            display: currentSection === 2 ? "block" : "none",
            width: "100vw",
            maxWidth: "100vw",
            boxSizing: "border-box",
          }}
        >
          <ServicesSection
            ref={(el) => (sectionsRef.current[2] = el!)}
            theme={theme}
            isVisible={currentSection === 2}
            isMobile={isMobile}
            animationConfig={animationConfig}
          />
        </motion.div>

        {/* Portfolio Section */}
        <motion.div
          className={`max-w-full ${isMobileMenuOpen ? "blur-sm" : ""}`}
          style={{
            display: currentSection === 3 ? "block" : "none",
            width: "100vw",
            maxWidth: "100vw",
            boxSizing: "border-box",
          }}
        >
          <PortfolioSection
            ref={(el) => (sectionsRef.current[3] = el!)}
            theme={theme}
            isVisible={currentSection === 3}
            isMobile={isMobile}
            animationConfig={animationConfig}
          />
        </motion.div>

        {/* Contact Us Section */}
        <motion.div
          className={`max-w-full ${isMobileMenuOpen ? "blur-sm" : ""}`}
          style={{
            display: currentSection === 4 ? "block" : "none",
            width: "100vw",
            maxWidth: "100vw",
            boxSizing: "border-box",
          }}
        >
          <ContactUsSection
            ref={(el) => (sectionsRef.current[4] = el!)}
            theme={theme}
            isVisible={currentSection === 4}
            isMobile={isMobile}
            animationConfig={animationConfig}
          />
        </motion.div>
      </div>

      {/* Enhanced Background Animations */}
      <style>{`
        :root {
          --badge-margin-top: 140px;
        }
        @media (min-width: 640px) {
          :root {
            --badge-margin-top: 10px;
          }
        }
        @keyframes backgroundShift {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(10px) translateY(-5px);
          }
          50% {
            transform: translateX(-5px) translateY(10px);
          }
          75% {
            transform: translateX(15px) translateY(5px);
          }
        }

        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px) scale(1.2);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-40px) translateX(-15px) scale(0.8);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-20px) translateX(20px) scale(1.1);
            opacity: 0.3;
          }
        }



        @keyframes noise {
          0%,
          100% {
            opacity: 0.05;
            transform: translateX(0) translateY(0);
          }
          50% {
            opacity: 0.1;
            transform: translateX(2px) translateY(1px);
          }
        }

        .animate-float-particle {
          animation: float-particle linear infinite;
        }



        .animate-noise {
          animation: noise 3s ease-in-out infinite;
        }

        @keyframes shine-left-to-right {
          0% {
            background: linear-gradient(
              90deg,
              rgba(178, 227, 255, 0.7) 0%,
              rgba(178, 227, 255, 0.7) 20%,
              rgba(255, 255, 255, 1) 35%,
              rgba(255, 255, 255, 1) 40%,
              rgba(255, 255, 255, 1) 45%,
              rgba(255, 255, 255, 1) 50%,
              rgba(255, 255, 255, 1) 55%,
              rgba(255, 255, 255, 1) 60%,
              rgba(255, 255, 255, 1) 65%,
              rgba(178, 227, 255, 0.7) 80%,
              rgba(178, 227, 255, 0.7) 100%
            );
            background-size: 400% 100%;
            background-position: -150% 0;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          100% {
            background-position: 250% 0;
          }
        }

        @keyframes shine-right-to-left {
          0% {
            background: linear-gradient(
              90deg,
              rgba(178, 227, 255, 0.7) 0%,
              rgba(178, 227, 255, 0.7) 20%,
              rgba(255, 255, 255, 1) 35%,
              rgba(255, 255, 255, 1) 40%,
              rgba(255, 255, 255, 1) 45%,
              rgba(255, 255, 255, 1) 50%,
              rgba(255, 255, 255, 1) 55%,
              rgba(255, 255, 255, 1) 60%,
              rgba(255, 255, 255, 1) 65%,
              rgba(178, 227, 255, 0.7) 80%,
              rgba(178, 227, 255, 0.7) 100%
            );
            background-size: 400% 100%;
            background-position: 250% 0;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          100% {
            background-position: -150% 0;
          }
        }

        @keyframes sparkle-twinkle {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.9) rotate(0deg);
          }
          25% {
            opacity: 0.8;
            transform: scale(1.1) rotate(90deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.3) rotate(180deg);
          }
          75% {
            opacity: 0.8;
            transform: scale(1.1) rotate(270deg);
          }
        }

        @keyframes text-reveal {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
            text-shadow: 0 0 0px rgba(73, 146, 255, 0);
          }
          50% {
            text-shadow: 0 0 30px rgba(73, 146, 255, 0.8);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
            text-shadow: 0 0 20px rgba(73, 146, 255, 0.4);
          }
        }

        @keyframes text-bounce {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.05);
          }
        }

        @keyframes type-writer {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0px);
          }
        }

        @keyframes fade-in-word {
          0% {
            opacity: 0;
            transform: translateY(10px) blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) blur(0px);
          }
        }

        .shine-text-base {
          background: linear-gradient(
            90deg,
            rgba(178, 227, 255, 0.7) 0%,
            rgba(178, 227, 255, 0.7) 20%,
            rgba(255, 255, 255, 1) 35%,
            rgba(255, 255, 255, 1) 40%,
            rgba(255, 255, 255, 1) 45%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 1) 55%,
            rgba(255, 255, 255, 1) 60%,
            rgba(255, 255, 255, 1) 65%,
            rgba(178, 227, 255, 0.7) 80%,
            rgba(178, 227, 255, 0.7) 100%
          );
          background-size: 400% 100%;
          background-position: 0% 0;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))
            drop-shadow(0 0 40px rgba(34, 211, 238, 0.4));
        }

        .animate-sparkle-twinkle {
          animation: sparkle-twinkle ease-in-out infinite;
        }

        .animate-text-reveal {
          animation: text-reveal 1.5s ease-out forwards;
        }

        .animate-text-bounce {
          animation: text-bounce 2s ease-in-out infinite;
        }

        @keyframes energy-pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes aurora {
          0%,
          100% {
            opacity: 0.4;
            transform: translateX(-50%) translateY(-50%) rotate(0deg) scale(1);
          }
          33% {
            opacity: 0.7;
            transform: translateX(-45%) translateY(-55%) rotate(120deg)
              scale(1.2);
          }
          66% {
            opacity: 0.5;
            transform: translateX(-55%) translateY(-45%) rotate(240deg)
              scale(0.9);
          }
        }

        @keyframes ambient-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(73, 146, 255, 0.3);
          }
          50% {
            box-shadow:
              0 0 40px rgba(73, 146, 255, 0.6),
              0 0 60px rgba(63, 186, 255, 0.3);
          }
        }

        @keyframes energy-ripple {
          0% {
            transform: scale(0.8);
            opacity: 0;
            border-width: 3px;
          }
          30% {
            transform: scale(1);
            opacity: 0.6;
            border-width: 2px;
          }
          70% {
            transform: scale(1.1);
            opacity: 0.3;
            border-width: 1px;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
            border-width: 1px;
          }
        }

        @keyframes subtle-glow {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
        }

        @keyframes gentle-glow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.35;
          }
        }

        .animate-type-writer {
          animation: type-writer 1s ease-out forwards;
        }

        .animate-fade-in-word {
          opacity: 0;
          animation: fade-in-word 0.8s ease-out forwards;
        }

        /* Line clamping utilities */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Mobile responsive utilities */
        @media (max-width: 640px) {
          .mobile-responsive-text {
            font-size: 0.875rem;
            line-height: 1.25rem;
          }

          .mobile-responsive-title {
            font-size: 2rem;
            line-height: 2.5rem;
          }

          .mobile-card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1rem;
            padding: 0 1rem;
          }
        }

        /* Ensure content doesn't overflow on small screens */
        @media (max-width: 768px) {
          .section-container {
            padding-left: 1rem;
            padding-right: 1rem;
            max-width: 100vw;
            overflow-x: hidden;
          }

          .responsive-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        /* Fix text overflow on all sections */
        .section-content {
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* Ensure viewport doesn't overflow */
        html, body {
          max-width: 100vw;
          overflow-x: hidden;
        }

        /* Prevent horizontal scrolling */
        * {
          box-sizing: border-box;
        }

        /* NEW SPECTACULAR ANIMATIONS FOR EYE CANDY */

        @keyframes desktop-float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotateZ(0deg); }
          25% { transform: translateY(-15px) translateX(8px) rotateZ(2deg); }
          50% { transform: translateY(-25px) translateX(-5px) rotateZ(-1deg); }
          75% { transform: translateY(-10px) translateX(12px) rotateZ(3deg); }
        }

        @keyframes desktop-float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotateZ(0deg); }
          25% { transform: translateY(-12px) translateX(-10px) rotateZ(-2deg); }
          50% { transform: translateY(-30px) translateX(8px) rotateZ(1deg); }
          75% { transform: translateY(-8px) translateX(-15px) rotateZ(-3deg); }
        }

        @keyframes desktop-float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotateZ(0deg); }
          25% { transform: translateY(-20px) translateX(6px) rotateZ(1deg); }
          50% { transform: translateY(-15px) translateX(-12px) rotateZ(-2deg); }
          75% { transform: translateY(-25px) translateX(10px) rotateZ(2deg); }
        }

        @keyframes desktop-float-4 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotateZ(0deg); }
          25% { transform: translateY(-18px) translateX(-8px) rotateZ(-1deg); }
          50% { transform: translateY(-22px) translateX(15px) rotateZ(3deg); }
          75% { transform: translateY(-12px) translateX(-6px) rotateZ(-2deg); }
        }

        @keyframes mobile-float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotateZ(0deg); }
          50% { transform: translateY(-10px) translateX(5px) rotateZ(1deg); }
        }

        @keyframes mobile-float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotateZ(0deg); }
          50% { transform: translateY(-8px) translateX(-3px) rotateZ(-1deg); }
        }

        @keyframes mobile-float-3 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotateZ(0deg); }
          50% { transform: translateY(-12px) translateX(4px) rotateZ(2deg); }
        }

        @keyframes desktop-pulse-corner {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
        }

        @keyframes mobile-pulse-corner {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.5; }
          50% { transform: scale(1.1) rotate(90deg); opacity: 0.8; }
        }

        @keyframes mobile-wave-1 {
          0%, 100% { transform: translateX(0px) translateY(0px) skewY(-2deg) rotate(0deg); }
          50% { transform: translateX(10px) translateY(-5px) skewY(-1deg) rotate(1deg); }
        }

        @keyframes mobile-wave-2 {
          0%, 100% { transform: translateX(0px) translateY(0px) skewY(-1deg) rotate(1deg); }
          50% { transform: translateX(-8px) translateY(8px) skewY(0deg) rotate(2deg); }
        }

        @keyframes mobile-wave-3 {
          0%, 100% { transform: translateX(0px) translateY(0px) skewY(0deg) rotate(2deg); }
          50% { transform: translateX(12px) translateY(-3px) skewY(1deg) rotate(3deg); }
        }

        @keyframes aurora-wave-subtle-1 {
          0%, 100% { transform: translateX(-15%) translateY(0%) skewY(-1deg) scale(1); }
          25% { transform: translateX(-12%) translateY(-2%) skewY(-0.5deg) scale(1.05); }
          50% { transform: translateX(-10%) translateY(1%) skewY(0deg) scale(1.1); }
          75% { transform: translateX(-13%) translateY(-1%) skewY(-0.8deg) scale(1.02); }
        }

        @keyframes aurora-wave-subtle-2 {
          0%, 100% { transform: translateX(-20%) translateY(0%) skewY(0.5deg) scale(1); }
          25% { transform: translateX(-18%) translateY(1%) skewY(1deg) scale(1.03); }
          50% { transform: translateX(-15%) translateY(-1%) skewY(0.2deg) scale(1.08); }
          75% { transform: translateX(-22%) translateY(0.5%) skewY(0.8deg) scale(1.01); }
        }

        @keyframes aurora-wave-subtle-3 {
          0%, 100% { transform: translateX(-25%) translateY(0%) skewY(-0.5deg) scale(1); }
          25% { transform: translateX(-20%) translateY(-1%) skewY(0deg) scale(1.02); }
          50% { transform: translateX(-28%) translateY(1%) skewY(-1deg) scale(1.06); }
          75% { transform: translateX(-23%) translateY(-0.5%) skewY(-0.3deg) scale(1.01); }
        }

        @keyframes aurora-base-flow-subtle {
          0%, 100% { transform: translateX(-30%) translateY(0%) skewY(0.3deg) scale(1); }
          25% { transform: translateX(-25%) translateY(-1%) skewY(0.6deg) scale(1.04); }
          50% { transform: translateX(-35%) translateY(0.5%) skewY(0deg) scale(1.08); }
          75% { transform: translateX(-28%) translateY(-0.3%) skewY(0.4deg) scale(1.02); }
        }

        @keyframes desktop-wave-1 {
          0%, 100% { transform: translateX(0px) translateY(0px) skewY(-1.5deg) rotate(0deg); }
          50% { transform: translateX(15px) translateY(-8px) skewY(-1deg) rotate(1.5deg); }
        }

        @keyframes desktop-wave-2 {
          0%, 100% { transform: translateX(0px) translateY(0px) skewY(-1deg) rotate(1.5deg); }
          50% { transform: translateX(-12px) translateY(10px) skewY(-0.5deg) rotate(3deg); }
        }

        @keyframes desktop-wave-3 {
          0%, 100% { transform: translateX(0px) translateY(0px) skewY(-0.5deg) rotate(3deg); }
          50% { transform: translateX(20px) translateY(-5px) skewY(0deg) rotate(4.5deg); }
        }

        @keyframes desktop-wave-4 {
          0%, 100% { transform: translateX(0px) translateY(0px) skewY(0deg) rotate(4.5deg); }
          50% { transform: translateX(-18px) translateY(12px) skewY(0.5deg) rotate(6deg); }
        }

        @keyframes color-shift {
          0%, 100% { filter: hue-rotate(0deg) brightness(1) saturate(1); }
          25% { filter: hue-rotate(90deg) brightness(1.2) saturate(1.3); }
          50% { filter: hue-rotate(180deg) brightness(1.1) saturate(1.1); }
          75% { filter: hue-rotate(270deg) brightness(1.3) saturate(1.2); }
        }

        @keyframes energy-float {
          0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0.6; }
          25% { transform: translateY(-8px) scale(1.1) rotate(90deg); opacity: 0.8; }
          50% { transform: translateY(-12px) scale(1.2) rotate(180deg); opacity: 1; }
          75% { transform: translateY(-6px) scale(1.05) rotate(270deg); opacity: 0.9; }
        }

        @keyframes breath {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
          50% { transform: scale(1.3) rotate(180deg); opacity: 0.6; }
        }

        @keyframes geometric-pulse {
          0%, 100% { opacity: 0.3; stroke-dashoffset: 0; }
          50% { opacity: 0.8; stroke-dashoffset: 15; }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }

        @keyframes warm-glow-pulse {
          0%, 100% { text-shadow: 0 0 10px rgba(73, 146, 255, 0.4), 0 0 20px rgba(34, 211, 238, 0.3); }
          50% { text-shadow: 0 0 20px rgba(73, 146, 255, 0.8), 0 0 40px rgba(34, 211, 238, 0.6), 0 0 60px rgba(147, 51, 234, 0.4); }
        }

        @keyframes letter-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(1deg); }
        }

        @keyframes dev-services-text {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-2px) scale(1.02); }
        }

        @keyframes wavy-text {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes text-pop {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        @keyframes sparkle-enhanced {
          0%, 100% { opacity: 0.4; transform: scale(0.8) rotate(0deg); }
          25% { opacity: 0.8; transform: scale(1.1) rotate(90deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
          75% { opacity: 0.8; transform: scale(1.1) rotate(270deg); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes gentle-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes bubble-pop-in {
          0% { opacity: 0; transform: scale(0.3) translateY(20px); }
          50% { opacity: 0.8; transform: scale(1.1) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0px); }
        }

        @keyframes button-drift {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(3px) translateY(-2px); }
          50% { transform: translateX(-2px) translateY(4px); }
          75% { transform: translateX(4px) translateY(1px); }
        }

        /* Mobile fixes for service cards - fill gaps in corners */
        @media (max-width: 640px) {
          .responsive-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
            width: 100% !important;
            padding: 0 !important;
          }

          .responsive-grid > div {
            width: 100% !important;
            height: 100% !important;
          }

          .responsive-grid > div > div {
            width: 100% !important;
            height: 100% !important;
            min-height: 200px !important;
            border-radius: 0.75rem !important;
          }

          /* iPhone 14 specific optimizations */
          .section-container {
            min-height: 100vh !important;
            padding-top: 3rem !important;
            padding-bottom: 5rem !important;
          }

          .section-content {
            padding-top: 1.5rem !important;
            padding-bottom: 4rem !important;
          }

          /* Reduce vertical spacing on small screens */
          h1 {
            margin-bottom: 1.5rem !important;
          }

          /* Optimize text sizing for readability */
          .warm-glow-text {
            line-height: 1.2 !important;
          }
        }

        /* Improve button tap targets on mobile */
        @media (max-width: 768px) {
          button {
            min-height: 44px;
            min-width: 44px;
          }
        }

        /* Performance optimizations for animations */
        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: transform;
        }

        .composite-layer {
          transform: translateZ(0);
        }

        .scroll-optimized {
          overflow-scrolling: touch;
          -webkit-overflow-scrolling: touch;
        }

        .scroll-simplified * {
          will-change: auto !important;
          animation-play-state: paused !important;
        }

        .warm-glow-text {
          animation: warm-glow-pulse 4s ease-in-out infinite;
        }

        .animate-warm-glow-pulse {
          animation: warm-glow-pulse 4s ease-in-out infinite;
        }

        .animate-letter-float {
          animation: letter-float 3s ease-in-out infinite;
        }

        .animate-dev-services-text {
          animation: dev-services-text 2s ease-in-out infinite;
        }

        .animate-wavy-text {
          animation: wavy-text 2s ease-in-out infinite;
        }

        .animate-text-pop {
          animation: text-pop 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

// Contact Section Specific Animations CSS
const contactAnimationsCSS = `
  @keyframes contact-signal-wave {
    0%, 100% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(2);
      opacity: 0.2;
    }
  }

  @keyframes contact-data-flow {
    0% {
      offset-distance: 0%;
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      offset-distance: 100%;
      opacity: 0;
    }
  }

  @keyframes contact-card-hover {
    0%, 100% {
      transform: translateY(0) rotateX(0);
      opacity: 0.3;
    }
    50% {
      transform: translateY(-10px) rotateX(5deg);
      opacity: 0.8;
    }
  }

  @keyframes contact-frequency {
    0%, 100% {
      height: 10px;
    }
    50% {
      height: 30px;
    }
  }

  @keyframes contact-status-blink {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }

  @keyframes contact-network-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.5);
      opacity: 1;
    }
  }

  @keyframes contact-message-bubble {
    0% {
      transform: translateY(20px) scale(0.8);
      opacity: 0;
    }
    25%, 75% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translateY(-20px) scale(0.8);
      opacity: 0;
    }
  }

  @keyframes contact-social-preview {
    0% {
      transform: rotateY(90deg) scale(0.8);
      opacity: 0;
    }
    25%, 75% {
      transform: rotateY(0deg) scale(1);
      opacity: 0.4;
    }
    100% {
      transform: rotateY(-90deg) scale(0.8);
      opacity: 0;
    }
  }

  @keyframes contact-comm-icon-float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-10px) rotate(5deg);
    }
    50% {
      transform: translateY(-5px) rotate(-3deg);
    }
    75% {
      transform: translateY(-8px) rotate(2deg);
    }
  }

  .animate-contact-signal-wave {
    animation: contact-signal-wave 4s ease-in-out infinite;
  }

  .animate-contact-data-flow {
    animation: contact-data-flow 5s ease-in-out infinite;
  }

  .animate-contact-card-hover {
    animation: contact-card-hover 8s ease-in-out infinite;
  }

  .animate-contact-frequency {
    animation: contact-frequency 1.5s ease-in-out infinite;
  }

  .animate-contact-status-blink {
    animation: contact-status-blink 3s ease-in-out infinite;
  }

  .animate-contact-network-pulse {
    animation: contact-network-pulse 3s ease-in-out infinite;
  }

  .animate-contact-message-bubble {
    animation: contact-message-bubble 4s ease-in-out infinite;
  }

  .animate-contact-social-preview {
    animation: contact-social-preview 6s ease-in-out infinite;
  }

  .animate-contact-comm-icon-float {
    animation: contact-comm-icon-float 6s ease-in-out infinite;
  }

  /* Mobile and Tablet Performance Optimizations */
  @media (max-width: 991px) {
    .animate-noise {
      animation: none !important;
      opacity: 0.02 !important;
    }

    .animate-aurora-wave-subtle,
    .animate-aurora-wave-subtle-1,
    .animate-aurora-wave-subtle-2 {
      animation-duration: 60s !important;
      opacity: 0.3 !important;
    }

    .animate-geometric-pulse {
      animation-duration: 12s !important;
    }

    .animate-gentleFloat {
      animation-duration: 8s !important;
    }

    .animate-sparkle {
      animation: none !important;
    }

    /* Disable complex transforms on mobile */
    .gpu-accelerated {
      transform: none !important;
      will-change: auto !important;
    }
  }

  @media (max-width: 640px) {
    .animate-breath {
      animation-duration: 10s !important;
    }

    .animate-subtle-glow {
      animation-duration: 20s !important;
    }

    /* Further reduce animations on mobile */
    .animate-aurora,
    .animate-aurora-1,
    .animate-aurora-2 {
      animation: none !important;
      opacity: 0.05 !important;
    }
  }

  @keyframes bubble-bounce-enhanced {
    0% {
      transform: translateY(30px) scale(0) rotate(-45deg);
      opacity: 0;
      filter: blur(4px);
    }
    15% {
      transform: translateY(-10px) scale(1.2) rotate(5deg);
      opacity: 1;
      filter: blur(0px);
    }
    30% {
      transform: translateY(5px) scale(0.9) rotate(-2deg);
    }
    45% {
      transform: translateY(-5px) scale(1.1) rotate(0deg);
    }
    85% {
      transform: translateY(-5px) scale(1) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(30px) scale(0) rotate(45deg);
      opacity: 0;
      filter: blur(4px);
    }
  }

  @keyframes bubble-typewriter-enhanced {
    0% {
      transform: translateX(-20px) scale(0.5) rotate(-30deg);
      opacity: 0;
      filter: blur(3px);
    }
    20% {
      transform: translateX(5px) scale(1) rotate(0deg);
      opacity: 1;
      filter: blur(0px);
    }
    80% {
      transform: translateX(0px) scale(1) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateX(20px) scale(0.5) rotate(30deg);
      opacity: 0;
      filter: blur(3px);
    }
  }

  @keyframes bubble-pulse-enhanced {
    0% {
      transform: scale(0.3);
      opacity: 0;
      filter: blur(5px);
    }
    25% {
      transform: scale(0.9);
      opacity: 0.8;
      filter: blur(1px);
    }
    50% {
      transform: scale(1.3);
      opacity: 1;
      filter: blur(0px);
    }
    75% {
      transform: scale(1);
      opacity: 0.8;
      filter: blur(1px);
    }
    100% {
      transform: scale(0.3);
      opacity: 0;
      filter: blur(5px);
    }
  }

  @keyframes bubble-rocket-enhanced {
    0% {
      transform: translateX(-30px) translateY(50px) scale(0.2) rotate(-90deg);
      opacity: 0;
      filter: blur(6px);
    }
    20% {
      transform: translateX(10px) translateY(-15px) scale(1) rotate(-15deg);
      opacity: 1;
      filter: blur(0px);
    }
    40% {
      transform: translateX(-5px) translateY(5px) scale(1) rotate(5deg);
    }
    60% {
      transform: translateX(0px) translateY(-10px) scale(1) rotate(15deg);
    }
    80% {
      transform: translateX(0px) translateY(-10px) scale(1) rotate(15deg);
      opacity: 1;
    }
    100% {
      transform: translateX(30px) translateY(50px) scale(0.2) rotate(90deg);
      opacity: 0;
      filter: blur(6px);
    }
  }

  @keyframes shimmer-effect {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(200%);
    }
  }

  @keyframes particle-trail {
    0% {
      opacity: 0;
      transform: translateX(-10px) scale(0);
    }
    50% {
      opacity: 1;
      transform: translateX(-20px) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(-30px) scale(0);
    }
  }

  @keyframes glow-pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.3;
    }
  }

  .animate-bubble-bounce-enhanced {
    animation: bubble-bounce-enhanced 5s ease-out infinite;
  }

  .animate-bubble-typewriter-enhanced {
    animation: bubble-typewriter-enhanced 5s ease-in-out infinite;
  }

  .animate-bubble-pulse-enhanced {
    animation: bubble-pulse-enhanced 3.5s ease-in-out infinite;
  }

  .animate-bubble-rocket-enhanced {
    animation: bubble-rocket-enhanced 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
  }

  .animate-shimmer-effect {
    animation: shimmer-effect 2s ease-in-out infinite;
  }

  .animate-particle-trail {
    animation: particle-trail 1s ease-out infinite;
  }

  .animate-glow-pulse {
    animation: glow-pulse 2s ease-in-out infinite;
  }
`;

// Inject the CSS into the document head
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = contactAnimationsCSS;
  document.head.appendChild(style);
}

// ========================================
// MOBILE HAMBURGER MENU COMPONENT
// ========================================

interface MobileHamburgerMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  theme: "light" | "dark";
}

function MobileHamburgerMenu({
  isOpen,
  setIsOpen,
  theme,
}: MobileHamburgerMenuProps) {
  const isPinkActive = false; // Pink theme removed
  const [menuPosition, setMenuPosition] = useState({ left: 70, top: -80 });
  const [showTooltip, setShowTooltip] = useState(false);

  const menuItems = [
    { text: "About us" },
    { text: "Services" },
    { text: "Portfolio" },
    { text: "Contact us" },
  ];

  // Calculate safe menu position to avoid screen overflow
  const calculateMenuPosition = () => {
    const menuWidth = 200; // Approximate menu width
    const menuHeight = 280; // Increased height for button-style items
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonX = viewportWidth / 2 + 70; // Button position
    const buttonY = viewportHeight / 2 - 130; // Button position

    let left = 70;
    let top = -80; // Closer to button

    // Check right boundary
    if (buttonX + menuWidth > viewportWidth - 20) {
      left = 70 - (menuWidth + 40); // Move menu to left of button
    }

    // Check bottom boundary
    if (buttonY + menuHeight > viewportHeight - 20) {
      top = -menuHeight - 20; // Move menu above button
    }

    // Check top boundary
    if (buttonY + top < 20) {
      top = 20 - buttonY; // Move menu down to stay in view
    }

    // Check left boundary
    if (buttonX + left < 20) {
      left = 20 - viewportWidth / 2; // Adjust to stay in view
    }

    return { left, top };
  };

  useEffect(() => {
    if (isOpen) {
      const position = calculateMenuPosition();
      setMenuPosition(position);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowTooltip(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button - MOBILE ONLY */}
      <div
        className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 sm:hidden"
        style={{
          marginLeft: "40px", // Mobile: moved left 30px from 70px
          marginTop: "-100px", // Mobile: moved down 30px from -130px
          animationDelay: "0.2s",
          animation:
            "gentleFloat 4s ease-in-out infinite 0.2s, button-drift 8s ease-in-out infinite 0.3s, bubble-pop-in 0.6s ease-out forwards",
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => !isOpen && setShowTooltip(false)}
          className={`group relative px-3 py-3 rounded-xl border-2 backdrop-blur-2xl hover:backdrop-blur-3xl transition-all duration-700 hover:shadow-2xl active:scale-95 overflow-hidden ${
            isPinkActive
              ? "border-pink-400/50 bg-pink-500/10 hover:border-pink-500/70"
              : theme === "light"
                ? "border-blue-400/40 bg-white/30 hover:border-blue-500/60"
                : "border-blue-300/30 bg-blue-400/5 hover:border-white/40"
          }`}
          style={{
            background:
              theme === "light"
                ? `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`
                : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
          }}
        >
          {/* Animated background layers */}
          <div
            className={`absolute inset-0 rounded-xl opacity-50 group-hover:opacity-70 transition-all duration-500 ${
              isPinkActive
                ? "bg-gradient-to-br from-pink-400/30 via-pink-300/15 to-transparent"
                : "bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent"
            }`}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tl from-white/20 via-transparent to-white/10 opacity-30 group-hover:opacity-50 transition-all duration-500" />

          {/* Hamburger Icon */}
          <div className="relative w-6 h-6 flex flex-col justify-center items-center space-y-1">
            <div
              className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5" : ""
              } ${theme === "light" ? "text-gray-800" : "text-white/90"}`}
            />
            <div
              className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                isOpen ? "opacity-0" : ""
              } ${theme === "light" ? "text-gray-800" : "text-white/90"}`}
            />
            <div
              className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-1.5" : ""
              } ${theme === "light" ? "text-gray-800" : "text-white/90"}`}
            />
          </div>

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none z-40"
              >
                <div
                  className={`px-3 py-2 rounded-lg border backdrop-blur-xl text-xs font-medium whitespace-nowrap ${
                    theme === "light"
                      ? "border-blue-400/40 bg-white/80 text-gray-800"
                      : "border-blue-300/30 bg-blue-400/10 text-white/90"
                  }`}
                  style={{
                    background:
                      theme === "light"
                        ? `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)`
                        : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
                    boxShadow: "0 0 15px rgba(73, 146, 255, 0.3)",
                  }}
                >
                  {isOpen ? "Click to close menu" : "Click to open menu"}
                  {/* Tooltip arrow */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                      theme === "light"
                        ? "border-t-white/80"
                        : "border-t-blue-400/10"
                    }`}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Enhanced Backdrop overlay with synchronized menu content */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsOpen(false)}
            style={{
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {/* Mobile Menu Content - Synchronized with backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.05 }}
              className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
              style={{
                marginLeft: `${menuPosition.left}px`,
                marginTop: `${menuPosition.top}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`relative rounded-2xl border-2 p-4 w-[200px] max-w-[90vw] will-change-transform ${
                  theme === "light"
                    ? "border-blue-400/40 bg-white/30"
                    : "border-blue-300/30 bg-blue-400/5"
                }`}
                style={{
                  background:
                    theme === "light"
                      ? `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`
                      : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
                  boxShadow:
                    "0 0 25px rgba(73, 146, 255, 0.4), 0 0 50px rgba(73, 146, 255, 0.2)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                {/* Animated background layers */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent opacity-50" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-white/20 via-transparent to-white/10 opacity-30" />

                {/* Menu Items - Optimized for performance */}
                <div className="relative space-y-2">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.text}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                      className={`group w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 hover:shadow-xl active:scale-95 overflow-hidden relative will-change-transform ${
                        theme === "light"
                          ? "border-blue-400/40 bg-white/30 hover:border-blue-500/60 text-gray-800 hover:text-gray-900"
                          : "border-blue-300/30 bg-blue-400/5 hover:border-white/40 text-white/90 hover:text-white"
                      }`}
                      style={{
                        background:
                          theme === "light"
                            ? `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`
                            : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                      }}
                      onClick={() => {
                        setIsOpen(false);
                        const sectionMap: { [key: string]: number } = {
                          "About us": 1,
                          Services: 2,
                          Portfolio: 3,
                          "Contact us": 4,
                        };
                        const sectionIndex = sectionMap[item.text];
                        if (sectionIndex) {
                          const event = new CustomEvent("scrollToSection", {
                            detail: sectionIndex,
                          });
                          window.dispatchEvent(event);
                        }
                      }}
                    >
                      {/* Simplified background layers for performance */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-200" />

                      {/* Button text */}
                      <span className="relative font-poppins font-semibold text-sm tracking-wide">
                        {item.text}
                      </span>

                      {/* Subtle highlight */}
                      <div className="absolute top-0.5 left-0.5 right-0.5 h-1/3 rounded-xl bg-gradient-to-b from-white/15 via-white/5 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
                    </motion.button>
                  ))}
                </div>

                {/* Holographic shimmer effect */}
                <div className="absolute top-0.5 left-0.5 right-0.5 h-1/3 rounded-2xl bg-gradient-to-b from-white/25 via-white/10 to-transparent opacity-40" />

                {/* Bottom reflection */}
                <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1/4 rounded-2xl bg-gradient-to-t from-white/15 to-transparent opacity-30" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ========================================
// BUTTON POSITIONING CONFIGURATION
// ========================================
// Edit these values to easily adjust button positions

const ORB_BUTTON_CONFIG = {
  // Global settings for all buttons
  global: {
    // Base radius multipliers for different screen sizes - mobile needs smaller radius
    mobileRadiusMultiplier: 0.35, // Compact mobile positioning
    tabletRadiusMultiplier: 0.5, // Moderate tablet positioning
    desktopRadiusMultiplier: 0.7, // Keep desktop positioning unchanged

    // Global animation settings
    animationDuration: "600ms", // How long hover animations take
    hoverScale: 1.15, // How much buttons grow on hover (1.15 = 15% bigger)
  },

  // Individual button configurations
  buttons: [
    {
      text: "About us",
      angle: -30, // Position: top-right, mirrored from Services for symmetry
      radius: 280, // Consistent distance from center
      position: "top-right",
      animationDelay: 0.3,
      size: "medium", // Consistent sizing
      accent: "blue", // Color accent - unified to blue
      onClick: () => {
        console.log("About us clicked");
        scrollToSection(1);
      },

      // Custom positioning for About us button
      xOffset: 0, // Centered positioning
      yOffset: -20, // Better spacing for mobile

      // About us button now uses global positioning for consistency
      customRadiusMultiplier: null, // Use global multipliers for consistency
    },

    {
      text: "Services",
      angle: 30, // Position: bottom-right, mirrored from About us for symmetry
      radius: 280, // Consistent distance from center
      position: "bottom-right",
      animationDelay: 0.6,
      size: "medium", // Consistent sizing
      accent: "blue", // Color accent - unified to blue
      onClick: () => {
        console.log("Services clicked");
        scrollToSection(2);
      },

      // Custom positioning for Services button
      xOffset: 0, // Centered positioning
      yOffset: 10, // Better spacing for mobile

      // Services button now uses global positioning for consistency
      customRadiusMultiplier: null, // Use global multipliers for consistency
    },

    {
      text: "Portfolio",
      angle: 150, // Position: bottom-left, better symmetry
      radius: 280, // Consistent distance from center
      position: "bottom-left",
      animationDelay: 0.9,
      size: "medium", // Consistent sizing for uniform look
      accent: "blue", // Color accent - unified to blue
      onClick: () => {
        console.log("Portfolio clicked");
        scrollToSection(3);
      },

      xOffset: 0, // Centered positioning
      yOffset: 15, // Adjusted for mobile balance

      customRadiusMultiplier: null,
    },

    {
      text: "Contact us",
      angle: -150, // Position: top-left, mirrored from Portfolio for symmetry
      radius: 280, // Consistent distance from center
      position: "top-left",
      animationDelay: 1.2,
      size: "medium", // Consistent sizing
      accent: "blue", // Color accent - unified to blue
      onClick: () => {
        console.log("Contact us clicked");
        scrollToSection(4);
      },

      xOffset: -20, // Mobile-friendly spacing
      yOffset: -75, // Moved up 50px from -25 to -75

      customRadiusMultiplier: null,
    },
  ],
};

// ========================================
// QUICK POSITIONING GUIDE:
// ========================================
//
// ANGLES (degrees around circle):
// -90 or 270 = Top
// 0 = Right
// 90 = Bottom
// 180 or -180 = Left
//
// RADIUS: Distance from center (try values 150-300)
//
// OFFSETS: Fine-tune positioning in pixels
// xOffset: negative = left, positive = right
// yOffset: negative = up, positive = down
//
// SCREEN SIZE MULTIPLIERS:
// 0.5 = half distance, 1.0 = full distance, 1.5 = 50% further
//
// ========================================
// USAGE EXAMPLES:
// ========================================
//
// To move "Services" button 50px to the right:
// Change: xOffset: 0  →  xOffset: 50
//
// To move "About us" button 30px up:
// Change: yOffset: 0  →  yOffset: -30
//
// To make all buttons closer to center on mobile:
// Change: mobileRadiusMultiplier: 0.5  →  mobileRadiusMultiplier: 0.3
//
// To make "Portfolio" button appear at the top:
// Change: angle: 125  →  angle: -90
//
// To make buttons grow more on hover:
// Change: hoverScale: 1.05  �����  hoverScale: 1.15
//
// ========================================

function OrbFloatingButtons({ animationStep }: { animationStep: number }) {
  const { theme } = useTheme();

  // Access the parent component's scrollToSection function
  const scrollToSection = (index: number) => {
    const event = new CustomEvent("scrollToSection", { detail: index });
    window.dispatchEvent(event);
  };
  return (
    <>
      {ORB_BUTTON_CONFIG.buttons.map((button) => (
        <OrbFloatingButton
          key={button.text}
          text={button.text}
          angle={button.angle}
          position={button.position}
          radius={button.radius}
          delay={button.animationDelay}
          xOffset={button.xOffset}
          yOffset={button.yOffset}
          customRadiusMultiplier={button.customRadiusMultiplier}
          size={button.size}
          accent={button.accent}
          theme={theme}
          animationStep={animationStep}
          onClick={() => {
            if (button.text === "About us") scrollToSection(1);
            else if (button.text === "Services") scrollToSection(2);
            else if (button.text === "Portfolio") scrollToSection(3);
            else if (button.text === "Contact us") scrollToSection(4);
            else button.onClick?.();
          }}
        />
      ))}
    </>
  );
}

interface OrbFloatingButtonProps {
  text: string;
  angle: number;
  position: string;
  radius: number;
  delay: number;
  xOffset: number;
  yOffset: number;
  customRadiusMultiplier: number | null;
  size: string;
  accent: string;
  theme: "light" | "dark";
  animationStep: number;
  onClick?: () => void;
}

function OrbFloatingButton({
  text,
  angle,
  position,
  radius,
  delay,
  xOffset,
  yOffset,
  customRadiusMultiplier,
  size,
  accent,
  theme,
  animationStep,
  onClick,
}: OrbFloatingButtonProps) {
  // Only render button if animation step is 4 or higher
  if (animationStep < 4) {
    return null;
  }
  // Calculate base position from angle
  const radian = (angle * Math.PI) / 180;
  const x = Math.cos(radian);
  const y = Math.sin(radian);

  // Get radius multipliers from config or use custom override
  const mobileMultiplier =
    customRadiusMultiplier || ORB_BUTTON_CONFIG.global.mobileRadiusMultiplier;
  const tabletMultiplier =
    customRadiusMultiplier || ORB_BUTTON_CONFIG.global.tabletRadiusMultiplier;
  const desktopMultiplier =
    customRadiusMultiplier || ORB_BUTTON_CONFIG.global.desktopRadiusMultiplier;

  // Size configurations for different button variants - mobile-optimized
  const sizeConfig = {
    small: {
      padding: "px-2 py-1 sm:px-4 sm:py-2 md:px-5 md:py-2.5",
      text: "text-xs sm:text-sm md:text-sm",
      radius: "rounded-md sm:rounded-xl md:rounded-2xl",
      scale: 0.75, // Smaller on mobile
    },
    medium: {
      padding: "px-2 py-1 sm:px-3 sm:py-1.5 md:px-6 md:py-3",
      text: "text-xs sm:text-sm md:text-base",
      radius: "rounded-lg sm:rounded-xl md:rounded-3xl",
      scale: 0.8, // Appropriately sized for mobile
    },
    large: {
      padding: "px-3 py-1.5 sm:px-6 sm:py-3 md:px-8 md:py-4",
      text: "text-sm sm:text-lg md:text-xl",
      radius: "rounded-lg sm:rounded-3xl md:rounded-3xl",
      scale: 0.95, // Smaller on mobile
    },
  };

  // Accent color configurations
  const accentConfig = {
    cyan: {
      glow: "rgba(34, 211, 238, 0.6)",
      gradient: "from-cyan-400/20 via-cyan-300/10 to-transparent",
      shadow:
        "0 0 25px rgba(34, 211, 238, 0.4), 0 0 50px rgba(34, 211, 238, 0.2)",
      border: "border-cyan-300/30",
      bg: "bg-cyan-400/5",
    },
    purple: {
      glow: "rgba(147, 51, 234, 0.6)",
      gradient: "from-purple-400/20 via-purple-300/10 to-transparent",
      shadow:
        "0 0 25px rgba(147, 51, 234, 0.4), 0 0 50px rgba(147, 51, 234, 0.2)",
      border: "border-purple-300/30",
      bg: "bg-purple-400/5",
    },
    blue: {
      glow: "rgba(59, 130, 246, 0.6)",
      gradient: "from-blue-400/20 via-blue-300/10 to-transparent",
      shadow:
        "0 0 25px rgba(59, 130, 246, 0.4), 0 0 50px rgba(59, 130, 246, 0.2)",
      border: "border-blue-300/30",
      bg: "bg-blue-400/5",
    },
    green: {
      glow: "rgba(34, 197, 94, 0.6)",
      gradient: "from-green-400/20 via-green-300/10 to-transparent",
      shadow:
        "0 0 25px rgba(34, 197, 94, 0.4), 0 0 50px rgba(34, 197, 94, 0.2)",
      border: "border-green-300/30",
      bg: "bg-green-400/5",
    },
  };

  const currentSize =
    sizeConfig[size as keyof typeof sizeConfig] || sizeConfig.medium;
  const currentAccent =
    accentConfig[accent as keyof typeof accentConfig] || accentConfig.cyan;

  return (
    <div
      className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] animate-gentleFloat hidden sm:block"
      style={
        {
          "--mobile-x": `${Math.max(-120, Math.min(120, x * radius * mobileMultiplier + xOffset))}px`,
          "--mobile-y": `${Math.max(-120, Math.min(120, y * radius * mobileMultiplier + yOffset))}px`,
          "--tablet-x": `${Math.max(-180, Math.min(180, x * radius * tabletMultiplier + xOffset))}px`,
          "--tablet-y": `${Math.max(-150, Math.min(150, y * radius * tabletMultiplier + yOffset))}px`,
          "--desktop-x": `${x * radius * desktopMultiplier + xOffset}px`,
          "--desktop-y": `${y * radius * desktopMultiplier + yOffset}px`,
          marginLeft: "var(--mobile-x)",
          marginTop: "var(--mobile-y)",
          animationDelay: `${delay}s`,
          transform: `scale(${currentSize.scale})`,
          animation: `gentleFloat 4s ease-in-out infinite ${delay}s, button-drift ${8 + delay * 2}s ease-in-out infinite ${delay * 1.5}s, bubble-pop-in 0.5s ease-out ${0.2 + delay}s both`,
        } as React.CSSProperties
      }
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (min-width: 640px) {
            [style*="--mobile-x"] {
              margin-left: var(--tablet-x) !important;
              margin-top: var(--tablet-y) !important;
            }
          }
          @media (min-width: 1024px) {
            [style*="--mobile-x"] {
              margin-left: var(--desktop-x) !important;
              margin-top: var(--desktop-y) !important;
            }
          }
        `,
        }}
      />
      <button
        className={`group relative cursor-pointer ${currentSize.padding} ${currentSize.radius} border-2 backdrop-blur-2xl hover:backdrop-blur-3xl transition-all duration-700 hover:shadow-2xl active:scale-95 overflow-hidden ${
          theme === "light"
            ? "border-blue-400/40 bg-white/30 hover:border-blue-500/60"
            : "border-blue-300/30 bg-blue-400/5 hover:border-white/40"
        }`}
        style={{
          transitionDuration: ORB_BUTTON_CONFIG.global.animationDuration,
          transform: `scale(1)`,
          background:
            theme === "light"
              ? `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`
              : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
        }}
        onClick={onClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `scale(${ORB_BUTTON_CONFIG.global.hoverScale}) rotateY(5deg)`;
          e.currentTarget.style.boxShadow =
            "0 0 25px rgba(73, 146, 255, 0.4), 0 0 50px rgba(73, 146, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `scale(1) rotateY(0deg)`;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Animated background layers */}
        <div
          className={`absolute inset-0 ${currentSize.radius} bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent opacity-50 group-hover:opacity-70 transition-all duration-500`}
        />
        <div
          className={`absolute inset-0 ${currentSize.radius} bg-gradient-to-tl from-white/20 via-transparent to-white/10 opacity-30 group-hover:opacity-50 transition-all duration-500`}
        />

        {/* Futuristic circuit-like patterns */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500">
          <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full" />
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Holographic scanning line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <div
            className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
            style={{ animationDelay: "0.2s", left: "-50px" }}
          />
        </div>

        {/* Pulsing border effect */}
        <div
          className={`absolute inset-0 ${currentSize.radius} border border-white/10 group-hover:border-white/30 transition-all duration-500 opacity-30`}
          style={{ left: "-50px" }}
        />

        {/* Button text with enhanced styling and glow animation */}
        <span
          className={`relative ${currentSize.text} font-semibold transition-all duration-500 drop-shadow-lg whitespace-nowrap tracking-wide font-poppins ${
            theme === "light"
              ? "text-gray-800 group-hover:text-gray-900"
              : "text-white/90 group-hover:text-white"
          }`}
          style={{
            textShadow:
              theme === "light"
                ? `0 0 10px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)`
                : `0 0 10px rgba(73, 146, 255, 0.6), 0 0 20px rgba(73, 146, 255, 0.4)`,
          }}
        >
          {text}
        </span>

        {/* Enhanced 3D depth effect */}
        <div
          className={`absolute inset-0 ${currentSize.radius} opacity-0 group-hover:opacity-100 transition-all duration-700`}
          style={{
            background: `linear-gradient(145deg, transparent 0%, rgba(73, 146, 255, 0.2) 50%, transparent 100%)`,
            transform: "translateZ(10px)",
          }}
        />

        {/* Holographic shimmer effect */}
        <div
          className={`absolute top-0.5 left-0.5 right-0.5 h-1/3 ${currentSize.radius} bg-gradient-to-b from-white/25 via-white/10 to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500`}
        />

        {/* Bottom reflection */}
        <div
          className={`absolute bottom-0.5 left-0.5 right-0.5 h-1/4 ${currentSize.radius} bg-gradient-to-t from-white/15 to-transparent opacity-30 group-hover:opacity-50 transition-all duration-500`}
        />
      </button>
    </div>
  );
}

// ========================================
// ABOUT US SECTION COMPONENT
// ========================================

interface SectionProps {
  theme: "light" | "dark";
  isVisible: boolean;
  isMobile?: boolean;
  animationConfig?: any;
}

const AboutUsSection = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ theme, isVisible, isMobile = false, animationConfig }, ref) => {
    const [screenSize, setScreenSize] = useState<
      "mobile" | "tablet" | "desktop"
    >("desktop");

    useEffect(() => {
      const updateScreenSize = () => {
        const width = window.innerWidth;
        if (width <= 640) {
          setScreenSize("mobile");
        } else if (width <= 991) {
          setScreenSize("tablet");
        } else {
          setScreenSize("desktop");
        }
      };

      updateScreenSize();
      window.addEventListener("resize", updateScreenSize);
      return () => window.removeEventListener("resize", updateScreenSize);
    }, []);

    const isMobileOrTablet = screenSize !== "desktop";

    return (
      <motion.div
        ref={ref}
        className={`relative min-h-screen max-w-full flex items-center justify-center overflow-hidden ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            : "bg-black"
        }`}
        style={{
          width: "100vw",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Enhanced Background Elements - Complete Visual Package */}

        {/* Animated Noise Texture - Desktop Only */}
        {screenSize === "desktop" && (
          <div
            className="absolute inset-0 opacity-5 animate-noise gpu-accelerated"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* SPECTACULAR ABOUT SECTION ENHANCEMENTS */}

        {/* Floating Code Blocks with Syntax Highlighting Effect - Desktop Only for Performance */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`code-block-${i}`}
                className="absolute"
                style={{
                  left: `${10 + ((i * 75) % 80)}%`,
                  top: `${15 + ((i * 45) % 70)}%`,
                  width: `${60 + (i % 3) * 20}px`,
                  height: `${30 + (i % 2) * 15}px`,
                  opacity: 0.3,
                }}
                animate={{
                  y: [-10, 10, -10],
                  x: [-5, 5, -5],
                  rotateZ: [-2, 2, -2],
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                <div
                  className="w-full h-full rounded-lg border-2 backdrop-blur-sm"
                  style={{
                    background: "rgba(30, 30, 50, 0.6)",
                    border: "2px solid rgba(73, 146, 255, 0.3)",
                    boxShadow: "0 0 15px rgba(73, 146, 255, 0.2)",
                  }}
                >
                  {/* Simulated code lines */}
                  <div className="p-2 space-y-1">
                    {[...Array(2 + (i % 2))].map((_, lineIndex) => (
                      <div
                        key={lineIndex}
                        className="h-1 rounded-full opacity-80"
                        style={{
                          width: `${50 + (((lineIndex + i) * 30) % 50)}%`,
                          background: [
                            "linear-gradient(90deg, #22d3ee, #60a5fa)",
                            "linear-gradient(90deg, #10b981, #22d3ee)",
                            "linear-gradient(90deg, #f59e0b, #ef4444)",
                            "linear-gradient(90deg, #8b5cf6, #ec4899)",
                          ][lineIndex % 4],
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Floating UI Components Preview - Desktop Only for Performance */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              {
                type: "button",
                x: 20,
                y: 25,
                color: "from-blue-500 to-purple-500",
              },
              {
                type: "card",
                x: 75,
                y: 40,
                color: "from-green-500 to-blue-500",
              },
              ...(window.innerWidth >= 992
                ? [
                    {
                      type: "input",
                      x: 15,
                      y: 70,
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      type: "toggle",
                      x: 80,
                      y: 20,
                      color: "from-orange-500 to-red-500",
                    },
                  ]
                : []),
            ].map((component, i) => (
              <motion.div
                key={`ui-component-${i}`}
                className="absolute"
                style={{
                  left: `${component.x}%`,
                  top: `${component.y}%`,
                }}
                animate={
                  window.innerWidth < 992
                    ? {
                        y: [-4, 4, -4],
                      }
                    : {
                        y: [-8, 8, -8],
                        rotateZ: [-1, 1, -1],
                        scale: [0.9, 1.1, 0.9],
                      }
                }
                transition={{
                  duration: window.innerWidth < 992 ? 5 + i : 3 + i,
                  repeat: Infinity,
                  delay: i * 1,
                }}
              >
                <div
                  className={`w-16 h-8 rounded-lg bg-gradient-to-r ${component.color} opacity-40 backdrop-blur-sm border border-white/20`}
                  style={{
                    boxShadow: "0 0 20px rgba(73, 146, 255, 0.3)",
                  }}
                >
                  {component.type === "button" && (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                      BTN
                    </div>
                  )}
                  {component.type === "card" && (
                    <div className="p-1">
                      <div className="h-1 bg-white/40 rounded mb-0.5" />
                      <div className="h-0.5 bg-white/30 rounded w-3/4" />
                    </div>
                  )}
                  {component.type === "input" && (
                    <div className="w-full h-full border-2 border-white/30 rounded-lg bg-white/10" />
                  )}
                  {component.type === "toggle" && (
                    <div className="w-full h-full flex items-center justify-between px-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full" />
                      <div className="w-2 h-2 bg-white/30 rounded-full" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Animated Data Streams - Desktop Only for Performance */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`data-stream-${i}`}
                className="absolute"
                style={{
                  left: `${10 + ((i * 80) % 80)}%`,
                  top: "0%",
                  height: "100%",
                  width: window.innerWidth < 992 ? "1px" : "2px",
                }}
              >
                <motion.div
                  className="w-full rounded-full"
                  style={{
                    height: window.innerWidth < 992 ? "30px" : "40px",
                    opacity: window.innerWidth < 992 ? 0.4 : 0.6,
                    background: `linear-gradient(180deg,
                    rgba(73, 146, 255, 0.8) 0%,
                    rgba(34, 211, 238, 0.6) 50%,
                    transparent 100%)`,
                    boxShadow:
                      window.innerWidth < 992
                        ? "0 0 5px rgba(73, 146, 255, 0.3)"
                        : "0 0 10px rgba(73, 146, 255, 0.4)",
                  }}
                  animate={{
                    y: ["-50px", "calc(100vh + 50px)"],
                  }}
                  transition={{
                    duration:
                      window.innerWidth < 992 ? 5 + (i % 2) : 3 + (i % 3),
                    repeat: Infinity,
                    delay: i * 1,
                    ease: "linear",
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Interactive Holographic Stats Display */}
        <div className="absolute top-20 right-10 hidden lg:block pointer-events-none">
          <motion.div
            className="relative"
            animate={{
              rotateY: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          >
            <div
              className="w-32 h-24 rounded-xl backdrop-blur-lg border opacity-70"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30, 30, 50, 0.7), rgba(10, 10, 30, 0.7))",
                border: "2px solid rgba(73, 146, 255, 0.3)",
                boxShadow: "0 0 30px rgba(73, 146, 255, 0.2)",
              }}
            >
              <div className="p-3">
                <div className="text-xs text-cyan-400 font-mono mb-1">
                  PERFORMANCE
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Speed</span>
                    <span className="text-green-400">99.9%</span>
                  </div>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "99%" }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Quality</span>
                    <span className="text-blue-400">100%</span>
                  </div>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, delay: 1.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Desktop Aurora Curtains */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 hidden lg:block">
          <div
            className="absolute aurora-curtain-1"
            style={{
              top: "20%",
              left: "-15%",
              right: "-15%",
              height: "120px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.4) 15%, rgba(20, 184, 166, 0.5) 30%, rgba(34, 197, 94, 0.4) 50%, rgba(6, 182, 212, 0.5) 70%, rgba(20, 184, 166, 0.4) 85%, transparent 100%)",
              borderRadius: "40% 60% 80% 20% / 60% 40% 80% 20%",
              filter: "blur(15px)",
              animation: "aurora-wave-subtle-1 28s ease-in-out infinite",
              transform: "skewY(-1deg)",
            }}
          />
          <div
            className="absolute aurora-curtain-2"
            style={{
              top: "45%",
              left: "-20%",
              right: "-20%",
              height: "140px",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.35) 10%, rgba(6, 182, 212, 0.45) 25%, rgba(16, 185, 129, 0.4) 40%, rgba(20, 184, 166, 0.45) 60%, rgba(34, 197, 94, 0.4) 75%, rgba(6, 182, 212, 0.35) 90%, transparent 100%)",
              borderRadius: "30% 70% 40% 60% / 70% 30% 60% 40%",
              filter: "blur(18px)",
              animation: "aurora-wave-subtle-2 34s ease-in-out infinite",
              transform: "skewY(0.5deg)",
            }}
          />

          {/* Desktop Floating Energy Orbs */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={`about-desktop-orb-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${8 + ((i * 7) % 84)}%`,
                  top: `${12 + ((i * 11) % 76)}%`,
                  width: `${6 + (i % 4) * 2}px`,
                  height: `${6 + (i % 4) * 2}px`,
                  background: [
                    "radial-gradient(circle, rgba(34, 197, 94, 0.9) 0%, rgba(34, 197, 94, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(59, 130, 246, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(147, 51, 234, 0.9) 0%, rgba(147, 51, 234, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, rgba(236, 72, 153, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(6, 182, 212, 0.9) 0%, rgba(6, 182, 212, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(245, 158, 11, 0.9) 0%, rgba(245, 158, 11, 0.2) 60%, transparent 80%)",
                  ][i % 6],
                  animation: `desktop-float-${(i % 4) + 1} ${4 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
                  filter: `blur(${1 + (i % 2) * 0.5}px)`,
                  boxShadow: `0 0 ${12 + (i % 3) * 6}px currentColor`,
                }}
              />
            ))}
          </div>

          {/* Desktop Pulsing Corner Accents */}
          <div className="absolute top-8 left-8 w-24 h-24 rounded-full opacity-40">
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(59, 130, 246, 0.6) 40%, rgba(147, 51, 234, 0.3) 70%, transparent 90%)",
                animation: "desktop-pulse-corner 4s ease-in-out infinite",
                filter: "blur(6px)",
              }}
            />
          </div>
          <div className="absolute top-8 right-8 w-20 h-20 rounded-full opacity-35">
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(236, 72, 153, 0.6) 40%, rgba(59, 130, 246, 0.3) 70%, transparent 90%)",
                animation:
                  "desktop-pulse-corner 3.5s ease-in-out infinite 0.7s",
                filter: "blur(5px)",
              }}
            />
          </div>
          <div className="absolute bottom-8 left-8 w-28 h-28 rounded-full opacity-45">
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(34, 197, 94, 0.6) 40%, rgba(6, 182, 212, 0.3) 70%, transparent 90%)",
                animation:
                  "desktop-pulse-corner 4.5s ease-in-out infinite 1.2s",
                filter: "blur(7px)",
              }}
            />
          </div>
          <div className="absolute bottom-8 right-8 w-22 h-22 rounded-full opacity-38">
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(245, 158, 11, 0.6) 40%, rgba(34, 197, 94, 0.3) 70%, transparent 90%)",
                animation:
                  "desktop-pulse-corner 3.8s ease-in-out infinite 0.4s",
                filter: "blur(4px)",
              }}
            />
          </div>
        </div>

        {/* Mobile/Tablet Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden lg:hidden">
          {/* Animated Gradient Waves */}
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={`about-mobile-wave-${i}`}
                className="absolute w-full h-32 opacity-40"
                style={{
                  top: `${20 + i * 25}%`,
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    rgba(34, 197, 94, ${0.3 + i * 0.1}) 25%,
                    rgba(59, 130, 246, ${0.4 + i * 0.1}) 50%,
                    rgba(147, 51, 234, ${0.3 + i * 0.1}) 75%,
                    transparent 100%)`,
                  borderRadius: `${60 + i * 10}% ${40 - i * 5}% ${30 + i * 15}% ${70 - i * 10}% / ${50 + i * 20}% ${30 - i * 5}% ${40 + i * 10}% ${60 - i * 15}%`,
                  filter: `blur(${8 + i * 2}px)`,
                  animation: `mobile-wave-${i + 1} ${4 + i}s ease-in-out infinite`,
                  transform: `skewY(${-2 + i}deg) rotate(${i * 2}deg)`,
                }}
              />
            ))}
          </div>

          {/* Mobile Floating Energy Dots */}
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <div
                key={`about-mobile-dot-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${10 + ((i * 11) % 80)}%`,
                  top: `${15 + ((i * 13) % 70)}%`,
                  width: `${4 + (i % 3)}px`,
                  height: `${4 + (i % 3)}px`,
                  background: [
                    "radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, transparent 70%)",
                    "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, transparent 70%)",
                  ][i % 4],
                  animation: `mobile-float-${(i % 3) + 1} ${3 + (i % 2)}s ease-in-out infinite ${i * 0.2}s`,
                  filter: `blur(${0.5 + (i % 2) * 0.5}px)`,
                  boxShadow: `0 0 ${8 + (i % 3) * 4}px currentColor`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Floating Ambient Particles with Color Shifting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full opacity-60"
              style={{
                left: `${5 + ((i * 60) % 95)}%`,
                top: `${10 + ((i * 35) % 85)}%`,
                width: `${1 + (i % 4)}px`,
                height: `${1 + (i % 4)}px`,
                background: `rgba(${73 + ((i * 20) % 50)}, ${146 + ((i * 10) % 30)}, 255, ${0.2 + (i % 4) * 0.15})`,
                animation: `gentleFloat ${3 + (i % 4)}s ease-in-out infinite ${i * 0.3}s, color-shift ${12 + (i % 5)}s ease-in-out infinite ${i * 0.2}s`,
                filter: "blur(0.3px)",
                transform: `scale(${0.5 + (i % 3) * 0.3})`,
              }}
            />
          ))}
        </div>

        {/* Animated Geometric Patterns */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <svg className="absolute w-full h-full" viewBox="0 0 1200 800">
            {/* Animated hexagon grid */}
            {[...Array(4)].map((_, i) => (
              <polygon
                key={`hex-${i}`}
                points="100,20 140,40 140,80 100,100 60,80 60,40"
                fill="none"
                stroke="rgba(73, 146, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray="10 5"
                style={{
                  transform: `translate(${100 + i * 200}px, ${100 + (i % 2) * 150}px)`,
                  animation: `geometric-pulse ${8 + i}s ease-in-out infinite ${i * 0.5}s`,
                }}
              />
            ))}
            {/* Animated connecting lines */}
            {[...Array(4)].map((_, i) => (
              <line
                key={`line-${i}`}
                x1={50 + i * 300}
                y1={200}
                x2={250 + i * 300}
                y2={400}
                stroke="rgba(63, 186, 255, 0.2)"
                strokeWidth="1"
                strokeDasharray="15 10"
                style={{
                  animation: `geometric-pulse ${10 + i * 2}s ease-in-out infinite ${i * 0.7}s`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* Breathing Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={`breath-orb-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${15 + ((i * 80) % 70)}%`,
                top: `${20 + ((i * 60) % 60)}%`,
                width: `${20 + (i % 3) * 15}px`,
                height: `${20 + (i % 3) * 15}px`,
                background: `radial-gradient(circle, rgba(${73 + i * 10}, ${146 + i * 5}, 255, 0.3) 0%, transparent 70%)`,
                animation: `breath ${6 + (i % 4)}s ease-in-out infinite ${i * 0.4}s`,
                filter: `blur(${2 + (i % 3)}px)`,
              }}
            />
          ))}
        </div>

        {/* Dynamic Background Waves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(73, 146, 255, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(63, 186, 255, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(57, 135, 227, 0.1) 0%, transparent 50%)
              `,
              animation: "subtle-glow 12s ease-in-out infinite alternate",
            }}
          />
        </div>

        {/* Aurora-like Moving Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-96 h-96 rounded-full opacity-15"
            style={{
              left: "10%",
              top: "20%",
              background:
                "linear-gradient(45deg, rgba(73, 146, 255, 0.4), rgba(63, 186, 255, 0.2))",
              filter: "blur(60px)",
              animation: "aurora 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full opacity-10"
            style={{
              right: "15%",
              bottom: "25%",
              background:
                "linear-gradient(-45deg, rgba(57, 135, 227, 0.3), rgba(73, 146, 255, 0.1))",
              filter: "blur(80px)",
              animation: "aurora 15s ease-in-out infinite 3s",
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative min-h-screen py-4 sm:py-6 lg:py-8 section-container">
          {/* Text Content */}
          <motion.div
            className="relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto section-content pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16"
            initial={{
              opacity: 0,
              y: 80,
              filter: "blur(10px)",
            }}
            animate={
              isVisible
                ? {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }
                : {}
            }
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
          >
            {/* About Us Title - matching home style */}
            <div className="text-center mb-3 sm:mb-6 lg:mb-8">
              <h1
                className={`font-poppins text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight relative ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                {"About Us".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </h1>
            </div>

            {/* Our Mission - matching development services style */}
            <div className="text-center mb-4 sm:mb-8">
              <div className="relative">
                <div className="font-poppins text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold relative z-10">
                  <span
                    className={`relative inline-block ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                    style={{
                      filter:
                        theme === "light"
                          ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(147, 51, 234, 0.4))`
                          : `drop-shadow(0 0 20px rgba(73, 146, 255, 0.8)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.5))`,
                    }}
                  >
                    <span className="warm-glow-text animate-warm-glow-pulse">
                      {"Crafting Digital Excellence"
                        .split("")
                        .map((letter, i) => (
                          <span
                            key={i}
                            className="animate-letter-float"
                            style={{
                              animationDelay: `${i * 0.1}s`,
                            }}
                          >
                            {letter === " " ? "\u00A0" : letter}
                          </span>
                        ))}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center mt-6 sm:mt-8">
              {/* Left Content */}
              <motion.div
                className="space-y-4 sm:space-y-6 lg:space-y-8 text-left"
                initial={{ x: -50, opacity: 0 }}
                animate={
                  isVisible ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="space-y-4 sm:space-y-6">
                  <p
                    className={`text-sm sm:text-lg leading-relaxed ${
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    }`}
                    style={{
                      textShadow:
                        theme === "dark"
                          ? "0 0 10px rgba(255, 255, 255, 0.1)"
                          : "none",
                    }}
                  >
                    We are a cutting-edge software development company dedicated
                    to transforming innovative ideas into powerful digital
                    solutions. Our team of expert developers, designers, and
                    strategists work collaboratively to deliver exceptional
                    results.
                  </p>
                  <p
                    className={`text-sm sm:text-lg leading-relaxed ${
                      theme === "light" ? "text-gray-600" : "text-gray-300"
                    }`}
                    style={{
                      textShadow:
                        theme === "dark"
                          ? "0 0 10px rgba(255, 255, 255, 0.1)"
                          : "none",
                    }}
                  >
                    With years of experience in modern web development, mobile
                    applications, and AI integration, we bring your vision to
                    life with precision and creativity.
                  </p>
                </div>

                {/* Stats - matching floating button style */}
                <div className="grid grid-cols-3 gap-1 sm:gap-4 lg:gap-6 mt-4 sm:mt-8 lg:mt-12 max-w-4xl mx-auto">
                  {[
                    { number: "100+", label: "Projects" },
                    { number: "50+", label: "Clients" },
                    { number: "5+", label: "Years" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center group cursor-pointer"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={
                        isVisible
                          ? { scale: 1, opacity: 1 }
                          : { scale: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className="relative p-2 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl backdrop-blur-lg border border-white/20 hover:border-blue-400/40 transition-all duration-500"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          boxShadow: "0 0 20px rgba(73, 146, 255, 0.1)",
                        }}
                      >
                        <div
                          className="text-lg sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 warm-glow-text"
                          style={{
                            textShadow: "0 0 15px rgba(73, 146, 255, 0.6)",
                          }}
                        >
                          {stat.number}
                        </div>
                        <div
                          className={`text-xs sm:text-sm font-medium ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                        >
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Content - Modern Software Development Visualization */}
              <motion.div
                className="flex justify-center lg:justify-end lg:pl-8"
                initial={{ x: 50, opacity: 0 }}
                animate={
                  isVisible ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="relative w-full max-w-md h-64 sm:h-80 lg:h-96 lg:ml-12">
                  {/* Main Glass Container */}
                  <div
                    className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-xl border border-white/30"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.1), 0 0 60px rgba(73, 146, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                  >
                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/10" />

                    {/* Code Editor Interface */}
                    <div className="absolute inset-0 p-4 sm:p-6 lg:p-8">
                      {/* Browser-like Header */}
                      <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                        <div className="flex space-x-1.5">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/80" />
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400/80" />
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400/80" />
                        </div>
                        <div className="flex-1 h-6 sm:h-8 bg-white/10 rounded-md ml-3 flex items-center px-3">
                          <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-pulse" />
                          <div className="ml-2 text-xs text-white/60 font-mono">
                            Building amazing software...
                          </div>
                        </div>
                      </div>

                      {/* Code Lines Visualization */}
                      <div className="space-y-2 sm:space-y-3 mb-6">
                        {[
                          {
                            width: "w-3/4",
                            color: "from-blue-400 to-cyan-400",
                            delay: 0,
                          },
                          {
                            width: "w-1/2",
                            color: "from-purple-400 to-pink-400",
                            delay: 0.2,
                          },
                          {
                            width: "w-5/6",
                            color: "from-cyan-400 to-blue-500",
                            delay: 0.4,
                          },
                          {
                            width: "w-2/3",
                            color: "from-green-400 to-blue-400",
                            delay: 0.6,
                          },
                          {
                            width: "w-4/5",
                            color: "from-indigo-400 to-purple-400",
                            delay: 0.8,
                          },
                        ].map((line, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center space-x-2 sm:space-x-3"
                            initial={{ x: -30, opacity: 0 }}
                            animate={
                              isVisible
                                ? { x: 0, opacity: 1 }
                                : { x: -30, opacity: 0 }
                            }
                            transition={{
                              duration: 0.6,
                              delay: 1 + line.delay,
                            }}
                          >
                            <div className="w-4 sm:w-6 text-center">
                              <span className="text-xs text-white/40 font-mono">
                                {i + 1}
                              </span>
                            </div>
                            <div
                              className={`h-2 sm:h-2.5 ${line.width} bg-gradient-to-r ${line.color} rounded-full opacity-80`}
                              style={{
                                boxShadow: "0 0 10px rgba(73, 146, 255, 0.3)",
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Modern Tech Stack Icons */}
                      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                        <div className="grid grid-cols-4 gap-2 sm:gap-3">
                          {[
                            {
                              Icon: Code,
                              label: "React",
                              color: "text-blue-400",
                            },
                            {
                              Icon: Smartphone,
                              label: "Mobile",
                              color: "text-green-400",
                            },
                            {
                              Icon: Zap,
                              label: "AI/ML",
                              color: "text-yellow-400",
                            },
                            {
                              Icon: Globe,
                              label: "Cloud",
                              color: "text-purple-400",
                            },
                          ].map((tech, index) => (
                            <motion.div
                              key={index}
                              className="flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10"
                              initial={{ y: 20, opacity: 0, scale: 0.8 }}
                              animate={
                                isVisible
                                  ? { y: 0, opacity: 1, scale: 1 }
                                  : { y: 20, opacity: 0, scale: 0.8 }
                              }
                              transition={{
                                duration: 0.5,
                                delay: 1.2 + index * 0.1,
                              }}
                              whileHover={{ scale: 1.05, y: -2 }}
                            >
                              <tech.Icon
                                className={`w-4 h-4 sm:w-6 sm:h-6 ${tech.color} mb-1`}
                                style={{
                                  filter: "drop-shadow(0 0 8px currentColor)",
                                }}
                              />
                              <span className="text-[10px] sm:text-xs text-white/70 font-medium">
                                {tech.label}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Floating Particles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={`particle-${i}`}
                          className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-400/40 rounded-full"
                          style={{
                            left: `${20 + ((i * 60) % 60)}%`,
                            top: `${15 + ((i * 45) % 70)}%`,
                            boxShadow: "0 0 6px rgba(73, 146, 255, 0.6)",
                          }}
                          animate={{
                            y: [-5, 5, -5],
                            x: [-3, 3, -3],
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 3 + (i % 3),
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </div>

                    {/* Glass Reflection */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  },
);

// ========================================
// SERVICES SECTION COMPONENT
// ========================================

const ServicesSection = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ theme, isVisible, isMobile = false, animationConfig }, ref) => {
    const [screenSize, setScreenSize] = useState<
      "mobile" | "tablet" | "desktop"
    >("desktop");

    useEffect(() => {
      const updateScreenSize = () => {
        const width = window.innerWidth;
        if (width <= 640) {
          setScreenSize("mobile");
        } else if (width <= 991) {
          setScreenSize("tablet");
        } else {
          setScreenSize("desktop");
        }
      };

      updateScreenSize();
      window.addEventListener("resize", updateScreenSize);
      return () => window.removeEventListener("resize", updateScreenSize);
    }, []);

    const services = [
      {
        icon: Globe,
        title: "Web Development",
        description:
          "Modern, responsive websites built with cutting-edge technologies",
        color: "from-blue-500 to-cyan-500",
      },
      {
        icon: Smartphone,
        title: "Mobile Apps",
        description: "Native and cross-platform mobile applications",
        color: "from-purple-500 to-pink-500",
      },
      {
        icon: Palette,
        title: "UI/UX Design",
        description: "Beautiful, intuitive designs that engage and convert",
        color: "from-green-500 to-emerald-500",
      },
      {
        icon: Zap,
        title: "AI Integration",
        description: "Smart solutions powered by artificial intelligence",
        color: "from-orange-500 to-red-500",
      },
      {
        icon: Users,
        title: "Consulting",
        description: "Strategic guidance for your digital transformation",
        color: "from-indigo-500 to-purple-500",
      },
      {
        icon: Code,
        title: "Custom Solutions",
        description: "Tailored software solutions for unique business needs",
        color: "from-teal-500 to-blue-500",
      },
    ];

    return (
      <motion.div
        ref={ref}
        className={`relative min-h-screen max-w-full flex items-center justify-center overflow-hidden ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            : "bg-black"
        }`}
        style={{
          width: "100vw",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* SPECTACULAR SERVICES SECTION ENHANCEMENTS */}

        {/* Animated Noise Texture */}
        <div
          className="absolute inset-0 opacity-5 animate-noise"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating Service Icons with Orbit Animation - Desktop Only for Performance */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              {
                Icon: Globe,
                color: "from-blue-500 to-cyan-500",
                x: 85,
                y: 20,
                delay: 0,
              },
              {
                Icon: Smartphone,
                color: "from-purple-500 to-pink-500",
                x: 15,
                y: 30,
                delay: 1,
              },
              ...(window.innerWidth >= 992
                ? [
                    {
                      Icon: Palette,
                      color: "from-green-500 to-emerald-500",
                      x: 80,
                      y: 65,
                      delay: 2,
                    },
                    {
                      Icon: Zap,
                      color: "from-orange-500 to-red-500",
                      x: 10,
                      y: 70,
                      delay: 3,
                    },
                    {
                      Icon: Users,
                      color: "from-indigo-500 to-purple-500",
                      x: 85,
                      y: 85,
                      delay: 4,
                    },
                    {
                      Icon: Code,
                      color: "from-teal-500 to-blue-500",
                      x: 15,
                      y: 15,
                      delay: 5,
                    },
                  ]
                : [
                    {
                      Icon: Palette,
                      color: "from-green-500 to-emerald-500",
                      x: 75,
                      y: 75,
                      delay: 2,
                    },
                  ]),
            ].map((service, i) => (
              <motion.div
                key={`floating-service-${i}`}
                className="absolute"
                style={{
                  left: `${service.x}%`,
                  top: `${service.y}%`,
                }}
                animate={
                  window.innerWidth < 992
                    ? {
                        y: [-8, 8, -8],
                      }
                    : {
                        y: [-15, 15, -15],
                        x: [-8, 8, -8],
                        rotateZ: [-10, 10, -10],
                        scale: [0.8, 1.2, 0.8],
                      }
                }
                transition={{
                  duration: window.innerWidth < 992 ? 6 + (i % 2) : 4 + (i % 3),
                  repeat: Infinity,
                  delay: service.delay * (window.innerWidth < 992 ? 1 : 0.5),
                }}
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} opacity-40 backdrop-blur-sm border border-white/30 flex items-center justify-center`}
                  style={{
                    boxShadow: "0 0 30px rgba(73, 146, 255, 0.4)",
                  }}
                >
                  <service.Icon className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Rotating Skill Rings - Desktop Only for Performance */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`skill-ring-${i}`}
                className="absolute rounded-full border-2"
                style={{
                  width:
                    window.innerWidth < 992
                      ? `${250 + i * 80}px`
                      : `${300 + i * 100}px`,
                  height:
                    window.innerWidth < 992
                      ? `${250 + i * 80}px`
                      : `${300 + i * 100}px`,
                  border: `${window.innerWidth < 992 ? "1px" : "2px"} solid rgba(73, 146, 255, ${0.4 - i * 0.1})`,
                  opacity: window.innerWidth < 992 ? 0.15 : 0.2,
                }}
                animate={{
                  rotateZ: i % 2 === 0 ? [0, 360] : [360, 0],
                }}
                transition={{
                  duration: window.innerWidth < 992 ? 30 + i * 15 : 20 + i * 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Skill indicators on the ring - Reduced for mobile */}
                {[...Array(window.innerWidth < 992 ? 4 : 6)].map(
                  (_, skillIndex) => (
                    <motion.div
                      key={`skill-indicator-${i}-${skillIndex}`}
                      className="absolute rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
                      style={{
                        width: window.innerWidth < 992 ? "2px" : "12px",
                        height: window.innerWidth < 992 ? "2px" : "12px",
                        left: `${50 + 45 * Math.cos((skillIndex * (window.innerWidth < 992 ? 90 : 60) * Math.PI) / 180)}%`,
                        top: `${50 + 45 * Math.sin((skillIndex * (window.innerWidth < 992 ? 90 : 60) * Math.PI) / 180)}%`,
                        transform: "translate(-50%, -50%)",
                        boxShadow:
                          window.innerWidth < 992
                            ? "0 0 5px rgba(73, 146, 255, 0.4)"
                            : "0 0 10px rgba(73, 146, 255, 0.6)",
                      }}
                      animate={
                        window.innerWidth < 992
                          ? {
                              opacity: [0.6, 1, 0.6],
                            }
                          : {
                              scale: [0.8, 1.2, 0.8],
                              opacity: [0.4, 1, 0.4],
                            }
                      }
                      transition={{
                        duration: window.innerWidth < 992 ? 3 : 2,
                        repeat: Infinity,
                        delay:
                          skillIndex * (window.innerWidth < 992 ? 0.5 : 0.3),
                      }}
                    />
                  ),
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Technology Stack Visualization */}
        <div className="absolute top-10 left-10 hidden lg:block pointer-events-none">
          <motion.div
            className="relative"
            animate={{
              rotateY: [0, 10, 0, -10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
            }}
          >
            <div
              className="w-40 h-32 rounded-xl backdrop-blur-lg border opacity-70"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(10, 10, 30, 0.8))",
                border: "2px solid rgba(73, 146, 255, 0.3)",
                boxShadow: "0 0 40px rgba(73, 146, 255, 0.3)",
              }}
            >
              <div className="p-3">
                <div className="text-xs text-cyan-400 font-mono mb-2">
                  TECH STACK
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { name: "React", color: "bg-blue-400" },
                    { name: "Node", color: "bg-green-400" },
                    { name: "AI", color: "bg-purple-400" },
                    { name: "Cloud", color: "bg-cyan-400" },
                    { name: "Mobile", color: "bg-pink-400" },
                    { name: "Design", color: "bg-yellow-400" },
                  ].map((tech, techIndex) => (
                    <motion.div
                      key={tech.name}
                      className={`w-6 h-6 ${tech.color} rounded-md flex items-center justify-center text-white text-xs font-bold`}
                      animate={{
                        scale: [1, 1.1, 1],
                        rotateZ: [0, 5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: techIndex * 0.2,
                      }}
                      style={{
                        boxShadow: "0 0 10px rgba(73, 146, 255, 0.3)",
                      }}
                    >
                      {tech.name.slice(0, 2)}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Digital Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`digital-element-${i}`}
              className="absolute opacity-30"
              style={{
                left: `${5 + ((i * 80) % 90)}%`,
                top: `${10 + ((i * 35) % 80)}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                rotateZ: [-15, 15, -15],
              }}
              transition={{
                duration: 5 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >
              <div
                className="w-8 h-8 border-2 border-blue-400/50 backdrop-blur-sm"
                style={{
                  clipPath: [
                    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // Diamond
                    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)", // Octagon
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)", // Star
                  ][i % 3],
                  background: `linear-gradient(135deg, rgba(73, 146, 255, 0.3), rgba(34, 211, 238, 0.3))`,
                  boxShadow: "0 0 15px rgba(73, 146, 255, 0.2)",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Colorful Floating Orbs for Mobile/Tablet (replacing heavy particles) */}
        {screenSize !== "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(screenSize === "tablet" ? 6 : 4)].map((_, i) => (
              <div
                key={`mobile-orb-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${10 + ((i * 70) % 80)}%`,
                  top: `${15 + ((i * 50) % 70)}%`,
                  width: `${screenSize === "tablet" ? 8 + (i % 3) * 2 : 6 + (i % 2)}px`,
                  height: `${screenSize === "tablet" ? 8 + (i % 3) * 2 : 6 + (i % 2)}px`,
                  background: [
                    "radial-gradient(circle, rgba(34, 197, 94, 0.7) 0%, rgba(34, 197, 94, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(59, 130, 246, 0.7) 0%, rgba(59, 130, 246, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(147, 51, 234, 0.7) 0%, rgba(147, 51, 234, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(236, 72, 153, 0.7) 0%, rgba(236, 72, 153, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(6, 182, 212, 0.7) 0%, rgba(6, 182, 212, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(245, 158, 11, 0.7) 0%, rgba(245, 158, 11, 0.2) 60%, transparent 80%)",
                  ][i % 6],
                  animation: `gentleFloat ${4 + (i % 3)}s ease-in-out infinite ${i * 0.5}s`,
                  filter: `blur(${1 + (i % 2) * 0.5}px)`,
                  boxShadow: `0 0 ${8 + (i % 2) * 4}px currentColor`,
                }}
              />
            ))}
          </div>
        )}

        {/* Animated Geometric Patterns - Desktop Only */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <svg className="absolute w-full h-full" viewBox="0 0 1200 800">
              {/* Animated hexagon grid */}
              {[...Array(4)].map((_, i) => (
                <polygon
                  key={`hex-${i}`}
                  points="100,20 140,40 140,80 100,100 60,80 60,40"
                  fill="none"
                  stroke="rgba(73, 146, 255, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="10 5"
                  style={{
                    transform: `translate(${100 + i * 200}px, ${100 + (i % 2) * 150}px)`,
                    animation: `geometric-pulse ${8 + i}s ease-in-out infinite ${i * 0.5}s`,
                  }}
                />
              ))}
              {/* Animated connecting lines */}
              {[...Array(4)].map((_, i) => (
                <line
                  key={`line-${i}`}
                  x1={50 + i * 300}
                  y1={200}
                  x2={250 + i * 300}
                  y2={400}
                  stroke="rgba(63, 186, 255, 0.2)"
                  strokeWidth="1"
                  strokeDasharray="15 10"
                  style={{
                    animation: `geometric-pulse ${10 + i * 2}s ease-in-out infinite ${i * 0.7}s`,
                  }}
                />
              ))}
            </svg>
          </div>
        )}

        {/* Breathing Orbs - Desktop Only */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={`breath-orb-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${15 + ((i * 80) % 70)}%`,
                  top: `${20 + ((i * 60) % 60)}%`,
                  width: `${20 + (i % 3) * 15}px`,
                  height: `${20 + (i % 3) * 15}px`,
                  background: `radial-gradient(circle, rgba(${73 + i * 10}, ${146 + i * 5}, 255, 0.3) 0%, transparent 70%)`,
                  animation: `breath ${6 + (i % 4)}s ease-in-out infinite ${i * 0.4}s`,
                  filter: `blur(${2 + (i % 3)}px)`,
                }}
              />
            ))}
          </div>
        )}

        {/* Dynamic Background Waves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(73, 146, 255, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(63, 186, 255, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(57, 135, 227, 0.1) 0%, transparent 50%)
              `,
              animation: "subtle-glow 12s ease-in-out infinite alternate",
            }}
          />
        </div>

        {/* Aurora-like Moving Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-96 h-96 rounded-full opacity-15"
            style={{
              left: "10%",
              top: "20%",
              background:
                "linear-gradient(45deg, rgba(73, 146, 255, 0.4), rgba(63, 186, 255, 0.2))",
              filter: "blur(60px)",
              animation: "aurora 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full opacity-10"
            style={{
              right: "15%",
              bottom: "25%",
              background:
                "linear-gradient(-45deg, rgba(57, 135, 227, 0.3), rgba(73, 146, 255, 0.1))",
              filter: "blur(80px)",
              animation: "aurora 15s ease-in-out infinite 3s",
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative min-h-screen py-2 sm:py-3 lg:py-4 section-container">
          {/* Text Content */}
          <motion.div
            className="relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto section-content pt-16 sm:pt-20 lg:pt-24 pb-2"
            initial={{
              opacity: 0,
              y: 80,
              filter: "blur(10px)",
            }}
            animate={
              isVisible
                ? {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }
                : {}
            }
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
          >
            {/* Services Title - matching home style */}
            <div className="text-center mb-3">
              <h1
                className={`font-poppins text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight relative mobile-lively-text ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                {"Services".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
            </div>

            {/* Subtitle - matching development services style */}
            <div className="text-center mb-3">
              <div className="relative">
                {/* Background glow effect */}
                <div
                  className="absolute inset-0 blur-3xl opacity-30 animate-pulse-glow"
                  style={{
                    background:
                      theme === "light"
                        ? "radial-gradient(ellipse, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 50%, transparent 70%)"
                        : "radial-gradient(ellipse, rgba(73, 146, 255, 0.6) 0%, rgba(34, 211, 238, 0.4) 50%, transparent 70%)",
                    transform: "scale(1.5)",
                  }}
                />

                {/* Floating energy particles around text - Desktop Only */}
                {screenSize === "desktop" &&
                  [...Array(8)].map((_, i) => (
                    <div
                      key={`energy-${i}`}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        left: `${20 + ((i * 60) % 160)}%`,
                        top: `${30 + ((i * 40) % 60)}%`,
                        width: `${3 + (i % 2)}px`,
                        height: `${3 + (i % 2)}px`,
                        background:
                          theme === "light"
                            ? `rgba(${59 + ((i * 30) % 60)}, ${130 + ((i * 20) % 50)}, 246, ${0.6 + (i % 3) * 0.2})`
                            : `rgba(${73 + ((i * 20) % 50)}, ${146 + ((i * 10) % 30)}, 255, ${0.6 + (i % 3) * 0.2})`,
                        animation: `energy-float ${3 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
                        filter: "blur(0.5px)",

                        animationTimingFunction: "ease-in-out",
                      }}
                    />
                  ))}

                <div className="font-poppins text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold relative z-10">
                  <span
                    className={`relative inline-block ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                    style={{
                      filter:
                        theme === "light"
                          ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(147, 51, 234, 0.4))`
                          : `drop-shadow(0 0 20px rgba(73, 146, 255, 0.8)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.5))`,
                    }}
                  >
                    <span className="warm-glow-text animate-warm-glow-pulse">
                      {"Digital Innovation Solutions"
                        .split("")
                        .map((letter, i) => (
                          <span
                            key={i}
                            className="animate-letter-float"
                            style={{
                              animationDelay: `${i * 0.1}s`,
                            }}
                          >
                            {letter === " " ? "\u00A0" : letter}
                          </span>
                        ))}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="flex justify-center mt-12 sm:mt-16 lg:mt-20">
              <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-3 lg:gap-4 xl:gap-5 responsive-grid w-full max-w-4xl">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={
                      isVisible
                        ? { y: 0, opacity: 1, scale: 1 }
                        : { y: 50, opacity: 0, scale: 0.9 }
                    }
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    {/* Service Card */}
                    <div
                      className="relative p-1 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl backdrop-blur-lg border overflow-hidden transition-all duration-500 h-full mobile-lively-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "2px solid rgba(255, 255, 255, 0.1)",
                        boxShadow: "0 0 40px rgba(73, 146, 255, 0.2)",
                      }}
                    >
                      {/* Animated Background Gradient */}
                      <div
                        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${service.color}`}
                      />

                      {/* Scanning line effect */}
                      <div className="absolute inset-0 overflow-hidden rounded-3xl">
                        <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      </div>

                      {/* Service Title - positioned at top of card */}
                      <div className="relative z-10 mb-1 sm:mb-2 lg:mb-3">
                        <h3
                          className={`text-xs sm:text-sm lg:text-base font-bold warm-glow-text text-center ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}
                          style={{
                            textShadow: "0 0 10px rgba(73, 146, 255, 0.6)",
                          }}
                        >
                          {service.title}
                        </h3>
                      </div>

                      {/* Icon - centered */}
                      <motion.div
                        className="relative z-10 mb-1 sm:mb-2 lg:mb-3 flex justify-center"
                        whileHover={{ rotate: 10, scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl lg:rounded-xl flex items-center justify-center bg-gradient-to-br mobile-lively-icon ${service.color}`}
                          style={{
                            boxShadow: "0 0 20px rgba(73, 146, 255, 0.4)",
                          }}
                        >
                          <service.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                      </motion.div>

                      {/* Description Content */}
                      <div className="relative z-10 text-center">
                        <p
                          className={`text-xs leading-relaxed ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-300"
                          }`}
                          style={{
                            textShadow:
                              theme === "dark"
                                ? "0 0 5px rgba(255, 255, 255, 0.1)"
                                : "none",
                          }}
                        >
                          {service.description}
                        </p>
                      </div>

                      {/* Circuit-like decorative elements */}
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500">
                        <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        <div
                          className="absolute bottom-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        />
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                      </div>

                      {/* Holographic shimmer effect */}
                      <div className="absolute top-0.5 left-0.5 right-0.5 h-1/3 rounded-3xl bg-gradient-to-b from-white/25 via-white/10 to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  },
);

// ========================================
// PORTFOLIO SECTION COMPONENT
// ========================================

const PortfolioSection = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ theme, isVisible, isMobile = false, animationConfig }, ref) => {
    const [currentPage, setCurrentPage] = useState(0);

    // ===== PORTFOLIO PROJECTS =====
    // Easy to add more projects - just add them to this array
    // Page 1: First 4 projects
    // Page 2: Next 4 projects
    // To add more projects, simply add them here and they'll automatically distribute
    const allProjects = [
      // === PAGE 1 PROJECTS ===
      {
        title: "E-Commerce Platform",
        description: "Modern shopping experience with AI recommendations",
        tech: ["React", "Node.js", "AI/ML"],
        image: "from-purple-500 to-pink-500",
      },
      {
        title: "Healthcare App",
        description: "Telemedicine platform connecting patients and doctors",
        tech: ["React Native", "Firebase", "WebRTC"],
        image: "from-green-500 to-emerald-500",
      },
      {
        title: "FinTech Dashboard",
        description: "Real-time financial analytics and trading platform",
        tech: ["Vue.js", "Python", "WebSocket"],
        image: "from-blue-500 to-cyan-500",
      },
      {
        title: "Smart IoT System",
        description: "Connected devices management platform",
        tech: ["Angular", "IoT", "Cloud"],
        image: "from-orange-500 to-red-500",
      },

      // === PAGE 2 PROJECTS ===
      {
        title: "AI Analytics Suite",
        description: "Machine learning powered business intelligence platform",
        tech: ["Python", "TensorFlow", "React"],
        image: "from-indigo-500 to-purple-500",
      },
      {
        title: "Blockchain Wallet",
        description: "Secure cryptocurrency wallet with DeFi integration",
        tech: ["Solidity", "Web3.js", "Next.js"],
        image: "from-yellow-500 to-orange-500",
      },
      {
        title: "Video Streaming App",
        description: "High-performance video platform with live streaming",
        tech: ["React Native", "WebRTC", "Node.js"],
        image: "from-red-500 to-pink-500",
      },
      {
        title: "Cloud Monitoring Tool",
        description: "Real-time infrastructure monitoring and alerting system",
        tech: ["Go", "Docker", "Kubernetes"],
        image: "from-teal-500 to-blue-500",
      },
    ];

    // Responsive projects per page: 2 on mobile/tablet, 3 on desktop
    const [screenSize, setScreenSize] = useState("desktop");

    useEffect(() => {
      const checkScreenSize = () => {
        if (window.innerWidth <= 640) {
          setScreenSize("mobile");
        } else if (window.innerWidth <= 991) {
          setScreenSize("tablet");
        } else {
          setScreenSize("desktop");
        }
      };
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const projectsPerPage = screenSize === "desktop" ? 3 : 2;
    const totalPages = Math.ceil(allProjects.length / projectsPerPage);

    // Get current page projects
    const getCurrentPageProjects = () => {
      const startIndex = currentPage * projectsPerPage;
      return allProjects.slice(startIndex, startIndex + projectsPerPage);
    };

    // Navigation functions - only move if there's somewhere to go
    const nextPage = () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    };

    const prevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };

    return (
      <motion.div
        ref={ref}
        className={`relative min-h-screen max-w-full flex items-center justify-center overflow-hidden ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            : "bg-black"
        }`}
        style={{
          width: "100vw",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* SPECTACULAR PORTFOLIO SECTION ENHANCEMENTS */}

        {/* Animated Noise Texture - Desktop Only */}
        {screenSize === "desktop" && (
          <div
            className="absolute inset-0 opacity-5 animate-noise"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* Desktop Project Screenshots Floating Effect */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              {
                x: 10,
                y: 20,
                rotation: -15,
                color: "from-purple-500 to-pink-500",
              },
              {
                x: 85,
                y: 25,
                rotation: 12,
                color: "from-blue-500 to-cyan-500",
              },
              {
                x: 15,
                y: 70,
                rotation: -8,
                color: "from-green-500 to-emerald-500",
              },
              {
                x: 80,
                y: 75,
                rotation: 18,
                color: "from-orange-500 to-red-500",
              },
            ].map((project, i) => (
              <motion.div
                key={`floating-project-${i}`}
                className="absolute"
                style={{
                  left: `${project.x}%`,
                  top: `${project.y}%`,
                  transform: `rotate(${project.rotation}deg)`,
                  opacity: 0.4,
                }}
                animate={{
                  y: [-10, 10, -10],
                  rotateZ: [
                    project.rotation - 5,
                    project.rotation + 5,
                    project.rotation - 5,
                  ],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                <div
                  className={`w-20 h-16 rounded-lg bg-gradient-to-br ${project.color} backdrop-blur-sm border border-white/30`}
                  style={{
                    boxShadow: "0 0 25px rgba(73, 146, 255, 0.3)",
                  }}
                >
                  {/* Simulated browser interface */}
                  <div className="p-1">
                    <div className="flex space-x-1 mb-1">
                      <div className="w-1 h-1 bg-red-400 rounded-full" />
                      <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                      <div className="w-1 h-1 bg-green-400 rounded-full" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="h-0.5 bg-white/40 rounded w-3/4" />
                      <div className="h-0.5 bg-white/30 rounded w-1/2" />
                      <div className="h-0.5 bg-white/20 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Colorful Floating Orbs for Mobile/Tablet (replacing browser boxes) */}
        {screenSize !== "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(screenSize === "tablet" ? 8 : 6)].map((_, i) => (
              <div
                key={`portfolio-orb-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${5 + ((i * 80) % 90)}%`,
                  top: `${10 + ((i * 60) % 80)}%`,
                  width: `${screenSize === "tablet" ? 10 + (i % 4) * 2 : 8 + (i % 3)}px`,
                  height: `${screenSize === "tablet" ? 10 + (i % 4) * 2 : 8 + (i % 3)}px`,
                  background: [
                    "radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(34, 197, 94, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(147, 51, 234, 0.8) 0%, rgba(147, 51, 234, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(236, 72, 153, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, rgba(6, 182, 212, 0.2) 60%, transparent 80%)",
                    "radial-gradient(circle, rgba(245, 158, 11, 0.8) 0%, rgba(245, 158, 11, 0.2) 60%, transparent 80%)",
                  ][i % 6],
                  animation: `gentleFloat ${5 + (i % 4)}s ease-in-out infinite ${i * 0.7}s`,
                  filter: `blur(${1.5 + (i % 2) * 0.5}px)`,
                  boxShadow: `0 0 ${10 + (i % 3) * 5}px currentColor`,
                }}
              />
            ))}
          </div>
        )}

        {/* Code Repository Visualization */}
        <div className="absolute top-10 right-10 hidden lg:block pointer-events-none">
          <motion.div
            className="relative"
            animate={{
              rotateY: [0, -10, 0, 10, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
            }}
          >
            <div
              className="w-48 h-36 rounded-xl backdrop-blur-lg border opacity-70"
              style={{
                background:
                  "linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(10, 10, 30, 0.8))",
                border: "2px solid rgba(73, 146, 255, 0.3)",
                boxShadow: "0 0 40px rgba(73, 146, 255, 0.3)",
              }}
            >
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-cyan-400 font-mono">
                    REPOSITORY
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <div
                      className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    { lang: "JavaScript", percent: 45, color: "bg-yellow-400" },
                    { lang: "TypeScript", percent: 30, color: "bg-blue-400" },
                    { lang: "CSS", percent: 25, color: "bg-green-400" },
                  ].map((lang, langIndex) => (
                    <div
                      key={lang.lang}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-white/70">{lang.lang}</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${lang.color} rounded-full`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${lang.percent}%` }}
                            transition={{ duration: 2, delay: langIndex * 0.3 }}
                          />
                        </div>
                        <span className="text-white/50">{lang.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="text-xs text-white/50 flex justify-between">
                    <span>Commits: 342</span>
                    <span>Stars: 89</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Achievement Badges - Desktop Only */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              {
                icon: "🏆",
                label: "Award",
                x: 8,
                y: 15,
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: "⭐",
                label: "Featured",
                x: 88,
                y: 18,
                color: "from-blue-500 to-purple-500",
              },
              {
                icon: "🚀",
                label: "Launch",
                x: 12,
                y: 85,
                color: "from-green-500 to-blue-500",
              },
              {
                icon: "💎",
                label: "Premium",
                x: 85,
                y: 82,
                color: "from-purple-500 to-pink-500",
              },
            ].map((badge, i) => (
              <motion.div
                key={`achievement-${i}`}
                className="absolute"
                style={{
                  left: `${badge.x}%`,
                  top: `${badge.y}%`,
                }}
                animate={{
                  y: [-8, 8, -8],
                  rotateZ: [-5, 5, -5],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 3 + (i % 2),
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} opacity-50 backdrop-blur-sm border border-white/30 flex items-center justify-center`}
                  style={{
                    boxShadow: "0 0 20px rgba(73, 146, 255, 0.3)",
                  }}
                >
                  <span className="text-lg">{badge.icon}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Interactive Network Connections - Desktop Only */}
        {screenSize === "desktop" && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute w-full h-full opacity-20">
              {/* Dynamic connecting lines between floating elements */}
              {[...Array(6)].map((_, i) => {
                const startX = 20 + ((i * 120) % 80);
                const startY = 30 + ((i * 80) % 60);
                const endX = 40 + (((i + 1) * 130) % 80);
                const endY = 50 + (((i + 1) * 90) % 60);

                return (
                  <motion.line
                    key={`connection-${i}`}
                    x1={`${startX}%`}
                    y1={`${startY}%`}
                    x2={`${endX}%`}
                    y2={`${endY}%`}
                    stroke="rgba(73, 146, 255, 0.4)"
                    strokeWidth="1"
                    strokeDasharray="5 5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                );
              })}
            </svg>
          </div>
        )}

        {/* Enhanced Floating Ambient Particles with Color Shifting - Reduced for Mobile/Tablet */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            ...Array(
              screenSize === "desktop" ? 12 : screenSize === "tablet" ? 4 : 2,
            ),
          ].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full opacity-60"
              style={{
                left: `${5 + ((i * 60) % 95)}%`,
                top: `${10 + ((i * 35) % 85)}%`,
                width: `${1 + (i % 4)}px`,
                height: `${1 + (i % 4)}px`,
                background: `rgba(${73 + ((i * 20) % 50)}, ${146 + ((i * 10) % 30)}, 255, ${0.2 + (i % 4) * 0.15})`,
                animation: `gentleFloat ${3 + (i % 4)}s ease-in-out infinite ${i * 0.3}s, color-shift ${12 + (i % 5)}s ease-in-out infinite ${i * 0.2}s`,
                filter: "blur(0.3px)",
                transform: `scale(${0.5 + (i % 3) * 0.3})`,
              }}
            />
          ))}
        </div>

        {/* Animated Geometric Patterns */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <svg className="absolute w-full h-full" viewBox="0 0 1200 800">
            {/* Animated hexagon grid */}
            {[...Array(4)].map((_, i) => (
              <polygon
                key={`hex-${i}`}
                points="100,20 140,40 140,80 100,100 60,80 60,40"
                fill="none"
                stroke="rgba(73, 146, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray="10 5"
                style={{
                  transform: `translate(${100 + i * 200}px, ${100 + (i % 2) * 150}px)`,
                  animation: `geometric-pulse ${8 + i}s ease-in-out infinite ${i * 0.5}s`,
                }}
              />
            ))}
            {/* Animated connecting lines */}
            {[...Array(4)].map((_, i) => (
              <line
                key={`line-${i}`}
                x1={50 + i * 300}
                y1={200}
                x2={250 + i * 300}
                y2={400}
                stroke="rgba(63, 186, 255, 0.2)"
                strokeWidth="1"
                strokeDasharray="15 10"
                style={{
                  animation: `geometric-pulse ${10 + i * 2}s ease-in-out infinite ${i * 0.7}s`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* Breathing Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={`breath-orb-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${15 + ((i * 80) % 70)}%`,
                top: `${20 + ((i * 60) % 60)}%`,
                width: `${20 + (i % 3) * 15}px`,
                height: `${20 + (i % 3) * 15}px`,
                background: `radial-gradient(circle, rgba(${73 + i * 10}, ${146 + i * 5}, 255, 0.3) 0%, transparent 70%)`,
                animation: `breath ${6 + (i % 4)}s ease-in-out infinite ${i * 0.4}s`,
                filter: `blur(${2 + (i % 3)}px)`,
              }}
            />
          ))}
        </div>

        {/* Dynamic Background Waves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(73, 146, 255, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(63, 186, 255, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(57, 135, 227, 0.1) 0%, transparent 50%)
              `,
              animation: "subtle-glow 12s ease-in-out infinite alternate",
            }}
          />
        </div>

        {/* Aurora-like Moving Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-96 h-96 rounded-full opacity-15"
            style={{
              left: "10%",
              top: "20%",
              background:
                "linear-gradient(45deg, rgba(73, 146, 255, 0.4), rgba(63, 186, 255, 0.2))",
              filter: "blur(60px)",
              animation: "aurora 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full opacity-10"
            style={{
              right: "15%",
              bottom: "25%",
              background:
                "linear-gradient(-45deg, rgba(57, 135, 227, 0.3), rgba(73, 146, 255, 0.1))",
              filter: "blur(80px)",
              animation: "aurora 15s ease-in-out infinite 3s",
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative min-h-screen py-4 sm:py-6 lg:py-8 section-container">
          <motion.div
            className="relative z-10 px-3 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto section-content pt-16 sm:pt-20 lg:pt-24 pb-4"
            initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
            animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* Portfolio Title */}
            <div className="text-center mb-4 sm:mb-8">
              <h1
                className={`font-poppins text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight relative mobile-lively-text ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                {"Portfolio".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
            </div>

            {/* Subtitle */}
            <div className="text-center mb-10 sm:mb-16">
              <div className="relative">
                <div
                  className="absolute inset-0 blur-3xl opacity-30 animate-pulse-glow"
                  style={{
                    background:
                      theme === "light"
                        ? "radial-gradient(ellipse, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 50%, transparent 70%)"
                        : "radial-gradient(ellipse, rgba(73, 146, 255, 0.6) 0%, rgba(34, 211, 238, 0.4) 50%, transparent 70%)",
                    transform: "scale(1.5)",
                  }}
                />
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`energy-${i}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      left: `${20 + ((i * 60) % 160)}%`,
                      top: `${30 + ((i * 40) % 60)}%`,
                      width: `${3 + (i % 2)}px`,
                      height: `${3 + (i % 2)}px`,
                      background:
                        theme === "light"
                          ? `rgba(${59 + ((i * 30) % 60)}, ${130 + ((i * 20) % 50)}, 246, ${0.6 + (i % 3) * 0.2})`
                          : `rgba(${73 + ((i * 20) % 50)}, ${146 + ((i * 10) % 30)}, 255, ${0.6 + (i % 3) * 0.2})`,
                      animation: `energy-float ${3 + (i % 3)}s ease-in-out infinite ${i * 0.3}s`,
                      filter: "blur(0.5px)",
                    }}
                  />
                ))}
                <div className="font-poppins text-lg sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold relative z-10">
                  <span
                    className={`relative inline-block ${theme === "light" ? "text-gray-900" : "text-white"}`}
                    style={{
                      filter:
                        theme === "light"
                          ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(147, 51, 234, 0.4))`
                          : `drop-shadow(0 0 20px rgba(73, 146, 255, 0.8)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.5))`,
                    }}
                  >
                    <span
                      className={`warm-glow-text ${animationConfig?.enableTextGlow ? "animate-warm-glow-pulse" : ""}`}
                    >
                      {animationConfig?.enableLetterAnimations
                        ? "Our Featured Work".split("").map((letter, i) => (
                            <span
                              key={i}
                              className="animate-letter-float"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            >
                              {letter === " " ? "\u00A0" : letter}
                            </span>
                          ))
                        : "Our Featured Work"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Portfolio Carousel Container */}
            <div className="relative mt-10 sm:mt-16 px-3 sm:px-4">
              {/* Compact Mobile Navigation */}
              <div className="flex justify-center items-center mb-6 sm:mb-8">
                <div
                  className="flex items-center gap-2 sm:gap-4 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-lg border"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 0 15px rgba(73, 146, 255, 0.1)",
                  }}
                >
                  {/* Left Navigation */}
                  <motion.button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className={`group relative p-1 sm:p-1.5 rounded-lg transition-all duration-300 ${
                      currentPage === 0
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:scale-110 cursor-pointer hover:bg-white/5"
                    }`}
                    whileHover={currentPage === 0 ? {} : { scale: 1.1 }}
                    whileTap={currentPage === 0 ? {} : { scale: 0.9 }}
                  >
                    <ChevronLeft
                      className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
                        currentPage === 0
                          ? "text-gray-500"
                          : `${theme === "light" ? "text-gray-700" : "text-white/80"} group-hover:text-blue-400`
                      }`}
                    />
                  </motion.button>

                  {/* Compact Page Indicators */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`transition-all duration-300 rounded-full ${
                          currentPage === index
                            ? "w-4 h-1.5 sm:w-5 sm:h-2 bg-blue-400"
                            : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/20 hover:bg-white/30"
                        }`}
                        style={{
                          boxShadow:
                            currentPage === index
                              ? "0 0 6px rgba(73, 146, 255, 0.6)"
                              : "none",
                        }}
                      />
                    ))}
                  </div>

                  {/* Compact Page Counter */}
                  <span
                    className={`text-[10px] sm:text-xs font-mono px-1.5 py-0.5 rounded-md ${
                      theme === "light" ? "text-gray-600" : "text-white/50"
                    }`}
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {currentPage + 1}/{totalPages}
                  </span>

                  {/* Right Navigation */}
                  <motion.button
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`group relative p-1 sm:p-1.5 rounded-lg transition-all duration-300 ${
                      currentPage === totalPages - 1
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:scale-110 cursor-pointer hover:bg-white/5"
                    }`}
                    whileHover={
                      currentPage === totalPages - 1 ? {} : { scale: 1.1 }
                    }
                    whileTap={
                      currentPage === totalPages - 1 ? {} : { scale: 0.9 }
                    }
                  >
                    <ChevronRight
                      className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${
                        currentPage === totalPages - 1
                          ? "text-gray-500"
                          : `${theme === "light" ? "text-gray-700" : "text-white/80"} group-hover:text-blue-400`
                      }`}
                    />
                  </motion.button>
                </div>
              </div>

              {/* Simple Page Display */}
              <div className="relative">
                <motion.div
                  key={currentPage}
                  className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {getCurrentPageProjects().map((project, index) => (
                    <motion.div
                      key={`page-${currentPage}-${index}`}
                      className="group relative w-full"
                      initial={{ scale: 0.8, opacity: 0, y: 50 }}
                      animate={
                        isVisible
                          ? { scale: 1, opacity: 1, y: 0 }
                          : { scale: 0.8, opacity: 0, y: 50 }
                      }
                      transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -3 }}
                    >
                      <div
                        className="relative p-2 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl backdrop-blur-lg border overflow-hidden transition-all duration-500 h-full mobile-lively-card"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "2px solid rgba(255, 255, 255, 0.1)",
                          boxShadow: "0 0 30px rgba(73, 146, 255, 0.15)",
                        }}
                      >
                        {/* Scanning line effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                        </div>

                        {/* Project Visual - Inspired by the provided image */}
                        <div
                          className="w-full h-32 sm:h-36 rounded-xl mb-4 relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(30, 30, 50, 0.9) 0%, rgba(10, 10, 30, 0.9) 100%)",
                            boxShadow: "0 0 15px rgba(73, 146, 255, 0.25)",
                          }}
                        >
                          {/* Dark mesh background similar to provided image */}
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
                              backgroundSize: "20px 20px",
                            }}
                          />

                          {/* Gradient overlay */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${project.image} opacity-60`}
                          />

                          {/* Scanning effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: "-100%" }}
                            animate={isVisible ? { x: "100%" } : { x: "-100%" }}
                            transition={{
                              duration: 1.5,
                              delay: 0.8 + index * 0.2,
                            }}
                          />

                          {/* Content overlay similar to the provided image style */}
                          <div className="absolute inset-0 flex flex-col justify-between p-3">
                            {/* Top indicator */}
                            <div className="flex justify-between items-start">
                              <div
                                className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"
                                style={{
                                  boxShadow: "0 0 8px rgba(73, 146, 255, 0.8)",
                                }}
                              />
                              <div className="text-xs text-white/60 font-mono">
                                {String(
                                  currentPage * projectsPerPage + index + 1,
                                ).padStart(2, "0")}
                              </div>
                            </div>

                            {/* Bottom status bar */}
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                                  initial={{ width: "0%" }}
                                  animate={
                                    isVisible
                                      ? { width: "75%" }
                                      : { width: "0%" }
                                  }
                                  transition={{
                                    duration: 2,
                                    delay: 1 + index * 0.3,
                                  }}
                                />
                              </div>
                              <div className="text-xs text-white/60 font-mono">
                                LIVE
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Project Info - Compact */}
                        <h3
                          className={`text-base sm:text-lg font-bold mb-2 warm-glow-text ${theme === "light" ? "text-gray-900" : "text-white"} line-clamp-2`}
                          style={{
                            textShadow: "0 0 8px rgba(73, 146, 255, 0.6)",
                          }}
                        >
                          {project.title}
                        </h3>
                        <p
                          className={`text-xs sm:text-sm mb-3 ${theme === "light" ? "text-gray-600" : "text-gray-300"} line-clamp-2`}
                          style={{
                            textShadow:
                              theme === "dark"
                                ? "0 0 5px rgba(255, 255, 255, 0.1)"
                                : "none",
                          }}
                        >
                          {project.description}
                        </p>

                        {/* Tech Stack - Compact */}
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {project.tech.slice(0, 3).map((tech, techIndex) => (
                            <motion.span
                              key={techIndex}
                              className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-lg border"
                              style={{
                                background: "rgba(73, 146, 255, 0.1)",
                                border: "1px solid rgba(73, 146, 255, 0.3)",
                                color:
                                  theme === "light" ? "#1f2937" : "#e5e7eb",
                                boxShadow: "0 0 6px rgba(73, 146, 255, 0.2)",
                              }}
                              initial={{ scale: 0 }}
                              animate={isVisible ? { scale: 1 } : { scale: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: 1 + techIndex * 0.1,
                              }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                          {project.tech.length > 3 && (
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium backdrop-blur-lg border"
                              style={{
                                background: "rgba(73, 146, 255, 0.1)",
                                border: "1px solid rgba(73, 146, 255, 0.3)",
                                color:
                                  theme === "light" ? "#1f2937" : "#e5e7eb",
                              }}
                            >
                              +{project.tech.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Circuit decorations */}
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500">
                          <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                          <div
                            className="absolute bottom-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          />
                          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  },
);

// ========================================
// CONTACT US SECTION COMPONENT
// ========================================

const ContactUsSection = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ theme, isVisible, isMobile = false, animationConfig }, ref) => {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      interest: "",
      budget: "",
      description: "",
    });

    const [selectedInterest, setSelectedInterest] = useState("");
    const [selectedBudget, setSelectedBudget] = useState("");

    const interests = [
      "Web Design",
      "Web Development",
      "Software/App Development",
      "E-commerce Solutions",
      "UI/UX Design",
      "Digital Marketing",
      "Other",
    ];

    const budgets = [
      "$0 - $1K",
      "$1K - $5K",
      "$5K - $10K",
      "$10K - $25K",
      "$25K - $50K",
      "$50K+",
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted:", {
        ...formData,
        interest: selectedInterest,
        budget: selectedBudget,
      });
      // Add your form submission logic here
    };

    const handleInterestSelect = (interest: string) => {
      setSelectedInterest(interest);
      setFormData({ ...formData, interest });
    };

    const handleBudgetSelect = (budget: string) => {
      setSelectedBudget(budget);
      setFormData({ ...formData, budget });
    };

    return (
      <motion.div
        ref={ref}
        className={`relative min-h-screen max-w-full flex items-center justify-center overflow-hidden ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            : "bg-black"
        }`}
        style={{
          width: "100vw",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Enhanced Background Elements - Contact Section Eye Candy */}

        {/* Floating Communication Icons - Contact specific */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-5">
          {[
            { icon: "�����", delay: 0, x: 15, y: 20, size: 24, duration: 8 },
            { icon: "��", delay: 2, x: 85, y: 15, size: 20, duration: 6 },
            { icon: "📱", delay: 4, x: 25, y: 80, size: 22, duration: 7 },
            { icon: "🌐", delay: 1, x: 75, y: 70, size: 26, duration: 9 },
            { icon: "📞", delay: 3, x: 10, y: 60, size: 18, duration: 8 },
            { icon: "💻", delay: 5, x: 90, y: 40, size: 20, duration: 7 },
          ].map((item, i) => (
            <motion.div
              key={`comm-icon-${i}`}
              className="absolute opacity-80"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                fontSize: `${item.size}px`,
              }}
              initial={{ opacity: 0, scale: 0, rotateZ: -45 }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1],
                rotateZ: [0, 10, -10, 0],
                y: [-10, 10, -10],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>

        {/* Animated Noise Texture - Enhanced for contact */}
        {!isMobile && (
          <div
            className="absolute inset-0 opacity-5 animate-noise gpu-accelerated"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* Data Transmission Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute w-full h-full" viewBox="0 0 1200 800">
            {[
              { path: "M100,100 Q300,200 500,150 T900,200", delay: 0 },
              { path: "M200,300 Q400,150 600,250 T1000,180", delay: 2 },
              { path: "M50,500 Q250,350 450,400 T800,350", delay: 4 },
            ].map((line, i) => (
              <g key={`data-line-${i}`}>
                <motion.path
                  d={line.path}
                  stroke="rgba(73, 146, 255, 0.4)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="10 5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 5,
                    delay: line.delay,
                    repeat: Infinity,
                    repeatDelay: 6,
                  }}
                />
                <motion.circle
                  r="4"
                  fill="rgba(63, 186, 255, 0.8)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: ["0%", "100%"] }}
                  transition={{
                    duration: 5,
                    delay: line.delay,
                    repeat: Infinity,
                    repeatDelay: 6,
                  }}
                  style={{ offsetPath: `path('${line.path}')` }}
                />
                \n{" "}
              </g>
            ))}
          </svg>
        </div>

        {/* Floating Contact Cards */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { type: "email", x: 15, y: 35, icon: "������" },
            { type: "call", x: 75, y: 25, icon: "��" },
            { type: "chat", x: 25, y: 70, icon: "💬" },
            { type: "meet", x: 80, y: 65, icon: "🤝" },
          ].map((card, i) => (
            <motion.div
              key={`contact-card-${i}`}
              className="absolute w-16 h-16 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-300/20 flex items-center justify-center"
              style={{
                left: `${card.x}%`,
                top: `${card.y}%`,
              }}
              initial={{ opacity: 0, rotateX: -90, scale: 0.5 }}
              animate={{
                opacity: [0, 0.8, 0],
                rotateX: [-90, 0, 90],
                scale: [0.5, 1, 0.5],
                y: [-20, 0, 20],
              }}
              transition={{
                duration: 8,
                delay: i * 2,
                repeat: Infinity,
                repeatDelay: 10,
              }}
            >
              <span className="text-2xl">{card.icon}</span>
            </motion.div>
          ))}
        </div>

        {/* Live Status Indicators */}
        <div className="absolute top-10 right-10 pointer-events-none">
          <div className="flex flex-col space-y-2 opacity-40">
            {[
              { label: "Online", color: "bg-green-400" },
              { label: "Response: &lt; 24h", color: "bg-blue-400" },
              { label: "Available", color: "bg-purple-400" },
            ].map((status, i) => (
              <motion.div
                key={`status-${i}`}
                className="flex items-center space-x-2 text-xs text-white"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: [0.4, 0.8, 0.4], x: 0 }}
                transition={{
                  duration: 3,
                  delay: i * 0.5,
                  repeat: Infinity,
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full ${status.color} animate-pulse`}
                />
                <span>{status.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Colorful Floating Particles - Mobile Optimized */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            ...Array(
              window.innerWidth < 992
                ? window.innerWidth < 641
                  ? 2
                  : 3
                : animationConfig?.enableBackgroundParticles
                  ? 15
                  : 6,
            ),
          ].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full opacity-70 gpu-accelerated"
              style={{
                left: `${5 + ((i * 60) % 95)}%`,
                top: `${10 + ((i * 35) % 85)}%`,
                width: `${3 + (i % 4)}px`,
                height: `${3 + (i % 4)}px`,
                background: (() => {
                  const colorPalettes = [
                    `radial-gradient(circle, rgba(255, 100, 200, 0.8) 0%, rgba(255, 150, 100, 0.4) 70%, transparent 90%)`, // Pink-Orange
                    `radial-gradient(circle, rgba(100, 255, 150, 0.8) 0%, rgba(100, 200, 255, 0.4) 70%, transparent 90%)`, // Green-Blue
                    `radial-gradient(circle, rgba(200, 100, 255, 0.8) 0%, rgba(255, 200, 100, 0.4) 70%, transparent 90%)`, // Purple-Yellow
                    `radial-gradient(circle, rgba(100, 200, 255, 0.8) 0%, rgba(200, 255, 150, 0.4) 70%, transparent 90%)`, // Blue-Green
                    `radial-gradient(circle, rgba(255, 200, 100, 0.8) 0%, rgba(200, 100, 255, 0.4) 70%, transparent 90%)`, // Orange-Purple
                    `radial-gradient(circle, rgba(255, 150, 200, 0.8) 0%, rgba(150, 255, 200, 0.4) 70%, transparent 90%)`, // Pink-Mint
                  ];
                  return colorPalettes[i % colorPalettes.length];
                })(),
                animation:
                  window.innerWidth < 992
                    ? `gentleFloat ${6 + (i % 2)}s ease-in-out infinite ${i * 0.8}s`
                    : `gentleFloat ${4 + (i % 3)}s ease-in-out infinite ${i * 0.4}s, sparkle ${8 + (i % 4)}s ease-in-out infinite ${i * 0.5}s`,
                filter:
                  window.innerWidth < 992
                    ? "none"
                    : `drop-shadow(0 0 4px currentColor) blur(0.5px)`,
                boxShadow:
                  window.innerWidth < 992
                    ? "none"
                    : `0 0 ${4 + (i % 3) * 2}px rgba(255, 255, 255, 0.3)`,
                transform: `translateZ(0) scale(${window.innerWidth < 992 ? 0.6 : 0.8 + (i % 2) * 0.4})`,
                willChange: window.innerWidth < 992 ? "auto" : "transform",
              }}
            />
          ))}
        </div>

        {/* Animated Geometric Patterns */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <svg className="absolute w-full h-full" viewBox="0 0 1200 800">
            {/* Animated hexagon grid - Full experience */}
            {[...Array(4)].map((_, i) => (
              <polygon
                key={`hex-${i}`}
                points="100,20 140,40 140,80 100,100 60,80 60,40"
                fill="none"
                stroke="rgba(73, 146, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray="10 5"
                style={{
                  transform: `translate(${100 + i * 200}px, ${100 + (i % 2) * 150}px)`,
                  animation: `geometric-pulse ${8 + i}s ease-in-out infinite ${i * 0.5}s`,
                }}
              />
            ))}
            {/* Animated connecting lines - Full experience */}
            {[...Array(4)].map((_, i) => (
              <line
                key={`line-${i}`}
                x1={50 + i * 300}
                y1={200}
                x2={250 + i * 300}
                y2={400}
                stroke="rgba(63, 186, 255, 0.2)"
                strokeWidth="1"
                strokeDasharray="15 10"
                style={{
                  animation: `geometric-pulse ${10 + i * 2}s ease-in-out infinite ${i * 0.7}s`,
                }}
              />
            ))}
            {/* Animated circuit lines for Contact section - Full experience */}
            {[...Array(2)].map((_, i) => (
              <motion.path
                key={`circuit-${i}`}
                d={`M${100 + i * 200},100 L${200 + i * 200},200 L${150 + i * 200},300 L${250 + i * 200},400`}
                stroke="rgba(73, 146, 255, 0.5)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="10 5"
                initial={{ pathLength: 0 }}
                animate={isVisible ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2, delay: i * 0.3 }}
              />
            ))}
          </svg>
        </div>

        {/* Breathing Orbs - Reduced for mobile */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={`breath-orb-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${15 + ((i * 80) % 70)}%`,
                top: `${20 + ((i * 60) % 60)}%`,
                width: `${20 + (i % 3) * 15}px`,
                height: `${20 + (i % 3) * 15}px`,
                background: `radial-gradient(circle, rgba(${73 + i * 10}, ${146 + i * 5}, 255, 0.3) 0%, transparent 70%)`,
                animation: `breath ${6 + (i % 4)}s ease-in-out infinite ${i * 0.4}s`,
                filter: `blur(${2 + (i % 3)}px)`,
              }}
            />
          ))}
        </div>

        {/* Dynamic Background Waves */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(73, 146, 255, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(63, 186, 255, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(57, 135, 227, 0.1) 0%, transparent 50%)
              `,
              animation: "subtle-glow 12s ease-in-out infinite alternate",
            }}
          />
        </div>

        {/* Aurora-like Moving Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-96 h-96 rounded-full opacity-15"
            style={{
              left: "10%",
              top: "20%",
              background:
                "linear-gradient(45deg, rgba(73, 146, 255, 0.4), rgba(63, 186, 255, 0.2))",
              filter: "blur(60px)",
              animation: "aurora 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-80 h-80 rounded-full opacity-10"
            style={{
              right: "15%",
              bottom: "25%",
              background:
                "linear-gradient(-45deg, rgba(57, 135, 227, 0.3), rgba(73, 146, 255, 0.1))",
              filter: "blur(80px)",
              animation: "aurora 15s ease-in-out infinite 3s",
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative min-h-screen py-2 sm:py-4 lg:py-6 section-container">
          <motion.div
            className="relative z-10 px-3 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto section-content pt-1 pb-4"
            initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
            animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* Contact Title */}
            <div className="text-center mb-2 sm:mb-4">
              <h1
                className={`contact-title font-poppins text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight relative mobile-lively-text ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                {"Contact".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animationDelay: `${i * 0.15}s`,
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
            </div>

            {/* Subtitle */}
            <div className="text-center mb-2 sm:mb-3">
              <h2
                className={`text-base sm:text-lg md:text-xl font-medium ${theme === "light" ? "text-gray-700" : "text-white/80"} mb-1`}
              >
                Have a great idea?
              </h2>
              <p
                className={`text-sm sm:text-base font-medium ${theme === "light" ? "text-gray-700" : "text-white/80"}`}
              >
                <span className="warm-glow-text animate-warm-glow-pulse">
                  {"Tell us about it.".split("").map((letter, i) => (
                    <span
                      key={i}
                      className="inline-block relative"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                      }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </span>
                  ))}
                </span>
              </p>
            </div>

            {/* Contact Content Grid */}
            <div className="contact-grid max-w-5xl mx-auto px-1 sm:px-2 mt-1 sm:mt-2">
              {/* Desktop Layout - Form + Sidebar */}
              <div className="hidden lg:grid lg:grid-cols-5 gap-3 sm:gap-4 items-start">
                {/* Main Contact Form - Takes 3 columns */}
                <motion.div
                  className="lg:col-span-3"
                  initial={{ x: -50, opacity: 0 }}
                  animate={
                    isVisible ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }
                  }
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div
                    className="p-2 sm:p-3 lg:p-4 rounded-xl backdrop-blur-lg border"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 0 30px rgba(73, 146, 255, 0.2)",
                    }}
                  >
                    <form
                      onSubmit={handleSubmit}
                      className="contact-form space-y-2 sm:space-y-3"
                    >
                      {/* Name Fields Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <input
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full p-1.5 sm:p-2 rounded-lg border backdrop-blur-lg transition-all duration-200 focus:scale-[1.01] outline-none text-xs sm:text-sm will-change-transform"
                            style={{
                              background: "rgba(255, 255, 255, 0.08)",
                              border: "2px solid rgba(255, 255, 255, 0.15)",
                              color: theme === "light" ? "#1f2937" : "#e5e7eb",
                            }}
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full p-1.5 sm:p-2 rounded-lg border backdrop-blur-lg transition-all duration-200 focus:scale-[1.01] outline-none text-xs sm:text-sm will-change-transform"
                            style={{
                              background: "rgba(255, 255, 255, 0.08)",
                              border: "2px solid rgba(255, 255, 255, 0.15)",
                              color: theme === "light" ? "#1f2937" : "#e5e7eb",
                            }}
                            required
                          />
                        </div>
                      </div>

                      {/* Email and Phone Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <input
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="w-full p-1.5 sm:p-2 rounded-lg border backdrop-blur-lg transition-all duration-200 focus:scale-[1.01] outline-none text-xs sm:text-sm will-change-transform"
                            style={{
                              background: "rgba(255, 255, 255, 0.08)",
                              border: "2px solid rgba(255, 255, 255, 0.15)",
                              color: theme === "light" ? "#1f2937" : "#e5e7eb",
                            }}
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full p-1.5 sm:p-2 rounded-lg border backdrop-blur-lg transition-all duration-200 focus:scale-[1.01] outline-none text-xs sm:text-sm will-change-transform"
                            style={{
                              background: "rgba(255, 255, 255, 0.08)",
                              border: "2px solid rgba(255, 255, 255, 0.15)",
                              color: theme === "light" ? "#1f2937" : "#e5e7eb",
                            }}
                            required
                          />
                        </div>
                      </div>

                      {/* Interest Selection */}
                      <div>
                        <h3
                          className={`text-xs font-medium mb-1.5 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}
                        >
                          I'm interested in...
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
                          {interests.map((interest) => (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => handleInterestSelect(interest)}
                              className={`p-1 sm:p-1.5 text-xs rounded-md border transition-all duration-200 hover:scale-105 will-change-transform ${
                                selectedInterest === interest
                                  ? "border-blue-400 text-blue-400"
                                  : "border-white/20 hover:border-white/40"
                              }`}
                              style={{
                                background:
                                  selectedInterest === interest
                                    ? "rgba(59, 130, 246, 0.1)"
                                    : "rgba(255, 255, 255, 0.05)",
                                color:
                                  selectedInterest === interest
                                    ? theme === "light"
                                      ? "#2563eb"
                                      : "#60a5fa"
                                    : theme === "light"
                                      ? "#4b5563"
                                      : "#d1d5db",
                              }}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Budget Selection */}
                      <div>
                        <h3
                          className={`text-xs font-medium mb-1.5 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}
                        >
                          Project Budget (USD)
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
                          {budgets.map((budget) => (
                            <button
                              key={budget}
                              type="button"
                              onClick={() => handleBudgetSelect(budget)}
                              className={`p-1 sm:p-1.5 text-xs rounded-md border transition-all duration-200 hover:scale-105 will-change-transform ${
                                selectedBudget === budget
                                  ? "border-green-400 text-green-400"
                                  : "border-white/20 hover:border-white/40"
                              }`}
                              style={{
                                background:
                                  selectedBudget === budget
                                    ? "rgba(34, 197, 94, 0.1)"
                                    : "rgba(255, 255, 255, 0.05)",
                                color:
                                  selectedBudget === budget
                                    ? theme === "light"
                                      ? "#059669"
                                      : "#34d399"
                                    : theme === "light"
                                      ? "#4b5563"
                                      : "#d1d5db",
                              }}
                            >
                              {budget}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Project Description */}
                      <div>
                        <h3
                          className={`text-xs font-medium mb-1.5 ${theme === "light" ? "text-gray-700" : "text-white/80"}`}
                        >
                          Tell us more about your project
                        </h3>
                        <textarea
                          placeholder="Something about your great idea..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full p-1.5 sm:p-2 rounded-lg border backdrop-blur-lg transition-all duration-200 focus:scale-[1.01] resize-none outline-none text-xs sm:text-sm will-change-transform"
                          style={{
                            background: "rgba(255, 255, 255, 0.08)",
                            border: "2px solid rgba(255, 255, 255, 0.15)",
                            color: theme === "light" ? "#1f2937" : "#e5e7eb",
                          }}
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        className="w-full p-2 sm:p-3 rounded-xl text-white font-semibold flex items-center justify-center space-x-2 group transition-all duration-200 hover:scale-[1.02] text-xs sm:text-sm will-change-transform"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(73, 146, 255, 0.8), rgba(34, 211, 238, 0.8))",
                          boxShadow: "0 0 30px rgba(73, 146, 255, 0.4)",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span>Submit Your Request</span>
                      </motion.button>
                    </form>
                  </div>
                </motion.div>

                {/* Desktop Sidebar */}
                <motion.div
                  className="lg:col-span-2"
                  initial={{ x: 50, opacity: 0 }}
                  animate={
                    isVisible ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                  }
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <div className="space-y-4">
                    {/* Message Us Header */}
                    <div>
                      <h3
                        className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}
                      >
                        Message us:
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          {
                            name: "Instagram",
                            url: "https://instagram.com",
                            icon: "📷",
                            color: "from-pink-500 to-purple-500",
                          },
                          {
                            name: "Discord",
                            url: "https://discord.com",
                            icon: "��",
                            color: "from-indigo-500 to-blue-500",
                          },
                          {
                            name: "Telegram",
                            url: "https://telegram.org",
                            icon: "��",
                            color: "from-blue-500 to-cyan-500",
                          },
                        ].map((social) => (
                          <motion.button
                            key={social.name}
                            onClick={() => window.open(social.url, "_blank")}
                            className="group relative p-2 rounded-lg backdrop-blur-lg border transition-all duration-200 hover:scale-[1.02] overflow-hidden will-change-transform text-left"
                            style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "2px solid rgba(255, 255, 255, 0.1)",
                              boxShadow: "0 0 20px rgba(73, 146, 255, 0.1)",
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Animated background gradient */}
                            <div
                              className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${social.color}`}
                            />

                            {/* Scanning line effect */}
                            <div className="absolute inset-0 overflow-hidden rounded-xl">
                              <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            </div>

                            <div className="flex items-center space-x-2 relative z-10">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center`}
                              >
                                <span className="text-white text-sm">
                                  {social.icon}
                                </span>
                              </div>
                              <div>
                                <p
                                  className={`font-medium text-xs ${theme === "light" ? "text-gray-900" : "text-white"} group-hover:text-blue-300 transition-colors duration-300`}
                                >
                                  {social.name}
                                </p>
                                <p
                                  className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                                >
                                  Message us on {social.name}
                                </p>
                              </div>
                            </div>

                            {/* Circuit decorations */}
                            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500">
                              <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                              <div
                                className="absolute bottom-1 left-1 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                                style={{ animationDelay: "0.5s" }}
                              />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Contact Us Header */}
                    <div>
                      <h3
                        className={`text-sm font-semibold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}
                      >
                        Contact us:
                      </h3>
                      <div
                        className="p-2 rounded-lg backdrop-blur-lg border"
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "2px solid rgba(255, 255, 255, 0.1)",
                          boxShadow: "0 0 20px rgba(73, 146, 255, 0.1)",
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Mail className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <p
                              className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                            >
                              Email us at
                            </p>
                            <p
                              className={`font-medium text-xs ${theme === "light" ? "text-gray-900" : "text-white"}`}
                            >
                              contact@kor.dev
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Mobile/Tablet Layout - Social Buttons Only */}
              <motion.div
                className="lg:hidden"
                initial={{ y: 50, opacity: 0 }}
                animate={
                  isVisible ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="space-y-6">
                  {/* Mobile Contact Header */}
                  <div className="text-center">
                    <h3
                      className={`text-lg sm:text-xl font-semibold mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}
                    >
                      Get in touch
                    </h3>
                    <p
                      className={`text-sm sm:text-base ${theme === "light" ? "text-gray-600" : "text-white/60"}`}
                    >
                      Choose your preferred way to reach us
                    </p>
                  </div>

                  {/* Social Media Buttons - Redesigned for Mobile */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        name: "Instagram",
                        subtitle: "Follow us for updates",
                        url: "https://instagram.com",
                        icon: "📷",
                        color: "from-pink-500 via-purple-500 to-indigo-500",
                        shadowColor: "rgba(236, 72, 153, 0.3)",
                      },
                      {
                        name: "Discord",
                        subtitle: "Join our community",
                        url: "https://discord.com",
                        icon: "💬",
                        color: "from-indigo-500 via-blue-500 to-purple-500",
                        shadowColor: "rgba(99, 102, 241, 0.3)",
                      },
                      {
                        name: "Telegram",
                        subtitle: "Quick messaging",
                        url: "https://telegram.org",
                        icon: "����",
                        color: "from-blue-500 via-cyan-500 to-teal-500",
                        shadowColor: "rgba(34, 211, 238, 0.3)",
                      },
                      {
                        name: "Email",
                        subtitle: "contact@kor.dev",
                        url: "mailto:contact@kor.dev",
                        icon: "✉�������",
                        color: "from-emerald-500 via-green-500 to-lime-500",
                        shadowColor: "rgba(16, 185, 129, 0.3)",
                      },
                    ].map((contact, index) => (
                      <motion.button
                        key={contact.name}
                        onClick={() => window.open(contact.url, "_blank")}
                        className="group relative rounded-2xl backdrop-blur-lg border transition-all duration-300 hover:scale-[1.02] overflow-hidden will-change-transform p-4 sm:p-6 mobile-lively-float"
                        style={{
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "2px solid rgba(255, 255, 255, 0.15)",
                          boxShadow: `0 0 40px ${contact.shadowColor}`,
                        }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Animated background gradient */}
                        <div
                          className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-500 bg-gradient-to-br ${contact.color}`}
                        />

                        {/* Scanning line effect */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                        </div>

                        {/* Main Content - Responsive Layout */}
                        <div className="relative z-10">
                          {/* Unified Layout for all devices */}
                          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-2 sm:space-y-0 sm:space-x-4">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center shadow-lg`}
                              style={{
                                boxShadow: `0 6px 20px ${contact.shadowColor}`,
                              }}
                            >
                              <span className="text-white text-lg animate-gentleBounce">
                                {contact.icon}
                              </span>
                            </div>
                            <div>
                              <h4
                                className={`font-bold text-sm ${theme === "light" ? "text-gray-900" : "text-white"} group-hover:text-blue-300 transition-colors duration-300`}
                              >
                                {contact.name}
                              </h4>
                              <p
                                className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"} group-hover:text-blue-200 transition-colors duration-300 mt-1`}
                              >
                                {contact.name === "Email"
                                  ? "contact@kor.dev"
                                  : contact.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Unified Layout - now visible on all devices */}
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center shadow-lg`}
                              style={{
                                boxShadow: `0 8px 25px ${contact.shadowColor}`,
                              }}
                            >
                              <span className="text-white text-2xl animate-gentleBounce">
                                {contact.icon}
                              </span>
                            </div>
                            <div className="flex-1 text-left">
                              <h4
                                className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"} group-hover:text-blue-300 transition-colors duration-300`}
                              >
                                {contact.name}
                              </h4>
                              <p
                                className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"} group-hover:text-blue-200 transition-colors duration-300`}
                              >
                                {contact.subtitle}
                              </p>
                            </div>
                            <div className="text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Circuit decorations */}
                        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500">
                          <div className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse" />
                          <div
                            className="absolute bottom-2 left-2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          />
                          <div
                            className="absolute top-1/2 right-4 sm:right-6 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-purple-400 rounded-full animate-pulse"
                            style={{ animationDelay: "1s" }}
                          />
                        </div>

                        {/* Glow effect */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                          style={{
                            background: `radial-gradient(circle at center, ${contact.shadowColor}, transparent 70%)`,
                          }}
                        />
                      </motion.button>
                    ))}
                  </div>

                  {/* Additional Info for Mobile */}
                  <div className="text-center pt-4">
                    <p
                      className={`text-xs ${theme === "light" ? "text-gray-500" : "text-white/40"}`}
                    >
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  },
);
