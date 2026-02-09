import { UsuarioI } from "./usuario-i";

export interface ClienteI extends UsuarioI {
    id_cliente: string; // UUID
}
