import { UsuarioI } from "./usuario-i";

export interface AdministradorI extends UsuarioI{
    id_admin: string; // UUID
}
