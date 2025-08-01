import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { Home, User, Briefcase, Mail, Settings } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: <Home size={16} /> },
  { id: "about", label: "About", icon: <User size={16} /> },
  { id: "services", label: "Services", icon: <Briefcase size={16} /> },
  { id: "contact", label: "Contact", icon: <Mail size={16} /> },
];

export function CenteredNavbar() {
  const { theme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div
        className={`
          relative px-6 py-3 rounded-2xl border backdrop-blur-2xl
          ${
            theme === "light"
              ? "border-blue-400/30 bg-white/20"
              : "border-blue-300/20 bg-blue-950/10"
          }
        `}
        style={{
          background:
            theme === "light"
              ? `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)`
              : `linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.05) 50%, rgba(59,130,246,0.02) 100%)`,
          boxShadow:
            theme === "light"
              ? "0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.2) inset"
              : "0 8px 32px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.1) inset",
        }}
      >
        {/* Glass reflection overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-50"
          style={{
            background:
              theme === "light"
                ? "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)",
          }}
        />

        <ul className="flex items-center space-x-8 relative z-10">
          {navItems.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <motion.a
                href={item.href || `#${item.id}`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                  ${
                    theme === "light"
                      ? "text-gray-700 hover:text-blue-600 hover:bg-white/30"
                      : "text-gray-200 hover:text-blue-400 hover:bg-blue-400/10"
                  }
                `}
                style={{
                  textShadow:
                    theme === "light"
                      ? "0 1px 2px rgba(0,0,0,0.1)"
                      : "0 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                <span className="opacity-80">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </motion.a>
            </motion.li>
          ))}
        </ul>

        {/* Subtle glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-30 blur-xl"
          style={{
            background:
              theme === "light"
                ? "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(147,197,253,0.1) 100%)"
                : "linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(147,197,253,0.1) 100%)",
          }}
        />
      </div>
    </motion.nav>
  );
}
