import { Component, OnInit, inject } from '@angular/core';

import { VehiculoService } from '../../../service/vehiculo.service';
import { VehicloI } from '../../../interface/vehiclo-i';
import { CardVehiculoComponent } from "../../../components/vehiculo-card/vehiculo-card.component";
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-vehiculo-list',
  standalone: true,
  imports: [CardVehiculoComponent, FormsModule, RouterLink],
  templateUrl: './vehiculo-list.component.html'
})
export class ListVehiculoComponent implements OnInit {
  serviceVehiculo = inject(VehiculoService);
  arrVehiculos: VehicloI[] = [];
  filtroMatricula: string = "";

  constructor() {
    this.arrVehiculos = [];
  }

  async ngOnInit(): Promise<void> {
    try {
      // Obtenemos el ID del cliente logueado
      const clienteId = localStorage.getItem('userId');
      if (clienteId) {
        this.arrVehiculos = await this.serviceVehiculo.getVehiculosPorCliente(clienteId);
      }
    } catch (error) {
      console.log("error al obtener los vehículos | " + error);
    }
  }

  // Getter para filtrar en tiempo real en el HTML
  get vehiculosAMostrar(): VehicloI[] {
    return this.arrVehiculos.filter(v => 
      v.matricula.toLowerCase().includes(this.filtroMatricula.toLowerCase())
    );
  }
}