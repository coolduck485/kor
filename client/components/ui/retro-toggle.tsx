import { Monitor, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRetroMode } from "@/hooks/use-retro-mode"

export function RetroToggle() {
  const { mode, toggleMode } = useRetroMode()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMode}
      className="border-input bg-background hover:bg-accent hover:text-accent-foreground"
    >
      {mode === "retro" ? (
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Terminal className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle retro mode</span>
    </Button>
  )
}
