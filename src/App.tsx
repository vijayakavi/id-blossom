import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { KYCProvider } from "./contexts/KYCContext";
import Index from "./pages/Index";
import Aadhaar from "./pages/Aadhaar";
import PAN from "./pages/PAN";
import Business from "./pages/Business";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <KYCProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/aadhaar" element={<Aadhaar />} />
            <Route path="/pan" element={<PAN />} />
            <Route path="/business" element={<Business />} />
            <Route path="/success" element={<Success />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </KYCProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
