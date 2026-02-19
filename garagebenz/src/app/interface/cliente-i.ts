import { UsuarioI } from "./usuario-i";

export interface ClienteI extends UsuarioI {
    idCliente: string; // UUID
}
