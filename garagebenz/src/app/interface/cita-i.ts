export interface CitaI {
    id_cita: string;      // UUID (PK)
    fecha_cita: string;   // DATE
    hora_cita: string;    // TIME
    descripcion?: string; //
    estado: 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada'; // ENUM
    id_cliente: string;   // FK -> Cliente
    id_vehiculo: string;  // FK -> Vehiculos
}
