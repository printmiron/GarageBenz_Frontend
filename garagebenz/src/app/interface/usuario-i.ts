export interface UsuarioI {
    nombre: string;
    apellido1: string;
    apellido2: string;
    correo: string;
    usuario: string;
    contraseña?: string; // opcional porque no solemos recibirla del backend por seguridad
    id_rol: string;
}
