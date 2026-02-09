export interface AuthResponse {
    token: string;
    id: string; // Aquí vendrá el id_cliente, id_trabajador o id_admin
    rol: 'cliente' | 'trabajador' | 'administrador';
    nombreUsuario: string;
}
