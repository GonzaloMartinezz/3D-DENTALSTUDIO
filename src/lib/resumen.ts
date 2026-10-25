export interface ResumenPanel {
  pacientes: number;
  pacientes_mes: number;
  pacientes_con_estudios: number;
  estudios: number;
  estudios_mes: number;
  estudios_sin_publicar: number;
  descargas_mes: number;
  almacenamiento_bytes: number;
  pacientes_por_mes: { mes: string; total: number }[];
}

export const RESUMEN_VACIO: ResumenPanel = {
  pacientes: 0, pacientes_mes: 0, pacientes_con_estudios: 0, estudios: 0, estudios_mes: 0,
  estudios_sin_publicar: 0, descargas_mes: 0, almacenamiento_bytes: 0, pacientes_por_mes: [],
};

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const nombreMes = (aaaamm: string) => MESES[Number(aaaamm.slice(5, 7)) - 1] ?? aaaamm;
