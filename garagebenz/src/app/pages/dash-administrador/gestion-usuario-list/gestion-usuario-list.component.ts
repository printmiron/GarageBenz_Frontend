import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClienteFullI } from 'src/app/interface/clientefull-i';
import { UsuarioService } from 'src/app/service/usuario.service';

@Component({
  selector: 'app-gestion-usuario-list',
  imports: [RouterLink],
  templateUrl: './gestion-usuario-list.component.html',
  styleUrl: './gestion-usuario-list.component.css',
})
export class GestionUsuarioListComponent implements OnInit {
  private userRef = inject(UsuarioService);

  clientes = this.userRef.clientes;
  trabajadores = this.userRef.trabajadores;

  clienteDetalle = signal<ClienteFullI | null>(null);

  async ngOnInit() {
    await Promise.all([
      this.userRef.cargarClientes(),
      this.userRef.cargarTrabajadores()
    ]);
  }

  async verTodoDelCliente(id: string) {
    const info = await this.userRef.obtenerExpedienteCompleto(id);
    this.clienteDetalle.set(info);
  }

  async borrar(id: string, tipo: 'clientes' | 'trabajadores') {
    if (confirm('¿Seguro que quieres eliminar este usuario? Se perderán sus datos.')) {
      await this.userRef.eliminarUsuario(id, tipo);
    }
  }
}
