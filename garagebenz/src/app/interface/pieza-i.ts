export interface PiezaI {
    idPieza: string;
    nombre: string;      // <--- Asegúrate de que sea minúscula
    descripcion: string; // <--- Asegúrate de que sea minúscula
    precio: number;     // (Añádelo si vas a usar precios)
    categoria?: string;  // (Añádelo si vas a usar categorías)
}