// dashboardService.js - Servicio de datos reales y exportación para el Dashboard de CENAREPAS
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { toast } from 'sonner';
import { api } from '../../../shared/services/api.js';

const PERIODO_MAP = {
  'Esta semana': 'semana',
  'Este mes': 'mes',
  'Últimos 30 días': '30d',
  'Año actual': 'anio',
  semana: 'semana',
  mes: 'mes',
  '30d': '30d',
  anio: 'anio',
};

export const EMPTY_DASHBOARD_DATA = {
  periodo: { clave: 'semana', etiqueta: 'Esta semana', desde: null, hasta: null },
  generadoEn: null,
  fechaGeneracion: '',
  kpis: {
    ventasHoy: 0,
    ventasAyer: 0,
    ventasHoyCambio: 0,
    pedidosProcesados: 0,
    pedidosCambio: 0,
    insumosActivos: 0,
    insumosStockBajo: 0,
    insumosProximosVencer: 0,
    insumosCambio: 0,
    produccionDia: 0,
    produccionAyer: 0,
    produccionCambio: 0,
    sparklines: {
      ventas: [],
      pedidos: [],
      insumos: [],
      produccion: [],
    },
  },
  ventasPorPeriodo: { diarias: [], semanales: [], mensuales: [] },
  comprasPorPeriodo: { diarias: [], semanales: [], mensuales: [] },
  comparativaDiaria: { hoy: 0, ayer: 0, variacionPct: 0, sinBaseAnterior: false },
  comparativaMensual: { mesActual: 0, mesAnterior: 0, variacionPct: 0, sinBaseAnterior: false },
  ultimasVentas: [],
  pedidosRecientes: [],
  productosMasVendidos: [],
  ventasPorCategoria: [],
  ventasSemanales: {
    total: 0,
    promedioDiario: 0,
    dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    semanaActual: [0, 0, 0, 0, 0, 0, 0],
    semanaAnterior: [0, 0, 0, 0, 0, 0, 0],
    porDia: [],
  },
  gastoAcumuladoMensual: [],
  topProveedores: [],
  comparativaComprasAnual: {
    anioActual: new Date().getFullYear(),
    anioAnterior: new Date().getFullYear() - 1,
    totalActual: 0,
    totalAnterior: 0,
    variacionPct: 0,
    sinBaseAnterior: false,
    porMes: [],
  },
  stockInsumosPorCategoria: { agrupadoPor: 'unidad_medida', nota: '', items: [] },
  alertasStockBajo: [],
  alertasProximosVencer: [],
  featuredInsumos: [],
  pedidoActivo: null,
  funnelPedidos: [],
  produccionLineas: [],
  pedidosFlow: { belloOriente: 0, aranjuez: 0, porSede: [] },
  insumosRotacion: [],
  hallazgoClave: null,
  rentabilidad: {
    ventasPeriodo: 0,
    comprasPeriodo: 0,
    resultadoPeriodo: 0,
    margenPct: 0,
    variacionPp: 0,
    semanas: [],
  },
  topClientes: [],
  alertas: [],
};

const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

function normalizeDashboardData(res) {
  if (!res || typeof res !== 'object') {
    return EMPTY_DASHBOARD_DATA;
  }

  const rawKpis = res.kpis || {};
  const kpis = {
    ventasHoy: safeNum(rawKpis.ventasHoy ?? rawKpis.ventasDelDia?.valor),
    ventasAyer: safeNum(rawKpis.ventasAyer),
    ventasHoyCambio: safeNum(rawKpis.ventasHoyCambio),
    pedidosProcesados: safeNum(rawKpis.pedidosProcesados ?? rawKpis.pedidosHoy?.valor),
    pedidosCambio: safeNum(rawKpis.pedidosCambio),
    insumosActivos: safeNum(rawKpis.insumosActivos),
    insumosStockBajo: safeNum(rawKpis.insumosStockBajo ?? rawKpis.stockBajo?.valor),
    insumosProximosVencer: safeNum(rawKpis.insumosProximosVencer),
    insumosCambio: safeNum(rawKpis.insumosCambio),
    produccionDia: safeNum(rawKpis.produccionDia),
    produccionAyer: safeNum(rawKpis.produccionAyer),
    produccionCambio: safeNum(rawKpis.produccionCambio),
    sparklines: {
      ventas: Array.isArray(rawKpis.sparklines?.ventas) ? rawKpis.sparklines.ventas.map(safeNum) : [],
      pedidos: Array.isArray(rawKpis.sparklines?.pedidos) ? rawKpis.sparklines.pedidos.map(safeNum) : [],
      insumos: Array.isArray(rawKpis.sparklines?.insumos) ? rawKpis.sparklines.insumos.map(safeNum) : [],
      produccion: Array.isArray(rawKpis.sparklines?.produccion) ? rawKpis.sparklines.produccion.map(safeNum) : [],
    },
  };

  return {
    ...EMPTY_DASHBOARD_DATA,
    ...res,
    kpis,
    featuredInsumos: Array.isArray(res.featuredInsumos) ? res.featuredInsumos : [],
    pedidoActivo: res.pedidoActivo ?? null,
    funnelPedidos: Array.isArray(res.funnelPedidos) ? res.funnelPedidos : [],
    produccionLineas: Array.isArray(res.produccionLineas) ? res.produccionLineas : [],
    pedidosFlow: res.pedidosFlow
      ? {
          belloOriente: safeNum(res.pedidosFlow.belloOriente),
          aranjuez: safeNum(res.pedidosFlow.aranjuez),
          porSede: Array.isArray(res.pedidosFlow.porSede) ? res.pedidosFlow.porSede : [],
        }
      : EMPTY_DASHBOARD_DATA.pedidosFlow,
    insumosRotacion: Array.isArray(res.insumosRotacion) ? res.insumosRotacion : [],
    hallazgoClave: res.hallazgoClave ?? null,
    rentabilidad: res.rentabilidad
      ? {
          ventasPeriodo: safeNum(res.rentabilidad.ventasPeriodo),
          comprasPeriodo: safeNum(res.rentabilidad.comprasPeriodo),
          resultadoPeriodo: safeNum(res.rentabilidad.resultadoPeriodo),
          margenPct: safeNum(res.rentabilidad.margenPct),
          variacionPp: safeNum(res.rentabilidad.variacionPp),
          semanas: Array.isArray(res.rentabilidad.semanas) ? res.rentabilidad.semanas : [],
        }
      : EMPTY_DASHBOARD_DATA.rentabilidad,
    topClientes: Array.isArray(res.topClientes) ? res.topClientes : [],
    alertas: Array.isArray(res.alertas) ? res.alertas : [],
    ultimasVentas: Array.isArray(res.ultimasVentas) ? res.ultimasVentas : [],
    productosMasVendidos: Array.isArray(res.productosMasVendidos) ? res.productosMasVendidos : [],
    ventasPorCategoria: Array.isArray(res.ventasPorCategoria) ? res.ventasPorCategoria : [],
    gastoAcumuladoMensual: Array.isArray(res.gastoAcumuladoMensual) ? res.gastoAcumuladoMensual : [],
    topProveedores: Array.isArray(res.topProveedores) ? res.topProveedores : [],
    alertasStockBajo: Array.isArray(res.alertasStockBajo) ? res.alertasStockBajo : [],
    alertasProximosVencer: Array.isArray(res.alertasProximosVencer) ? res.alertasProximosVencer : [],
  };
}

export const getDashboardData = async (periodo = 'Esta semana', { signal } = {}) => {
  const clave = PERIODO_MAP[periodo] || 'semana';
  const res = await api.get(`/dashboard?periodo=${encodeURIComponent(clave)}`, null, { signal });
  return normalizeDashboardData(res);
};

const fmtMoneda = (valor) => `$${Math.round(safeNum(valor)).toLocaleString('es-CO')}`;

function fechaGeneracionBogota(data) {
  if (data?.fechaGeneracion) return data.fechaGeneracion;
  const now = new Date();
  const f = now.toLocaleDateString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const h = now.toLocaleTimeString('es-CO', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${f} ${h}`;
}

/**
 * HU-148: Exporta a PDF todos los indicadores y tablas reales del Dashboard
 * con fecha de generación y nombre del reporte.
 */
export function exportDashboardToPdf(data = EMPTY_DASHBOARD_DATA, periodoLabel = '') {
  try {
    const d = normalizeDashboardData(data);
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const titulo = 'REPORTE GENERAL DEL DASHBOARD - CENAREPAS';
    const fechaGen = fechaGeneracionBogota(d);
    const periodo = periodoLabel || d.periodo?.etiqueta || 'Esta semana';

    doc.setFillColor(193, 80, 45);
    doc.rect(0, 0, pageWidth, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(193, 80, 45);
    doc.text('CENAREPAS', 14, 15);
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(titulo, 14, 23);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Período: ${periodo}`, 14, 29);
    doc.text(`Fecha de generación: ${fechaGen}`, pageWidth - 14, 15, { align: 'right' });

    const agregarSeccion = (nombre, head, body) => {
      const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : 34;
      autoTable(doc, {
        startY,
        margin: { left: 14, right: 14, bottom: 16 },
        head: [[{ content: nombre, colSpan: head.length, styles: { fillColor: [140, 73, 26] } }], head],
        body: body.length > 0 ? body : [[{ content: 'Sin datos registrados', colSpan: head.length }]],
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [193, 80, 45], textColor: [255, 255, 255], fontStyle: 'bold' },
        didDrawPage: (hookData) => {
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184);
          doc.text('CENAREPAS © - Reporte Dashboard', 14, pageHeight - 8);
          doc.text(`Página ${hookData.pageNumber} de ${doc.internal.getNumberOfPages()}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
        },
      });
    };

    agregarSeccion('Indicadores Clave y Comparativas (HU-135, HU-136, HU-144)', ['Indicador', 'Valor', 'Referencia / Variación'], [
      ['Ventas Hoy (Entregados)', fmtMoneda(d.comparativaDiaria.hoy), `Ayer: ${fmtMoneda(d.comparativaDiaria.ayer)} (${d.comparativaDiaria.variacionPct}%)`],
      ['Ventas Mes Actual', fmtMoneda(d.comparativaMensual.mesActual), `Mes anterior: ${fmtMoneda(d.comparativaMensual.mesAnterior)} (${d.comparativaMensual.variacionPct}%)`],
      ['Pedidos Procesados (Período)', String(d.kpis.pedidosProcesados), `${d.kpis.pedidosCambio}% vs. período anterior`],
      ['Producción del Día', `${d.kpis.produccionDia} un.`, `${d.kpis.produccionCambio}% vs. ayer`],
      ['Insumos Activos / Bajo Stock', String(d.kpis.insumosActivos), `${d.kpis.insumosStockBajo} bajo stock · ${d.kpis.insumosProximosVencer} próx. vencer`],
      ['Compras Año Vigente vs Anterior', fmtMoneda(d.comparativaComprasAnual.totalActual), `${d.comparativaComprasAnual.anioAnterior}: ${fmtMoneda(d.comparativaComprasAnual.totalAnterior)} (${d.comparativaComprasAnual.variacionPct}%)`],
      ['Rentabilidad (Ventas - Compras)', fmtMoneda(d.rentabilidad.resultadoPeriodo), `Margen: ${d.rentabilidad.margenPct}%`],
    ]);

    agregarSeccion('Últimas 5 Ventas Entregadas (HU-137)', ['ID', 'Cliente', 'Sede', 'Fecha', 'Hora', 'Monto'], d.ultimasVentas.map((v) => [
      `#${v.id_venta}`, v.cliente, v.sede_nombre, v.fecha, v.hora, fmtMoneda(v.monto),
    ]));

    agregarSeccion('Ventas por Día de la Semana (HU-140)', ['Día', 'Semana Actual', 'Semana Anterior'], (d.ventasSemanales.porDia || []).map((dia) => [
      dia.dia, fmtMoneda(dia.semanaActual), fmtMoneda(dia.semanaAnterior),
    ]));

    agregarSeccion('Productos Más Vendidos (HU-138)', ['Producto', 'Cantidad', 'Monto'], d.productosMasVendidos.map((p) => [
      p.nombre, String(p.cantidad), fmtMoneda(p.monto),
    ]));

    agregarSeccion('Ventas por Categoría y Participación (HU-139, HU-141)', ['Categoría', 'Cantidad', 'Total', '% Participación'], d.ventasPorCategoria.map((c) => [
      c.categoria, String(c.cantidad), fmtMoneda(c.total), `${c.porcentaje}%`,
    ]));

    agregarSeccion('Gasto Acumulado Mensual (HU-142)', ['Mes', 'Gasto Mensual', 'Acumulado'], d.gastoAcumuladoMensual.map((m) => [
      m.etiqueta, fmtMoneda(m.montoMensual), fmtMoneda(m.acumulado),
    ]));

    agregarSeccion('Top 5 Proveedores por Compras (HU-143)', ['Proveedor', 'Compras', 'Monto Total'], d.topProveedores.map((p) => [
      p.nombre, String(p.totalCompras), fmtMoneda(p.montoTotal),
    ]));

    agregarSeccion(`Stock de Insumos por ${d.stockInsumosPorCategoria?.agrupadoPor || 'unidad_medida'} (HU-145)`, ['Agrupación', 'Stock Total', 'Insumos', 'Bajo Stock'], (d.stockInsumosPorCategoria?.items || []).map((s) => [
      s.categoria, String(s.stockTotal), String(s.cantidadInsumos), String(s.insumosBajoStock),
    ]));

    agregarSeccion('Alertas de Bajo Stock (HU-146)', ['Insumo', 'Stock Actual', 'Stock Mínimo', 'Déficit'], d.alertasStockBajo.map((a) => [
      a.nombre, `${a.stock_actual} ${a.unidad_medida}`, `${a.stock_minimo} ${a.unidad_medida}`, String(a.deficit),
    ]));

    agregarSeccion('Alertas de Próximos a Vencer (HU-147)', ['Insumo', 'Stock', 'Vencimiento', 'Días Restantes'], d.alertasProximosVencer.map((a) => [
      a.nombre, `${a.stock_actual} ${a.unidad_medida}`, a.fecha_vencimiento, String(a.dias_restantes),
    ]));

    const dateSlug = new Date().toISOString().slice(0, 10);
    const filename = `dashboard_cenarepas_${dateSlug}.pdf`;
    doc.save(filename);
    toast.success(`PDF exportado: ${filename}`);
  } catch (error) {
    console.error('[dashboardService] Error al exportar PDF:', error);
    toast.error('Ocurrió un error al generar el PDF del dashboard');
  }
}

/**
 * HU-149: Exporta a Excel (.xlsx) todos los indicadores reales del Dashboard.
 */
export async function exportDashboardToExcel(data = EMPTY_DASHBOARD_DATA, periodoLabel = '') {
  try {
    const d = normalizeDashboardData(data);
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'CENAREPAS';
    workbook.created = new Date();
    const fechaGen = fechaGeneracionBogota(d);
    const periodo = periodoLabel || d.periodo?.etiqueta || 'Esta semana';

    const agregarHoja = (nombre, columnas, filas) => {
      const ws = workbook.addWorksheet(nombre.slice(0, 31));
      ws.addRow([`CENAREPAS — ${nombre} (${periodo})`]);
      ws.addRow([`Generado: ${fechaGen}`]);
      ws.addRow([]);
      const headerRow = ws.addRow(columnas);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC1502D' } };
      });
      if (filas.length === 0) {
        ws.addRow(['Sin datos registrados']);
      } else {
        filas.forEach((f) => ws.addRow(f));
      }
      ws.columns.forEach((col) => { col.width = 22; });
    };

    agregarHoja('Resumen KPIs', ['Indicador', 'Valor', 'Comparativo', 'Variación %'], [
      ['Ventas Hoy', d.comparativaDiaria.hoy, d.comparativaDiaria.ayer, d.comparativaDiaria.variacionPct],
      ['Ventas Mes Actual', d.comparativaMensual.mesActual, d.comparativaMensual.mesAnterior, d.comparativaMensual.variacionPct],
      ['Pedidos Procesados', d.kpis.pedidosProcesados, '', d.kpis.pedidosCambio],
      ['Producción del Día', d.kpis.produccionDia, d.kpis.produccionAyer, d.kpis.produccionCambio],
      ['Insumos Activos', d.kpis.insumosActivos, d.kpis.insumosStockBajo, d.kpis.insumosCambio],
      ['Compras Año Vigente', d.comparativaComprasAnual.totalActual, d.comparativaComprasAnual.totalAnterior, d.comparativaComprasAnual.variacionPct],
      ['Rentabilidad (Ventas - Compras)', d.rentabilidad.resultadoPeriodo, d.rentabilidad.comprasPeriodo, d.rentabilidad.margenPct],
    ]);

    agregarHoja('Ultimas Ventas', ['ID Venta', 'Cliente', 'Sede', 'Fecha', 'Hora', 'Monto', 'Estado Pago'], d.ultimasVentas.map((v) => [
      v.id_venta, v.cliente, v.sede_nombre, v.fecha, v.hora, v.monto, v.estado,
    ]));

    agregarHoja('Ventas Periodo', ['Tipo', 'Fecha / Periodo', 'Cantidad', 'Total'], [
      ...(d.ventasPorPeriodo?.diarias || []).map((x) => ['Diaria', x.etiqueta, x.cantidad, x.total]),
      ...(d.ventasPorPeriodo?.semanales || []).map((x) => ['Semanal', x.etiqueta, x.cantidad, x.total]),
      ...(d.ventasPorPeriodo?.mensuales || []).map((x) => ['Mensual', x.etiqueta, x.cantidad, x.total]),
    ]);

    agregarHoja('Ventas Semana', ['Día', 'Semana Actual', 'Semana Anterior'], (d.ventasSemanales?.porDia || []).map((x) => [
      x.dia, x.semanaActual, x.semanaAnterior,
    ]));

    agregarHoja('Productos y Categorias', ['Tipo', 'Nombre', 'Cantidad', 'Monto', '% Participación'], [
      ...d.productosMasVendidos.map((p) => ['Producto', p.nombre, p.cantidad, p.monto, '']),
      ...d.ventasPorCategoria.map((c) => ['Categoría', c.categoria, c.cantidad, c.total, c.porcentaje]),
    ]);

    agregarHoja('Compras y Proveedores', ['Sección', 'Nombre / Mes', 'Actual / Monto', 'Anterior / Acumulado'], [
      ...d.gastoAcumuladoMensual.map((m) => ['Gasto Acumulado', m.etiqueta, m.montoMensual, m.acumulado]),
      ...(d.comparativaComprasAnual?.porMes || []).map((m) => ['Anual', m.etiqueta, m.anioActual, m.anioAnterior]),
      ...d.topProveedores.map((p) => ['Top Proveedor', p.nombre, p.montoTotal, p.totalCompras]),
    ]);

    agregarHoja('Stock y Alertas', ['Tipo', 'Nombre / Agrupación', 'Stock', 'Mínimo / Vencimiento', 'Días / Déficit'], [
      ...(d.stockInsumosPorCategoria?.items || []).map((s) => ['Stock por unidad_medida', s.categoria, s.stockTotal, s.cantidadInsumos, s.insumosBajoStock]),
      ...d.alertasStockBajo.map((a) => ['Bajo Stock', a.nombre, a.stock_actual, a.stock_minimo, a.deficit]),
      ...d.alertasProximosVencer.map((a) => ['Próximo a Vencer', a.nombre, a.stock_actual, a.fecha_vencimiento, a.dias_restantes]),
    ]);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const dateSlug = new Date().toISOString().slice(0, 10);
    const filename = `dashboard_cenarepas_${dateSlug}.xlsx`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast.success(`Excel exportado: ${filename}`);
  } catch (error) {
    console.error('[dashboardService] Error al exportar Excel:', error);
    toast.error('Ocurrió un error al generar el archivo Excel del dashboard');
  }
}
