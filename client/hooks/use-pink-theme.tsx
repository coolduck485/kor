import React, { createContext, useContext, useEffect, useState } from "react";

type PinkTheme = "default" | "pink";

interface PinkThemeContextType {
  pinkTheme: PinkTheme;
  setPinkTheme: (theme: PinkTheme) => void;
  togglePinkTheme: () => void;
  isPinkActive: boolean;
}

const PinkThemeContext = createContext<PinkThemeContextType | undefined>(undefined);

export function PinkThemeProvider({ children }: { children: React.ReactNode }) {
  const [pinkTheme, setPinkTheme] = useState<PinkTheme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem("pink-theme") as PinkTheme | null;
    return stored || "default";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all pink theme classes
    root.classList.remove("pink-theme", "default-theme");
    
    // Add the current pink theme class
    root.classList.add(pinkTheme === "pink" ? "pink-theme" : "default-theme");

    // Store in localStorage
    localStorage.setItem("pink-theme", pinkTheme);

    // Set CSS custom properties for pink theme
    if (pinkTheme === "pink") {
      root.style.setProperty("--pink-primary", "340 75% 68%");
      root.style.setProperty("--pink-secondary", "340 65% 85%");
      root.style.setProperty("--pink-accent", "340 82% 75%");
      root.style.setProperty("--pink-muted", "340 45% 95%");
      root.style.setProperty("--pink-glow", "340 100% 70%");
      root.style.setProperty("--pink-glow-intense", "340 100% 65%");
      root.style.setProperty("--pink-gradient-start", "340 75% 68%");
      root.style.setProperty("--pink-gradient-end", "320 65% 75%");
      root.style.setProperty("--pink-neon", "340 100% 80%");
      root.style.setProperty("--pink-soft", "340 50% 90%");
      root.style.setProperty("--pink-dark", "340 60% 20%");
    }
  }, [pinkTheme]);

  const togglePinkTheme = () => {
    setPinkTheme((prev) => (prev === "default" ? "pink" : "default"));
  };

  const isPinkActive = pinkTheme === "pink";

  return (
    <PinkThemeContext.Provider value={{ pinkTheme, setPinkTheme, togglePinkTheme, isPinkActive }}>
      {children}
    </PinkThemeContext.Provider>
  );
}

export function usePinkTheme() {
  const context = useContext(PinkThemeContext);
  if (context === undefined) {
    throw new Error("usePinkTheme must be used within a PinkThemeProvider");
  }
  return context;
}
