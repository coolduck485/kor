import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RetroToggle } from "@/components/ui/retro-toggle";
import { useTheme } from "@/hooks/use-theme";
import { useRetroMode } from "@/hooks/use-retro-mode";
import { useFloatingNotifications } from "@/hooks/use-floating-notifications";
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
  const { showSuccess, showError, showWarning, showInfo } =
    useFloatingNotifications();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [badgeMousePosition, setBadgeMousePosition] = useState({
    x: 0,
    y: 0,
    isNear: false,
  });
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animationStep, setAnimationStep] = useState(0); // 0: initial, 1: orb, 2: text, 3: buttons, 4: background, 5: complete
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [previousMode, setPreviousMode] = useState(mode);
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(false);
  const hasShownWelcomeRef = useRef(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Welcome notification - shows once per page load
  useEffect(() => {
    // Temporarily disabled to test button functionality
    // if (animationStep >= 2 && !hasShownWelcomeRef.current) {
    //   hasShownWelcomeRef.current = true;
    //   setTimeout(() => {
    //     showInfo(
    //       "Welcome to KOR!",
    //       "Experience the future of modern web development. Click the X to dismiss.",
    //     );
    //   }, 3000);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationStep]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Type 'help' to see list of available commands.",
  ]);
  const [systemStats, setSystemStats] = useState({
    networkUp: 1.2,
    networkDown: 847,
  });

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const slideInFromSide = (direction: "left" | "right") => ({
    hidden: {
      opacity: 0,
      x: direction === "left" ? -100 : 100,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  });

  const staggeredLetters = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const triggerLoadingSequence = () => {
    setIsLoading(true);
    setIsLoaded(false);
    setAnimationStep(0);

    const animationSequence = [
      { delay: 300, step: 1 }, // Show central orb
      { delay: 800, step: 2 }, // Show text (KOR + subtitle)
      { delay: 1400, step: 3 }, // Show buttons one by one
      { delay: 2000, step: 4 }, // Show background elements
      { delay: 2600, step: 5 }, // Complete - show everything else
    ];

    const timeouts = animationSequence.map(({ delay, step }) =>
      setTimeout(() => {
        setAnimationStep(step);
        if (step === 5) {
          setIsLoading(false);
          setTimeout(() => setIsLoaded(true), 200);
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

    window.addEventListener("mousemove", handleMouseMove);

    // Initial loading sequence
    const timeouts = triggerLoadingSequence();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Trigger loading animation when switching modes
  useEffect(() => {
    if (previousMode !== mode) {
      setPreviousMode(mode);
      // Only trigger loading if it's not the initial load
      if (previousMode !== null) {
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

  // Scroll to section function
  const scrollToSection = (index: number) => {
    if (isScrolling || !containerRef.current) return;

    setIsScrolling(true);
    setCurrentSection(index);

    const targetSection = sectionsRef.current[index];
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setTimeout(() => setIsScrolling(false), 1000);
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

  // Handle touch scroll for mobile
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling || mode === "retro") return;

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < sections.length - 1) {
          scrollToSection(currentSection + 1);
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
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
                    className="font-mono text-4xl md:text-6xl lg:text-7xl font-bold text-green-400"
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
                      ��
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
                  {`██╗  ██╗ ██████╗ ████���█╗
██║ ██╔╝██╔═══██╗██╔═══██╗
█████╔╝ ██���   ██║██████╔╝
██╔═██╗ ██║   ██║██╔══██╗
██║  ██╗╚██████╔╝██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ���═╝`}
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
                      CPU: █████���██████��███████ 60%
                    </div>
                    <div
                      className="text-xs text-amber-400 mb-1"
                      style={{ lineHeight: "1.2", fontFamily: "monospace" }}
                    >
                      RAM: ██████████████████████ 50%
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
                  <span className="text-green-400 ml-4">◄►◄►◄►</span>
                </div>

                <div className="loading-indicators">
                  <span>█▓▒░</span>
                  <span className="text-amber-400">PROCESSING...</span>
                  <span>░▒▓█</span>
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
      className={`relative transition-all duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
          : "bg-black"
      }`}
      style={{ height: "100vh", overflow: "hidden", maxWidth: "100vw" }}
    >
      {/* Universal Scroll Navigation */}
      {currentSection < sections.length - 1 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex flex-col items-center space-y-3 animate-button-float">
            {/* Desktop: Scroll Down */}
            <span
              className={`hidden sm:block font-inter text-sm font-medium animate-text-glow ${
                theme === "light" ? "text-gray-600" : "text-white/70"
              }`}
            >
              Scroll Down
            </span>
            {/* Mobile: Swipe Down */}
            <span
              className={`sm:hidden font-inter text-sm font-medium animate-text-glow ${
                theme === "light" ? "text-gray-600" : "text-white/70"
              }`}
            >
              Swipe Down
            </span>

            {/* Desktop: Mouse scroll indicator */}
            <div className="hidden sm:flex relative w-6 h-10 border-2 border-white/40 rounded-full justify-center backdrop-blur-sm bg-white/5">
              <div
                className="w-1 h-3 bg-gradient-to-b from-glow-blue to-white/80 rounded-full mt-2 animate-float shadow-lg"
                style={{
                  boxShadow: "0 0 10px rgba(73, 146, 255, 0.5)",
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
            </div>

            {/* Mobile: Phone with swipe indicator */}
            <div className="sm:hidden relative">
              <div className="relative w-8 h-12 border-2 border-white/40 rounded-lg backdrop-blur-sm bg-white/5 flex items-center justify-center">
                <div className="w-4 h-7 bg-white/10 rounded-sm relative overflow-hidden">
                  <div
                    className="absolute w-6 h-0.5 bg-gradient-to-r from-transparent via-glow-blue to-transparent rounded-full animate-swipe-down shadow-lg"
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                      boxShadow: "0 0 8px rgba(73, 146, 255, 0.6)",
                    }}
                  />
                  <div
                    className="absolute w-4 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full animate-swipe-down-delayed"
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>
                <div className="absolute top-1 w-2 h-0.5 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Up Indicator - Last Section */}
      {currentSection === sections.length - 1 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex flex-col items-center space-y-3 animate-button-float">
            {/* Desktop: Scroll Up */}
            <span
              className={`hidden sm:block font-inter text-sm font-medium animate-text-glow ${
                theme === "light" ? "text-gray-600" : "text-white/70"
              }`}
            >
              Scroll Up
            </span>
            {/* Mobile: Swipe Up */}
            <span
              className={`sm:hidden font-inter text-sm font-medium animate-text-glow ${
                theme === "light" ? "text-gray-600" : "text-white/70"
              }`}
            >
              Swipe Up
            </span>

            {/* Desktop: Mouse scroll indicator - pointing up */}
            <div className="hidden sm:flex relative w-6 h-10 border-2 border-white/40 rounded-full justify-center backdrop-blur-sm bg-white/5">
              <div
                className="w-1 h-3 bg-gradient-to-t from-glow-blue to-white/80 rounded-full mb-2 animate-float shadow-lg"
                style={{
                  boxShadow: "0 0 10px rgba(73, 146, 255, 0.5)",
                  alignSelf: "flex-end",
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/10 to-transparent" />
            </div>

            {/* Mobile: Phone with swipe up indicator */}
            <div className="sm:hidden relative">
              <div className="relative w-8 h-12 border-2 border-white/40 rounded-lg backdrop-blur-sm bg-white/5 flex items-center justify-center">
                <div className="w-4 h-7 bg-white/10 rounded-sm relative overflow-hidden">
                  <div
                    className="absolute w-6 h-0.5 bg-gradient-to-r from-transparent via-glow-blue to-transparent rounded-full animate-swipe-up shadow-lg"
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                      boxShadow: "0 0 8px rgba(73, 146, 255, 0.6)",
                    }}
                  />
                  <div
                    className="absolute w-4 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full animate-swipe-up-delayed"
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>
                <div className="absolute top-1 w-2 h-0.5 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button - All sections except first */}
      {currentSection > 0 && (
        <div className="fixed bottom-8 right-4 sm:right-8 z-50">
          <button
            onClick={() => scrollToSection(0)}
            className={`group relative p-3 sm:p-4 rounded-full border-2 backdrop-blur-lg transition-all duration-300 hover:scale-110 ${
              theme === "light"
                ? "border-blue-400/40 bg-white/80 hover:bg-white/90"
                : "border-blue-300/30 bg-blue-400/10 hover:bg-blue-400/20"
            }`}
            style={{
              background:
                theme === "light"
                  ? `linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 50%, transparent 100%)`
                  : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
              boxShadow: "0 0 20px rgba(73, 146, 255, 0.3)",
            }}
          >
            {/* Icon */}
            <ChevronUp
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                theme === "light"
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

      {/* Sections Container */}
      <div className="h-full">
        {/* Home Section */}
        <motion.div
          ref={(el) => (sectionsRef.current[0] = el!)}
          className={`relative min-h-screen overflow-hidden transition-all duration-500 ${
            theme === "light"
              ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
              : "bg-black"
          }`}
          variants={containerVariants}
          initial="hidden"
          animate={!isLoading && isLoaded ? "visible" : "hidden"}
        >
          {/* Main Content - Always visible with orchestrated animations */}
          {/* Left Corner Visual Elements for Mobile Balance */}
          <div className="fixed top-6 left-6 z-40 block sm:hidden"></div>

          {/* Theme Toggle Container with Tooltip */}
          <div className="fixed top-6 right-6 z-50">
            <div
              className="group relative"
              onMouseEnter={() => setIsTooltipDismissed(true)}
            >
              {/* Tooltip - only show in modern mode and if not dismissed */}
              {mode === "modern" && !isTooltipDismissed && (
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-1 sm:mr-2 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
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

          {/* Enhanced Background Elements */}

          {/* Dynamic Gradient Overlays */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 animate-gradient-shift" />
            <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/15 via-transparent to-blue-500/15 animate-gradient-shift-reverse" />
          </div>

          {/* Animated Noise Texture */}
          <div
            className="absolute inset-0 opacity-5 animate-noise"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Enhanced Floating Ambient Particles with Color Shifting */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(25)].map((_, i) => (
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
              {[...Array(6)].map((_, i) => (
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
            {[...Array(8)].map((_, i) => (
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

          {/* Interactive Glass Badge at Top */}
          <div
            className="absolute top-8 sm:top-28 left-0 right-0 flex justify-center z-20 animate-gentleBounce scale-50 sm:scale-100"
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
            {/* Energy Rings Around Orb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`ring-${i}`}
                  className="absolute rounded-full border opacity-20"
                  style={{
                    width: `${400 + i * 120}px`,
                    height: `${400 + i * 120}px`,
                    border: `1px solid rgba(73, 146, 255, ${0.4 - i * 0.1})`,
                    animation: `energy-ripple 3s ease-out infinite ${i * 0.4}s`,
                  }}
                />
              ))}
            </div>

            {/* Rotating Light Beams */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <div
                className="absolute w-1 h-96 bg-gradient-to-t from-transparent via-blue-400/25 to-transparent"
                style={{
                  animation: "spin 15s linear infinite",
                  transformOrigin: "center 50%",
                }}
              />
              <div
                className="absolute w-1 h-96 bg-gradient-to-t from-transparent via-cyan-400/20 to-transparent"
                style={{
                  animation: "spin 20s linear infinite reverse",
                  transformOrigin: "center 50%",
                }}
              />
              <div
                className="absolute h-1 w-96 bg-gradient-to-r from-transparent via-blue-300/15 to-transparent"
                style={{
                  animation: "spin 25s linear infinite",
                  transformOrigin: "50% center",
                }}
              />
            </div>

            {/* Left Side Visual Balance Elements */}
            <div className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 pointer-events-none">
              {/* Floating geometric indicators */}
              <div className="space-y-4 sm:space-y-8">
                {/* Primary indicator */}
                <motion.div
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-400/30 animate-gentle-pulse"
                  initial={{ opacity: 0, x: -20 }}
                  animate={animationStep >= 1 ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 2, duration: 1 }}
                />
                {/* Secondary indicators */}
                <motion.div
                  className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-blue-300/20 animate-gentle-pulse"
                  initial={{ opacity: 0, x: -20 }}
                  animate={animationStep >= 1 ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 2.3, duration: 1 }}
                  style={{ animationDelay: "1s" }}
                />
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-200/25 animate-gentle-pulse"
                  initial={{ opacity: 0, x: -20 }}
                  animate={animationStep >= 1 ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 2.6, duration: 1 }}
                  style={{ animationDelay: "2s" }}
                />
              </div>

              {/* Vertical progress line */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 top-12 sm:top-16 w-px h-16 sm:h-24 bg-gradient-to-b from-blue-400/40 via-blue-300/20 to-transparent"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={animationStep >= 1 ? { opacity: 1, scaleY: 1 } : {}}
                transition={{ delay: 3, duration: 1.5 }}
              />

              {/* Connecting line to center (desktop only) */}
              <motion.div
                className="hidden lg:block absolute top-8 left-4 w-32 h-px bg-gradient-to-r from-blue-400/30 to-transparent"
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

            {/* Central Glowing Orb - SVG Based with Magnetic Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative animate-float cursor-pointer group pointer-events-none"
                initial={{
                  opacity: 0,
                  scale: 0.3,
                  y: 100,
                  filter: "blur(20px)",
                }}
                animate={
                  animationStep >= 1
                    ? {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        filter: "blur(0px)",
                      }
                    : {}
                }
                transition={{
                  duration: 1.5,
                  ease: [0.16, 1, 0.3, 1],
                  type: "spring",
                  stiffness: 80,
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
                  className="w-[58rem] h-[58rem] sm:w-[78rem] sm:h-[78rem] md:w-[75rem] md:h-[75rem] lg:w-[90rem] lg:h-[90rem] pointer-events-none"
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
                        values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
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
                        values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
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
                        values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
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
                        values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
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
                        values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"
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
                      <stop stopColor="#3FBAFF" />
                      <stop offset="0.493374" stopColor="#4992FF" />
                      <stop offset="1" stopColor="#3987E3" />
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

            {/* Text Content - Moved up */}
            <motion.div
              className="relative z-10 px-4 -mt-16"
              initial={{
                opacity: 0,
                y: 80,
                filter: "blur(10px)",
              }}
              animate={
                animationStep >= 2
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
              {/* Kor - moved further to the left */}
              <div
                className="text-center transform -translate-x-6 sm:-translate-x-8 md:-translate-x-16 lg:-translate-x-20"
                style={{ marginLeft: "-5px" }}
              >
                <h1
                  className={`font-poppins text-8xl sm:text-8xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight relative ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  <span
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animation:
                        "text-glow 3s ease-in-out infinite, text-bounce 2s ease-in-out 0.5s infinite both, warm-glow-pulse 3s ease-in-out infinite",
                    }}
                  >
                    K
                  </span>
                  <span
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animation:
                        "text-glow 3s ease-in-out infinite 0.3s, text-bounce 2s ease-in-out 0.8s infinite both, warm-glow-pulse 3s ease-in-out infinite 0.3s",
                    }}
                  >
                    o
                  </span>
                  <span
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animation:
                        "text-glow 3s ease-in-out infinite 0.6s, text-bounce 2s ease-in-out 1.1s infinite both, warm-glow-pulse 3s ease-in-out infinite 0.6s",
                    }}
                  >
                    r
                  </span>
                </h1>
              </div>

              {/* Development services - enhanced with dramatic effects */}
              <div
                className="text-center transform translate-x-8 sm:translate-x-12 md:translate-x-16 mt-2 md:mt-4"
                style={{ marginLeft: "5px", marginTop: "-5px" }}
              >
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

                  {/* Floating energy particles around text */}
                  {[...Array(12)].map((_, i) => (
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
                        animationFillMode: "both",
                        animationTimingFunction: "ease-in-out",
                      }}
                    />
                  ))}

                  <div className="font-poppins text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold relative z-10">
                    <span
                      className={`relative inline-block ${
                        theme === "light" ? "text-gray-900" : "text-white"
                      }`}
                      style={{
                        animation: `text-pop 2s ease-in-out infinite 0.5s, text-glow-pulse 3s ease-in-out infinite 1s`,
                        filter:
                          theme === "light"
                            ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(147, 51, 234, 0.4))`
                            : `drop-shadow(0 0 20px rgba(73, 146, 255, 0.8)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.5))`,
                        animationFillMode: "both",
                      }}
                    >
                      {/* Warm glow text with iOS-inspired styling */}
                      <span className="warm-glow-text animate-warm-glow-pulse">
                        {"Development services".split("").map((letter, i) => (
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

                      {/* Enhanced sparkles with more variety */}
                      {SHINE_CONFIG.showSparkles &&
                        [
                          // Upper sparkles
                          { x: 95, y: -35, size: 0.8, type: "star" },
                          { x: 75, y: -10, size: 0.6, type: "diamond" },
                          { x: 120, y: 50, size: 0.7, type: "plus" },
                          { x: 90, y: 80, size: 0.9, type: "star" },
                          { x: 25, y: 85, size: 0.5, type: "diamond" },
                          { x: -40, y: 60, size: 0.6, type: "plus" },
                          { x: 165, y: 15, size: 1.0, type: "star" },
                          // Additional sparkles for more drama
                          { x: -20, y: -20, size: 0.7, type: "diamond" },
                          { x: 140, y: -15, size: 0.5, type: "plus" },
                          { x: 50, y: 100, size: 0.8, type: "star" },
                        ].map((sparkle, i) => (
                          <div
                            key={`enhanced-sparkle-${i}`}
                            className="absolute pointer-events-none"
                            style={{
                              left: `calc(50% + ${sparkle.x}px)`,
                              top: `calc(50% + ${sparkle.y}px)`,
                              animation: `sparkle-enhanced ${6 + (i % 4) * 2}s ease-in-out infinite ${i * 0.8}s`,
                              transform: `scale(${sparkle.size})`,
                              opacity: 0.6,
                              animationFillMode: "both",
                              zIndex: -1,
                            }}
                          >
                            {sparkle.type === "star" && (
                              <div
                                className="w-6 h-6"
                                style={{
                                  background:
                                    theme === "light"
                                      ? "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)"
                                      : "radial-gradient(circle, rgba(73, 146, 255, 0.6) 0%, transparent 70%)",
                                  clipPath:
                                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                                  animation: "spin-slow 15s linear infinite",
                                }}
                              />
                            )}
                            {sparkle.type === "diamond" && (
                              <div
                                className="w-4 h-4"
                                style={{
                                  background:
                                    theme === "light"
                                      ? "linear-gradient(45deg, rgba(147, 51, 234, 0.5), rgba(59, 130, 246, 0.4))"
                                      : "linear-gradient(45deg, rgba(34, 211, 238, 0.5), rgba(73, 146, 255, 0.4))",
                                  clipPath:
                                    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                                  animation:
                                    "gentle-pulse 4s ease-in-out infinite",
                                }}
                              />
                            )}
                            {sparkle.type === "plus" && (
                              <div
                                className="w-5 h-5"
                                style={{
                                  background:
                                    theme === "light"
                                      ? "conic-gradient(from 0deg, rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.4), rgba(59, 130, 246, 0.5))"
                                      : "conic-gradient(from 0deg, rgba(73, 146, 255, 0.5), rgba(34, 211, 238, 0.4), rgba(73, 146, 255, 0.5))",
                                  clipPath:
                                    "polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)",
                                  animation: "rotate-slow 12s linear infinite",
                                }}
                              />
                            )}
                          </div>
                        ))}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Hamburger Menu - Only on mobile (640px and below) */}
            <div className="sm:hidden absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <MobileHamburgerMenu
                  isOpen={isMobileMenuOpen}
                  setIsOpen={setIsMobileMenuOpen}
                  theme={theme}
                />
              </div>
            </div>

            {/* Desktop Orb-Floating Navigation Buttons - positioned relative to orb */}
            <motion.div
              className="hidden sm:flex absolute inset-0 items-center justify-center"
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
                <OrbFloatingButtons />
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
        <AboutUsSection
          ref={(el) => (sectionsRef.current[1] = el!)}
          theme={theme}
          isVisible={currentSection === 1}
        />

        {/* Services Section */}
        <ServicesSection
          ref={(el) => (sectionsRef.current[2] = el!)}
          theme={theme}
          isVisible={currentSection === 2}
        />

        {/* Portfolio Section */}
        <PortfolioSection
          ref={(el) => (sectionsRef.current[3] = el!)}
          theme={theme}
          isVisible={currentSection === 3}
        />

        {/* Contact Us Section */}
        <ContactUsSection
          ref={(el) => (sectionsRef.current[4] = el!)}
          theme={theme}
          isVisible={currentSection === 4}
        />
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

        @keyframes gradient-shift {
          0%,
          100% {
            transform: translateX(0%) translateY(0%) rotate(0deg);
          }
          25% {
            transform: translateX(10%) translateY(-5%) rotate(1deg);
          }
          50% {
            transform: translateX(-5%) translateY(10%) rotate(-1deg);
          }
          75% {
            transform: translateX(15%) translateY(-10%) rotate(0.5deg);
          }
        }

        @keyframes gradient-shift-reverse {
          0%,
          100% {
            transform: translateX(0%) translateY(0%) rotate(0deg);
          }
          25% {
            transform: translateX(-10%) translateY(5%) rotate(-1deg);
          }
          50% {
            transform: translateX(5%) translateY(-10%) rotate(1deg);
          }
          75% {
            transform: translateX(-15%) translateY(10%) rotate(-0.5deg);
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

        .animate-gradient-shift {
          animation: gradient-shift 25s ease-in-out infinite;
        }

        .animate-gradient-shift-reverse {
          animation: gradient-shift-reverse 30s ease-in-out infinite;
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

        /* Mobile fixes for service cards - fill gaps in corners */
        @media (max-width: 640px) {
          .responsive-grid {
            grid-template-columns: repeat(2, 1fr) !important;
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
      `}</style>
    </div>
  );
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
      {/* Hamburger Button - adjusted position: down 150px, left 50px */}
      <div
        className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        style={{
          marginLeft: "70px", // Moved left 50px from 120px
          marginTop: "-130px", // Moved down 150px from -280px
          animationDelay: "0.2s",
          animation:
            "gentleFloat 4s ease-in-out infinite 0.2s, button-drift 8s ease-in-out infinite 0.3s",
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => !isOpen && setShowTooltip(false)}
          className={`group relative px-3 py-3 rounded-xl border-2 backdrop-blur-2xl hover:backdrop-blur-3xl transition-all duration-700 hover:shadow-2xl active:scale-95 overflow-hidden ${
            theme === "light"
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
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent opacity-50 group-hover:opacity-70 transition-all duration-500" />
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

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
            style={{
              marginLeft: `${menuPosition.left}px`, // Dynamic positioning to stay in bounds
              marginTop: `${menuPosition.top}px`, // Dynamic positioning to stay in bounds
            }}
          >
            <div
              className={`relative rounded-2xl border-2 backdrop-blur-2xl p-4 w-[200px] max-w-[90vw] ${
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
              }}
            >
              {/* Animated background layers */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent opacity-50" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-white/20 via-transparent to-white/10 opacity-30" />

              {/* Menu Items - Styled like original floating buttons */}
              <div className="relative space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`group w-full px-4 py-3 rounded-xl border-2 backdrop-blur-2xl hover:backdrop-blur-3xl transition-all duration-500 hover:shadow-xl active:scale-95 overflow-hidden relative ${
                      theme === "light"
                        ? "border-blue-400/40 bg-white/30 hover:border-blue-500/60 text-gray-800 hover:text-gray-900"
                        : "border-blue-300/30 bg-blue-400/5 hover:border-white/40 text-white/90 hover:text-white"
                    }`}
                    style={{
                      background:
                        theme === "light"
                          ? `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`
                          : `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = `scale(1.05)`;
                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(73, 146, 255, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = `scale(1)`;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Animated background layers */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent opacity-50 group-hover:opacity-70 transition-all duration-500" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tl from-white/20 via-transparent to-white/10 opacity-30 group-hover:opacity-50 transition-all duration-500" />

                    {/* Futuristic circuit-like patterns */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500">
                      <div className="absolute top-1 left-1 w-1 h-1 bg-white/30 rounded-full" />
                      <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white/40 rounded-full" />
                      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>

                    {/* Holographic scanning line effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-inherit">
                      <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>

                    {/* Button text */}
                    <span className="relative font-poppins font-semibold text-sm tracking-wide drop-shadow-lg">
                      {item.text}
                    </span>

                    {/* Holographic shimmer effect */}
                    <div className="absolute top-0.5 left-0.5 right-0.5 h-1/3 rounded-xl bg-gradient-to-b from-white/25 via-white/10 to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500" />

                    {/* Bottom reflection */}
                    <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1/4 rounded-xl bg-gradient-to-t from-white/15 to-transparent opacity-30 group-hover:opacity-50 transition-all duration-500" />
                  </motion.button>
                ))}
              </div>

              {/* Holographic shimmer effect */}
              <div className="absolute top-0.5 left-0.5 right-0.5 h-1/3 rounded-2xl bg-gradient-to-b from-white/25 via-white/10 to-transparent opacity-40" />

              {/* Bottom reflection */}
              <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1/4 rounded-2xl bg-gradient-to-t from-white/15 to-transparent opacity-30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Backdrop overlay that blurs all content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsOpen(false)}
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />
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
      animationDelay: 0.2,
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
      animationDelay: 1.0,
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
      animationDelay: 1.4,
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
// Change: hoverScale: 1.05  ���  hoverScale: 1.15
//
// ========================================

function OrbFloatingButtons() {
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
  onClick,
}: OrbFloatingButtonProps) {
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
      className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] animate-gentleFloat"
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
          animation: `gentleFloat 4s ease-in-out infinite ${delay}s, button-drift ${8 + delay * 2}s ease-in-out infinite ${delay * 1.5}s`,
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
}

const AboutUsSection = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ theme, isVisible }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            : "bg-black"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Enhanced Background Elements - Copy from Home Section */}

        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 animate-gradient-shift" />
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/15 via-transparent to-blue-500/15 animate-gradient-shift-reverse" />
        </div>

        {/* Animated Noise Texture */}
        <div
          className="absolute inset-0 opacity-5 animate-noise"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          }}
        />

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
        <div className="relative min-h-screen py-16 sm:py-20 lg:py-24 section-container">
          {/* Text Content */}
          <motion.div
            className="relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto section-content pt-8 pb-20"
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
            <div className="text-center mb-6 sm:mb-12 lg:mb-16">
              <h1
                className={`font-poppins text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight relative ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                <span
                  className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                  style={{
                    animation:
                      "text-glow 3s ease-in-out infinite, text-bounce 2s ease-in-out 0.5s infinite both, warm-glow-pulse 3s ease-in-out infinite",
                  }}
                >
                  A
                </span>
                <span
                  className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                  style={{
                    animation:
                      "text-glow 3s ease-in-out infinite 0.2s, text-bounce 2s ease-in-out 0.7s infinite both, warm-glow-pulse 3s ease-in-out infinite 0.2s",
                  }}
                >
                  b
                </span>
                <span
                  className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                  style={{
                    animation:
                      "text-glow 3s ease-in-out infinite 0.4s, text-bounce 2s ease-in-out 0.9s infinite both, warm-glow-pulse 3s ease-in-out infinite 0.4s",
                  }}
                >
                  o
                </span>
                <span
                  className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                  style={{
                    animation:
                      "text-glow 3s ease-in-out infinite 0.6s, text-bounce 2s ease-in-out 1.1s infinite both, warm-glow-pulse 3s ease-in-out infinite 0.6s",
                  }}
                >
                  u
                </span>
                <span
                  className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                  style={{
                    animation:
                      "text-glow 3s ease-in-out infinite 0.8s, text-bounce 2s ease-in-out 1.3s infinite both, warm-glow-pulse 3s ease-in-out infinite 0.8s",
                  }}
                >
                  t
                </span>
                <span className="mx-4" />
                <span
                  className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                  style={{
                    animation:
                      "text-glow 3s ease-in-out infinite 1.0s, text-bounce 2s ease-in-out 1.5s infinite both, warm-glow-pulse 3s ease-in-out infinite 1.0s",
                  }}
                >
                  U
                </span>
                <span
                  className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                  style={{
                    animation:
                      "text-glow 3s ease-in-out infinite 1.2s, text-bounce 2s ease-in-out 1.7s infinite both, warm-glow-pulse 3s ease-in-out infinite 1.2s",
                  }}
                >
                  s
                </span>
              </h1>
            </div>

            {/* Our Mission - matching development services style */}
            <div className="text-center mb-10 sm:mb-16">
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

                {/* Floating energy particles around text - reduced for mobile */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`energy-${i}`}
                    className="absolute rounded-full pointer-events-none hidden sm:block"
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
                      animationFillMode: "both",
                      animationTimingFunction: "ease-in-out",
                    }}
                  />
                ))}

                <div className="font-poppins text-lg sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold relative z-10">
                  <span
                    className={`relative inline-block ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                    style={{
                      animation: `text-pop 2s ease-in-out infinite 0.5s, text-glow-pulse 3s ease-in-out infinite 1s`,
                      filter:
                        theme === "light"
                          ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(147, 51, 234, 0.4))`
                          : `drop-shadow(0 0 20px rgba(73, 146, 255, 0.8)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.5))`,
                      animationFillMode: "both",
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center mt-12 sm:mt-16">
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

              {/* Right Content - Tech Visual - Hidden on mobile */}
              <motion.div
                className="relative hidden sm:block"
                initial={{ x: 50, opacity: 0 }}
                animate={
                  isVisible ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div
                  className="relative w-full h-96 rounded-3xl overflow-hidden backdrop-blur-lg border border-white/20"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    boxShadow: "0 0 40px rgba(73, 146, 255, 0.2)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />

                  {/* Animated Tech Elements */}
                  <div className="absolute inset-4 space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center space-x-3"
                        initial={{ x: -50, opacity: 0 }}
                        animate={
                          isVisible
                            ? { x: 0, opacity: 1 }
                            : { x: -50, opacity: 0 }
                        }
                        transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                      >
                        <div
                          className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"
                          style={{
                            boxShadow: "0 0 10px rgba(73, 146, 255, 0.8)",
                          }}
                        />
                        <div
                          className={`h-2 rounded-full ${
                            i % 3 === 0
                              ? "w-32 bg-gradient-to-r from-blue-400 to-cyan-400"
                              : i % 3 === 1
                                ? "w-24 bg-gradient-to-r from-purple-400 to-pink-400"
                                : "w-28 bg-gradient-to-r from-cyan-400 to-blue-400"
                          }`}
                          style={{
                            boxShadow: "0 0 8px rgba(73, 146, 255, 0.4)",
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Floating Tech Icons */}
                  {[Code, Zap, Star].map((Icon, index) => (
                    <motion.div
                      key={index}
                      className="absolute"
                      style={{
                        right: `${20 + index * 40}px`,
                        top: `${60 + index * 50}px`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        rotate: [0, 10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: index * 0.7,
                      }}
                    >
                      <Icon
                        className="w-10 h-10 text-blue-400 opacity-80"
                        style={{
                          filter:
                            "drop-shadow(0 0 10px rgba(73, 146, 255, 0.6))",
                        }}
                      />
                    </motion.div>
                  ))}
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
  ({ theme, isVisible }, ref) => {
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
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            : "bg-black"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Enhanced Background Elements - Copy from Home Section */}

        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 animate-gradient-shift" />
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/15 via-transparent to-blue-500/15 animate-gradient-shift-reverse" />
        </div>

        {/* Animated Noise Texture */}
        <div
          className="absolute inset-0 opacity-5 animate-noise"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          }}
        />

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
        <div className="relative min-h-screen py-16 sm:py-20 lg:py-24 section-container">
          {/* Text Content */}
          <motion.div
            className="relative z-10 px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto section-content pt-8 pb-20"
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
            <div className="text-center mb-16">
              <h1
                className={`font-poppins text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight relative ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                {"Services".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animation: `text-glow 3s ease-in-out infinite ${i * 0.2}s, text-bounce 2s ease-in-out ${0.5 + i * 0.2}s infinite both, warm-glow-pulse 3s ease-in-out infinite ${i * 0.2}s`,
                    }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
            </div>

            {/* Subtitle - matching development services style */}
            <div className="text-center mb-16">
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

                {/* Floating energy particles around text */}
                {[...Array(8)].map((_, i) => (
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
                      animationFillMode: "both",
                      animationTimingFunction: "ease-in-out",
                    }}
                  />
                ))}

                <div className="font-poppins text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold relative z-10">
                  <span
                    className={`relative inline-block ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                    style={{
                      animation: `text-pop 2s ease-in-out infinite 0.5s, text-glow-pulse 3s ease-in-out infinite 1s`,
                      filter:
                        theme === "light"
                          ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(147, 51, 234, 0.4))`
                          : `drop-shadow(0 0 20px rgba(73, 146, 255, 0.8)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.5))`,
                      animationFillMode: "both",
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
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-6 lg:gap-8 xl:gap-10 mt-16 responsive-grid w-full">
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
                    className="relative p-1 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl lg:rounded-3xl backdrop-blur-lg border overflow-hidden transition-all duration-500 h-full"
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
                    <div className="relative z-10 mb-2 sm:mb-4 lg:mb-6">
                      <h3
                        className={`text-sm sm:text-lg lg:text-xl font-bold warm-glow-text text-center ${
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
                      className="relative z-10 mb-2 sm:mb-4 lg:mb-6 flex justify-center"
                      whileHover={{ rotate: 10, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center bg-gradient-to-br ${service.color}`}
                        style={{
                          boxShadow: "0 0 20px rgba(73, 146, 255, 0.4)",
                        }}
                      >
                        <service.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Description Content */}
                    <div className="relative z-10 text-center">
                      <p
                        className={`text-xs sm:text-sm leading-relaxed ${
                          theme === "light" ? "text-gray-600" : "text-gray-300"
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
  ({ theme, isVisible }, ref) => {
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
    const [screenSize, setScreenSize] = useState('desktop');

    useEffect(() => {
      const checkScreenSize = () => {
        if (window.innerWidth <= 640) {
          setScreenSize('mobile');
        } else if (window.innerWidth <= 991) {
          setScreenSize('tablet');
        } else {
          setScreenSize('desktop');
        }
      };
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const projectsPerPage = screenSize === 'desktop' ? 3 : 2;
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
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            : "bg-black"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Enhanced Background Elements - Copy from Home Section */}

        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 animate-gradient-shift" />
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/15 via-transparent to-blue-500/15 animate-gradient-shift-reverse" />
        </div>

        {/* Animated Noise Texture */}
        <div
          className="absolute inset-0 opacity-5 animate-noise"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          }}
        />

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
        <div className="relative min-h-screen py-16 sm:py-20 lg:py-24 section-container">
          <motion.div
            className="relative z-10 px-3 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto section-content pt-6 pb-16"
            initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
            animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* Portfolio Title */}
            <div className="text-center mb-10 sm:mb-16">
              <h1
                className={`font-poppins text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight relative ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                {"Portfolio".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animation: `text-glow 3s ease-in-out infinite ${i * 0.15}s, text-bounce 2s ease-in-out ${0.5 + i * 0.15}s infinite both, warm-glow-pulse 3s ease-in-out infinite ${i * 0.15}s`,
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
                    className="absolute rounded-full pointer-events-none hidden sm:block"
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
                      animationFillMode: "both",
                    }}
                  />
                ))}
                <div className="font-poppins text-lg sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold relative z-10">
                  <span
                    className={`relative inline-block ${theme === "light" ? "text-gray-900" : "text-white"}`}
                    style={{
                      animation: `text-pop 2s ease-in-out infinite 0.5s, text-glow-pulse 3s ease-in-out infinite 1s`,
                      filter:
                        theme === "light"
                          ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(147, 51, 234, 0.4))`
                          : `drop-shadow(0 0 20px rgba(73, 146, 255, 0.8)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.5))`,
                      animationFillMode: "both",
                    }}
                  >
                    <span className="warm-glow-text animate-warm-glow-pulse">
                      {"Our Featured Work".split("").map((letter, i) => (
                        <span
                          key={i}
                          className="animate-letter-float"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          {letter === " " ? "\u00A0" : letter}
                        </span>
                      ))}
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
                    whileHover={currentPage === totalPages - 1 ? {} : { scale: 1.1 }}
                    whileTap={currentPage === totalPages - 1 ? {} : { scale: 0.9 }}
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
                        className="relative p-2 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl backdrop-blur-lg border overflow-hidden transition-all duration-500 h-full"
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
  ({ theme, isVisible }, ref) => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Form submitted:", formData);
      // Add your form submission logic here
    };

    return (
      <motion.div
        ref={ref}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
          theme === "light"
            ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
            : "bg-black"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Enhanced Background Elements - Copy from Home Section */}

        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 animate-gradient-shift" />
          <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/15 via-transparent to-blue-500/15 animate-gradient-shift-reverse" />
        </div>

        {/* Animated Noise Texture */}
        <div
          className="absolute inset-0 opacity-5 animate-noise"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`,
          }}
        />

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
            {/* Animated circuit lines for Contact section */}
            {[...Array(4)].map((_, i) => (
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
        <div className="relative min-h-screen py-12 sm:py-20 lg:py-24 section-container">
          <motion.div
            className="relative z-10 px-3 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto section-content pt-6 pb-16"
            initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
            animate={isVisible ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* Contact Title */}
            <div className="text-center mb-10 sm:mb-16">
              <h1
                className={`font-poppins text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight relative ${theme === "light" ? "text-gray-900" : "text-white"}`}
              >
                {"Contact".split("").map((letter, i) => (
                  <span
                    key={i}
                    className="inline-block relative warm-glow-text animate-warm-glow-pulse"
                    style={{
                      animation: `text-glow 3s ease-in-out infinite ${i * 0.15}s, text-bounce 2s ease-in-out ${0.5 + i * 0.15}s infinite both, warm-glow-pulse 3s ease-in-out infinite ${i * 0.15}s`,
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
                    className="absolute rounded-full pointer-events-none hidden sm:block"
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
                      animationFillMode: "both",
                    }}
                  />
                ))}
                <div className="font-poppins text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold relative z-10 px-2 sm:px-0">
                  <span
                    className={`relative inline-block ${theme === "light" ? "text-gray-900" : "text-white"}`}
                    style={{
                      animation: `text-pop 2s ease-in-out infinite 0.5s, text-glow-pulse 3s ease-in-out infinite 1s`,
                      filter:
                        theme === "light"
                          ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 30px rgba(147, 51, 234, 0.4))`
                          : `drop-shadow(0 0 20px rgba(73, 146, 255, 0.8)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.5))`,
                      animationFillMode: "both",
                    }}
                  >
                    <span className="warm-glow-text animate-warm-glow-pulse text-center block">
                      {"Ready to Build Something Amazing?"
                        .split("")
                        .map((letter, i) => (
                          <span
                            key={i}
                            className="animate-letter-float"
                            style={{ animationDelay: `${i * 0.05}s` }}
                          >
                            {letter === " " ? "\u00A0" : letter}
                          </span>
                        ))}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-12 items-start mt-4 sm:mt-8 lg:mt-16">
              {/* Contact Form */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={
                  isVisible ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 sm:space-y-6"
                >
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border backdrop-blur-lg transition-all duration-300 focus:scale-105 outline-none text-sm sm:text-base"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "2px solid rgba(255, 255, 255, 0.1)",
                        color: theme === "light" ? "#1f2937" : "#e5e7eb",
                        boxShadow: "0 0 20px rgba(73, 146, 255, 0.1)",
                      }}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border backdrop-blur-lg transition-all duration-300 focus:scale-105 outline-none text-sm sm:text-base"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "2px solid rgba(255, 255, 255, 0.1)",
                        color: theme === "light" ? "#1f2937" : "#e5e7eb",
                        boxShadow: "0 0 20px rgba(73, 146, 255, 0.1)",
                      }}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={5}
                      className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border backdrop-blur-lg transition-all duration-300 focus:scale-105 resize-none outline-none text-sm sm:text-base"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "2px solid rgba(255, 255, 255, 0.1)",
                        color: theme === "light" ? "#1f2937" : "#e5e7eb",
                        boxShadow: "0 0 20px rgba(73, 146, 255, 0.1)",
                      }}
                      required
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white font-semibold flex items-center justify-center space-x-2 group transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(73, 146, 255, 0.8), rgba(34, 211, 238, 0.8))",
                      boxShadow: "0 0 30px rgba(73, 146, 255, 0.4)",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span>Send Message</span>
                  </motion.button>
                </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className="grid grid-cols-1 sm:space-y-4 lg:space-y-6 gap-2 sm:gap-0 mt-1 sm:mt-4 lg:mt-0 sm:block"
                initial={{ x: 50, opacity: 0 }}
                animate={
                  isVisible ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }
                }
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {[
                  {
                    icon: Mail,
                    title: "Email Us",
                    info: "contact@kor.dev",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: Phone,
                    title: "Call Us",
                    info: "+1 (555) 123-4567",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    icon: MapPin,
                    title: "Visit Us",
                    info: "123 Tech Street, Digital City",
                    color: "from-purple-500 to-pink-500",
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-lg border transition-all duration-500 hover:scale-105"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 0 30px rgba(73, 146, 255, 0.2)",
                    }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={
                      isVisible ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }
                    }
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                  >
                    {/* Scanning line effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 text-center sm:text-left relative z-10">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center flex-shrink-0`}
                        style={{
                          boxShadow: "0 0 15px rgba(73, 146, 255, 0.4)",
                        }}
                      >
                        <contact.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4
                          className={`font-semibold warm-glow-text ${theme === "light" ? "text-gray-900" : "text-white"}`}
                          style={{
                            textShadow: "0 0 8px rgba(73, 146, 255, 0.5)",
                          }}
                        >
                          {contact.title}
                        </h4>
                        <p
                          className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}
                          style={{
                            textShadow:
                              theme === "dark"
                                ? "0 0 5px rgba(255, 255, 255, 0.1)"
                                : "none",
                          }}
                        >
                          {contact.info}
                        </p>
                      </div>
                    </div>

                    {/* Circuit decorations */}
                    <div className="absolute inset-0 opacity-20 hover:opacity-40 transition-all duration-500">
                      <div className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <div
                        className="absolute bottom-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Social Media Buttons */}
            <motion.div
              className="text-center mt-6 sm:mt-12 lg:mt-16"
              initial={{ y: 50, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <h3
                className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 warm-glow-text ${theme === "light" ? "text-gray-900" : "text-white"}`}
                style={{
                  textShadow: "0 0 8px rgba(73, 146, 255, 0.5)",
                }}
              >
                Connect With Us
              </h3>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6">
                {[
                  {
                    name: "Instagram",
                    url: "https://instagram.com",
                    color: "from-pink-500 to-purple-500",
                  },
                  {
                    name: "Discord",
                    url: "https://discord.com",
                    color: "from-indigo-500 to-blue-500",
                  },
                  {
                    name: "Telegram",
                    url: "https://telegram.org",
                    color: "from-blue-500 to-cyan-500",
                  },
                ].map((social, index) => (
                  <motion.button
                    key={social.name}
                    onClick={() => window.open(social.url, "_blank")}
                    className="group relative px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl backdrop-blur-lg border transition-all duration-500 hover:scale-105 overflow-hidden min-w-[120px] sm:min-w-[140px]"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 0 25px rgba(73, 146, 255, 0.2)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated background gradient */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${social.color}`}
                    />

                    {/* Scanning line effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    </div>

                    {/* Button text */}
                    <span
                      className={`relative font-semibold warm-glow-text text-sm sm:text-base ${theme === "light" ? "text-gray-900" : "text-white"} group-hover:text-blue-300 transition-colors duration-300`}
                      style={{
                        textShadow: "0 0 8px rgba(73, 146, 255, 0.6)",
                      }}
                    >
                      {social.name}
                    </span>

                    {/* Circuit decorations */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500">
                      <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                      <div
                        className="absolute bottom-1 right-1 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      />
                      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                    </div>

                    {/* Holographic shimmer effect */}
                    <div className="absolute top-0.5 left-0.5 right-0.5 h-1/3 rounded-2xl bg-gradient-to-b from-white/25 via-white/10 to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  },
);
