// src/pages/expenses/index.tsx
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

import { formatCurrency } from "@/lib/utils";

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  date: string;
  notes?: string;
}

const categoryLabels: Record<string, string> = {
  rent: 'Aluguel',
  utilities: 'Água/Luz',
  salary: 'Salários',
  tax: 'Impostos',
  maintenance: 'Manutenção',
  supplies: 'Material de Escritório',
  marketing: 'Marketing',
  other_expense: 'Outros'
};

const paymentMethodLabels: Record<string, string> = {
  cash: 'Dinheiro',
  bank_transfer: 'Transferência',
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito'
};

export default function ExpenseList() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/transactions?type=expense', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar despesas');

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError('Erro ao carregar despesas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Despesas</h1>
          <p className="text-muted-foreground">Gerenciamento de despesas da loja</p>
        </div>

        <Button onClick={() => navigate('/expenses/register')}>
          
          Nova Despesa
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {categoryLabels[expense.category] || expense.category}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  {paymentMethodLabels[expense.paymentMethod] || expense.paymentMethod}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span className="text-red-600">
                    - {formatCurrency(expense.amount)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}