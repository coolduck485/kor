import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/use-theme";

export default function Index() {
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [badgeMousePosition, setBadgeMousePosition] = useState({
    x: 0,
    y: 0,
    isNear: false,
  });
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorTrails, setCursorTrails] = useState<Array<{id: number, x: number, y: number}>>([]);

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });

      // Add cursor trail effect
      setCursorTrails(prev => {
        const newTrail = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY
        };
        return [...prev.slice(-8), newTrail]; // Keep only last 8 trails
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Trigger loading animation after a short delay
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // Clean up old cursor trails
    const trailCleanup = setInterval(() => {
      setCursorTrails(prev => prev.slice(-5));
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(loadTimer);
      clearInterval(trailCleanup);
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
      {/* Theme Toggle */}
      <ThemeToggle />
      {/* Cursor Trail Effects */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {cursorTrails.map((trail, index) => (
          <div
            key={trail.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: trail.x - 6,
              top: trail.y - 6,
              background: `radial-gradient(circle, rgba(73, 146, 255, ${0.8 - index * 0.1}) 0%, transparent 70%)`,
              animation: `cursor-trail 0.8s ease-out forwards`,
              animationDelay: `${index * 0.05}s`,
              transform: `scale(${1 - index * 0.1})`,
            }}
          />
        ))}
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
              background: `radial-gradient(circle, rgba(${73 + (i * 10)}, ${146 + (i * 5)}, 255, 0.3) 0%, transparent 70%)`,
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
        className="absolute top-28 left-0 right-0 flex justify-center z-20 animate-gentleBounce"
        style={{ marginTop: "10px" }}
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
            className={`font-inter text-xs md:text-sm font-normal text-center animate-textGlow ${
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

        {/* Central Glowing Orb - SVG Based with Magnetic Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative animate-float cursor-pointer group"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              const deltaX = (e.clientX - centerX) * 0.1;
              const deltaY = (e.clientY - centerY) * 0.1;
              e.currentTarget.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0px, 0px) scale(1)';
            }}
            style={{
              transition: 'transform 0.3s ease-out',
            }}
          >
            <svg
              width="292"
              height="308"
              viewBox="0 0 1284 810"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[45rem] h-[45rem] sm:w-[60rem] sm:h-[60rem] md:w-[75rem] md:h-[75rem] lg:w-[90rem] lg:h-[90rem]"
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

        {/* Text Content - Moved up */}
        <div className="relative z-10 px-4 -mt-16">
          {/* Kor - moved further to the left */}
          <div
            className="text-center transform -translate-x-8 sm:-translate-x-12 md:-translate-x-16 lg:-translate-x-20"
            style={{ marginLeft: "-5px" }}
          >
            <h1
              className={`font-poppins text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight relative ${
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

              <p className="font-poppins text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold relative z-10">
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
                  <div className="warm-glow-text animate-warm-glow-pulse">
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
                  </div>

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
                              animation: "gentle-pulse 4s ease-in-out infinite",
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
              </p>
            </div>
          </div>
        </div>

        {/* Orb-Floating Navigation Buttons - positioned relative to orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Animated Connection Lines Between Buttons */}
            <svg className="absolute inset-0 pointer-events-none" width="600" height="600" style={{ left: "-300px", top: "-300px" }}>
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
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
      </div>

      {/* Scroll/Swipe Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center space-y-3 animate-button-float">
          {/* Desktop: Scroll Down */}
          <span
            className={`hidden lg:block font-inter text-sm font-medium animate-text-glow ${
              theme === "light" ? "text-gray-600" : "text-white/70"
            }`}
          >
            Scroll Down
          </span>
          {/* Mobile/Tablet: Swipe Down */}
          <span
            className={`lg:hidden font-inter text-sm font-medium animate-text-glow ${
              theme === "light" ? "text-gray-600" : "text-white/70"
            }`}
          >
            Swipe Down
          </span>

          {/* Desktop: Mouse scroll indicator */}
          <div className="hidden lg:flex relative w-6 h-10 border-2 border-white/40 rounded-full justify-center backdrop-blur-sm bg-white/5">
            <div
              className="w-1 h-3 bg-gradient-to-b from-glow-blue to-white/80 rounded-full mt-2 animate-float shadow-lg"
              style={{
                boxShadow: "0 0 10px rgba(73, 146, 255, 0.5)",
              }}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
          </div>

          {/* Mobile/Tablet: Phone with swipe indicator */}
          <div className="lg:hidden relative">
            {/* Phone Icon */}
            <div className="relative w-8 h-12 border-2 border-white/40 rounded-lg backdrop-blur-sm bg-white/5 flex items-center justify-center">
              {/* Phone screen */}
              <div className="w-4 h-7 bg-white/10 rounded-sm relative overflow-hidden">
                {/* Swipe gesture indicator */}
                <div
                  className="absolute w-6 h-0.5 bg-gradient-to-r from-transparent via-glow-blue to-transparent rounded-full animate-swipe-down shadow-lg"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    boxShadow: "0 0 8px rgba(73, 146, 255, 0.6)",
                  }}
                />
                {/* Second swipe line for better effect */}
                <div
                  className="absolute w-4 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full animate-swipe-down-delayed"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              {/* Phone speaker */}
              <div className="absolute top-1 w-2 h-0.5 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background Animations */}
      <style jsx>{`
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
      `}</style>
    </motion.div>
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
      angle: -30, // Position: top-right, more evenly spaced
      radius: 280, // Consistent distance from center
      position: "top-right", // Visual description (for reference only)
      animationDelay: 0.2, // When button appears (in seconds)
      size: "medium", // Button size variant
      accent: "blue", // Color accent - unified to blue

      // Fine-tune positioning (these are added to calculated position)
      xOffset: 0, // Centered positioning for cleaner look
      yOffset: -20, // Adjusted for mobile positioning

      // Override global settings for this button (optional)
      customRadiusMultiplier: null, // Set to override global radius multiplier for all screen sizes
    },

    {
      text: "Services",
      angle: 30, // Position: bottom-right, mirrored from About us for symmetry
      radius: 280, // Consistent distance from center
      position: "bottom-right",
      animationDelay: 0.6,
      size: "medium", // Consistent sizing
      accent: "blue", // Color accent - unified to blue

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
// Change: hoverScale: 1.05  →  hoverScale: 1.15
//
// ========================================

function OrbFloatingButtons() {
  const { theme } = useTheme();
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
      className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-gentleFloat"
      style={
        {
          "--mobile-x": `${Math.max(-120, Math.min(120, x * radius * mobileMultiplier + xOffset + (text === "About us" ? -60 : 0)))}px`,
          "--mobile-y": `${Math.max(-120, Math.min(120, y * radius * mobileMultiplier + yOffset))}px`,
          "--tablet-x": `${Math.max(-180, Math.min(180, x * radius * tabletMultiplier + xOffset + (text === "About us" ? -60 : 0)))}px`,
          "--tablet-y": `${Math.max(-150, Math.min(150, y * radius * tabletMultiplier + yOffset))}px`,
          "--desktop-x": `${x * radius * desktopMultiplier + xOffset + (text === "About us" ? -100 : 0)}px`,
          "--desktop-y": `${y * radius * desktopMultiplier + yOffset}px`,
          marginLeft: "var(--mobile-x)",
          marginTop: "var(--mobile-y)",
          animationDelay: `${delay}s`,
          transform: `scale(${currentSize.scale})`,
          animation: `gentleFloat 4s ease-in-out infinite ${delay}s, button-drift ${8 + (delay * 2)}s ease-in-out infinite ${delay * 1.5}s`,
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
        className={`group relative ${currentSize.padding} ${currentSize.radius} border-2 backdrop-blur-2xl hover:backdrop-blur-3xl transition-all duration-700 hover:shadow-2xl active:scale-95 overflow-hidden ${
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
