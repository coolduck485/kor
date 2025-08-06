import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { TooltipState } from "@/hooks/use-tooltip";

interface FloatingTooltipProps {
  tooltipState: TooltipState;
}

export function FloatingTooltip({ tooltipState }: FloatingTooltipProps) {
  const { theme } = useTheme();
  const { isVisible, content, position, side } = tooltipState;

  const getTooltipPosition = () => {
    let x = position.x;
    let y = position.y;
    
    switch (side) {
      case "top":
        return {
          x: x - 50, // Half of tooltip width estimate
          y: y - 40,
          transformOrigin: "bottom center",
        };
      case "bottom":
        return {
          x: x - 50,
          y: y + 10,
          transformOrigin: "top center",
        };
      case "left":
        return {
          x: x - 120,
          y: y - 20,
          transformOrigin: "center right",
        };
      case "right":
        return {
          x: x + 10,
          y: y - 20,
          transformOrigin: "center left",
        };
      default:
        return { x, y, transformOrigin: "center" };
    }
  };

  const tooltipPosition = getTooltipPosition();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            scale: 0.8,
            y: side === "top" ? 10 : side === "bottom" ? -10 : 0,
            x: side === "left" ? 10 : side === "right" ? -10 : 0
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0,
            x: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            y: side === "top" ? 10 : side === "bottom" ? -10 : 0,
            x: side === "left" ? 10 : side === "right" ? -10 : 0
          }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
          className={`fixed z-[100000] px-3 py-2 rounded-lg text-sm font-medium pointer-events-none backdrop-blur-md border shadow-lg ${
            theme === "light"
              ? "bg-white/90 text-gray-800 border-gray-200 shadow-gray-200/50"
              : "bg-gray-900/90 text-white border-gray-700 shadow-black/50"
          }`}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transformOrigin: tooltipPosition.transformOrigin,
            maxWidth: "200px",
            wordWrap: "break-word",
          }}
        >
          {content}
          
          {/* Tooltip arrow */}
          <div
            className={`absolute w-2 h-2 rotate-45 ${
              theme === "light"
                ? "bg-white/90 border-gray-200"
                : "bg-gray-900/90 border-gray-700"
            } ${
              side === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2 border-r border-b" :
              side === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2 border-l border-t" :
              side === "left" ? "right-[-4px] top-1/2 -translate-y-1/2 border-t border-r" :
              side === "right" ? "left-[-4px] top-1/2 -translate-y-1/2 border-b border-l" :
              ""
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
