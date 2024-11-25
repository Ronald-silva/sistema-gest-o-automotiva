// src/components/SaleForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Vehicle {
  _id: string;
  model: string;
  brand: string;
  year: number;
  price: number;
}

interface PaymentMethod {
  value: string;
  label: string;
}

export default function SaleForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const paymentMethods: PaymentMethod[] = [
    { value: 'cash', label: 'Dinheiro' },
    { value: 'bank_transfer', label: 'Transferência' },
    { value: 'pix', label: 'PIX' },
    { value: 'financing', label: 'Financiamento' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'debit_card', label: 'Cartão de Débito' }
  ];

  const [formData, setFormData] = useState({
    vehicleId: '',
    salePrice: '',
    customerName: '',
    customerDocument: '',
    customerPhone: '',
    customerEmail: '',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles', {
        params: { status: 'Disponível' }
      });
      
      if (response.data.docs) {
        setVehicles(response.data.docs);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      toast.error('Erro ao carregar veículos disponíveis.');
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    if (vehicle) {
      setFormData(prev => ({
        ...prev,
        vehicleId,
        salePrice: vehicle.price.toString()
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/sales', formData);
      toast.success('Venda registrada com sucesso!');
      navigate('/sales');
    } catch (error) {
      console.error('Erro ao registrar venda:', error);
      toast.error('Erro ao registrar venda. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Registrar Venda</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seleção de Veículo */}
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Veículo</Label>
            <select
              id="vehicleId"
              className="w-full p-2 border rounded"
              value={formData.vehicleId}
              onChange={(e) => handleVehicleSelect(e.target.value)}
              required
            >
              <option value="">Selecione um veículo...</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle._id}>
                  {`${vehicle.brand} ${vehicle.model} (${vehicle.year}) - R$ ${vehicle.price.toLocaleString()}`}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Preço de Venda */}
            <div className="space-y-2">
              <Label htmlFor="salePrice">Preço de Venda</Label>
              <Input
                id="salePrice"
                type="number"
                value={formData.salePrice}
                onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Data da Venda */}
            <div className="space-y-2">
              <Label htmlFor="date">Data da Venda</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados do Cliente</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nome Completo</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerDocument">CPF</Label>
                <Input
                  id="customerDocument"
                  value={formData.customerDocument}
                  onChange={(e) => setFormData({...formData, customerDocument: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Telefone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">E-mail</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <select
              id="paymentMethod"
              className="w-full p-2 border rounded"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
              required
            >
              <option value="">Selecione...</option>
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              className="w-full p-2 border rounded"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Observações adicionais sobre a venda..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => navigate('/sales')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Registrar Venda'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}