/**
 * Utilidades para manejo de fechas en zona horaria de Argentina (GMT-3)
 */

/**
 * Obtiene la fecha actual en Argentina
 * @returns {Date} Fecha actual en Argentina
 */
export const getArgentinaDate = () => {
  // Crear fecha en UTC
  const now = new Date();
  
  // Convertir a Argentina (UTC-3)
  const argentinaOffset = -3 * 60; // -3 horas en minutos
  const localOffset = now.getTimezoneOffset(); // offset del navegador en minutos
  const argentinaTime = new Date(now.getTime() + (localOffset - argentinaOffset) * 60000);
  
  return argentinaTime;
};

/**
 * Calcula la fecha de inicio del contrato según las reglas del negocio:
 * - Si se crea del día 1 al 15: startDate = día 1 del mes corriente
 * - Si se crea del día 16 en adelante: startDate = día 1 del mes siguiente
 * 
 * @returns {Date} Fecha de inicio calculada
 */
export const calculateLeaseStartDate = () => {
  const today = getArgentinaDate();
  const dayOfMonth = today.getDate();
  
  // Crear fecha para el día 1 del mes
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Si estamos del 16 en adelante, mover al próximo mes
  if (dayOfMonth >= 16) {
    startDate.setMonth(startDate.getMonth() + 1);
  }
  
  return startDate;
};

/**
 * Formatea una fecha como string en formato ISO para inputs type="date"
 * @param {Date} date - Fecha a formatear
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Formatea una fecha en formato legible para Argentina (DD/MM/YYYY)
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha en formato DD/MM/YYYY
 */
export const formatArgentinaDate = (date) => {
  if (!date) return '';
  
  const d = date instanceof Date ? date : new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Convierte una fecha ISO string a Date en zona horaria de Argentina
 * Evita problemas de conversión UTC
 * @param {string} isoString - Fecha en formato ISO
 * @returns {Date} Fecha parseada correctamente
 */
export const parseArgentinaDate = (isoString) => {
  if (!isoString) return null;
  
  // Si viene con hora (T00:00:00), tomar solo la parte de fecha
  const dateOnly = isoString.split('T')[0];
  const [year, month, day] = dateOnly.split('-').map(Number);
  
  // Crear fecha en hora local sin conversión UTC
  return new Date(year, month - 1, day);
};

/**
 * Agrega meses a una fecha
 * @param {Date} date - Fecha base
 * @param {number} months - Cantidad de meses a agregar
 * @returns {Date} Nueva fecha
 */
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Calcula la fecha de finalización del contrato
 * @param {Date|string} startDate - Fecha de inicio
 * @param {number} totalMonths - Duración en meses
 * @returns {Date} Fecha de finalización
 */
export const calculateLeaseEndDate = (startDate, totalMonths) => {
  const start = startDate instanceof Date ? startDate : parseArgentinaDate(startDate);
  const endDate = addMonths(start, totalMonths);
  
  // Restar 1 día para que termine el último día del mes
  endDate.setDate(endDate.getDate() - 1);
  
  return endDate;
};

/**
 * Verifica si una fecha está en Argentina (para debugging)
 * @param {Date} date - Fecha a verificar
 * @returns {Object} Información de la fecha
 */
export const debugDate = (date) => {
  return {
    date: date.toISOString(),
    localString: date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }),
    timezoneOffset: date.getTimezoneOffset(),
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear()
  };
};
