import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { RetroToggle } from "@/components/ui/retro-toggle";
import { useTheme } from "@/hooks/use-theme";
import { useRetroMode } from "@/hooks/use-retro-mode";

export default function Index() {
  const { theme } = useTheme();
  const { mode } = useRetroMode();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [badgeMousePosition, setBadgeMousePosition] = useState({
    x: 0,
    y: 0,
    isNear: false,
  });
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Modern mode animations
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(loadTimer);
    };
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

  const showSection = (section: string) => {
    console.log(`Navigating to ${section}`);
  };

  const openTerminal = () => {
    setTerminalOpen(true);
  };

  const closeTerminal = () => {
    setTerminalOpen(false);
  };

  // Render retro mode
  if (mode === "retro") {
    return (
      <div className="retro-container min-h-screen">
        {/* Header Bar */}
        <div className="retro-header">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              <div className="pixel-dot bg-green-400"></div>
              <div className="pixel-dot bg-yellow-400"></div>
              <div className="pixel-dot bg-red-400"></div>
            </div>
            <div className="terminal-glow font-bold text-green-400">KOR SYSTEMS v2.1</div>
          </div>
          <div className="flex items-center space-x-2">
            <RetroToggle />
            <ThemeToggle />
            <div 
              className="power-button"
              onClick={() => {
                document.body.style.opacity = '0';
                setTimeout(() => location.reload(), 1000);
              }}
            >
              ■
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
            <pre className="ascii-logo">
{`██╗  ██╗ ██████╗ ██████╗ 
██║ ██╔╝██╔═══██╗██╔══██╗
█████╔╝ ██║   ██║██████╔╝
██╔═██╗ ██║   ██║██╔══██╗
██║  ██╗╚██████╔╝██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝`}
            </pre>
            <div className="retro-subtitle">
              RETRO DEVELOPMENT SYSTEMS
            </div>
          </motion.div>

          {/* Terminal Window */}
          <motion.div 
            className="terminal-window"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="terminal-header">
              <span>■ ■ ■</span>
              <span>TERMINAL</span>
            </div>
            <div className="terminal-content">
              <div className="text-amber-400 font-bold mb-2">SYSTEM STATUS: ONLINE</div>
              <div className="typewriter mb-2">LOADING DEVELOPMENT SERVICES...</div>
              <div className="terminal-line">
                <span className="prompt">&gt;</span>
                <span className="cursor-text">CUSTOM SOFTWARE SOLUTIONS</span>
              </div>
              <div className="terminal-line">
                <span className="prompt">&gt;</span>
                <span className="cursor-text text-amber-400">RETRO SYSTEM ARCHITECTURE</span>
              </div>
              <div className="terminal-line">
                <span className="prompt">&gt;</span>
                <span className="cursor-text">WEB APPLICATION DEVELOPMENT</span>
              </div>
              <div className="terminal-line mb-4">
                <span className="prompt">&gt;</span>
                <span className="cursor-text text-amber-400">LEGACY SYSTEM MODERNIZATION</span>
              </div>
              <div className="memory-section">
                <div className="text-xs mb-2">MEMORY USAGE:</div>
                <div className="loading-bar"></div>
                <div className="text-xs text-amber-400 mt-1">64KB / 640KB AVAILABLE</div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div 
            className="button-grid"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <button className="pixel-button" onClick={() => showSection('about')}>
              ▓ ABOUT ▓
            </button>
            <button className="pixel-button" onClick={() => showSection('services')}>
              ▓ SERVICES ▓
            </button>
            <button className="pixel-button" onClick={() => showSection('portfolio')}>
              ▓ PORTFOLIO ▓
            </button>
            <button className="pixel-button" onClick={() => showSection('contact')}>
              ▓ CONTACT ▓
            </button>
            <button className="pixel-button" onClick={openTerminal}>
              ▓ TERMINAL ▓
            </button>
            <button className="pixel-button" onClick={() => showSection('archives')}>
              ▓ ARCHIVES ▓
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
              <span className="status-dot text-red-400 blink">●</span>
              <span>READY</span>
              <span className="status-dot text-amber-400">●</span>
              <span>CONNECTED</span>
              <span className="status-dot text-green-400 terminal-glow">●</span>
              <span>ONLINE</span>
            </div>
            
            <div className="continue-prompt">
              ◄ ► PRESS [SPACE] TO CONTINUE ◄ ►
            </div>
            
            <div className="loading-indicators">
              <span>█▓▒░</span>
              <span className="blink">LOADING...</span>
              <span>░▒▓█</span>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="retro-footer">
          <div className="text-green-400">COPYRIGHT (C) 2024 KOR SYSTEMS - ALL RIGHTS RESERVED</div>
          <div className="text-amber-400">TERMINAL EMULATION MODE - PHOSPHOR DISPLAY ACTIVE</div>
          <div className="text-red-400 blink">WARNING: RETRO MODE ENGAGED</div>
        </div>

        {/* Terminal Modal */}
        <AnimatePresence>
          {terminalOpen && (
            <motion.div 
              className="terminal-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="terminal-modal-window">
                <div className="terminal-modal-header">
                  <span className="font-bold text-green-400">KOR TERMINAL v1.0</span>
                  <button 
                    onClick={closeTerminal} 
                    className="close-button"
                  >
                    ✕
                  </button>
                </div>
                <div className="terminal-modal-content">
                  <div className="text-amber-400 mb-2">KOR SYSTEMS TERMINAL INTERFACE</div>
                  <div className="mb-2">Type 'help' for available commands</div>
                  <div className="terminal-line">
                    <span className="prompt">&gt;</span>
                    <span>help</span>
                  </div>
                  <div className="mb-2">Available commands:</div>
                  <div className="ml-4 text-amber-400">about - System information</div>
                  <div className="ml-4 text-amber-400">services - Available services</div>
                  <div className="ml-4 text-amber-400">contact - Contact information</div>
                  <div className="ml-4 text-amber-400">clear - Clear terminal</div>
                  <div className="ml-4 text-amber-400">exit - Close terminal</div>
                  <div className="terminal-line">
                    <span className="prompt">&gt;</span>
                    <span className="cursor">_</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Retro Styles */}
        <style jsx>{`
          .retro-container {
            background: #0a0a0a;
            color: #00ff41;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
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
          }

          .retro-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 65, 0.03) 2px,
                rgba(0, 255, 65, 0.03) 4px
              );
            pointer-events: none;
            animation: scanlines 0.1s linear infinite;
            z-index: 100;
          }

          @keyframes scanlines {
            0% { transform: translateY(0px); }
            100% { transform: translateY(4px); }
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
            justify-content: center;
            min-height: calc(100vh - 160px);
            padding: 32px;
            position: relative;
            z-index: 105;
          }

          .retro-logo-container {
            text-align: center;
            margin-bottom: 32px;
            animation: pixel-float 3s ease-in-out infinite;
          }

          .ascii-logo {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 800;
            font-size: clamp(8px, 2.5vw, 18px);
            line-height: 0.9;
            color: #00ff41;
            text-shadow: 0 0 10px #00ff41;
            margin: 0;
            white-space: pre;
          }

          .retro-subtitle {
            color: #ffaa00;
            font-size: clamp(12px, 3vw, 18px);
            font-weight: bold;
            margin-top: 12px;
            text-shadow: 0 0 10px #ffaa00;
            animation: terminal-glow 2s ease-in-out infinite;
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
            from { width: 0; }
            to { width: 100%; }
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
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background: #00ff41;
            animation: loading-progress 3s ease-in-out infinite;
          }

          @keyframes loading-progress {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
          }

          .button-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            max-width: 600px;
            margin-bottom: 32px;
            position: relative;
            z-index: 106;
          }

          @media (max-width: 640px) {
            .button-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          .pixel-button {
            background: #0a0a0a;
            border: 2px solid #00ff41;
            color: #00ff41;
            padding: 12px 16px;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            cursor: pointer;
            box-shadow: 4px 4px 0px #00ff41;
            border-radius: 0;
            transition: none;
            position: relative;
          }

          .pixel-button:hover {
            background: #00ff41;
            color: #0a0a0a;
            transform: translate(-2px, -2px);
            box-shadow: 6px 6px 0px #00ff41;
          }

          .pixel-button:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #00ff41;
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

          .terminal-modal {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 200;
            padding: 16px;
          }

          .terminal-modal-window {
            background: #0a0a0a;
            border: 2px solid #00ff41;
            width: 100%;
            max-width: 600px;
            max-height: 400px;
            display: flex;
            flex-direction: column;
            box-shadow: 
              0 0 20px rgba(0, 255, 65, 0.3),
              inset 0 0 20px rgba(0, 255, 65, 0.1);
          }

          .terminal-modal-header {
            background: #00ff41;
            color: #0a0a0a;
            padding: 8px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            font-size: 14px;
          }

          .close-button {
            background: transparent;
            border: none;
            color: #0a0a0a;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .close-button:hover {
            background: #0a0a0a;
            color: #ff4444;
          }

          .terminal-modal-content {
            padding: 16px;
            flex: 1;
            overflow-y: auto;
            font-size: 12px;
            line-height: 1.4;
            color: #00ff41;
          }

          .cursor::after {
            content: '█';
            animation: blink 1s infinite;
            color: #00ff41;
          }

          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }

          .blink {
            animation: blink 1s infinite;
          }

          @keyframes terminal-glow {
            0%, 100% { text-shadow: 0 0 10px currentColor; }
            50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
          }

          .terminal-glow {
            animation: terminal-glow 2s ease-in-out infinite;
          }

          @keyframes pixel-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    );
  }

  // Render modern mode (original design)
  return (
    <motion.div
      className={`relative min-h-screen overflow-hidden transition-all duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100"
          : "bg-black"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      {/* Theme Toggle and Retro Toggle */}
      <div className="absolute top-4 right-4 flex space-x-2 z-20">
        <RetroToggle />
        <ThemeToggle />
      </div>

      {/* Enhanced Background Elements */}
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
        {/* Central Glowing Orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative animate-float cursor-pointer group"
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
              className="w-[58rem] h-[58rem] sm:w-[78rem] sm:h-[78rem] md:w-[75rem] md:h-[75rem] lg:w-[90rem] lg:h-[90rem]"
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
                <ellipse cx="642" cy="390" rx="146" ry="154" stroke="black" />
              </g>
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="relative z-10 px-4 -mt-16">
          {/* Kor */}
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

          {/* Development services */}
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
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
