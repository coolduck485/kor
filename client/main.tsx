import { createRoot } from "react-dom/client";
import App from "./App";
import "./performance-optimizations.css";

// Performance monitoring
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Simple performance logging for development
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log(`Page Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
    console.log(`DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.fetchStart}ms`);
    console.log(`First Paint: ${performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime}ms`);
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Use React's concurrent features for better performance
const root = createRoot(rootElement);

// Render with error boundary
root.render(<App />);
