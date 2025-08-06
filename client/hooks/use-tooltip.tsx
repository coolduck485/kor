import { useState, useCallback } from "react";

export interface TooltipState {
  isVisible: boolean;
  content: string;
  position: { x: number; y: number };
  side: "top" | "bottom" | "left" | "right";
}

export function useTooltip() {
  const [tooltipState, setTooltipState] = useState<TooltipState>({
    isVisible: false,
    content: "",
    position: { x: 0, y: 0 },
    side: "top",
  });

  const showTooltip = useCallback((
    content: string,
    element: HTMLElement,
    side: "top" | "bottom" | "left" | "right" = "top"
  ) => {
    const rect = element.getBoundingClientRect();
    let x = rect.left + rect.width / 2;
    let y = rect.top;

    switch (side) {
      case "top":
        y = rect.top - 10;
        break;
      case "bottom":
        y = rect.bottom + 10;
        break;
      case "left":
        x = rect.left - 10;
        y = rect.top + rect.height / 2;
        break;
      case "right":
        x = rect.right + 10;
        y = rect.top + rect.height / 2;
        break;
    }

    setTooltipState({
      isVisible: true,
      content,
      position: { x, y },
      side,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltipState(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    tooltipState,
    showTooltip,
    hideTooltip,
  };
}
