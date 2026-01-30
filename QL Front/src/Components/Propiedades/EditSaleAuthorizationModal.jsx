/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { 
  IoCloseOutline, 
  IoDocumentTextOutline, 
  IoSaveOutline,
  IoCalendarOutline,
  IoPricetagOutline,
  IoPersonOutline,
  IoHomeOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const EditSaleAuthorizationModal = ({ property, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    ownerName: '',
    ownerCuil: '',
    ownerAddress: '',
    propertyDescription: '',
    salePrice: '',
    commission: '',
    validityDays: 360,
    customText: '',
    socio: '',
    currency: 'ARS'
  });

  // Cargar datos existentes al montar el componente
  useEffect(() => {
    const loadAuthorizationData = async () => {
      try {
        setLoadingData(true);
        const response = await axios.get(
          `${API_URL}/api/property/${property.propertyId}/sale-authorization`
        );

        if (response.data.success) {
          const { authorization, client, property: propertyData } = response.data;
          
          setFormData({
            ownerName: authorization.ownerName || client?.name || '',
            ownerCuil: authorization.ownerCuil || client?.cuil || '',
            ownerAddress: authorization.ownerAddress || client?.address || '',
            propertyDescription: authorization.propertyDescription || propertyData.description || '',
            salePrice: authorization.salePrice || propertyData.price || '',
            commission: authorization.commission || propertyData.comision || '',
            validityDays: authorization.validityDays || 360,
            customText: authorization.customText || '',
            socio: authorization.socio || propertyData.socio || '',
            currency: authorization.currency || propertyData.currency || 'ARS'
          });
        }
      } catch (err) {
        console.error('Error al cargar datos de autorización:', err);
        // Si no hay datos, usar los de la propiedad
        setFormData({
          ownerName: '',
          ownerCuil: '',
          ownerAddress: '',
          propertyDescription: property.description || '',
          salePrice: property.price || '',
          commission: property.comision || '',
          validityDays: 360,
          customText: '',
          currency: property.currency || 'ARS',
          socio: property.socio || ''
        });
      } finally {
        setLoadingData(false);
      }
    };

    if (property) {
      loadAuthorizationData();
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${API_URL}/api/property/${property.propertyId}/sale-authorization`,
        formData
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSave(response.data.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error al guardar autorización:', err);
      setError(err.response?.data?.error || 'Error al guardar la autorización');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          <p className="text-white text-center mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl my-8 border border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <IoDocumentTextOutline className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Editar Autorización de Venta</h2>
              <p className="text-amber-100 text-sm mt-1">
                {property.address} - {property.city}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <IoCloseOutline className="text-2xl text-white" />
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300 flex items-center gap-3">
            <IoAlertCircleOutline className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-6 p-4 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300 flex items-center gap-3">
            <IoSaveOutline className="w-5 h-5 flex-shrink-0" />
            <span>¡Autorización guardada exitosamente!</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Propietario */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <IoPersonOutline className="w-5 h-5 text-blue-400" />
              Información del Propietario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  CUIL/CUIT *
                </label>
                <input
                  type="text"
                  name="ownerCuil"
                  value={formData.ownerCuil}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  placeholder="Ej: 20-12345678-9"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-300 font-medium mb-2">
                  Domicilio *
                </label>
                <input
                  type="text"
                  name="ownerAddress"
                  value={formData.ownerAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  placeholder="Ej: Av. Siempre Viva 123"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-300 font-medium mb-2">
                  Socio
                </label>
                <input
                  type="text"
                  name="socio"
                  value={formData.socio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  placeholder="Nombre del socio (opcional)"
                />
              </div>
            </div>
          </div>

          {/* Información de la Propiedad */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <IoHomeOutline className="w-5 h-5 text-emerald-400" />
              Información de la Propiedad
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Descripción de la Propiedad *
                </label>
                <textarea
                  name="propertyDescription"
                  value={formData.propertyDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  placeholder="Descripción completa de la propiedad..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Condiciones Económicas */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <IoPricetagOutline className="w-5 h-5 text-amber-400" />
              Condiciones Económicas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Precio de Venta *
                </label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  placeholder="Ej: 150000"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Moneda *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  required
                >
                  <option value="ARS" className="bg-slate-800">Pesos (ARS)</option>
                  <option value="USD" className="bg-slate-800">Dólares (USD)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">
                  Comisión (%) *
                </label>
                <input
                  type="number"
                  name="commission"
                  value={formData.commission}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  placeholder="Ej: 5"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-300 font-medium mb-2">
                  <IoCalendarOutline className="w-4 h-4" />
                  Validez (días)
                </label>
                <input
                  type="number"
                  name="validityDays"
                  value={formData.validityDays}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                  placeholder="360"
                />
              </div>
            </div>
          </div>

          {/* Texto Personalizado */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">
              Texto Personalizado (Opcional)
            </h3>
            <textarea
              name="customText"
              value={formData.customText}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
              placeholder="Agregue cualquier texto adicional que desee incluir en la autorización..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center gap-2 border border-white/20"
            >
              <IoCloseOutline className="w-5 h-5" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <IoSaveOutline className="w-5 h-5" />
                  Guardar Autorización
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSaleAuthorizationModal;
