import { PiezaI } from "./pieza-i";

export interface SotckI {
    idStock: string;     
    pieza: PiezaI;       
    cantidad: number;
}
