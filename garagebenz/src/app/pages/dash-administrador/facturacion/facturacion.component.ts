import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
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

  
  private readonly PRIMARY_COLOR = [0, 48, 135]; 

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
      error: (err) => {
        console.error('Error stats:', err);
        this.loading.set(false);
      }
    });

    this.facturaService.getTodasLasFacturas().subscribe(data => this.facturas.set(data));
  }

  margenColor = computed(() => {
    const m = this.stats()?.margenBeneficio || 0;
    if (m > 30) return 'text-success';
    if (m > 15) return 'text-warning';
    return 'text-danger';
  });

  
  descargarReporteMensual() {
    const s = this.stats();
    if (!s) return;

    const doc = new jsPDF();
    const margin = 14;

    
    doc.setFillColor(this.PRIMARY_COLOR[0], this.PRIMARY_COLOR[1], this.PRIMARY_COLOR[2]);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('GARAGE BENZ S.L.', margin, 20);
    doc.setFontSize(11);
    doc.text(`REPORTE ECONÓMICO MENSUAL - ${s.mes}/${s.anio}`, margin, 30);
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 140, 30);

    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN DE RENTABILIDAD', margin, 55);

    autoTable(doc, {
      startY: 60,
      head: [['Concepto', 'Total']],
      body: [
        ['Ingresos Brutos (Ventas + Mano Obra)', `${(s.totalIngresos || 0).toFixed(2)} €`],
        ['Desglose: Mano de Obra', `${(s.totalManoObra || 0).toFixed(2)} €`],
        ['Desglose: Venta de Repuestos', `${(s.totalPiezasVenta || 0).toFixed(2)} €`],
        ['Coste Adquisición Stock (Gastos)', `${(s.totalGastoStock || 0).toFixed(2)} €`],
        ['BENEFICIO NETO', `${(s.beneficioNeto || 0).toFixed(2)} €`],
        ['Margen Comercial', `${s.margenBeneficio || 0}%`]
      ],
      headStyles: { fillColor: this.PRIMARY_COLOR as [number, number, number] },
      theme: 'grid',
      styles: { fontSize: 10 }
    });

    
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.text('MÉTRICAS DE ACTIVIDAD', margin, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Indicador', 'Valor']],
      body: [
        ['Facturas Emitidas', s.cantidadFacturas || 0],
        ['Clientes Únicos Atendidos', s.clientesAtendidos || 0],
        ['Repuestos Instalados', s.piezasVendidas || 0],
        ['Ticket Medio por Intervención', `${(s.promedioTicket || 0).toFixed(2)} €`]
      ],
      headStyles: { fillColor: [60, 60, 60] },
      theme: 'striped'
    });

    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Confidencial - Solo para uso administrativo de Garage Benz S.L.', 105, 285, { align: 'center' });

    doc.save(`Reporte_Mensual_${s.mes}_${s.anio}.pdf`);
  }

  
  verFactura(f: any) {
    if (!f) return;

    const doc = new jsPDF();
    const margin = 14;

    
    doc.setFillColor(this.PRIMARY_COLOR[0], this.PRIMARY_COLOR[1], this.PRIMARY_COLOR[2]);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('GARAGE BENZ S.L.', margin, 20);
    doc.setFontSize(10);
    doc.text(`Factura Nº: ${f.numeroFactura}`, 140, 20);
    doc.text(`Fecha: ${new Date(f.fechaEmision).toLocaleDateString()}`, 140, 27);

    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL CLIENTE Y VEHÍCULO', margin, 55);
    doc.line(margin, 57, 80, 57);

    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente: ${f.ordenReparacion?.vehiculo?.cliente?.nombre || 'Particular'}`, margin, 65);
    doc.text(`Vehículo: ${f.ordenReparacion?.vehiculo?.modelo || 'N/A'}`, margin, 72);
    doc.text(`Matrícula: ${f.ordenReparacion?.vehiculo?.matricula || 'N/A'}`, margin, 79);

    
    autoTable(doc, {
      startY: 90,
      head: [['Descripción del Servicio', 'Base Imponible']],
      body: [
        ['Servicios de Mano de Obra Especializada', `${(f.totalManoObra || 0).toFixed(2)} €`],
        ['Materiales, Repuestos y Consumibles', `${(f.totalPiezas || 0).toFixed(2)} €`]
      ],
      headStyles: { fillColor: this.PRIMARY_COLOR as [number, number, number] },
      theme: 'striped'
    });

    
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const baseImponible = (f.totalManoObra || 0) + (f.totalPiezas || 0);
    const iva = f.importeTotal - baseImponible;

    doc.setFont('helvetica', 'bold');
    doc.text(`Base Imponible: ${baseImponible.toFixed(2)} €`, 130, finalY);
    doc.text(`IVA (21%): ${iva.toFixed(2)} €`, 130, finalY + 8);
    
    doc.setFontSize(16);
    doc.setTextColor(200, 0, 0);
    doc.text(`TOTAL: ${(f.importeTotal || 0).toFixed(2)} €`, 130, finalY + 18);

    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Este documento es una copia oficial de la factura original.', 105, 285, { align: 'center' });

    doc.save(`Factura_${f.numeroFactura}_${f.ordenReparacion?.vehiculo?.matricula}.pdf`);
  }
}