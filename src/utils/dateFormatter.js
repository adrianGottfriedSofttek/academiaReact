/**
 * Formatea un objeto de fecha para mostrarlo como texto amigable
 * @param {Date|Object|string|number} dateValue - Valor de fecha a formatear
 * @returns {string} Fecha formateada
 */

export function formatearFecha(dateValue) {
    // Si no hay fecha, mostrar mensaje por defecto
    if (!dateValue) return "No disponible";
    
    try {
      // Convertir a objeto Date según el tipo de entrada
      let fecha = convertirAFecha(dateValue);
      
      // Opciones de formato
      const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      // Retornar la fecha formateada
      return fecha.toLocaleString('es-ES', opciones);
    } catch (err) {
      console.error("Error al dar formato a la fecha:", err);
      return "Formato inválido";
    }
  }
  
  /**
   * Convierte diferentes formatos de fecha a un objeto Date estándar
   * @param {Date|Object|string|number} valor - Valor a convertir
   * @returns {Date} Objeto Date resultante
   */
  export function convertirAFecha(valor) {
    // Si ya es un objeto Date, devolverlo directamente
    if (valor instanceof Date) return valor;
    
    // Casos para diferentes formatos
    
    // Caso 1: Timestamp de Firestore con método toDate()
    if (valor && typeof valor.toDate === 'function') {
      return valor.toDate();
    }
    
    // Caso 2: Objeto con seconds (formato interno de Firestore)
    if (valor && typeof valor === 'object' && 'seconds' in valor) {
      return new Date(valor.seconds * 1000);
    }
    
    // Caso 3: String en formato ISO
    if (typeof valor === 'string') {
      return new Date(valor);
    }
    
    // Caso 4: Timestamp numérico (milisegundos)
    if (typeof valor === 'number') {
      return new Date(valor);
    }
    
    // Si no se puede convertir, devolver la fecha actual
    return new Date();
  }