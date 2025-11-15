import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import numeroALetras from '../../utils/numeroALetras';

const ReciboPdf = ({ payment, lease, autoGenerate = false }) => {
  const generatePdf = () => {
    const doc = new jsPDF();
    
    // Función para formatear fecha
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return { day, month, year };
    };

    // Datos del pago
    const tenant = lease?.Tenant || {};
    const amount = Number(payment.amount);
    const { day, month, year } = formatDate(payment.paymentDate);
    const receiptNumber = String(payment.id).padStart(5, '0');

    // === HEADER ===
    // Logo Q+L
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("QUINTERO + LOBETO", 20, 25);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("PROPIEDADES", 20, 30);

    // Datos de la empresa
    doc.setFontSize(9);
    doc.text("de LOBETO MARIANA", 20, 40);
    doc.text("ARQUITECTA", 20, 45);
    doc.text("M.P. Nº 275", 20, 50);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("AVDA. CUBA Nº 50", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Tel. 3835 - 461334", 20, 65);
    doc.text("C.P. 4750 - Belen - Catamarca", 20, 70);
    doc.text("arquitecturalobeto@yahoo.com.ar", 20, 75);
    
    doc.setFontSize(8);
    doc.text("IVA RESPONSABLE MONOTRIBUTO", 20, 82);

    // Recuadro número de recibo
    doc.setLineWidth(0.5);
    doc.rect(130, 15, 60, 35);
    
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text("X", 145, 30);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Nº ${receiptNumber} - 00000692`, 135, 40);
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("RECIBO", 145, 50);
    
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("DOCUMENTO NO VALIDO COMO FACTURA", 133, 55);

    // Fecha
    doc.setLineWidth(0.3);
    doc.rect(130, 52, 60, 20);
    
    doc.setFontSize(8);
    doc.text("C.U.I.T.:  23-20514549-4", 132, 58);
    doc.text("Ing. Brutos: 23-20514549-4", 132, 62);
    doc.text("Inicio Activ.: 01-10-1996", 132, 66);
    
    doc.setFontSize(7);
    doc.text("DIA", 167, 58);
    doc.text("MES", 176, 58);
    doc.text("AÑO", 185, 58);
    
    doc.setFontSize(10);
    doc.text(String(day), 168, 66);
    doc.text(String(month), 177, 66);
    doc.text(String(year).slice(-2), 186, 66);

    // === DATOS DEL CLIENTE ===
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    doc.text("Señor(es):", 20, 95);
    doc.line(45, 95, 140, 95);
    doc.text(tenant.name || 'N/A', 46, 94);
    doc.text("Tel.:", 145, 95);
    doc.line(155, 95, 190, 95);

    doc.text("Domicilio:", 20, 105);
    doc.line(45, 105, 110, 105);
    doc.text(tenant.direccion || '', 46, 104);
    doc.text("Localidad:", 115, 105);
    doc.line(140, 105, 190, 105);
    doc.text(`${tenant.ciudad || ''}, ${tenant.provincia || ''}`, 141, 104);

    // Checkboxes
    doc.setFontSize(8);
    doc.rect(20, 110, 60, 20);
    
    doc.rect(22, 112, 3, 3);
    doc.text("R. Insc.", 26, 114);
    doc.rect(22, 117, 3, 3);
    doc.text("Exento", 26, 119);
    doc.rect(22, 122, 3, 3);
    doc.text("No Resp.", 26, 124);
    doc.rect(22, 127, 3, 3);
    doc.text("C. Final", 26, 129);

    doc.rect(45, 112, 3, 3);
    doc.text("Monotributo", 49, 114);
    doc.rect(45, 117, 3, 3);
    doc.text("Monotributo Social", 49, 119);
    doc.rect(45, 122, 3, 3);
    doc.text("Monotributo Eventual", 49, 124);
    doc.rect(45, 127, 3, 3);
    doc.text("Peq. Cont. Event. Social", 49, 129);

    // CONDICIONES DE VENTA
    doc.rect(85, 110, 105, 20);
    doc.setFont("helvetica", "bold");
    doc.text("CONDICIONES DE VENTA", 90, 115);
    doc.text("C.U.I.T.:", 90, 120);
    
    doc.setFont("helvetica", "normal");
    doc.text("Cont.", 90, 125);
    doc.rect(100, 122, 3, 3);
    doc.text("Cta. Cte.", 105, 125);
    doc.rect(118, 122, 3, 3);
    doc.text("Tarj.", 122, 125);
    doc.rect(132, 122, 3, 3);
    doc.text("Ing. Brutos:", 137, 125);

    doc.text("Cupón Nº", 90, 129);
    doc.line(105, 129, 140, 129);
    doc.text("Factura Nº:", 145, 129);

    // === MONTO RECIBIDO ===
    doc.setFontSize(10);
    doc.text("Recibí la suma de Pesos:", 20, 145);
    doc.line(70, 145, 190, 145);
    
    const montoEnLetras = numeroALetras(amount).toUpperCase();
    doc.setFont("helvetica", "bold");
    doc.text(montoEnLetras, 70, 144);

    // === CONCEPTO ===
    doc.setFont("helvetica", "normal");
    doc.text("En concepto de:", 20, 160);
    doc.line(55, 160, 190, 160);
    
    const concepto = payment.type === 'initial' 
      ? `Pago Inicial - Contrato ${lease.id} - ${lease.Property?.address || ''}`
      : `${payment.period} - Contrato ${lease.id} - ${lease.Property?.address || ''}`;
    doc.text(concepto, 55, 159);

    doc.line(20, 170, 190, 170);
    doc.line(20, 180, 190, 180);

    // === CHEQUE ===
    doc.text("Cheque Nº:", 20, 195);
    doc.line(45, 195, 100, 195);
    doc.text("Banco:", 110, 195);
    doc.line(130, 195, 190, 195);

    // === MONTO Y FIRMA ===
    doc.setLineWidth(0.5);
    doc.rect(20, 200, 85, 35);
    doc.rect(110, 200, 80, 35);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Son $:", 25, 220);
    doc.setFontSize(16);
    doc.text(new Intl.NumberFormat('es-AR').format(amount), 50, 220);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.line(120, 220, 180, 220);
    doc.text("Firma", 145, 225);
    doc.line(120, 230, 180, 230);
    doc.text("Aclaración de la Firma", 135, 233);

    // === PIE DE PÁGINA ===
    doc.setFontSize(7);
    doc.text("Imprenta de Alberto R. Tabares", 20, 245);
    doc.text("Obispo O.P. (9100) Belen-Catamarca", 20, 248);
    doc.text("Cel. 27-385/04851 - Email: 60738 Ind. Act. 01-09-2007", 20, 251);
    
    doc.setFontSize(8);
    doc.text("Fecha de Impresión:", 110, 248);
    doc.text(new Date().toLocaleDateString('es-AR'), 110, 252);
    doc.text("Del 0001-00000601 - A1 0001-00000700", 110, 258);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("ORIGINAL", 165, 260);

    doc.save(`Recibo_${receiptNumber}_${tenant.name || 'Cliente'}.pdf`);
  };

  if (autoGenerate) {
    setTimeout(() => generatePdf(), 100);
    return null;
  }

  return (
    <div className="mt-4">
      <button
        onClick={generatePdf}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generar Recibo PDF
      </button>
    </div>
  );
};

ReciboPdf.propTypes = {
  payment: PropTypes.object.isRequired,
  lease: PropTypes.object.isRequired,
  autoGenerate: PropTypes.bool,
};

export default ReciboPdf;
