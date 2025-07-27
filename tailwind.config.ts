import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        glow: {
          blue: "#4992FF",
          "blue-light": "#3FBAFF",
          "blue-dark": "#3987E3",
          "text-light": "#B2E3FF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "orb-pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            filter: "brightness(1) saturate(1) hue-rotate(0deg)",
          },
          "25%": {
            transform: "scale(1.05)",
            filter: "brightness(1.3) saturate(1.4) hue-rotate(5deg)",
          },
          "50%": {
            transform: "scale(1.1)",
            filter: "brightness(1.5) saturate(1.6) hue-rotate(10deg)",
          },
          "75%": {
            transform: "scale(1.05)",
            filter: "brightness(1.3) saturate(1.4) hue-rotate(5deg)",
          },
        },
        "orb-rotate": {
          "0%": {
            background:
              "linear-gradient(0deg, #3FBAFF 0.45%, #4992FF 60.5%, #3987E3 122.16%)",
          },
          "25%": {
            background:
              "linear-gradient(90deg, #3FBAFF 0.45%, #4992FF 60.5%, #3987E3 122.16%)",
          },
          "50%": {
            background:
              "linear-gradient(180deg, #3FBAFF 0.45%, #4992FF 60.5%, #3987E3 122.16%)",
          },
          "75%": {
            background:
              "linear-gradient(270deg, #3FBAFF 0.45%, #4992FF 60.5%, #3987E3 122.16%)",
          },
          "100%": {
            background:
              "linear-gradient(360deg, #3FBAFF 0.45%, #4992FF 60.5%, #3987E3 122.16%)",
          },
        },
        "glow-intensity": {
          "0%, 100%": {
            boxShadow: `
              0 0 60px rgba(73, 146, 255, 0.8),
              0 0 120px rgba(73, 146, 255, 0.6),
              0 0 200px rgba(73, 146, 255, 0.4),
              0 0 300px rgba(73, 146, 255, 0.2),
              0 0 400px rgba(73, 146, 255, 0.1)
            `,
          },
          "50%": {
            boxShadow: `
              0 0 100px rgba(73, 146, 255, 1),
              0 0 200px rgba(73, 146, 255, 0.8),
              0 0 350px rgba(73, 146, 255, 0.6),
              0 0 500px rgba(73, 146, 255, 0.4),
              0 0 700px rgba(73, 146, 255, 0.2)
            `,
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px) rotateZ(0deg)",
          },
          "33%": {
            transform: "translateY(-12px) rotateZ(1deg)",
          },
          "66%": {
            transform: "translateY(-8px) rotateZ(-1deg)",
          },
        },
        "float-delayed": {
          "0%, 100%": {
            transform: "translateY(0px) rotateZ(0deg)",
          },
          "33%": {
            transform: "translateY(-8px) rotateZ(-1deg)",
          },
          "66%": {
            transform: "translateY(-15px) rotateZ(1deg)",
          },
        },
        "text-glow": {
          "0%, 100%": {
            textShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          },
          "50%": {
            textShadow:
              "0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(73, 146, 255, 0.3)",
          },
        },
        "button-float": {
          "0%, 100%": {
            transform: "translateY(0px) translateX(0px) rotateZ(0deg)",
          },
          "25%": {
            transform: "translateY(-8px) translateX(2px) rotateZ(0.5deg)",
          },
          "50%": {
            transform: "translateY(-15px) translateX(0px) rotateZ(0deg)",
          },
          "75%": {
            transform: "translateY(-8px) translateX(-2px) rotateZ(-0.5deg)",
          },
        },
        "gentle-float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-8px)",
          },
        },
        "gentle-bounce": {
          "0%, 100%": {
            transform: "translateY(0px) scale(1)",
          },
          "50%": {
            transform: "translateY(-3px) scale(1.02)",
          },
        },
        sparkle: {
          "0%, 100%": {
            transform: "rotate(0deg) scale(1)",
            opacity: "0.8",
          },
          "25%": {
            transform: "rotate(90deg) scale(1.1)",
            opacity: "1",
          },
          "50%": {
            transform: "rotate(180deg) scale(1)",
            opacity: "0.9",
          },
          "75%": {
            transform: "rotate(270deg) scale(1.1)",
            opacity: "1",
          },
        },
        "text-glow": {
          "0%, 100%": {
            textShadow: "0 0 5px rgba(34, 211, 238, 0.3)",
          },
          "50%": {
            textShadow:
              "0 0 10px rgba(34, 211, 238, 0.6), 0 0 20px rgba(34, 211, 238, 0.3)",
          },
        },
        "swipe-down": {
          "0%": {
            top: "10%",
            opacity: "0",
          },
          "30%": {
            opacity: "1",
          },
          "70%": {
            opacity: "1",
          },
          "100%": {
            top: "70%",
            opacity: "0",
          },
        },
        "swipe-down-delayed": {
          "0%": {
            top: "5%",
            opacity: "0",
          },
          "20%": {
            opacity: "0",
          },
          "50%": {
            opacity: "0.6",
          },
          "80%": {
            opacity: "0.6",
          },
          "100%": {
            top: "75%",
            opacity: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "orb-pulse": "orb-pulse 4s ease-in-out infinite",
        "orb-rotate": "orb-rotate 8s linear infinite",
        "glow-intensity": "glow-intensity 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float-delayed 6s ease-in-out infinite 2s",
        "text-glow": "text-glow 3s ease-in-out infinite",
        "button-float": "button-float 5s ease-in-out infinite",
        gentleFloat: "gentle-float 4s ease-in-out infinite",
        gentleBounce: "gentle-bounce 3s ease-in-out infinite",
        sparkle: "sparkle 6s ease-in-out infinite",
        textGlow: "text-glow 4s ease-in-out infinite",
        "swipe-down": "swipe-down 2s ease-in-out infinite",
        "swipe-down-delayed": "swipe-down-delayed 2s ease-in-out infinite 0.3s",
        "mobile-notification-enter": "mobile-notification-enter 0.3s ease-out forwards",
        "mobile-notification-exit": "mobile-notification-exit 0.2s ease-in forwards",
        "tablet-notification-enter": "tablet-notification-enter 0.25s ease-out forwards",
        "tablet-notification-exit": "tablet-notification-exit 0.25s ease-in forwards",
        "desktop-notification-enter": "desktop-notification-enter 0.4s ease-out forwards",
        "desktop-notification-exit": "desktop-notification-exit 0.35s ease-in forwards",
      },
      boxShadow: {
        glow: "0 0 100px rgba(73, 146, 255, 0.5), 0 0 200px rgba(73, 146, 255, 0.3), 0 0 300px rgba(73, 146, 255, 0.2)",
        "glow-intense":
          "0 0 50px rgba(73, 146, 255, 0.8), 0 0 100px rgba(73, 146, 255, 0.6), 0 0 200px rgba(73, 146, 255, 0.4)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
