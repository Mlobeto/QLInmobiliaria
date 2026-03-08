import { useState } from 'react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generarHTMLContrato } from '../../utils/generarHTMLContrato';
import { IoCloseOutline, IoDocumentTextOutline, IoDownloadOutline } from 'react-icons/io5';

const VistaPrePDF = ({ lease, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleGeneratePDF = async () => {
    setLoading(true);
    
    try {
      // Crear HTML del contrato
      const htmlContrato = lease.customContent || generarHTMLContrato(lease, []);
      
      // Crear contenedor temporal con el HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContrato;
      
      // Configurar estilos para A4 con márgenes precisos
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-99999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.minHeight = '297mm'; // A4 height
      tempDiv.style.padding = '20mm 25mm'; // Márgenes superior/inferior: 20mm, izquierda/derecha: 25mm
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.boxSizing = 'border-box';
      tempDiv.style.fontFamily = 'Arial, Helvetica, sans-serif';
      tempDiv.style.fontSize = '10pt';
      tempDiv.style.lineHeight = '1.5';
      tempDiv.style.color = '#000';
      
      document.body.appendChild(tempDiv);
      
      // Esperar a que se renderice
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Convertir a canvas con alta calidad
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Mejor calidad
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight,
        windowWidth: tempDiv.scrollWidth,
        windowHeight: tempDiv.scrollHeight
      });
      
      // Limpiar elemento temporal
      document.body.removeChild(tempDiv);
      
      // Crear PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pdfWidth = 210; // A4 width en mm
      const pdfHeight = 297; // A4 height en mm
      
      // Calcular altura de la imagen en PDF
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;
      
      // Primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, `page${page}`, 'FAST');
      heightLeft -= pdfHeight;
      
      // Páginas adicionales
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        page++;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, `page${page}`, 'FAST');
        heightLeft -= pdfHeight;
      }
      
      // Descargar
      const fileName = `Contrato_${lease.Tenant?.name || 'Contrato'}_${new Date().toLocaleDateString('es-AR').replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
      
      setLoading(false);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <IoDocumentTextOutline className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Vista Previa del Contrato #{lease.id}
              </h2>
              <p className="text-slate-400 text-sm">
                Verifica el contenido antes de descargar el PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            disabled={loading}
          >
            <IoCloseOutline className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido - Preview del HTML */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-800/50">
          <div 
            className="bg-white rounded-lg shadow-xl p-8 max-w-[210mm] mx-auto"
            style={{ minHeight: '297mm' }}
            dangerouslySetInnerHTML={{ 
              __html: lease.customContent || generarHTMLContrato(lease, []) 
            }}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <div className="text-slate-400 text-sm">
            💡 El PDF se generará con márgenes estándar A4 (20mm superior/inferior, 25mm laterales)
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 font-medium border border-white/10"
              disabled={loading}
            >
              Cerrar
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-500/30 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoDownloadOutline className="w-5 h-5" />
              <span>{loading ? 'Generando PDF...' : 'Descargar PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

VistaPrePDF.propTypes = {
  lease: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VistaPrePDF;
