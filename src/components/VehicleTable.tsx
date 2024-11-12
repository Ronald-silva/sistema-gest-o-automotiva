import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
  
  const mockVehicles = [
    {
      id: 1,
      model: "Honda Civic",
      year: 2020,
      price: 85000,
      status: "Disponível",
    },
    {
      id: 2,
      model: "Toyota Corolla",
      year: 2021,
      price: 92000,
      status: "Disponível",
    },
    {
      id: 3,
      model: "Hyundai HB20",
      year: 2019,
      price: 62000,
      status: "Vendido",
    },
  ];
  
  export const VehicleTable = () => {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Modelo</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>
                  {vehicle.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>{vehicle.status}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };