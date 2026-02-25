import { ClienteI } from "./cliente-i"; 

export interface CitaI {
    idCita: string;
    fecha_cita: string;
    hora_cita: string;
    descripcion?: string;
    estado: 'Pendiente' | 'Confirmada' | 'En_proceso' | 'Completada' | 'Cancelada';
    cliente?: ClienteI;
    id_cliente: string; 
    id_vehiculo: string;
    vehiculo?: {
        id_vehiculo: string;
        matricula: string;
        modelo: string;
        anio: number;
    };
}