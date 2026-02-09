export interface OrdenesReparacionI {
    id_or: string;         // UUID (PK)
    id_cita: string;       // FK -> Cita
    id_vehiculo: string;   // FK -> Vehiculos
    id_trabajador: string; // FK -> Trabajador
    diagnostico: string;   //
    horas: number;         // DECIMAL(5,2)
    fecha_inicio: string;  // DATE
    fecha_fin?: string;    // DATE (puede ser null hasta que termine)
    estado_rep: 'En proceso' | 'Completada' | 'Pausada' | 'Cancelada'; // ENUM
}
