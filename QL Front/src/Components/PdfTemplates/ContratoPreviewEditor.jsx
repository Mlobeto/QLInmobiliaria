import { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generarHTMLContrato } from '../../utils/generarHTMLContrato';
import { IoCloseOutline, IoDocumentTextOutline, IoDownloadOutline } from 'react-icons/io5';

const ContratoPreviewEditor = ({ lease, onClose }) => {
  const editorRef = useRef(null);
  const [contenido, setContenido] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generar HTML del contrato desde los datos
    const htmlContrato = generarHTMLContrato(lease);
    setContenido(htmlContrato);
  }, [lease]);

  const handleGeneratePDF = async () => {
    if (!editorRef.current) return;
    
    setLoading(true);
    
    try {
      const content = editorRef.current.getContent();
      
      // Crear contenedor temporal con tamaño A4 exacto
      const pageContainer = document.createElement('div');
      pageContainer.style.position = 'absolute';
      pageContainer.style.left = '-9999px';
      pageContainer.style.top = '0';
      pageContainer.style.width = '210mm'; // A4 width
      pageContainer.style.minHeight = '297mm'; // A4 height
      pageContainer.style.backgroundColor = 'white';
      pageContainer.style.padding = '25mm'; // Márgenes
      pageContainer.style.boxSizing = 'border-box';
      
      // Contenedor interno para el contenido
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = content;
      contentDiv.style.fontFamily = 'Arial, Helvetica, sans-serif';
      contentDiv.style.fontSize = '11pt';
      contentDiv.style.lineHeight = '1.6';
      contentDiv.style.color = '#000';
      contentDiv.style.width = '100%';
      
      pageContainer.appendChild(contentDiv);
      
      // Aplicar estilos para justificación y formato
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        #temp-contract-pdf p {
          text-align: justify !important;
          margin: 10px 0 !important;
          font-family: Arial, Helvetica, sans-serif !important;
          font-size: 11pt !important;
          line-height: 1.6 !important;
        }
        #temp-contract-pdf h1 {
          font-size: 14pt !important;
          text-align: center !important;
          font-weight: bold !important;
          margin: 15px 0 !important;
        }
        #temp-contract-pdf h2, #temp-contract-pdf h3 {
          font-size: 12pt !important;
          font-weight: bold !important;
          margin: 12px 0 8px 0 !important;
        }
        #temp-contract-pdf ul, #temp-contract-pdf ol {
          text-align: justify !important;
          margin: 10px 0 !important;
          padding-left: 20px !important;
        }
        #temp-contract-pdf li {
          margin: 5px 0 !important;
        }
        #temp-contract-pdf .clausula {
          margin: 15px 0 !important;
        }
        #temp-contract-pdf .titulo-clausula {
          font-weight: bold !important;
          margin-bottom: 5px !important;
        }
      `;
      contentDiv.id = 'temp-contract-pdf';
      document.head.appendChild(styleElement);
      document.body.appendChild(pageContainer);

      // Convertir a canvas con alta calidad
      const canvas = await html2canvas(pageContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: pageContainer.offsetWidth,
        height: pageContainer.offsetHeight,
        backgroundColor: '#ffffff',
        windowWidth: pageContainer.offsetWidth,
        windowHeight: pageContainer.offsetHeight
      });

      // Limpiar elementos temporales
      document.body.removeChild(pageContainer);
      document.head.removeChild(styleElement);

      // Crear PDF en formato A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Primera página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage('a4', 'p');
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      // Descargar PDF
      const fechaActual = new Date().toISOString().split('T')[0].replace(/-/g, '_');
      pdf.save(`Contrato_${lease.id}_${fechaActual}.pdf`);
      
      onClose();
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <IoDocumentTextOutline className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Preview y Edición de Contrato #{lease.id}
              </h2>
              <p className="text-slate-400 text-sm">
                Edita el contrato antes de generar el PDF (formato A4)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            disabled={loading}
          >
            <IoCloseOutline className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-auto p-6">
          <Editor
            tinymceScriptSrc="https://cdn.tiny.cloud/1/se2bvqg48curpyywfqprsxuygl0ycppdzaefay32hp988nbi/tinymce/7/tinymce.min.js"
            onInit={(evt, editor) => editorRef.current = editor}
            value={contenido}
            onEditorChange={(newContent) => setContenido(newContent)}
            init={{
              height: 600,
              menubar: false,
              statusbar: false,
              plugins: 'lists link code help wordcount pagebreak',
              toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat | pagebreak | code',
              content_style: `
                body { 
                  font-family: Arial, Helvetica, sans-serif; 
                  font-size: 11pt; 
                  line-height: 1.6;
                  max-width: 210mm;
                  margin: 0 auto;
                  padding: 25mm;
                  background: white;
                  color: #000;
                }
                p {
                  text-align: justify;
                  margin: 10px 0;
                }
                h1 {
                  font-size: 14pt;
                  text-align: center;
                  font-weight: bold;
                  margin: 15px 0;
                }
                h2, h3 {
                  font-size: 12pt;
                  font-weight: bold;
                  margin: 12px 0 8px 0;
                }
                .clausula {
                  margin: 15px 0;
                }
                .titulo-clausula {
                  font-weight: bold;
                  margin-bottom: 5px;
                }
              `,
              language: 'es',
            }}
          />
        </div>

        {/* Footer con botones */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <p className="text-slate-400 text-sm">
            💡 Los cambios NO se guardan en la base de datos. Edita y genera el PDF directamente.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generando PDF A4...
                </>
              ) : (
                <>
                  <IoDownloadOutline className="w-5 h-5" />
                  Generar PDF (A4)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ContratoPreviewEditor.propTypes = {
  lease: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ContratoPreviewEditor;
