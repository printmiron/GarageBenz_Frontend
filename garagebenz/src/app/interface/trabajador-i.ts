import { UsuarioI } from "./usuario-i";

export interface TrabajadorI extends UsuarioI{
    idTrabajador: string; // UUID
}
