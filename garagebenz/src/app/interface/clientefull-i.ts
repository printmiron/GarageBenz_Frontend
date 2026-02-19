import { ClienteI } from "./cliente-i";
import { OrdenTrabajoResumenI } from "./orden-trabajo-resumen-i";
import { VehicloI } from "./vehiclo-i";

export interface ClienteFullI extends ClienteI {
    vehiculos: VehicloI[];
    historialReparaciones: OrdenTrabajoResumenI[];
}
