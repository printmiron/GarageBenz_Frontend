export interface SotckI {
    id_stock: string;    // UUID (PK)
    id_pieza: string;    // FK -> Piezas
    cantidad: number;    // INT
}
