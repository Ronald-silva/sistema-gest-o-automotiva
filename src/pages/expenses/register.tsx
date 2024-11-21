// src/pages/expenses/register.tsx
import ExpenseForm from '../../components/ExpenseForm';

const ExpenseRegister = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Registrar Nova Despesa</h1>
      <ExpenseForm />
    </div>
  );
};

export default ExpenseRegister;