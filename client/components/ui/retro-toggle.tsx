import { Gamepad2, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRetroMode } from "@/hooks/use-retro-mode";

export function RetroToggle() {
  const { mode, toggleMode } = useRetroMode();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleMode}
      className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-none"
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
