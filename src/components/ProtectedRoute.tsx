// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'user';
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Mostra loader enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redireciona para login se não estiver autenticado
  if (!isAuthenticated) {
    // Salva a rota que o usuário tentou acessar
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  // Verifica permissão se requiredRole for especificado
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold text-red-500">Acesso Restrito</h1>
        <p className="text-center text-gray-600">
          Você não tem permissão para acessar esta página.
        </p>
        <a 
          href="/"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          Voltar para o início
        </a>
      </div>
    );
  }

  // Se tudo estiver ok, renderiza o conteúdo da rota
  return <Outlet />;
}

// HOC para proteger rotas individuais
export function withProtection(
  Component: React.ComponentType<any>,
  requiredRole?: 'admin' | 'user'
) {
  return function ProtectedComponent(props: any) {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(location.pathname + location.search);
      return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
          <h1 className="text-2xl font-bold text-red-500">Acesso Restrito</h1>
          <p className="text-center text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          <a 
            href="/"
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Voltar para o início
          </a>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Exemplo de uso em rotas:
/*
<Routes>
  <Route path="/login" element={<LoginPage />} />
  
  // Rota protegida básica
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<Dashboard />} />
  </Route>

  // Rota protegida com restrição de role
  <Route element={<ProtectedRoute requiredRole="admin" />}>
    <Route path="/admin" element={<AdminPanel />} />
  </Route>
</Routes>
*/

// Exemplo de uso com HOC:
/*
// Proteger componente individual
const ProtectedAdminPanel = withProtection(AdminPanel, 'admin');

// Usar em uma rota
<Route path="/admin" element={<ProtectedAdminPanel />} />
*/