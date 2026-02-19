import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe, DatePipe } from '@angular/common';
import { FacturaService } from 'src/app/service/factura.service';
import { FacturaStatsI } from 'src/app/interface/factura-stats-i';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})
export class FacturacionComponent implements OnInit {
  private facturaService = inject(FacturaService);

  stats = signal<FacturaStatsI | null>(null);
  facturas = signal<any[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    this.loading.set(true);
    const mesActual = new Date().getMonth() + 1;

    this.facturaService.getStatsMensuales(mesActual).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.facturaService.getTodasLasFacturas().subscribe(data => this.facturas.set(data));
  }

  margenColor = computed(() => {
    const m = this.stats()?.margenBeneficio || 0;
    if (m > 30) return 'text-success';  // Verde si el margen es alto
    if (m > 15) return 'text-warning';  // Naranja si es medio
    return 'text-danger';               // Rojo si es bajo
  });

  // DESCARGAR REPORTE MENSUAL EN PDF
  descargarReporteMensual() {
    const s = this.stats();
    // 1. Verificación de seguridad inicial
    if (!s) {
      alert('No hay datos disponibles para generar el reporte.');
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`REPORTE ECONÓMICO - MES ${s.mes || 'N/A'}/${s.anio || ''}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Garage Benz - Generado el: ${new Date().toLocaleDateString()}`, 14, 28);

    // 2. Uso de (valor || 0).toFixed(2) para evitar el error de 'undefined'
    autoTable(doc, {
      startY: 35,
      head: [['Concepto', 'Valor']],
      body: [
        ['Ingresos Totales (Bruto)', `${(s.totalIngresos || 0).toFixed(2)} €`],
        ['Mano de Obra', `${(s.totalManoObra || 0).toFixed(2)} €`],
        ['Venta de Repuestos', `${(s.totalPiezasVenta || 0).toFixed(2)} €`],
        ['Gasto en Adquisición Stock', `${(s.totalGastoStock || 0).toFixed(2)} €`],
        ['Beneficio Neto', `${(s.beneficioNeto || 0).toFixed(2)} €`],
        ['Margen de Beneficio', `${(s.margenBeneficio || 0)} %`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [13, 110, 253] }
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Métrica Operativa', 'Cantidad']],
      body: [
        ['Facturas Emitidas', s.cantidadFacturas || 0],
        ['Clientes Atendidos', s.clientesAtendidos || 0],
        ['Piezas Utilizadas', s.piezasVendidas || 0],
        ['Ticket Promedio', `${(s.promedioTicket || 0).toFixed(2)} €`],
      ],
      headStyles: { fillColor: [33, 37, 41] }
    });

    doc.save(`Reporte_Mensual_${s.mes}_${s.anio}.pdf`);
  }
  verFactura(f: any) {
    if (!f) return;

    const doc = new jsPDF();

    // Encabezado Factura
    doc.setFontSize(20);
    doc.text("FACTURA", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Nº: ${f.numeroFactura}`, 14, 40);
    doc.text(`Fecha: ${new Date(f.fechaEmision).toLocaleDateString()}`, 14, 47);

    // Datos Cliente
    doc.setFont(undefined, 'bold');
    doc.text("CLIENTE:", 14, 60);
    doc.setFont(undefined, 'normal');
    doc.text(`${f.ordenReparacion?.vehiculo?.cliente?.nombre || 'N/A'}`, 14, 67);
    doc.text(`Vehículo: ${f.ordenReparacion?.vehiculo?.modelo} (${f.ordenReparacion?.vehiculo?.matricula})`, 14, 74);

    // Tabla de conceptos (Mano de obra y piezas)
    autoTable(doc, {
      startY: 85,
      head: [['Descripción', 'Importe']],
      body: [
        ['Mano de Obra / Servicios', `${(f.totalManoObra || 0).toFixed(2)} €`],
        ['Repuestos y Materiales', `${(f.totalPiezas || 0).toFixed(2)} €`],
        ['IVA (21%)', `${(f.importeTotal - (f.importeTotal / 1.21)).toFixed(2)} €`]
      ],
      foot: [['TOTAL FACTURA', `${(f.importeTotal || 0).toFixed(2)} €`]],
      footStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }
    });

    doc.save(`Factura_${f.numeroFactura}.pdf`);
  }
}