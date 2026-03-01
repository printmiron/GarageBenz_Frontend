import { CitaI } from "./cita-i";
import { VehicloI } from "./vehiclo-i";


export interface OrdenesReparacionI {
  idOr?: string;
  cita: CitaI;
  vehiculo: VehicloI;
  diagnostico: string;
  estadoRep: 'En_proceso' | 'Completada' | 'Pausada' | 'Cancelada';
  fechaInicio: string;
  fechaFin?: string;
  horas: number;
  piezas?: Array<{
    cantidadUsada: number;
    pieza: {
      idPieza: string;
      nombre: string;
      precio: number;
    }
  }>;
}