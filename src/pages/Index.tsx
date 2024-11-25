import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, DollarSign, Car, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";

interface Stats {
  totalProfit: number;
  vehiclesInStock: number;
  salesThisMonth: number;
  averageMargin: number;
}

interface Transaction {
  id: string; // ID obrigatório agora está presente
  model: string;
  type: string;
  value: number;
}

interface StatsCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
}

const StatsCard = ({ icon: Icon, title, value }: StatsCardProps) => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="text-2xl font-bold text-foreground">{value}</h2>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface QuickActionProps {
  icon: React.ElementType;
  text: string;
  to?: string;
}

const QuickAction = ({ icon: Icon, text, to }: QuickActionProps) => {
  const commonClasses = "flex w-full items-center gap-3 rounded-lg border p-4 hover:bg-accent/10 transition-colors";
  
  if (to) {
    return (
      <Link to={to} className={commonClasses}>
        <Icon className="h-5 w-5 text-primary" />
        <span className="text-lg font-medium">{text}</span>
      </Link>
    );
  }

  return (
    <Button variant="ghost" className={commonClasses}>
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-lg font-medium">{text}</span>
    </Button>
  );
};

const TransactionCard = ({ model, type, value }: Transaction) => (
  <div className="flex items-center justify-between rounded-lg border bg-card p-4">
    <div>
      <p className="font-medium text-foreground">{model}</p>
      <p className="text-sm text-muted-foreground">{type}</p>
    </div>
    <p className="font-semibold text-green-600">+ R$ {value.toLocaleString()}</p>
  </div>
);

const Index = () => {
  const [stats, setStats] = useState<Stats>({
    totalProfit: 0,
    vehiclesInStock: 0,
    salesThisMonth: 0,
    averageMargin: 0,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      model: "Honda Civic 2020",
      type: "Venda realizada",
      value: 85000,
    },
    {
      id: "2",
      model: "Toyota Corolla 2021",
      type: "Venda realizada",
      value: 92000,
    },
    {
      id: "3",
      model: "Hyundai HB20 2019",
      type: "Venda realizada",
      value: 62000,
    },
  ]);

  useEffect(() => {
    fetchStats();
    fetchTransactions();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions/recent");
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-primary">
        <header className="container py-8">
          <h1 className="text-4xl font-bold text-primary-foreground">AutoGestão Pro</h1>
          <p className="mt-2 text-lg text-primary-foreground/80">
            Sistema de Gestão Automotiva
          </p>
        </header>
      </div>

      <main className="container py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={DollarSign} title="Lucro Total" value={`R$ ${stats.totalProfit.toLocaleString()}`} />
          <StatsCard icon={Car} title="Veículos em Estoque" value={`${stats.vehiclesInStock}`} />
          <StatsCard icon={BarChart} title="Vendas do Mês" value={`${stats.salesThisMonth}`} />
          <StatsCard icon={TrendingUp} title="Margem Média" value={`${stats.averageMargin}%`} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickAction icon={Car} text="Adicionar Novo Veículo" to="/vehicles" />
              <QuickAction icon={DollarSign} text="Registrar nova Despesa" to="/expenses/register" />
              <QuickAction icon={DollarSign} text="Registrar Venda" to="/sales/register" />
              <QuickAction icon={BarChart} text="Histórico de Vendas" to="/sales" />
              <QuickAction icon={BarChart} text="Ver Relatórios" to="/reports" />
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Últimas Transações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  id={transaction.id} // ID fictício garantido
                  model={transaction.model}
                  type={transaction.type}
                  value={transaction.value}
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
