import { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { updateLease } from '../../redux/Actions/actions';
import { generarHTMLContrato } from '../../utils/generarHTMLContrato';

const ContratoEditor = ({ lease, onClose }) => {
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const [contenido, setContenido] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si ya tiene contenido personalizado, usarlo; si no, generar uno nuevo
    const htmlInicial = lease.customContent || generarHTMLContrato(lease);
    setContenido(htmlInicial);
  }, [lease]);

  const handleSave = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      
      try {
        setLoading(true);
        
        await dispatch(updateLease(lease.id, { customContent: content }));
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Contrato personalizado guardado correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        
        onClose();
      } catch (error) {
        console.error('Error al guardar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo guardar el contrato personalizado'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetToDefault = () => {
    Swal.fire({
      title: '¿Restaurar contrato original?',
      text: 'Se perderán todos los cambios personalizados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const htmlOriginal = generarHTMLContrato(lease);
        setContenido(htmlOriginal);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Editor de Contrato #{lease.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
              height: 700,
              menubar: false,
              statusbar: false,
              plugins: 'lists link code help wordcount pagebreak',
              toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | removeformat | pagebreak | code | help',
              content_style: `
                html {
                  background: #f0f0f0;
                  padding: 20px;
                }
                body { 
                  font-family: Helvetica, Arial, sans-serif; 
                  font-size: 11pt; 
                  line-height: 1.6;
                  width: 210mm;
                  margin: 0 auto;
                  padding: 0;
                  background: white;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
                  position: relative;
                  background-image: 
                    linear-gradient(to right, transparent 25mm, #2196F3 25mm, #2196F3 calc(25mm + 2px), transparent calc(25mm + 2px), transparent calc(210mm - 25mm - 2px), #2196F3 calc(210mm - 25mm - 2px), #2196F3 calc(210mm - 25mm), transparent calc(210mm - 25mm)),
                    linear-gradient(to bottom, transparent 25mm, #2196F3 25mm, #2196F3 calc(25mm + 2px), transparent calc(25mm + 2px), transparent calc(297mm - 25mm - 2px), #2196F3 calc(297mm - 25mm - 2px), #2196F3 calc(297mm - 25mm), transparent calc(297mm - 25mm)),
                    linear-gradient(to bottom, transparent 297mm, #ff4444 297mm, #ff4444 calc(297mm + 3px), transparent calc(297mm + 3px), transparent 594mm, #ff4444 594mm, #ff4444 calc(594mm + 3px), transparent calc(594mm + 3px));
                  background-repeat: repeat-y, repeat-x, repeat;
                  min-height: 297mm;
                }
                body::before {
                  content: 'PÁGINA 1';
                  position: absolute;
                  top: 10mm;
                  left: 50%;
                  transform: translateX(-50%);
                  color: #999;
                  font-size: 9pt;
                  font-weight: bold;
                }
                body::after {
                  content: 'Límite de Página';
                  position: absolute;
                  top: 297mm;
                  left: 50%;
                  transform: translateX(-50%);
                  color: #ff4444;
                  font-size: 9pt;
                  font-weight: bold;
                  background: white;
                  padding: 5px 10px;
                  border: 2px solid #ff4444;
                  border-radius: 4px;
                  z-index: 1000;
                }
                body > * {
                  margin-left: 25mm;
                  margin-right: 25mm;
                  max-width: 160mm;
                }
                body > *:first-child {
                  margin-top: 25mm;
                }
                body > *:last-child {
                  margin-bottom: 25mm;
                }
                h1 { 
                  font-size: 16pt; 
                  text-align: center; 
                  font-weight: bold;
                  margin-top: 15px;
                  margin-bottom: 15px;
                }
                h2 { 
                  font-size: 14pt; 
                  font-weight: bold;
                  margin-top: 12px;
                  margin-bottom: 12px;
                }
                p { 
                  margin-top: 10px;
                  margin-bottom: 10px;
                  text-align: justify;
                }
                ul, ol {
                  text-align: justify;
                }
                /* Estilo para saltos de página manuales */
                .mce-pagebreak {
                  border-top: 3px dashed #ff4444;
                  margin: 20px 0;
                  page-break-after: always;
                  position: relative;
                }
                .mce-pagebreak::after {
                  content: 'SALTO DE PÁGINA';
                  position: absolute;
                  top: -12px;
                  left: 50%;
                  transform: translateX(-50%);
                  background: white;
                  padding: 0 10px;
                  color: #ff4444;
                  font-size: 9pt;
                  font-weight: bold;
                }
              `
            }}
          />
        </div>

        {/* Footer con botones */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleResetToDefault}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Restaurar Original
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ContratoEditor.propTypes = {
  lease: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ContratoEditor;
