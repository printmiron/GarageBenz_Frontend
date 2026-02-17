import { Component, inject, Input, OnInit } from '@angular/core';
import { VehiculoService } from '../../service/vehiculo.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';
import { VehicloI } from '../../interface/vehiclo-i';

@Component({
  selector: 'app-card-vehiculo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vehiculo-card.component.html',
  styleUrl: './vehiculo-card.component.css',
})
export class CardVehiculoComponent implements OnInit {
  serviceVehiculo = inject(VehiculoService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  
  @Input() miVehiculo!: VehicloI;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params: any) => {
      let id: string = params.id;
      if (id != undefined) {
        let response = await this.serviceVehiculo.getVehiculoById(id);
        if (response != undefined) {
          this.miVehiculo = response;
        }
      }
    });
  }

  async deleteVehiculo(vehiculo: VehicloI) {
    Swal.fire({
      title: "¿Estás seguro que quieres eliminar el vehículo " + vehiculo.matricula + "?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, ¡borrar!",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.serviceVehiculo.deleteById(vehiculo.id_vehiculo);

          Swal.fire({
            title: "¡Borrado!",
            text: "Se ha eliminado el vehículo con matrícula: " + vehiculo.matricula,
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo eliminar el vehículo."
          });
        }
      }
    });
  }
}