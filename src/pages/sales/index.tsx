// src/pages/sales/index.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Sale {
  id: string;
  date: string;
  vehicleId: string;
  vehicle: {
    brand: string;
    model: string;
    year: number;
  };
  customerName: string;
  salePrice: number;
  paymentMethod: string;
}

const paymentMethodLabels: Record<string, string> = {
  cash: 'Dinheiro',
  bank_transfer: 'Transferência',
  pix: 'PIX',
  financing: 'Financiamento',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito'
};

export default function SalesList() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data.docs || []);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
      toast.error('Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vendas</h1>
          <p className="text-muted-foreground">Histórico de vendas realizadas</p>
        </div>

        <Button onClick={() => navigate('/sales/register')}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  {new Date(sale.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {`${sale.vehicle.brand} ${sale.vehicle.model} (${sale.vehicle.year})`}
                </TableCell>
                <TableCell>{sale.customerName}</TableCell>
                <TableCell>
                  {paymentMethodLabels[sale.paymentMethod] || sale.paymentMethod}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(sale.salePrice)}
                </TableCell>
              </TableRow>
            ))}
            {sales.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  Nenhuma venda registrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center p-4 bg-muted rounded-lg">
        <div>
          <p className="text-sm font-medium">Total de vendas: {sales.length}</p>
        </div>
        <div>
          <p className="text-lg font-bold">
            Total: {formatCurrency(sales.reduce((sum, sale) => sum + sale.salePrice, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}