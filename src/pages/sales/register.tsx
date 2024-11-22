// src/pages/sales/register.tsx
import SaleForm from '../../components/SaleForm';

const SaleRegister = () => {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Registrar Nova Venda</h1>
      <SaleForm />
    </div>
  );
};

export default SaleRegister;