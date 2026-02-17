export interface OrdenesReparacionI {
    idOr: string;         // Coincide con Java private UUID idOr
    cita: any;            // El backend envía el objeto Cita completo (o al menos su ID)
    vehiculo: any;        // El backend envía el objeto Vehiculo
    trabajador: any;      // El backend envía el objeto Trabajador
    diagnostico: string;
    horas: number;
    fechaInicio: string;
    fechaFin?: string;
    estadoRep: 'En proceso' | 'Completada' | 'Pausada' | 'Cancelada';
}