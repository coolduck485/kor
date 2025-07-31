import { createRoot } from "react-dom/client";
import App from "./App";
import "./performance-optimizations.css";

// Performance monitoring
if (typeof window !== "undefined") {
  // Report FCP, LCP, and other Core Web Vitals
  import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  }).catch(() => {
    // Fallback if web-vitals is not available
    console.log("Web Vitals not available");
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
