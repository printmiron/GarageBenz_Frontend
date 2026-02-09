export interface OrdenesPiezaI {
    id_or: string;        // PK, FK -> Ordenes_Reparacion
    id_pieza: string;     // PK, FK -> Piezas
    cantidad_usada: number; // INT
}
