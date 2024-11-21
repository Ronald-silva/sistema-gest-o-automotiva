import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, DollarSign, Car, TrendingUp } from "lucide-react";

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

interface TransactionCardProps {
  model: string;
  type: string;
  value: string;
}

const TransactionCard = ({ model, type, value }: TransactionCardProps) => (
  <div className="flex items-center justify-between rounded-lg border bg-card p-4">
    <div>
      <p className="font-medium text-foreground">{model}</p>
      <p className="text-sm text-muted-foreground">{type}</p>
    </div>
    <p className="font-semibold text-green-600">{value}</p>
  </div>
);

const Index = () => {
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
          <StatsCard icon={DollarSign} title="Lucro Total" value="R$ 150.000" />
          <StatsCard icon={Car} title="Veículos em Estoque" value="15" />
          <StatsCard icon={BarChart} title="Vendas do Mês" value="8" />
          <StatsCard icon={TrendingUp} title="Margem Média" value="25%" />
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
  <QuickAction
    icon={Car}
    text="Adicionar Novo Veículo"
    to="/vehicles"
  />
  <QuickAction
    icon={DollarSign}
    text="Registrar nova Despesa"
    to="/expenses/register" // Nova rota
  />
  <QuickAction
    icon={DollarSign}
    text="Registrar Venda"
  />
  <QuickAction
    icon={BarChart}
    text="Ver Relatórios"
  />
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
              <TransactionCard
                model="Honda Civic 2020"
                type="Venda realizada"
                value="+ R$ 85.000"
              />
              <TransactionCard
                model="Toyota Corolla 2021"
                type="Venda realizada"
                value="+ R$ 92.000"
              />
              <TransactionCard
                model="Hyundai HB20 2019"
                type="Venda realizada"
                value="+ R$ 62.000"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;