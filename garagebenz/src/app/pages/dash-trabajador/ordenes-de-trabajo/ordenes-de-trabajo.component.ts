import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdenesReparacionI } from '../../../interface/ordenes-reparacion-i';
import { OrdenReparacionService } from '../../../service/orden-reparacion.service';
import { RouterLink } from '@angular/router';
import { FacturaService } from 'src/app/service/factura.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-ordenes-de-trabajo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ordenes-de-trabajo.component.html',
  styleUrl: './ordenes-de-trabajo.component.css',
})
export class OrdenesDeTrabajoComponent implements OnInit {
  private ordenService = inject(OrdenReparacionService);
  private facturaService = inject(FacturaService);

  ordenes = signal<OrdenesReparacionI[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarOrdenesActivas();
  }


  private agruparPiezas(piezas: any[]): any[] {
    if (!piezas || piezas.length === 0) return [];

    const mapa = new Map<string, any>();

    piezas.forEach(p => {
      const id = String(p.pieza?.idPieza);
      const cantidad = Number(p.cantidadUsada) || 0;

      if (mapa.has(id)) {
        const existente = mapa.get(id)!;
        mapa.set(id, {
          ...existente,
          cantidadUsada: existente.cantidadUsada + cantidad
        });
      } else {
        mapa.set(id, {
          ...p,
          pieza: { ...p.pieza },
          cantidadUsada: cantidad
        });
      }
    });

    return Array.from(mapa.values());
  }

  cargarOrdenesActivas(): void {
    this.loading.set(true);
    this.ordenService.getOrdenesActivas().subscribe({
      next: (data) => {
        const procesadas = data.map(orden => ({
          ...orden,
          piezas: this.agruparPiezas(orden.piezas || [])
        }));
        this.ordenes.set(procesadas);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
        this.loading.set(false);
      }
    });
  }

  finalizarOrdenTotal(orden: OrdenesReparacionI): void {
    if (!orden.idOr) {
      alert('Error: La orden no tiene un ID válido.');
      return;
    }

    this.ordenService.actualizarOrden(orden).subscribe({
      next: async () => {
        try {
          const factura = await this.facturaService.generarFacturaDesdeOrden(orden.idOr!);
          this.generarPDFProfesional(orden, factura);
          alert(`¡Orden Cerrada! Factura generada: ${factura.numeroFactura}`);
          this.ordenes.update(prev => prev.filter(o => o.idOr !== orden.idOr));
        } catch (err) {
          console.error('Error en el proceso de facturación:', err);
          alert('Error al generar la factura final.');
        }
      },
      error: (err) => {
        console.error('Error al actualizar orden:', err);
        alert('Error al comunicar los datos técnicos al servidor.');
      }
    });
  }

  calcularTotalTemporal(orden: OrdenesReparacionI): number {
    const totalPiezas = orden.piezas?.reduce((acc, p) => {
      const precio = Number(p.pieza?.precio) || 0;
      const cantidad = Number(p.cantidadUsada) || 0;
      return acc + (precio * cantidad);
    }, 0) || 0;
    const totalMano = (Number(orden.horas) || 0) * 40;
    return (totalPiezas + totalMano) * 1.21;
  }

  generarPDFProfesional(orden: OrdenesReparacionI, factura: any) {
    const doc = new jsPDF();
    const margin = 14;

    doc.setFillColor(0, 48, 135);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('GARAGE BENZ S.L.', margin, 20);
    doc.setFontSize(10);
    doc.text('Servicio Técnico Especializado', margin, 28);
    doc.text(`Factura Nº: ${factura.numeroFactura}`, 140, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL VEHÍCULO', margin, 50);
    doc.line(margin, 52, 70, 52);

    doc.setFont('helvetica', 'normal');
    doc.text(`Matrícula: ${orden.vehiculo?.matricula || 'N/A'}`, margin, 60);
    doc.text(`Modelo: ${orden.vehiculo?.modelo || 'N/A'}`, margin, 67);
    doc.text(`Fecha Cierre: ${new Date().toLocaleDateString()}`, margin, 74);

    doc.setFont('helvetica', 'bold');
    doc.text('DIAGNÓSTICO TÉCNICO', margin, 85);
    doc.setFont('helvetica', 'normal');
    const splitDiag = doc.splitTextToSize(orden.diagnostico || 'Sin diagnóstico.', 180);
    doc.text(splitDiag, margin, 92);

    const rows: any[] = [];
    if (orden.piezas) {
      orden.piezas.forEach(p => {
        rows.push([
          p.pieza?.nombre || 'Repuesto',
          p.cantidadUsada,
          `${Number(p.pieza?.precio || 0).toFixed(2)} €`,
          `${(Number(p.pieza?.precio || 0) * p.cantidadUsada).toFixed(2)} €`
        ]);
      });
    }
    rows.push(['Mano de Obra (Horas)', orden.horas, '40.00 €', `${(orden.horas * 40).toFixed(2)} €`]);

    autoTable(doc, {
      startY: 110,
      head: [['Descripción', 'Cant.', 'Precio Unit.', 'Subtotal']],
      body: rows,
      headStyles: { fillColor: [0, 48, 135] },
      theme: 'striped'
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Base Imponible: ${(factura.totalPiezas + factura.totalManoObra).toFixed(2)} €`, 130, finalY);
    doc.text(`IVA (21%): ${(factura.totalIVA || 0).toFixed(2)} €`, 130, finalY + 7);

    doc.setFontSize(14);
    doc.setTextColor(200, 0, 0);
    doc.text(`TOTAL FACTURA: ${(factura.importeTotal || 0).toFixed(2)} €`, 130, finalY + 16);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Gracias por confiar en Garage Benz. Documento oficial generado por sistema.', 105, 285, { align: 'center' });

    doc.save(`Factura_${orden.vehiculo?.matricula}_${factura.numeroFactura}.pdf`);
  }
}