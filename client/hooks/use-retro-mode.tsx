import { createContext, useContext, useEffect, useState } from "react"

type RetroMode = "retro" | "modern"

type RetroModeProviderProps = {
  children: React.ReactNode
  defaultMode?: RetroMode
  storageKey?: string
}

type RetroModeProviderState = {
  mode: RetroMode
  setMode: (mode: RetroMode) => void
  toggleMode: () => void
}

const initialState: RetroModeProviderState = {
  mode: "modern",
  setMode: () => null,
  toggleMode: () => null,
}

const RetroModeProviderContext = createContext<RetroModeProviderState>(initialState)

export function RetroModeProvider({
  children,
  defaultMode = "modern",
  storageKey = "retro-mode",
  ...props
}: RetroModeProviderProps) {
  const [mode, setMode] = useState<RetroMode>(
    () => (localStorage.getItem(storageKey) as RetroMode) || defaultMode
  )

  useEffect(() => {
    const root = window.document.documentElement
    
    root.classList.remove("retro", "modern")
    
    if (mode === "retro") {
      root.classList.add("retro")
    } else {
      root.classList.add("modern")
    }
    
    localStorage.setItem(storageKey, mode)
  }, [mode, storageKey])

  const toggleMode = () => {
    setMode(mode === "retro" ? "modern" : "retro")
  }

  const value = {
    mode,
    setMode,
    toggleMode,
  }

  return (
    <RetroModeProviderContext.Provider {...props} value={value}>
      {children}
    </RetroModeProviderContext.Provider>
  )
}

export const useRetroMode = () => {
  const context = useContext(RetroModeProviderContext)

  if (context === undefined)
    throw new Error("useRetroMode must be used within a RetroModeProvider")

  return context
}
