// src/contexts/VehicleContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Vehicle } from '../types/vehicle';
import { vehicleService } from '../services/vehicleService';
import { toast } from '../hooks/use-toast';

interface VehicleContextType {
  vehicles: Vehicle[];
  loading: boolean;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateVehicle: (id: number, vehicle: Partial<Vehicle>) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
  refreshVehicles: () => Promise<void>;
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

  const addVehicle = useCallback(async (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      await vehicleService.addVehicle(vehicle);
      toast.success('Veículo adicionado com sucesso');
      await refreshVehicles();
    } catch (error) {
      toast.error('Erro ao adicionar veículo');
    } finally {
      setLoading(false);
    }
  }, [refreshVehicles]);

  const updateVehicle = useCallback(async (id: number, vehicle: Partial<Vehicle>) => {
    try {
      setLoading(true);
      await vehicleService.updateVehicle(id, vehicle);
      toast.success('Veículo atualizado com sucesso');
      await refreshVehicles();
    } catch (error) {
      toast.error('Erro ao atualizar veículo');
    } finally {
      setLoading(false);
    }
  }, [refreshVehicles]);

  const deleteVehicle = useCallback(async (id: number) => {
    try {
      setLoading(true);
      await vehicleService.deleteVehicle(id);
      toast.success('Veículo removido com sucesso');
      await refreshVehicles();
    } catch (error) {
      toast.error('Erro ao remover veículo');
    } finally {
      setLoading(false);
    }
  }, [refreshVehicles]);

  React.useEffect(() => {
    refreshVehicles();
  }, [refreshVehicles]);

  return (
    <VehicleContext.Provider value={{
      vehicles,
      loading,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      refreshVehicles
    }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};