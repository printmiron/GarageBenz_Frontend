export interface VehicloI {
    id_vehiculo: string;  // UUID (PK)
    matricula: string;    // UNIQUE
    vin: string;          // UNIQUE
    modelo: string;       //
    año: number;          // YEAR en SQL
    id_cliente: string;   // FK -> Cliente
}
