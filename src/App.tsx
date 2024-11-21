import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VehicleProvider } from "./contexts/VehicleContext";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import ExpenseList from "./pages/expenses";
import ExpenseRegister from "./pages/expenses/register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VehicleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/expenses" element={<ExpenseList />} /> {/* Nova rota */}
            <Route path="/expenses/register" element={<ExpenseRegister />} /> {/* Nova rota */}
          </Routes>
        </BrowserRouter>
      </VehicleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;