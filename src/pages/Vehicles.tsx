import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Car } from "lucide-react";
import { VehicleTable } from "@/components/VehicleTable";
import { useState } from "react";
import { AddVehicleForm } from "@/components/AddVehicleForm";

const Vehicles = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestão de Veículos</h1>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Veículo
          </Button>
        </div>

        <div className="grid gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total em Estoque
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 veículos</div>
            </CardContent>
          </Card>
        </div>

        {showAddForm ? (
          <AddVehicleForm onClose={() => setShowAddForm(false)} />
        ) : (
          <VehicleTable />
        )}
      </div>
    </div>
  );
};

export default Vehicles;