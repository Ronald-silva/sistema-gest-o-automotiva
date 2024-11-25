// src/services/vehicleService.ts
import { Vehicle } from '../types/vehicle';

class VehicleService {
  private vehicles: Vehicle[] = [];

  async getAllVehicles(): Promise<Vehicle[]> {
    return this.vehicles;
  }

  async addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...vehicle
    };
    
    this.vehicles.push(newVehicle);
    return newVehicle;
  }

  async updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | null> {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index === -1) return null;
    
    this.vehicles[index] = {
      ...this.vehicles[index],
      ...vehicle,
      updatedAt: new Date()
    };
    
    return this.vehicles[index];
  }

  async deleteVehicle(id: number): Promise<boolean> {
    const index = this.vehicles.findIndex(v => v.id === id);
    if (index === -1) return false;
    
    this.vehicles.splice(index, 1);
    return true;
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {
    return this.vehicles.filter(vehicle => vehicle.status === 'Disponível');
  }
}

export const vehicleService = new VehicleService();