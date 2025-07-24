import { useState, useEffect } from 'react';

export default function Index() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Mouse Follower Effect */}
      <div
        className="absolute pointer-events-none opacity-30 transition-all duration-1000 ease-out"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(73, 146, 255, 0.1) 0%, transparent 70%)',
          width: '600px',
          height: '600px',
        }}
      />

      {/* Animated Glass Badge at Top */}
      <div className="absolute top-28 left-0 right-0 flex justify-center z-20 animate-gentleBounce">
        <div className="inline-flex items-center gap-2 px-3 py-2 md:py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-xs hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:scale-105">
          {/* Animated Sparkle Icon */}
          <svg
            className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 animate-sparkle"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3.5L10.088 9.313C9.99015 9.61051 9.82379 9.88088 9.60234 10.1023C9.38088 10.3238 9.11051 10.4901 8.813 10.588L3 12.5L8.813 14.412C9.11051 14.5099 9.38088 14.6762 9.60234 14.8977C9.82379 15.1191 9.99015 15.3895 10.088 15.687L12 21.5L13.912 15.687C14.0099 15.3895 14.1762 15.1191 14.3977 14.8977C14.6191 14.6762 14.8895 14.5099 15.187 14.412L21 12.5L15.187 10.588C14.8895 10.4901 14.6191 10.3238 14.3977 10.1023C14.1762 9.88088 14.0099 9.61051 13.912 9.313L12 3.5Z" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 3.5V7.5" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 17.5V21.5" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 5.5H7" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 19.5H21" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <defs>
                <filter id="orbFilter" x="0.820007" y="-259.18" width="1282.36" height="1298.36" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="11.79"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="41.265"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="82.53"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="effect2_dropShadow" result="effect3_dropShadow"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="141.48"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="effect3_dropShadow" result="effect4_dropShadow"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="247.59"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.286275 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"/>
                  <feBlend mode="normal" in2="effect4_dropShadow" result="effect5_dropShadow"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect5_dropShadow" result="shape"/>
                  <feGaussianBlur stdDeviation="17.5" result="effect6_foregroundBlur"/>
                </filter>
                <linearGradient id="orbGradient" x1="496" y1="449.231" x2="853.699" y2="451.438" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3FBAFF"/>
                  <stop offset="0.493374" stopColor="#4992FF"/>
                  <stop offset="1" stopColor="#3987E3"/>
                </linearGradient>
              </defs>
              <g filter="url(#orbFilter)">
                <ellipse cx="642" cy="390" rx="146" ry="154" fill="url(#orbGradient)"/>
                <ellipse cx="642" cy="390" rx="146" ry="154" stroke="black"/>
              </g>
            </svg>
          </div>
        </div>

        {/* Text Content - Moved up */}
        <div className="relative z-10 px-4 -mt-16">
          {/* Kor - moved further to the left */}
          <div className="text-center transform -translate-x-8 sm:-translate-x-12 md:-translate-x-16 lg:-translate-x-20">
            <h1 className="font-poppins text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight animate-text-glow">
              Kor
            </h1>
          </div>

          {/* Development services - keeping same position */}
          <div className="text-center transform translate-x-8 sm:translate-x-12 md:translate-x-16 mt-2 md:mt-4">
            <p className="font-poppins text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-glow-text-light animate-text-glow"
               style={{ animationDelay: '1s' }}>
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
          <span className="font-inter text-white/70 text-sm font-medium animate-text-glow">Scroll Down</span>
          <div className="relative w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm bg-white/5">
            <div className="w-1 h-3 bg-gradient-to-b from-glow-blue to-white/80 rounded-full mt-2 animate-float shadow-lg"
                 style={{
                   boxShadow: '0 0 10px rgba(73, 146, 255, 0.5)'
                 }} />
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Configuration for orb-floating buttons
const ORB_BUTTON_CONFIG = {
  // Button data with unique positions organically spread around the orb
  buttons: [
    { text: "About us", angle: -65, radius: 220, position: "top-right", animationDelay: 0.2 },      // Upper right
    { text: "Services", angle: 25, radius: 180, position: "right", animationDelay: 0.6 },           // Lower right, closer
    { text: "Portfolio", angle: 125, radius: 190, position: "bottom-left", animationDelay: 1.0 },   // Lower left, moved closer
    { text: "Contact us", angle: -145, radius: 200, position: "top-left", animationDelay: 1.4 }     // Upper left, medium distance
  ]
};

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
}

function OrbFloatingButton({ text, angle, position, radius, delay }: OrbFloatingButtonProps) {
  const getStaticPosition = () => {
    // Convert angle to radians and calculate position
    const radian = (angle * Math.PI) / 180;
    const x = Math.cos(radian) * radius;
    const y = Math.sin(radian) * radius;

    return {
      position: 'absolute' as const,
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%)`,
      marginLeft: `${x}px`,
      marginTop: `${y}px`,
      animationDelay: `${delay}s`,
      zIndex: 20
    };
  };

  return (
    <div
      className="pointer-events-auto"
      style={getStaticPosition()}
    >
      <button className="group relative px-6 py-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:scale-105 animate-gentleBounce">
        {/* Animated Sparkle Icon */}
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <svg
            className="w-full h-full animate-sparkle opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3.5L10.088 9.313C9.99015 9.61051 9.82379 9.88088 9.60234 10.1023C9.38088 10.3238 9.11051 10.4901 8.813 10.588L3 12.5L8.813 14.412C9.11051 14.5099 9.38088 14.6762 9.60234 14.8977C9.82379 15.1191 9.99015 15.3895 10.088 15.687L12 21.5L13.912 15.687C14.0099 15.3895 14.1762 15.1191 14.3977 14.8977C14.6191 14.6762 14.8895 14.5099 15.187 14.412L21 12.5L15.187 10.588C14.8895 10.4901 14.6191 10.3238 14.3977 10.1023C14.1762 9.88088 14.0099 9.61051 13.912 9.313L12 3.5Z" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Enhanced glass layers */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/5 to-transparent" />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-blue-400/10 via-transparent to-white/5" />
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-50" />

        {/* Button text with enhanced styling and glow animation */}
        <span className="relative text-white/80 text-sm font-medium group-hover:text-white transition-all duration-300 drop-shadow-sm animate-textGlow">
          {text}
        </span>

        {/* Enhanced hover glow with pulsing effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"
             style={{
               boxShadow: '0 0 30px rgba(73, 146, 255, 0.4), 0 0 60px rgba(73, 146, 255, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.1)'
             }} />

        {/* Glass reflection with shimmer effect */}
        <div className="absolute top-1 left-1 right-1 h-1/3 rounded-t-2xl bg-gradient-to-b from-white/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      </button>
    </div>
  );
}
