import React, { createContext, useContext, useEffect, useState } from "react";

type SolarSystemTheme = "default" | "solar-system";

interface SolarSystemThemeContextType {
  solarSystemTheme: SolarSystemTheme;
  setSolarSystemTheme: (theme: SolarSystemTheme) => void;
  toggleSolarSystemTheme: () => void;
  isSolarSystemActive: boolean;
}

const SolarSystemThemeContext = createContext<SolarSystemThemeContextType | undefined>(
  undefined,
);

export function SolarSystemThemeProvider({ children }: { children: React.ReactNode }) {
  const [solarSystemTheme, setSolarSystemTheme] = useState<SolarSystemTheme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem("solar-system-theme") as SolarSystemTheme | null;
    return stored || "default";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all solar system theme classes
    root.classList.remove("solar-system-theme", "default-theme");

    // Add the current solar system theme class
    root.classList.add(solarSystemTheme === "solar-system" ? "solar-system-theme" : "default-theme");

    // Store in localStorage
    localStorage.setItem("solar-system-theme", solarSystemTheme);

    // Set CSS custom properties for solar system theme
    if (solarSystemTheme === "solar-system") {
      root.style.setProperty("--solar-primary", "45 93% 47%"); // Sun yellow
      root.style.setProperty("--solar-secondary", "39 90% 50%"); // Golden
      root.style.setProperty("--solar-accent", "51 100% 60%"); // Bright yellow
      root.style.setProperty("--solar-background", "0 0% 0%"); // Black space
      root.style.setProperty("--solar-surface", "240 10% 4%"); // Dark surface
      root.style.setProperty("--solar-text", "0 0% 98%"); // White text
      root.style.setProperty("--solar-text-muted", "0 0% 70%"); // Muted text
      root.style.setProperty("--solar-border", "45 93% 47%"); // Sun border
      root.style.setProperty("--solar-glow", "45 100% 60%"); // Sun glow
    }
  }, [solarSystemTheme]);

  const toggleSolarSystemTheme = () => {
    setSolarSystemTheme((prev) => (prev === "default" ? "solar-system" : "default"));
  };

  const isSolarSystemActive = solarSystemTheme === "solar-system";

  return (
    <SolarSystemThemeContext.Provider
      value={{ solarSystemTheme, setSolarSystemTheme, toggleSolarSystemTheme, isSolarSystemActive }}
    >
      {children}
    </SolarSystemThemeContext.Provider>
  );
}

export function useSolarSystemTheme() {
  const context = useContext(SolarSystemThemeContext);
  if (context === undefined) {
    throw new Error("useSolarSystemTheme must be used within a SolarSystemThemeProvider");
  }
  return context;
}
