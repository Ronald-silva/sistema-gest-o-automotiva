// src/contexts/VehicleContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Vehicle } from '../types/vehicle';
import { vehicleService } from '../services/vehicleService';
import { toast } from 'sonner';

interface VehicleContextType {
  vehicles: Vehicle[];
  loading: boolean;
  refreshVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vehicleService.getAllVehicles();
      setVehicles(data);
    } catch (error) {
      toast.error('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  }, []);

  const addVehicle = useCallback(async (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newVehicle = await vehicleService.addVehicle(vehicleData);
      setVehicles(prev => [...prev, newVehicle]);
      toast.success('Veículo adicionado com sucesso');
    } catch (error) {
      toast.error('Erro ao adicionar veículo');
      throw error;
    }
  }, []);

  const updateVehicle = useCallback(async (id: number, vehicleData: Partial<Vehicle>) => {
    try {
      const updatedVehicle = await vehicleService.updateVehicle(id, vehicleData);
      if (updatedVehicle) {
        setVehicles(prev => prev.map(vehicle => 
          vehicle.id === id ? updatedVehicle : vehicle
        ));
        toast.success('Veículo atualizado com sucesso');
      }
    } catch (error) {
      toast.error('Erro ao atualizar veículo');
      throw error;
    }
  }, []);

  const deleteVehicle = useCallback(async (id: number) => {
    try {
      const success = await vehicleService.deleteVehicle(id);
      if (success) {
        setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
        toast.success('Veículo removido com sucesso');
      }
    } catch (error) {
      toast.error('Erro ao remover veículo');
      throw error;
    }
  }, []);

  return (
    <VehicleContext.Provider value={{
      vehicles,
      loading,
      refreshVehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle
    }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};