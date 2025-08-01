import { Gamepad2, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRetroMode } from "@/hooks/use-retro-mode";
import { useTheme } from "@/hooks/use-theme";
import { usePinkTheme } from "@/hooks/use-pink-theme";

export function RetroToggle() {
  const { mode, toggleMode } = useRetroMode();
  const { theme } = useTheme();
  const { isPinkActive } = usePinkTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        if (isPinkActive) return; // Disable in pink theme mode
        console.log("Retro toggle clicked!");
        toggleMode();
      }}
      className={`h-10 w-10 rounded-full backdrop-blur-md border transition-all duration-300 ${
        isPinkActive
          ? "opacity-50 cursor-not-allowed bg-white/5 border-white/10"
          : "bg-white/10 border-white/20 hover:bg-white/20 hover:scale-110 cursor-pointer"
      }`}
      style={{
        background:
          theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
        borderColor:
          theme === "light" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)",
      }}
    >
      {mode === "retro" ? (
        <Monitor className="h-[1.2rem] w-[1.2rem] text-blue-500" />
      ) : (
        <Gamepad2 className="h-[1.2rem] w-[1.2rem] text-green-500" />
      )}
      <span className="sr-only">Toggle retro mode</span>
    </Button>
  );
}
