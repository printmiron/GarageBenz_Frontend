import { UsuarioI } from "./usuario-i";

export interface TrabajadorI extends UsuarioI{
    id_trabajador: string; // UUID
}
