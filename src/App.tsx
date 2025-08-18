import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BookingWelcome from "./components/BookingWelcome";
import BookingCity from "./components/BookingCity";
import BookingForm from "./components/BookingForm";
import BookingConfirmation from "./components/BookingConfirmation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BookingWelcome />} />
          <Route path="/book/:cityKey" element={<BookingCity />} />
          <Route path="/booking-form" element={<BookingForm />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/demo" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
