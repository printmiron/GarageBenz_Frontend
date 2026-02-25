export interface FacturaStatsI {
    mes: number;
    anio: number; 
    
    
    totalIngresos: number;    
    totalManoObra: number;    
    totalPiezasVenta: number; 
    
    
    totalGastoStock: number;  
    beneficioNeto: number;    
    margenBeneficio: number;  
    
    
    cantidadFacturas: number;
    clientesAtendidos: number;
    promedioTicket: number;   
    piezasVendidas: number;   
}