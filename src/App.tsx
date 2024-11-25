import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { VehicleProvider } from "./contexts/VehicleContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Páginas públicas
import LoginPage from "./pages/auth/login";

// Páginas protegidas
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import ExpenseList from "./pages/expenses";
import ExpenseRegister from "./pages/expenses/register";
import SaleRegister from "./pages/sales/register";
import SalesList from "./pages/sales";

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <VehicleProvider>
            <TooltipProvider>
              <Toaster />

              <Routes>
                {/* Redirecionar "/" para "/dashboard" */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Rota de login (pública) */}
                <Route path="/login" element={<LoginPage />} />

                {/* Rotas protegidas */}
                <Route element={<ProtectedRoute />}>
                  {/* Página principal do dashboard */}
                  <Route path="/dashboard" element={<Index />} />

                  {/* Veículos */}
                  <Route path="/vehicles" element={<Vehicles />} />

                  {/* Despesas */}
                  <Route path="/expenses">
                    <Route index element={<ExpenseList />} />
                    <Route path="register" element={<ExpenseRegister />} />
                  </Route>

                  {/* Vendas */}
                  <Route path="/sales">
                    <Route index element={<SalesList />} />
                    <Route path="register" element={<SaleRegister />} />
                  </Route>
                </Route>

                {/* Página 404 */}
                <Route
                  path="*"
                  element={
                    <div className="flex h-screen items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900">404</h1>
                        <p className="mt-4 text-gray-600">Página não encontrada</p>
                        <a
                          href="/dashboard"
                          className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                        >
                          Voltar para o início
                        </a>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </TooltipProvider>
          </VehicleProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
