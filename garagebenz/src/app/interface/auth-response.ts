export interface AuthResponse {
    token: string;
    id: string; 
    rol: string;
    nombreUsuario: string;
    // Añadimos esto para que TypeScript reconozca los datos del perfil
    user: {
        id: string;
        nombre: string;
        apellido1: string;
        apellido2?: string;
        correo: string;
        usuario: string;
        rol: string;
    };
}