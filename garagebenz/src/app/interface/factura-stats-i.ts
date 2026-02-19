export interface FacturaStatsI {
    mes: number;
    anio: number; // Útil para comparar con años anteriores
    
    // Métricas de Ingresos
    totalIngresos: number;    // Lo que paga el cliente (Piezas + Mano de Obra + IVA)
    totalManoObra: number;    // Solo lo recaudado por horas de trabajo
    totalPiezasVenta: number; // Lo que se cobra al cliente por las piezas
    
    // Métricas de Gastos y Rentabilidad
    totalGastoStock: number;  // Coste real de compra de las piezas (lo que te costó a ti)
    beneficioNeto: number;    // (Total Ingresos - Total Gasto Stock)
    margenBeneficio: number;  // Porcentaje de ganancia
    
    // Métricas Operativas
    cantidadFacturas: number;
    clientesAtendidos: number;
    promedioTicket: number;   // totalIngresos / cantidadFacturas
    piezasVendidas: number;   // Cantidad total de unidades que salieron del almacén
}