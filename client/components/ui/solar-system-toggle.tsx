import { Sun, Stars } from "lucide-react";
import { useSolarSystemTheme } from "@/hooks/use-solar-system-theme";
import { useTheme } from "@/hooks/use-theme";
import { useRetroMode } from "@/hooks/use-retro-mode";
import { Button } from "@/components/ui/button";

export function SolarSystemToggle() {
  const { isSolarSystemActive, toggleSolarSystemTheme } = useSolarSystemTheme();
  const { theme } = useTheme();
  const { mode } = useRetroMode();

  return (
    <Button
      variant="outline"
      size="icon"
      className={`relative transition-all duration-500 ${
        isSolarSystemActive
          ? "bg-yellow-500/20 border-yellow-400/50 hover:bg-yellow-500/30 shadow-[0_0_20px_rgba(255,193,7,0.3)]"
          : "bg-transparent border-white/20 hover:bg-white/10"
      } ${
        theme === "light"
          ? "border-gray-300 hover:border-gray-400"
          : "hover:border-white/30"
      } backdrop-blur-sm`}
      onClick={() => {
        if (mode === "retro") return; // Disable in retro mode
        console.log("Solar system theme toggle clicked!");
        toggleSolarSystemTheme();
      }}
      disabled={mode === "retro"}
      style={{
        opacity: mode === "retro" ? 0.5 : 1,
        cursor: mode === "retro" ? "not-allowed" : "pointer",
        transform: isSolarSystemActive ? "scale(1.05)" : "scale(1)",
        boxShadow: isSolarSystemActive
          ? "0 0 25px rgba(255, 193, 7, 0.4), 0 0 50px rgba(255, 193, 7, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)"
          : "0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.1)",
      }}
    >
      {isSolarSystemActive ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400 animate-spin-slow" 
             style={{
               filter: "drop-shadow(0 0 8px rgba(255, 193, 7, 0.6))",
               animation: "spin 8s linear infinite"
             }} />
      ) : (
        <Stars className={`h-[1.2rem] w-[1.2rem] ${
          theme === "light" ? "text-gray-700" : "text-white/80"
        }`} />
      )}

      {/* Solar system theme indicator */}
      {isSolarSystemActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,193,7,0.8)]" />
      )}

      <span className="sr-only">Toggle Solar System Theme</span>
    </Button>
  );
}
