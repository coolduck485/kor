import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/use-theme";

export default function Index() {
  const { theme } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('main');
  const [bootSequence, setBootSequence] = useState(false);

  useEffect(() => {
    // Boot sequence
    setBootSequence(true);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const showSection = (section: string) => {
    setCurrentSection(section);
  };

  const openTerminal = () => {
    setTerminalOpen(true);
  };

  const closeTerminal = () => {
    setTerminalOpen(false);
  };

  return (
    <div className="retro-container crt-screen min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* CRT Screen Effects */}
      <div className="scanlines"></div>
      
      {/* Header Bar */}
      <div className="flex justify-between items-center p-4 border-b-2 border-green-400 bg-black">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-green-400 pixel-square"></div>
            <div className="w-3 h-3 bg-yellow-400 pixel-square"></div>
            <div className="w-3 h-3 bg-red-400 pixel-square"></div>
          </div>
          <div className="terminal-glow font-bold text-green-400">KOR SYSTEMS v2.1</div>
        </div>
        <div className="flex items-center space-x-4">
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
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        
        {/* ASCII Logo */}
        <motion.div 
          className="text-center mb-8 pixel-float"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 2 }}
        >
          <div className="ascii-logo terminal-glow text-green-400">
{`██╗  ██╗ ██████╗ ██████╗ 
██║ ██╔╝██╔═══██╗██╔══██╗
█████╔╝ ██║   ██║██████╔╝
██╔═██╗ ██║   ██║██╔══██╗
██║  ██╗╚██████╔╝██║  ██║
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝`}
          </div>
          <div className="text-amber-400 text-lg font-bold mt-2 terminal-glow">
            RETRO DEVELOPMENT SYSTEMS
          </div>
        </motion.div>

        {/* Terminal Window */}
        <motion.div 
          className="terminal-window w-full max-w-2xl p-6 mb-8 bg-black border-2 border-green-400"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="text-sm space-y-2">
            <div className="text-amber-400 font-bold">SYSTEM STATUS: ONLINE</div>
            <div className="typewriter text-green-400">LOADING DEVELOPMENT SERVICES...</div>
            <div className="terminal-prompt cursor text-green-400">CUSTOM SOFTWARE SOLUTIONS</div>
            <div className="terminal-prompt cursor text-amber-400">RETRO SYSTEM ARCHITECTURE</div>
            <div className="terminal-prompt cursor text-green-400">WEB APPLICATION DEVELOPMENT</div>
            <div className="terminal-prompt cursor text-amber-400">LEGACY SYSTEM MODERNIZATION</div>
            <div className="mt-4">
              <div className="text-xs mb-2 text-green-400">MEMORY USAGE:</div>
              <div className="loading-bar mb-2"></div>
              <div className="text-xs text-amber-400">64KB / 640KB AVAILABLE</div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div 
          className="button-grid w-full mb-8"
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
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="text-red-400 blink">●</span>
            <span className="text-green-400">READY</span>
            <span className="text-amber-400">●</span>
            <span className="text-green-400">CONNECTED</span>
            <span className="text-green-400 terminal-glow">●</span>
            <span className="text-green-400">ONLINE</span>
          </div>
          
          <div className="text-xs text-amber-400">
            ◄ ► PRESS [SPACE] TO CONTINUE ◄ ►
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-green-400">
            <span>█▓▒░</span>
            <span className="blink">LOADING...</span>
            <span>░▒▓█</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-green-400 p-4 text-center text-xs bg-black">
        <div className="space-y-1">
          <div className="text-green-400">COPYRIGHT (C) 2024 KOR SYSTEMS - ALL RIGHTS RESERVED</div>
          <div className="text-amber-400">TERMINAL EMULATION MODE - PHOSPHOR DISPLAY ACTIVE</div>
          <div className="text-red-400 blink">WARNING: RETRO MODE ENGAGED</div>
        </div>
      </div>

      {/* Terminal Modal */}
      <AnimatePresence>
        {terminalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="terminal-window w-full max-w-4xl h-96 flex flex-col bg-black border-2 border-green-400">
              <div className="flex justify-between items-center p-2 border-b border-green-400">
                <span className="font-bold text-green-400">KOR TERMINAL v1.0</span>
                <button 
                  onClick={closeTerminal} 
                  className="text-red-400 hover:bg-red-400 hover:text-black px-2 transition-none"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                <div className="space-y-1 text-green-400">
                  <div className="text-amber-400">KOR SYSTEMS TERMINAL INTERFACE</div>
                  <div>Type 'help' for available commands</div>
                  <div className="terminal-prompt">help</div>
                  <div>Available commands:</div>
                  <div className="ml-4 text-amber-400">about - System information</div>
                  <div className="ml-4 text-amber-400">services - Available services</div>
                  <div className="ml-4 text-amber-400">contact - Contact information</div>
                  <div className="ml-4 text-amber-400">clear - Clear terminal</div>
                  <div className="ml-4 text-amber-400">exit - Close terminal</div>
                  <div className="terminal-prompt cursor">_</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retro CSS */}
      <style jsx>{`
        .retro-container {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
          -webkit-font-smoothing: none;
          -moz-osx-font-smoothing: unset;
        }

        .crt-screen {
          position: relative;
          background: #0a0a0a;
        }

        .scanlines {
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
          animation: scanlines 0.1s linear infinite;
          z-index: 100;
        }

        @keyframes scanlines {
          0% { transform: translateY(0px); }
          100% { transform: translateY(4px); }
        }

        .pixel-square {
          border-radius: 0;
        }

        .terminal-glow {
          text-shadow: 0 0 10px currentColor;
          animation: terminal-glow 2s ease-in-out infinite;
        }

        @keyframes terminal-glow {
          0%, 100% { text-shadow: 0 0 10px currentColor; }
          50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
        }

        .pixel-float {
          animation: pixel-float 3s ease-in-out infinite;
        }

        @keyframes pixel-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        .ascii-logo {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 800;
          line-height: 0.8;
          letter-spacing: -1px;
          font-size: clamp(12px, 4vw, 24px);
          white-space: pre;
        }

        .terminal-window {
          box-shadow: 
            0 0 20px rgba(0, 255, 65, 0.3),
            inset 0 0 20px rgba(0, 255, 65, 0.1);
        }

        .pixel-button {
          background: #0a0a0a;
          border: 2px solid #00ff41;
          color: #00ff41;
          padding: 8px 16px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: none;
          cursor: pointer;
          box-shadow: 4px 4px 0px #00ff41;
          border-radius: 0;
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

        .power-button {
          background: #ff4444;
          border: 2px solid #ff4444;
          color: white;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          cursor: pointer;
          border-radius: 0;
        }

        .power-button:hover {
          animation: blink 0.5s infinite;
          background: white;
          color: #ff4444;
        }

        .loading-bar {
          background: #333;
          border: 1px solid #00ff41;
          height: 16px;
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
          animation: loading-bar 3s ease-in-out infinite;
        }

        @keyframes loading-bar {
          0% { width: 0%; }
          100% { width: 100%; }
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

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .blink {
          animation: blink 1s infinite;
        }

        .terminal-prompt::before {
          content: '> ';
          color: #00ff41;
          font-weight: bold;
        }

        .cursor::after {
          content: '█';
          animation: blink 1s infinite;
          color: #00ff41;
        }

        .button-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          max-width: 600px;
          margin: 0 auto;
        }

        @media (max-width: 640px) {
          .button-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .ascii-logo {
            font-size: 10px;
          }
          
          .pixel-button {
            padding: 6px 12px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}
