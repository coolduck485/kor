import { useState, useEffect } from "react";

export default function Index() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Mouse Follower Effect */}
      <div
        className="absolute pointer-events-none opacity-30 transition-all duration-1000 ease-out"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(73, 146, 255, 0.1) 0%, transparent 70%)",
          width: "600px",
          height: "600px",
        }}
      />

      {/* Animated Glass Badge at Top */}
      <div
        className="absolute top-28 left-0 right-0 flex justify-center z-20 animate-gentleBounce"
        style={{ marginTop: "10px" }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-2 md:py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xs hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:scale-105">
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
            <h1 className="font-poppins text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight animate-text-glow">
              Kor
            </h1>
          </div>

          {/* Development services - keeping same position */}
          <div
            className="text-center transform translate-x-8 sm:translate-x-12 md:translate-x-16 mt-2 md:mt-4"
            style={{ marginLeft: "5px", marginTop: "-5px" }}
          >
            <p
              className="font-poppins text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-glow-text-light animate-text-glow"
              style={{ animationDelay: "1s" }}
            >
              Development services
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

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center space-y-3 animate-button-float">
          <span className="font-inter text-white/70 text-sm font-medium animate-text-glow">
            Scroll Down
          </span>
          <div className="relative w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm bg-white/5">
            <div
              className="w-1 h-3 bg-gradient-to-b from-glow-blue to-white/80 rounded-full mt-2 animate-float shadow-lg"
              style={{
                boxShadow: "0 0 10px rgba(73, 146, 255, 0.5)",
              }}
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
          </div>
        </div>
      </div>
    </div>
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
    mobileRadiusMultiplier: 0.35, // Reduced for mobile to prevent cutoff
    tabletRadiusMultiplier: 0.6, // Good size for tablet
    desktopRadiusMultiplier: 0.6, // Good size for desktop

    // Global animation settings
    animationDuration: "600ms", // How long hover animations take
    hoverScale: 1.15, // How much buttons grow on hover (1.15 = 15% bigger)
  },

  // Individual button configurations
  buttons: [
    {
      text: "About us",
      angle: -25, // Position: moved down from top-right (less negative = lower)
      radius: 290, // Distance from center (slightly increased)
      position: "right-side", // Visual description (for reference only)
      animationDelay: 0.2, // When button appears (in seconds)
      size: "medium", // Button size variant
      accent: "blue", // Color accent - unified to blue

      // Fine-tune positioning (these are added to calculated position)
      xOffset: -15, // Move slightly left for randomization
      yOffset: 35, // Move down significantly

      // Override global settings for this button (optional)
      customRadiusMultiplier: null, // Set to override global radius multiplier for all screen sizes
    },

    {
      text: "Services",
      angle: 45, // Position: bottom-right
      radius: 270, // Distance from center (increased for better spread)
      position: "bottom-right",
      animationDelay: 0.6,
      size: "large", // Bigger button
      accent: "blue", // Color accent - unified to blue

      // Custom positioning for Services button
      xOffset: 0, // Move left (-) or right (+) in pixels
      yOffset: 20, // Move down slightly

      // Services button now uses global positioning for consistency
      customRadiusMultiplier: null, // Use global multipliers for consistency
    },

    {
      text: "Portfolio",
      angle: 135, // Position: bottom-left
      radius: 270, // Distance from center (increased for better spread)
      position: "bottom-left",
      animationDelay: 1.0,
      size: "small", // Smaller button for variety
      accent: "blue", // Color accent - unified to blue

      xOffset: 0, // Move left (-) or right (+) in pixels
      yOffset: 20, // Move down slightly

      customRadiusMultiplier: null,
    },

    {
      text: "Contact us",
      angle: -135, // Position: moved further from Kor text (was -155, now -135)
      radius: 290, // Distance from center - increased to move further away
      position: "left-side",
      animationDelay: 1.4,
      size: "medium", // Standard size
      accent: "blue", // Color accent - unified to blue

      xOffset: -20, // Reduced offset for mobile compatibility (was -90, now -20)
      yOffset: 0, // Reset offset for cleaner positioning

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

  // Size configurations for different button variants
  const sizeConfig = {
    small: {
      padding: "px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5",
      text: "text-xs sm:text-sm md:text-sm",
      radius: "rounded-lg sm:rounded-xl md:rounded-2xl",
      scale: 0.9,
    },
    medium: {
      padding: "px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3",
      text: "text-sm sm:text-base md:text-base",
      radius: "rounded-xl sm:rounded-2xl md:rounded-3xl",
      scale: 1.0,
    },
    large: {
      padding: "px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4",
      text: "text-base sm:text-lg md:text-xl",
      radius: "rounded-2xl sm:rounded-3xl md:rounded-3xl",
      scale: 1.15,
    },
  };

  // Accent color configurations
  const accentConfig = {
    cyan: {
      glow: "rgba(34, 211, 238, 0.6)",
      gradient: "from-cyan-400/20 via-cyan-300/10 to-transparent",
      shadow: "0 0 25px rgba(34, 211, 238, 0.4), 0 0 50px rgba(34, 211, 238, 0.2)",
      border: "border-cyan-300/30",
      bg: "bg-cyan-400/5",
    },
    purple: {
      glow: "rgba(147, 51, 234, 0.6)",
      gradient: "from-purple-400/20 via-purple-300/10 to-transparent",
      shadow: "0 0 25px rgba(147, 51, 234, 0.4), 0 0 50px rgba(147, 51, 234, 0.2)",
      border: "border-purple-300/30",
      bg: "bg-purple-400/5",
    },
    blue: {
      glow: "rgba(59, 130, 246, 0.6)",
      gradient: "from-blue-400/20 via-blue-300/10 to-transparent",
      shadow: "0 0 25px rgba(59, 130, 246, 0.4), 0 0 50px rgba(59, 130, 246, 0.2)",
      border: "border-blue-300/30",
      bg: "bg-blue-400/5",
    },
    green: {
      glow: "rgba(34, 197, 94, 0.6)",
      gradient: "from-green-400/20 via-green-300/10 to-transparent",
      shadow: "0 0 25px rgba(34, 197, 94, 0.4), 0 0 50px rgba(34, 197, 94, 0.2)",
      border: "border-green-300/30",
      bg: "bg-green-400/5",
    },
  };

  const currentSize = sizeConfig[size as keyof typeof sizeConfig] || sizeConfig.medium;
  const currentAccent = accentConfig[accent as keyof typeof accentConfig] || accentConfig.cyan;

  return (
    <div
      className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-gentleFloat"
      style={
        {
          "--mobile-x": `${x * radius * mobileMultiplier + xOffset}px`,
          "--mobile-y": `${y * radius * mobileMultiplier + yOffset}px`,
          "--tablet-x": `${x * radius * tabletMultiplier + xOffset}px`,
          "--tablet-y": `${y * radius * tabletMultiplier + yOffset}px`,
          "--desktop-x": `${x * radius * desktopMultiplier + xOffset}px`,
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
          e.currentTarget.style.boxShadow = "0 0 25px rgba(73, 146, 255, 0.4), 0 0 50px rgba(73, 146, 255, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `scale(1) rotateY(0deg)`;
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Animated background layers */}
        <div className={`absolute inset-0 ${currentSize.radius} bg-gradient-to-br from-blue-400/20 via-blue-300/10 to-transparent opacity-50 group-hover:opacity-70 transition-all duration-500`} />
        <div className={`absolute inset-0 ${currentSize.radius} bg-gradient-to-tl from-white/20 via-transparent to-white/10 opacity-30 group-hover:opacity-50 transition-all duration-500`} />

        {/* Futuristic circuit-like patterns */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all duration-500">
          <div className="absolute top-1 left-1 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Holographic scanning line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <div
            className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
            style={{ animationDelay: "0.2s" }}
          />
        </div>

        {/* Pulsing border effect */}
        <div className={`absolute inset-0 ${currentSize.radius} border border-white/10 group-hover:border-white/30 transition-all duration-500 animate-pulse opacity-50`} />

        {/* Button text with enhanced styling and glow animation */}
        <span className={`relative text-white/90 ${currentSize.text} font-semibold group-hover:text-white transition-all duration-500 drop-shadow-lg whitespace-nowrap tracking-wide font-poppins`}
          style={{
            textShadow: `0 0 10px rgba(73, 146, 255, 0.6), 0 0 20px rgba(73, 146, 255, 0.4)`,
          }}
        >
          {text}
        </span>

        {/* Enhanced 3D depth effect */}
        <div className={`absolute inset-0 ${currentSize.radius} opacity-0 group-hover:opacity-100 transition-all duration-700`}
          style={{
            background: `linear-gradient(145deg, transparent 0%, rgba(73, 146, 255, 0.2) 50%, transparent 100%)`,
            transform: "translateZ(10px)",
          }}
        />

        {/* Holographic shimmer effect */}
        <div className={`absolute top-0.5 left-0.5 right-0.5 h-1/3 ${currentSize.radius} bg-gradient-to-b from-white/25 via-white/10 to-transparent opacity-40 group-hover:opacity-70 transition-all duration-500`} />

        {/* Bottom reflection */}
        <div className={`absolute bottom-0.5 left-0.5 right-0.5 h-1/4 ${currentSize.radius} bg-gradient-to-t from-white/15 to-transparent opacity-30 group-hover:opacity-50 transition-all duration-500`} />
      </button>
    </div>
  );
}
