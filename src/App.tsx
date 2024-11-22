import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import ExpenseList from "./pages/expenses";
import ExpenseRegister from "./pages/expenses/register";
import SaleRegister from "./pages/sales/register"; // Novo import
import SalesList from "./pages/sales";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/expenses/register" element={<ExpenseRegister />} />
          <Route path="/sales/register" element={<SaleRegister />} /> {/* Nova rota */}
          <Route path="/sales" element={<SalesList />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;