import "./global.css";
import "./mobile-text-performance.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { RetroModeProvider } from "@/hooks/use-retro-mode";
import { PinkThemeProvider } from "@/hooks/use-pink-theme";
import { UnifiedNotificationProvider } from "@/components/ui/unified-notification";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <RetroModeProvider>
        <UnifiedNotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<Index />} />
                <Route path="/services" element={<Index />} />
                <Route path="/portfolio" element={<Index />} />
                <Route path="/contact" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UnifiedNotificationProvider>
      </RetroModeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
