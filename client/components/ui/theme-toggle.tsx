import { Palette, RotateCcw } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-pointer"
      style={{
        background:
          theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
        borderColor:
          theme === "light" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)",
      }}
    >
      {theme === "light" ? (
        <RotateCcw className="h-5 w-5 text-purple-600 transition-all" />
      ) : (
        <Palette className="h-5 w-5 text-cyan-400 transition-all" />
      )}
      <span className="sr-only">Invert colors</span>
    </Button>
  );
}
