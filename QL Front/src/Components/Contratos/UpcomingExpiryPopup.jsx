import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { parseSafeDate } from '../../utils/dateUtils';

const UpcomingExpiryPopup = () => {
  const leases = useSelector((state) => state.leases);
  const [showPopup, setShowPopup] = useState(false);
  const [alertContracts, setAlertContracts] = useState([]);
  const [updateAlerts, setUpdateAlerts] = useState([]);

  // Función para calcular próxima actualización
  const getNextUpdateDate = (lease) => {
    const { startDate, updateFrequency } = lease;
    let updateIntervalMonths = 0;
    if (updateFrequency === "semestral") updateIntervalMonths = 6;
    else if (updateFrequency === "cuatrimestral") updateIntervalMonths = 4;
    else if (updateFrequency === "anual") updateIntervalMonths = 12;
    else if (updateFrequency === "trimestral") updateIntervalMonths = 3;
    
    if (updateIntervalMonths === 0) return null;
    
    const dateStr = startDate.split('T')[0];
    const [year, month, day] = dateStr.split('-').map(Number);
    const baseDate = new Date(year, month - 1, day, 12, 0, 0);
    
    let nextUpdate = new Date(baseDate);
    const now = new Date();
    while (nextUpdate <= now) {
      nextUpdate.setMonth(nextUpdate.getMonth() + updateIntervalMonths);
    }
    return nextUpdate;
  };

  // Calcular contratos próximos a vencer (optimizado - hasta 3 meses)
  const upcomingContracts = useMemo(() => {
    if (!leases || leases.length === 0) return [];
    const now = new Date();
    return leases.filter((lease) => {
      // Calcula la fecha de culminación sumando totalMonths a la fecha de inicio
      const start = parseSafeDate(lease.startDate);
      const terminationDate = new Date(start.getFullYear(), start.getMonth() + lease.totalMonths, 1);
      // Calcula la diferencia en días
      const daysToTermination = Math.ceil((terminationDate - now) / (1000 * 60 * 60 * 24));
      return daysToTermination > 0 && daysToTermination <= 90; // 3 meses
    }).map(lease => {
      const start = parseSafeDate(lease.startDate);
      const terminationDate = new Date(start.getFullYear(), start.getMonth() + lease.totalMonths, 1);
      const daysToTermination = Math.ceil((terminationDate - now) / (1000 * 60 * 60 * 24));
      return {
        ...lease,
        terminationDate,
        daysToTermination
      };
    }).sort((a, b) => a.daysToTermination - b.daysToTermination); // Ordenar por urgencia
  }, [leases]);

  // Calcular actualizaciones de alquiler próximas (hasta 30 días)
  const upcomingUpdates = useMemo(() => {
    if (!leases || leases.length === 0) return [];
    const now = new Date();
    return leases
      .map(lease => {
        const nextUpdate = getNextUpdateDate(lease);
        if (!nextUpdate) return null;
        
        const daysToUpdate = Math.ceil((nextUpdate - now) / (1000 * 60 * 60 * 24));
        
        if (daysToUpdate > 0 && daysToUpdate <= 30) {
          return {
            ...lease,
            nextUpdate,
            daysToUpdate,
            updateFrequency: lease.updateFrequency
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.daysToUpdate - b.daysToUpdate);
  }, [leases]);

  useEffect(() => {
    if (upcomingContracts.length > 0 || upcomingUpdates.length > 0) {
      setAlertContracts(upcomingContracts);
      setUpdateAlerts(upcomingUpdates);
      setShowPopup(true);
    }
  }, [upcomingContracts, upcomingUpdates]);

  if (!showPopup) return null;

  // Categorizar contratos por urgencia (VENCIMIENTOS)
  const criticalContracts = alertContracts.filter(c => c.daysToTermination <= 30);
  const urgentContracts = alertContracts.filter(c => c.daysToTermination > 30 && c.daysToTermination <= 60);
  const warningContracts = alertContracts.filter(c => c.daysToTermination > 60);

  // Categorizar actualizaciones de alquiler por urgencia
  const criticalUpdates = updateAlerts.filter(u => u.daysToUpdate <= 7);
  const warningUpdates = updateAlerts.filter(u => u.daysToUpdate > 7);

  const totalAlerts = alertContracts.length + updateAlerts.length;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full relative z-[10000] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-orange-500 to-red-600 text-white p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="mr-3 text-3xl">⚠️</span>
            Alertas de Contratos
          </h2>
          <p className="text-white/90 text-sm mt-2">
            {updateAlerts.length > 0 && (
              <span className="mr-4">💰 {updateAlerts.length} actualización(es) de alquiler</span>
            )}
            {alertContracts.length > 0 && (
              <span>📋 {alertContracts.length} contrato(s) próximos a vencer</span>
            )}
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* ========== SECCIÓN: ACTUALIZACIONES DE ALQUILER ========== */}
          {updateAlerts.length > 0 && (
            <div className="border-2 border-purple-200 rounded-xl p-4 bg-purple-50/50">
              <div className="flex items-center mb-4 pb-3 border-b-2 border-purple-300">
                <span className="text-3xl mr-3">💰</span>
                <div>
                  <h3 className="text-xl font-bold text-purple-700">
                    Actualizaciones de Alquiler Pendientes
                  </h3>
                  <p className="text-sm text-purple-600">
                    Contratos que requieren ajuste de monto
                  </p>
                </div>
              </div>

              {/* Actualizaciones Críticas (≤ 7 días) */}
              {criticalUpdates.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
                    <h4 className="text-md font-bold text-purple-700">
                      Urgentes - Actualizar esta semana ({criticalUpdates.length})
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {criticalUpdates.map((lease) => (
                      <li key={`update-${lease.id || lease.leaseId}`} className="bg-purple-100 border border-purple-300 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800">Contrato #{lease.id || lease.leaseId}</span>
                            <p className="text-sm text-gray-600">Inquilino: {lease.Tenant?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">
                              Próxima actualización: {lease.nextUpdate.toLocaleDateString('es-AR')}
                            </p>
                            <p className="text-xs text-purple-700 font-medium mt-1">
                              Frecuencia: {lease.updateFrequency.toUpperCase()}
                            </p>
                          </div>
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {lease.daysToUpdate} días
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actualizaciones de Advertencia (8-30 días) */}
              {warningUpdates.length > 0 && (
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                    <h4 className="text-md font-bold text-purple-600">
                      Próximas - Actualizar este mes ({warningUpdates.length})
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {warningUpdates.map((lease) => (
                      <li key={`update-${lease.id || lease.leaseId}`} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="font-semibold text-gray-800">Contrato #{lease.id || lease.leaseId}</span>
                            <p className="text-sm text-gray-600">Inquilino: {lease.Tenant?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">
                              Próxima actualización: {lease.nextUpdate.toLocaleDateString('es-AR')}
                            </p>
                            <p className="text-xs text-purple-600 font-medium mt-1">
                              Frecuencia: {lease.updateFrequency.toUpperCase()}
                            </p>
                          </div>
                          <span className="bg-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {lease.daysToUpdate} días
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ========== SECCIÓN: VENCIMIENTOS DE CONTRATOS ========== */}
          {alertContracts.length > 0 && (
            <div className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50/50">
              <div className="flex items-center mb-4 pb-3 border-b-2 border-orange-300">
                <span className="text-3xl mr-3">📋</span>
                <div>
                  <h3 className="text-xl font-bold text-orange-700">
                    Contratos Próximos a Vencer
                  </h3>
                  <p className="text-sm text-orange-600">
                    Coordinar renovaciones o búsqueda de nuevos inquilinos
                  </p>
                </div>
              </div>

              {/* Contratos Críticos (< 1 mes) */}
              {criticalContracts.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <h4 className="text-md font-bold text-red-600">
                      Críticos - Vencen en menos de 1 mes ({criticalContracts.length})
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {criticalContracts.map((lease) => (
                      <li key={`expiry-${lease.id || lease.leaseId}`} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold text-gray-800">Contrato #{lease.id || lease.leaseId}</span>
                            <p className="text-sm text-gray-600">Inquilino: {lease.Tenant?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">Vence: {lease.terminationDate.toLocaleDateString('es-AR')}</p>
                          </div>
                          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {lease.daysToTermination} días
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contratos Urgentes (1-2 meses) */}
              {urgentContracts.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <h4 className="text-md font-bold text-orange-600">
                      Urgentes - Vencen en los próximos 2 meses ({urgentContracts.length})
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {urgentContracts.map((lease) => (
                      <li key={`expiry-${lease.id || lease.leaseId}`} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold text-gray-800">Contrato #{lease.id || lease.leaseId}</span>
                            <p className="text-sm text-gray-600">Inquilino: {lease.Tenant?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">Vence: {lease.terminationDate.toLocaleDateString('es-AR')}</p>
                          </div>
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {lease.daysToTermination} días
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contratos de Advertencia (2-3 meses) */}
              {warningContracts.length > 0 && (
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <h4 className="text-md font-bold text-blue-600">
                      Informativo - Vencen en menos de 3 meses ({warningContracts.length})
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {warningContracts.map((lease) => (
                      <li key={`expiry-${lease.id || lease.leaseId}`} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-semibold text-gray-800">Contrato #{lease.id || lease.leaseId}</span>
                            <p className="text-sm text-gray-600">Inquilino: {lease.Tenant?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">Vence: {lease.terminationDate.toLocaleDateString('es-AR')}</p>
                          </div>
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {lease.daysToTermination} días
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Mensaje informativo */}
          <div className="bg-gradient-to-r from-purple-50 to-orange-50 border-l-4 border-purple-400 p-4 rounded">
            <p className="text-sm text-gray-700">
              <span className="text-lg mr-2">💡</span>
              <strong>Recomendaciones:</strong>
            </p>
            <ul className="text-sm text-gray-700 mt-2 ml-6 space-y-1">
              {updateAlerts.length > 0 && (
                <li>• <strong>Actualizaciones:</strong> Revisar en el módulo "Actualizar Alquileres" para calcular nuevos montos.</li>
              )}
              {alertContracts.length > 0 && (
                <li>• <strong>Vencimientos:</strong> Contactar inquilinos con anticipación para coordinar renovaciones.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 rounded-b-2xl flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Total: {totalAlerts} alerta(s) activas
          </span>
          <button
            onClick={() => setShowPopup(false)}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium shadow-lg"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingExpiryPopup;