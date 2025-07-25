import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

export default function Index() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [badgeMousePosition, setBadgeMousePosition] = useState({
    x: 0,
    y: 0,
    isNear: false,
  });
  const badgeRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Trigger loading animation after a short delay
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
      className="relative min-h-screen bg-black overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
    >
      {/* Enhanced Background Elements */}
      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0 opacity-20"
        variants={fadeInScale}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
            animation: "backgroundShift 30s ease-in-out infinite alternate",
          }}
        />
      </motion.div>

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

      {/* Floating Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full opacity-60"
            style={{
              left: `${10 + ((i * 70) % 90)}%`,
              top: `${15 + ((i * 40) % 80)}%`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              background: `rgba(${73 + ((i * 20) % 50)}, ${146 + ((i * 10) % 30)}, 255, ${0.3 + (i % 3) * 0.2})`,
              animation: `gentleFloat ${4 + (i % 3)}s ease-in-out infinite ${i * 0.5}s`,
              filter: "blur(0.5px)",
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
              stroke="#22D3EE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 3.5V7.5"
              stroke="#22D3EE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 17.5V21.5"
              stroke="#22D3EE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 5.5H7"
              stroke="#22D3EE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 19.5H21"
              stroke="#22D3EE"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-inter text-white/80 text-xs md:text-sm font-normal text-center animate-textGlow">
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

        {/* Central Glowing Orb - SVG Based */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative animate-float">
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
            <h1 className="font-poppins text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight animate-text-reveal relative">
              <span
                className="inline-block animate-text-bounce relative"
                style={{
                  animationDelay: "0.8s",
                  textShadow:
                    "0 0 20px rgba(73, 146, 255, 0.6), 0 0 40px rgba(73, 146, 255, 0.4)",
                  animation:
                    "text-glow 3s ease-in-out infinite, text-bounce 2s ease-in-out 0.8s both",
                }}
              >
                K
              </span>
              <span
                className="inline-block animate-text-bounce relative"
                style={{
                  animationDelay: "1.4s",
                  textShadow:
                    "0 0 20px rgba(63, 186, 255, 0.6), 0 0 40px rgba(63, 186, 255, 0.4)",
                  animation:
                    "text-glow 3s ease-in-out infinite 1s, text-bounce 2s ease-in-out 1.4s both",
                }}
              >
                o
              </span>
              <span
                className="inline-block animate-text-bounce relative"
                style={{
                  animationDelay: "2.0s",
                  textShadow:
                    "0 0 20px rgba(57, 135, 227, 0.6), 0 0 40px rgba(57, 135, 227, 0.4)",
                  animation:
                    "text-glow 3s ease-in-out infinite 2s, text-bounce 2s ease-in-out 2.0s both",
                }}
              >
                r
              </span>
            </h1>
          </div>

          {/* Development services - keeping same position */}
          <div
            className="text-center transform translate-x-8 sm:translate-x-12 md:translate-x-16 mt-2 md:mt-4"
            style={{ marginLeft: "5px", marginTop: "-5px" }}
          >
            <p className="font-poppins text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold relative">
              <span
                className="relative inline-block shine-text-base"
                style={{
                  animationName: `shine-${SHINE_CONFIG.direction}`,
                  animationDuration: SHINE_CONFIG.duration,
                  animationDelay: SHINE_CONFIG.delay,
                  animationIterationCount: "infinite",
                  animationTimingFunction: "ease-in-out",
                }}
              >
                Development services
                {/* Simple 4-Point Stars - Match Figma Design */}
                {SHINE_CONFIG.showSparkles &&
                  [
                    // Upper right
                    { x: 95, y: -35, size: 0.6 },

                    // Right middle
                    { x: 75, y: -10, size: 0.4 },

                    // Lower right
                    { x: 120, y: 50, size: 0.5 },
                    { x: 90, y: 80, size: 0.7 },

                    // Lower center
                    { x: 25, y: 85, size: 0.4 },

                    // Lower left
                    { x: -40, y: 60, size: 0.5 },

                    // Far right
                    { x: 165, y: 15, size: 0.8 },
                  ].map((sparkle, i) => (
                    <div
                      key={`sparkle-${i}`}
                      className="absolute animate-sparkle-twinkle pointer-events-none"
                      style={{
                        left: `calc(50% + ${sparkle.x}px)`,
                        top: `calc(50% + ${sparkle.y}px)`,
                        animationDelay: `${i * 0.2 + 2}s`,
                        animationDuration: `${3 + Math.random() * 1.5}s`,
                        transform: `scale(${sparkle.size}) rotate(${Math.random() * 360}deg)`,
                        opacity: 0.9,
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                      />
                    </div>
                  ))}
              </span>
            </p>
          </div>
        </div>

        {/* Orb-Floating Navigation Buttons - positioned relative to orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
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
          <span className="hidden lg:block font-inter text-white/70 text-sm font-medium animate-text-glow">
            Scroll Down
          </span>
          {/* Mobile/Tablet: Swipe Down */}
          <span className="lg:hidden font-inter text-white/70 text-sm font-medium animate-text-glow">
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
          0%, 100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
        }

        @keyframes gentle-glow {
          0%, 100% {
            opacity: 0.20;
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
        className={`group relative ${currentSize.padding} ${currentSize.radius} border-2 border-blue-300/30 bg-blue-400/5 backdrop-blur-2xl hover:backdrop-blur-3xl transition-all duration-700 hover:border-white/40 hover:shadow-2xl active:scale-95 overflow-hidden`}
        style={{
          transitionDuration: ORB_BUTTON_CONFIG.global.animationDuration,
          transform: `scale(1)`,
          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
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
          <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
          <div
            className="absolute bottom-1 right-1 w-1 h-1 bg-white/40 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
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
          className={`absolute inset-0 ${currentSize.radius} border border-white/10 group-hover:border-white/30 transition-all duration-500 animate-pulse opacity-50`}
          style={{ left: "-50px" }}
        />

        {/* Button text with enhanced styling and glow animation */}
        <span
          className={`relative text-white/90 ${currentSize.text} font-semibold group-hover:text-white transition-all duration-500 drop-shadow-lg whitespace-nowrap tracking-wide font-poppins`}
          style={{
            textShadow: `0 0 10px rgba(73, 146, 255, 0.6), 0 0 20px rgba(73, 146, 255, 0.4)`,
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
