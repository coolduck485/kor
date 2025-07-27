import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSolarSystemTheme } from "@/hooks/use-solar-system-theme";
import { SolarSystemToggle } from "@/components/ui/solar-system-toggle";
import { useTheme } from "@/hooks/use-theme";

// Planet data with realistic properties
const planets = [
  {
    name: "Mercury",
    size: 8,
    distance: 180,
    color: "bg-gray-400",
    speed: 4,
    glow: "rgba(156, 163, 175, 0.6)",
    description: "Closest to the Sun"
  },
  {
    name: "Venus",
    size: 12,
    distance: 220,
    color: "bg-yellow-300",
    speed: 7,
    glow: "rgba(253, 224, 71, 0.6)",
    description: "Hottest planet"
  },
  {
    name: "Earth",
    size: 14,
    distance: 280,
    color: "bg-blue-500",
    speed: 10,
    glow: "rgba(59, 130, 246, 0.6)",
    description: "Our home planet"
  },
  {
    name: "Mars",
    size: 10,
    distance: 340,
    color: "bg-red-500",
    speed: 15,
    glow: "rgba(239, 68, 68, 0.6)",
    description: "The Red Planet"
  },
  {
    name: "Jupiter",
    size: 30,
    distance: 450,
    color: "bg-orange-400",
    speed: 25,
    glow: "rgba(251, 146, 60, 0.6)",
    description: "Largest planet"
  },
  {
    name: "Saturn",
    size: 26,
    distance: 550,
    color: "bg-yellow-600",
    speed: 35,
    glow: "rgba(202, 138, 4, 0.6)",
    description: "The Ringed Planet"
  },
  {
    name: "Uranus",
    size: 20,
    distance: 650,
    color: "bg-cyan-400",
    speed: 45,
    glow: "rgba(34, 211, 238, 0.6)",
    description: "Ice Giant"
  },
  {
    name: "Neptune",
    size: 18,
    distance: 750,
    color: "bg-blue-800",
    speed: 55,
    glow: "rgba(30, 64, 175, 0.6)",
    description: "Windiest planet"
  }
];

// Asteroid belt data
const asteroids = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  distance: 380 + Math.random() * 40,
  speed: 18 + Math.random() * 4,
  angle: (i * 15) + Math.random() * 10
}));

// Comet data
const comets = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  delay: i * 20,
  duration: 60 + Math.random() * 30
}));

export default function SolarSystem() {
  const { isSolarSystemActive, toggleSolarSystemTheme } = useSolarSystemTheme();
  const { theme } = useTheme();
  const [showPlanetInfo, setShowPlanetInfo] = useState<string | null>(null);
  const [isHighPerformance, setIsHighPerformance] = useState(true);

  useEffect(() => {
    // Auto-activate solar system theme when visiting this page
    if (!isSolarSystemActive) {
      toggleSolarSystemTheme();
    }

    // Performance detection
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isLowEnd = navigator.hardwareConcurrency < 4;
      setIsHighPerformance(!isMobile && !isLowEnd);
    };

    checkPerformance();
  }, [isSolarSystemActive, toggleSolarSystemTheme]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Layers */}
      {isHighPerformance && (
        <>
          {/* Starfield Layer 1 - Distant stars */}
          <div className="stars-layer-1 fixed inset-0 opacity-80" />
          
          {/* Starfield Layer 2 - Medium stars */}
          <div className="fixed inset-0 opacity-60"
               style={{
                 backgroundImage: Array.from({ length: 100 }, (_, i) => 
                   `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 255, 255, ${0.3 + Math.random() * 0.7}) 1px, transparent 1px)`
                 ).join(', '),
                 backgroundSize: '100px 100px',
                 animation: 'starsFloat 120s linear infinite reverse'
               }} />
          
          {/* Starfield Layer 3 - Bright stars */}
          <div className="fixed inset-0 opacity-90"
               style={{
                 backgroundImage: Array.from({ length: 50 }, (_, i) => 
                   `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(255, 255, 255, ${0.8 + Math.random() * 0.2}) 2px, transparent 2px)`
                 ).join(', '),
                 backgroundSize: '200px 200px',
                 animation: 'starsFloat 180s linear infinite'
               }} />

          {/* Milky Way */}
          <div className="milky-way fixed inset-0" />

          {/* Nebula Effects */}
          <div className="fixed inset-0 opacity-20 pointer-events-none"
               style={{
                 background: `
                   radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                   radial-gradient(ellipse at 20% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                   radial-gradient(ellipse at 60% 60%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
                 `
               }} />

          {/* Space Dust */}
          <div className="space-dust fixed inset-0" />

          {/* Distant Galaxy */}
          <div className="fixed inset-0 opacity-10 pointer-events-none"
               style={{
                 background: `
                   radial-gradient(ellipse 800px 300px at 90% 10%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
                   radial-gradient(ellipse 600px 200px at 10% 90%, rgba(255, 255, 255, 0.08) 0%, transparent 40%)
                 `,
                 animation: 'galaxySpiral 120s ease-in-out infinite'
               }} />
        </>
      )}

      {/* Solar System Container */}
      <div className="fixed inset-0 flex items-center justify-center">
        {/* Sun with Triangular Rays */}
        <div className="relative">
          {/* Sun Core */}
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full relative z-10"
            style={{
              background: `radial-gradient(circle at 30% 30%, #ffeb3b 0%, #ffc107 30%, #ff9800 70%, #ff5722 100%)`,
              boxShadow: `
                0 0 40px rgba(255, 235, 59, 0.8),
                0 0 80px rgba(255, 193, 7, 0.6),
                0 0 120px rgba(255, 152, 0, 0.4),
                0 0 160px rgba(255, 87, 34, 0.2)
              `
            }}
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 40px rgba(255, 235, 59, 0.8), 0 0 80px rgba(255, 193, 7, 0.6), 0 0 120px rgba(255, 152, 0, 0.4), 0 0 160px rgba(255, 87, 34, 0.2)",
                "0 0 60px rgba(255, 235, 59, 1), 0 0 120px rgba(255, 193, 7, 0.8), 0 0 180px rgba(255, 152, 0, 0.6), 0 0 240px rgba(255, 87, 34, 0.4)",
                "0 0 40px rgba(255, 235, 59, 0.8), 0 0 80px rgba(255, 193, 7, 0.6), 0 0 120px rgba(255, 152, 0, 0.4), 0 0 160px rgba(255, 87, 34, 0.2)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Triangular Sun Rays */}
          {isHighPerformance && Array.from({ length: 16 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 origin-bottom"
              style={{
                width: 0,
                height: 0,
                borderLeft: '3px solid transparent',
                borderRight: '3px solid transparent',
                borderBottom: '20px solid rgba(255, 235, 59, 0.6)',
                transform: `translate(-50%, -50%) rotate(${i * 22.5}deg) translateY(-70px)`,
                filter: 'drop-shadow(0 0 8px rgba(255, 235, 59, 0.8))'
              }}
              animate={{ 
                borderBottomColor: [
                  'rgba(255, 235, 59, 0.6)',
                  'rgba(255, 193, 7, 0.8)',
                  'rgba(255, 235, 59, 0.6)'
                ],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Planets */}
          {planets.map((planet, index) => (
            <motion.div
              key={planet.name}
              className="absolute top-1/2 left-1/2"
              style={{
                width: `${planet.distance * 2}px`,
                height: `${planet.distance * 2}px`,
                margin: `-${planet.distance}px 0 0 -${planet.distance}px`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: planet.speed,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Orbital Path */}
              <div 
                className="absolute inset-0 rounded-full border border-white/10"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              />
              
              {/* Planet */}
              <motion.div
                className={`absolute top-0 left-1/2 ${planet.color} rounded-full cursor-pointer`}
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  marginLeft: `-${planet.size / 2}px`,
                  marginTop: `-${planet.size / 2}px`,
                  boxShadow: `0 0 ${planet.size * 2}px ${planet.glow}`,
                  filter: `drop-shadow(0 0 ${planet.size}px ${planet.glow})`
                }}
                whileHover={{ 
                  scale: 1.2,
                  boxShadow: `0 0 ${planet.size * 3}px ${planet.glow}`
                }}
                onClick={() => setShowPlanetInfo(showPlanetInfo === planet.name ? null : planet.name)}
                animate={{ rotate: -360 }}
                transition={{
                  duration: planet.speed,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* Saturn's Rings */}
                {planet.name === "Saturn" && (
                  <div 
                    className="absolute top-1/2 left-1/2 border-2 border-yellow-400/40 rounded-full pointer-events-none"
                    style={{
                      width: `${planet.size * 2}px`,
                      height: `${planet.size * 1.2}px`,
                      marginLeft: `-${planet.size}px`,
                      marginTop: `-${planet.size * 0.6}px`,
                      borderWidth: '1px'
                    }}
                  />
                )}

                {/* Planet Info Tooltip */}
                {showPlanetInfo === planet.name && (
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg backdrop-blur-sm border border-white/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    <div className="font-bold text-yellow-400">{planet.name}</div>
                    <div className="text-gray-300">{planet.description}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}

          {/* Asteroid Belt */}
          {isHighPerformance && asteroids.map((asteroid) => (
            <motion.div
              key={asteroid.id}
              className="absolute top-1/2 left-1/2"
              style={{
                width: `${asteroid.distance * 2}px`,
                height: `${asteroid.distance * 2}px`,
                margin: `-${asteroid.distance}px 0 0 -${asteroid.distance}px`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: asteroid.speed,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div
                className="absolute bg-gray-600 rounded-full"
                style={{
                  width: `${asteroid.size}px`,
                  height: `${asteroid.size}px`,
                  top: '0',
                  left: '50%',
                  marginLeft: `-${asteroid.size / 2}px`,
                  marginTop: `-${asteroid.size / 2}px`,
                  transform: `rotate(${asteroid.angle}deg)`
                }}
                animate={{ 
                  rotate: [asteroid.angle, asteroid.angle + 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Comets */}
        {isHighPerformance && comets.map((comet) => (
          <motion.div
            key={comet.id}
            className="fixed w-2 h-2 bg-white rounded-full"
            style={{
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(59, 130, 246, 0.6)',
              filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))'
            }}
            initial={{ 
              x: '-10vw', 
              y: '60vh',
              opacity: 0
            }}
            animate={{ 
              x: '110vw', 
              y: '10vh',
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: comet.duration,
              repeat: Infinity,
              delay: comet.delay,
              ease: "easeInOut"
            }}
          >
            {/* Comet Trail */}
            <div 
              className="absolute top-1/2 right-full w-20 h-1 bg-gradient-to-l from-white/80 to-transparent rounded-full"
              style={{
                transform: 'translateY(-50%)',
                filter: 'blur(1px)'
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* UI Controls */}
      <div className="fixed top-4 right-4 z-50">
        <SolarSystemToggle />
      </div>

      {/* Welcome Message */}
      <motion.div
        className="fixed top-1/2 right-8 transform -translate-y-1/2 text-right z-40"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4"
            style={{
              textShadow: '0 0 20px rgba(255, 235, 59, 0.6), 0 0 40px rgba(255, 193, 7, 0.4)',
              filter: 'drop-shadow(0 0 10px rgba(255, 235, 59, 0.8))'
            }}>
          KOR Systems
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-6">
          Exploring Digital Galaxies
        </p>
        <div className="text-gray-400 text-sm">
          <p>Click planets to learn more</p>
          <p>Watch the cosmic dance</p>
        </div>
      </motion.div>

      {/* Performance Warning for Mobile */}
      {!isHighPerformance && (
        <div className="fixed bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg border border-yellow-400/50 backdrop-blur-sm">
          <p className="text-sm text-yellow-400">
            ⚡ Reduced effects for optimal performance on your device
          </p>
        </div>
      )}
    </div>
  );
}
