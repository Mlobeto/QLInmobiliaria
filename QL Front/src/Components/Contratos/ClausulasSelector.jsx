import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  IoCheckboxOutline, 
  IoSquareOutline, 
  IoCloseOutline,
  IoSaveOutline,
  IoInformationCircleOutline,
  IoBusinessOutline,
  IoHomeOutline,
  IoHelpCircleOutline
} from 'react-icons/io5';
import { 
  clausulasOpcionales,
  obtenerClausulasSegunTipo 
} from '../../utils/clausulasContratos';

const ClausulasSelector = ({ tipoPropiedad, onClausulasSelected, onClose }) => {
  const datosClausulas = obtenerClausulasSegunTipo(tipoPropiedad);
  const [clausulasSeleccionadas, setClausulasSeleccionadas] = useState({});
  const [clausulasOpcionalesSeleccionadas, setClausulasOpcionalesSeleccionadas] = useState({});
  const [verDetalles, setVerDetalles] = useState({});
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  const handleToggleClausula = (categoria, clave) => {
    if (categoria === 'opcionales') {
      setClausulasOpcionalesSeleccionadas(prev => ({
        ...prev,
        [clave]: !prev[clave]
      }));
    } else {
      setClausulasSeleccionadas(prev => ({
        ...prev,
        [clave]: !prev[clave]
      }));
    }
  };

  const handleToggleDetalle = (clave) => {
    setVerDetalles(prev => ({
      ...prev,
      [clave]: !prev[clave]
    }));
  };

  const handleConfirmar = () => {
    const clausulasFinales = [];
    
    // Agregar cláusulas específicas seleccionadas
    Object.entries(datosClausulas.clausulas).forEach(([clave, clausula]) => {
      if (clausulasSeleccionadas[clave]) {
        clausulasFinales.push({
          clave,
          titulo: clausula.titulo,
          contenido: clausula.contenido,
          tipo: datosClausulas.tipo
        });
      }
    });

    // Agregar cláusulas opcionales seleccionadas
    Object.entries(clausulasOpcionales).forEach(([clave, clausula]) => {
      if (clausulasOpcionalesSeleccionadas[clave]) {
        clausulasFinales.push({
          clave,
          titulo: clausula.titulo,
          contenido: clausula.contenido,
          tipo: 'opcional'
        });
      }
    });

    onClausulasSelected(clausulasFinales);
  };

  const getIconoTipo = () => {
    if (datosClausulas.tipo === 'comercial') {
      return <IoBusinessOutline className="w-6 h-6 text-blue-400" />;
    } else if (datosClausulas.tipo === 'vivienda') {
      return <IoHomeOutline className="w-6 h-6 text-green-400" />;
    }
    return <IoInformationCircleOutline className="w-6 h-6 text-purple-400" />;
  };

  const renderClausula = (clave, clausula, categoria = 'especifica') => {
    const isSeleccionada = categoria === 'opcionales' 
      ? clausulasOpcionalesSeleccionadas[clave] 
      : clausulasSeleccionadas[clave];
    const mostrarDetalle = verDetalles[clave];

    return (
      <div 
        key={clave}
        className={`bg-white/5 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
          isSeleccionada 
            ? 'border-blue-400/50 shadow-lg shadow-blue-500/20' 
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <button
              onClick={() => handleToggleClausula(categoria, clave)}
              className="flex items-start space-x-3 flex-1 text-left group"
            >
              <div className="mt-0.5">
                {isSeleccionada ? (
                  <IoCheckboxOutline className="w-6 h-6 text-blue-400" />
                ) : (
                  <IoSquareOutline className="w-6 h-6 text-slate-400 group-hover:text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold transition-colors ${
                  isSeleccionada ? 'text-blue-300' : 'text-white'
                }`}>
                  {clausula.titulo}
                </h4>
                <p className="text-slate-400 text-sm mt-1">
                  {mostrarDetalle ? clausula.contenido : `${clausula.contenido.substring(0, 80)}...`}
                </p>
              </div>
            </button>
            <button
              onClick={() => handleToggleDetalle(clave)}
              className="ml-2 text-slate-400 hover:text-blue-400 transition-colors text-sm"
            >
              {mostrarDetalle ? 'Ver menos' : 'Ver más'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            {getIconoTipo()}
            <div>
              <h2 className="text-2xl font-bold text-white">
                Cláusulas Adicionales del Contrato
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {datosClausulas.descripcion} - Selecciona las cláusulas que deseas incluir
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMostrarAyuda(true)}
              className="text-slate-400 hover:text-blue-400 transition-colors p-2 hover:bg-blue-500/10 rounded-lg group"
              title="Ayuda"
            >
              <IoHelpCircleOutline className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cláusulas específicas según tipo */}
          {Object.keys(datosClausulas.clausulas).length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {datosClausulas.tipo === 'comercial' ? (
                  <IoBusinessOutline className="w-5 h-5 text-blue-400" />
                ) : (
                  <IoHomeOutline className="w-5 h-5 text-green-400" />
                )}
                <h3 className="text-lg font-semibold text-white">
                  Cláusulas Específicas para {datosClausulas.tipo === 'comercial' ? 'Local Comercial' : 'Vivienda'}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(datosClausulas.clausulas).map(([clave, clausula]) => 
                  renderClausula(clave, clausula, 'especifica')
                )}
              </div>
            </div>
          )}

          {/* Cláusulas opcionales */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <IoInformationCircleOutline className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">
                Cláusulas Opcionales (Aplicables a Cualquier Tipo)
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(clausulasOpcionales).map(([clave, clausula]) => 
                renderClausula(clave, clausula, 'opcionales')
              )}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <IoInformationCircleOutline className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">💡 Información importante:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-200">
                  <li>Las cláusulas seleccionadas se agregarán al contrato estándar</li>
                  <li>Podrás editar el contenido completo antes de generar el PDF</li>
                  <li>Las cláusulas marcadas con [ESPECIFICAR] requieren completar datos</li>
                  <li>Puedes desmarcar las cláusulas que no necesites</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <div className="text-slate-400 text-sm">
            {Object.values(clausulasSeleccionadas).filter(Boolean).length + 
             Object.values(clausulasOpcionalesSeleccionadas).filter(Boolean).length} cláusula(s) seleccionada(s)
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 font-medium border border-white/10"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-500/30 flex items-center space-x-2"
            >
              <IoSaveOutline className="w-5 h-5" />
              <span>Confirmar y Continuar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Ayuda */}
      {mostrarAyuda && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-10 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full border border-blue-500/30 max-h-[80vh] overflow-y-auto">
            {/* Header del modal de ayuda */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 border-b border-blue-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <IoHelpCircleOutline className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Sistema de Cláusulas del Contrato</h3>
                    <p className="text-blue-100 text-sm mt-1">Guía completa de uso</p>
                  </div>
                </div>
                <button
                  onClick={() => setMostrarAyuda(false)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-lg"
                >
                  <IoCloseOutline className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenido del modal de ayuda */}
            <div className="p-6 space-y-6">
              {/* Sección 1: ¿Qué son las cláusulas? */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-start space-x-3">
                  <IoInformationCircleOutline className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">¿Qué son las cláusulas del contrato?</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Las cláusulas son condiciones específicas que se agregan al contrato de alquiler según el tipo de propiedad 
                      y las necesidades particulares de cada caso. Permiten personalizar cada contrato con las condiciones legales 
                      y comerciales adecuadas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección 2: Tipos de cláusulas */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <IoBusinessOutline className="w-5 h-5 text-blue-400" />
                  <span>Tipos de Cláusulas</span>
                </h4>
                <div className="space-y-4">
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <IoBusinessOutline className="w-5 h-5 text-blue-400" />
                      <h5 className="font-semibold text-blue-300">Cláusulas para Local Comercial</h5>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Incluyen condiciones específicas para actividades comerciales: habilitaciones municipales, 
                      actividades permitidas, horarios de funcionamiento, carteles publicitarios, etc.
                    </p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <IoHomeOutline className="w-5 h-5 text-green-400" />
                      <h5 className="font-semibold text-green-300">Cláusulas para Vivienda</h5>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Incluyen condiciones para uso habitacional: reglamento de propiedad horizontal, 
                      uso exclusivo de vivienda, mascotas, modificaciones, etc.
                    </p>
                  </div>
                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <IoInformationCircleOutline className="w-5 h-5 text-purple-400" />
                      <h5 className="font-semibold text-purple-300">Cláusulas Opcionales</h5>
                    </div>
                    <p className="text-slate-300 text-sm">
                      Aplicables a cualquier tipo de contrato: cláusula penal, seguro de caución, 
                      cláusula de mejoras, actualización de alquileres, etc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sección 3: Cómo usar el selector */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-lg font-bold text-white mb-4">¿Cómo usar el selector de cláusulas?</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Revisa las cláusulas disponibles</p>
                      <p className="text-slate-400 text-sm">Lee cada cláusula usando el botón &ldquo;Ver más&rdquo; para ver el contenido completo.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Marca las cláusulas que necesitas</p>
                      <p className="text-slate-400 text-sm">Haz clic en la cláusula o el checkbox para seleccionarla. Se destacará en azul.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Completa los campos necesarios</p>
                      <p className="text-slate-400 text-sm">Las cláusulas con <span className="text-yellow-400 font-mono">[ESPECIFICAR]</span> requieren que agregues información específica en el editor.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Confirma y edita en el contrato</p>
                      <p className="text-slate-400 text-sm">Las cláusulas se insertarán en el editor donde podrás modificar todo el contenido antes de generar el PDF.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 4: Consejos */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-5 border border-yellow-500/20">
                <h4 className="text-lg font-bold text-yellow-300 mb-3 flex items-center space-x-2">
                  <span>💡</span>
                  <span>Consejos importantes</span>
                </h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>No es necesario seleccionar todas las cláusulas, solo las que apliquen a tu caso específico.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Puedes combinar cláusulas específicas (comercial o vivienda) con cláusulas opcionales.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Después de confirmar, podrás editar libremente todo el texto del contrato antes de generar el PDF.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>Las cláusulas con <span className="font-mono text-yellow-300">[ESPECIFICAR]</span> son plantillas que debes personalizar con datos concretos.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-0.5">•</span>
                    <span>El sistema respeta los márgenes A4 estándar (20mm arriba/abajo, 25mm izquierda/derecha) para un PDF profesional.</span>
                  </li>
                </ul>
              </div>

              {/* Botón de cerrar */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setMostrarAyuda(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-500/30"
                >
                  Entendido, cerrar ayuda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ClausulasSelector.propTypes = {
  tipoPropiedad: PropTypes.string.isRequired,
  onClausulasSelected: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ClausulasSelector;
