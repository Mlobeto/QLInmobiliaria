import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllLeases } from "../../redux/Actions/actions";
import { 
  IoArrowBackOutline,
  IoHomeOutline,
  IoWarningOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCashOutline
} from 'react-icons/io5';

const getUpdateAlert = (lease) => {
  // Si el backend ya calculó nextUpdateDate, usarlo directamente
  if (lease.nextUpdateDate) {
    const dateStr = lease.nextUpdateDate.split('T')[0];
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  }

  // Fallback: calcular desde startDate
  const { startDate, updateFrequency } = lease;
  let updateIntervalMonths = 0;
  if (updateFrequency === "semestral") updateIntervalMonths = 6;
  else if (updateFrequency === "cuatrimestral") updateIntervalMonths = 4;
  else if (updateFrequency === "anual") updateIntervalMonths = 12;
  else if (updateFrequency === "trimestral") updateIntervalMonths = 3;
  
  // Parseo seguro para evitar conversión UTC
  const dateStr = startDate.split('T')[0];
  const [year, month, day] = dateStr.split('-').map(Number);
  const baseDate = new Date(year, month - 1, day, 12, 0, 0);
  
  let nextUpdate = new Date(baseDate);
  const hoy = new Date();
  while (nextUpdate <= hoy) {
    nextUpdate.setMonth(nextUpdate.getMonth() + updateIntervalMonths);
  }
  return nextUpdate;
};

const getEndAlert = (lease) => {
  const { startDate, totalMonths } = lease;
  // Parseo seguro para evitar conversión UTC
  const startDateStr = startDate.split('T')[0];
  const [year, month, day] = startDateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day, 12, 0, 0);
  // La fecha de culminación se obtiene sumando totalMonths a la fecha de inicio.
  return new Date(start.setMonth(start.getMonth() + totalMonths));
};

const getContractDetails = (lease) => {
  const nextUpdate = getUpdateAlert(lease);
  const terminationDate = getEndAlert(lease);
  
  // Parseo seguro de startDate
  const startDateStr = lease.startDate.split('T')[0];
  const [year, month, day] = startDateStr.split('-').map(Number);
  const startDate = new Date(year, month - 1, day, 12, 0, 0);
  
  return {
    leaseId: lease.id || lease.leaseId,
    startDate,
    nextUpdate,
    terminationDate,
    // Agrega el nombre del tenant, o en su defecto su Id
    tenant: lease.Tenant ? lease.Tenant.name : lease.tenantId,
  };
};

const EstadoAlertasContratos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Selectores optimizados
  const leases = useSelector((state) => state.leases);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error);

  useEffect(() => {
    dispatch(getAllLeases());
  }, [dispatch]);

  const contractDetails = (leases || []).map((lease) =>
    getContractDetails(lease)
  );

  // Ordenar por 'nextUpdate' y luego por 'terminationDate'
  const sortedContractDetails = [...contractDetails].sort((a, b) => {
    const diffNext = a.nextUpdate.getTime() - b.nextUpdate.getTime();
    return diffNext !== 0
      ? diffNext
      : a.terminationDate.getTime() - b.terminationDate.getTime();
  });

  const formatDate = (date) => date.toLocaleDateString();

  // Función para determinar el tipo de alerta (mejorada - prioriza actualizaciones)
  const getAlertType = (nextUpdate, terminationDate) => {
    const now = new Date();
    const daysToUpdate = Math.ceil((nextUpdate - now) / (1000 * 60 * 60 * 24));
    const daysToTermination = Math.ceil((terminationDate - now) / (1000 * 60 * 60 * 24));
    
    // Prioridad 1: Actualización de alquiler URGENTE (dentro de 7 días)
    if (daysToUpdate <= 7 && daysToUpdate > 0) {
      return { type: 'updateCritical', label: 'Actualización Urgente de Alquiler', color: 'purple', priority: 1 };
    }
    
    // Prioridad 2: Crítico - Vence en 30 días o menos
    if (daysToTermination <= 30) {
      return { type: 'critical', label: 'Vence en menos de 1 mes', color: 'red', priority: 2 };
    }
    
    // Prioridad 3: Actualización de alquiler próxima (8-30 días)
    if (daysToUpdate <= 30 && daysToUpdate > 7) {
      return { type: 'updateWarning', label: 'Actualización de Alquiler Próxima', color: 'violet', priority: 3 };
    }
    
    // Prioridad 4: Urgente - Vence en los próximos 2 meses (31-60 días)
    if (daysToTermination <= 60) {
      return { type: 'urgent', label: 'Vence en los próximos 2 meses', color: 'orange', priority: 4 };
    }
    
    // Prioridad 5: Vence en 3 meses
    if (daysToTermination <= 90) {
      return { type: 'info', label: 'Vence en menos de 3 meses', color: 'blue', priority: 5 };
    }
    
    // Sin alertas
    return { type: 'success', label: 'Al Día', color: 'green', priority: 6 };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-slate-400">Cargando alertas de contratos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center max-w-md">
          <IoAlertCircleOutline className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 text-lg font-medium">Error al cargar alertas</p>
          <p className="text-red-300 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)} 
              className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30"
            >
              <IoArrowBackOutline className="w-5 h-5" />
              <span className="hidden sm:inline">Volver</span>
            </button>
            
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-slate-300">
              <button onClick={() => navigate('/panel')} className="hover:text-white transition-colors">
                <IoHomeOutline className="w-4 h-4" />
              </button>
              <span>/</span>
              <button onClick={() => navigate('/panelContratos')} className="hover:text-white transition-colors">
                Contratos
              </button>
              <span>/</span>
              <span className="text-white font-medium">Alertas de Contratos</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <IoWarningOutline className="w-8 h-8 text-amber-400 mr-3" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Alertas de Contratos
              </h1>
            </div>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Monitorea vencimientos y actualizaciones pendientes de contratos
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {sortedContractDetails.length === 0 ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-12 text-center">
            <IoCheckmarkCircleOutline className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-green-400 text-xl font-medium mb-2">No hay alertas pendientes</p>
            <p className="text-slate-400">Todos los contratos están al día</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumen de alertas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
              {['updateCritical', 'updateWarning', 'critical', 'urgent', 'info', 'success'].map((type) => {
                const count = sortedContractDetails.filter(contract => {
                  const alertType = getAlertType(contract.nextUpdate, contract.terminationDate);
                  return alertType.type === type;
                }).length;
                
                const config = {
                  updateCritical: { label: 'Actualiz. Urgente', color: 'purple', bgClass: 'bg-purple-500/10', borderClass: 'border-purple-500/20', textClass: 'text-purple-400', icon: IoCashOutline },
                  updateWarning: { label: 'Actualiz. Próxima', color: 'violet', bgClass: 'bg-violet-500/10', borderClass: 'border-violet-500/20', textClass: 'text-violet-400', icon: IoCashOutline },
                  critical: { label: 'Vence < 1 mes', color: 'red', bgClass: 'bg-red-500/10', borderClass: 'border-red-500/20', textClass: 'text-red-400', icon: IoAlertCircleOutline },
                  urgent: { label: 'Vence en 2 meses', color: 'orange', bgClass: 'bg-orange-500/10', borderClass: 'border-orange-500/20', textClass: 'text-orange-400', icon: IoWarningOutline },
                  info: { label: 'Vence en 3 meses', color: 'blue', bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/20', textClass: 'text-blue-400', icon: IoCalendarOutline },
                  success: { label: 'Al Día', color: 'green', bgClass: 'bg-green-500/10', borderClass: 'border-green-500/20', textClass: 'text-green-400', icon: IoCheckmarkCircleOutline }
                }[type];
                
                const IconComponent = config.icon;
                
                return (
                  <div key={type} className={`${config.bgClass} border ${config.borderClass} rounded-xl p-4`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`${config.textClass} text-xs font-medium mb-1`}>{config.label}</p>
                        <p className={`${config.textClass} text-2xl font-bold`}>{count}</p>
                      </div>
                      <IconComponent className={`w-8 h-8 ${config.textClass} opacity-50`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sección destacada: Actualizaciones de Alquiler Pendientes */}
            {(() => {
              const updatesPending = sortedContractDetails.filter(contract => {
                const now = new Date();
                const daysToUpdate = Math.ceil((contract.nextUpdate - now) / (1000 * 60 * 60 * 24));
                return daysToUpdate > 0 && daysToUpdate <= 30;
              });

              if (updatesPending.length > 0) {
                return (
                  <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/30 rounded-xl p-6 mb-8">
                    <div className="flex items-center mb-4">
                      <IoCashOutline className="w-6 h-6 text-purple-400 mr-3" />
                      <h3 className="text-xl font-bold text-purple-300">
                        💰 Actualizaciones de Alquiler Pendientes
                      </h3>
                    </div>
                    <p className="text-slate-300 mb-4">
                      Se encontraron <span className="font-bold text-purple-400">{updatesPending.length}</span> contrato(s) con actualización de alquiler próxima. 
                      Es necesario calcular el nuevo monto según la frecuencia de actualización.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {updatesPending.map(contract => {
                        const now = new Date();
                        const daysToUpdate = Math.ceil((contract.nextUpdate - now) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={contract.leaseId} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-semibold text-sm">Contrato #{contract.leaseId}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${daysToUpdate <= 7 ? 'bg-purple-500/30 text-purple-300' : 'bg-violet-500/20 text-violet-400'}`}>
                                {daysToUpdate} días
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm mb-1">
                              <IoPersonOutline className="inline w-3 h-3 mr-1" />
                              {contract.tenant}
                            </p>
                            <p className="text-slate-400 text-xs">
                              Actualización: {formatDate(contract.nextUpdate)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Sección destacada: Contratos que vencen en los próximos 2 meses */}
            {(() => {
              const expiringIn2Months = sortedContractDetails.filter(contract => {
                const now = new Date();
                const daysToTermination = Math.ceil((contract.terminationDate - now) / (1000 * 60 * 60 * 24));
                return daysToTermination > 0 && daysToTermination <= 60;
              });

              if (expiringIn2Months.length > 0) {
                return (
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-6 mb-8">
                    <div className="flex items-center mb-4">
                      <IoWarningOutline className="w-6 h-6 text-orange-400 mr-3" />
                      <h3 className="text-xl font-bold text-orange-300">
                        ⚠️ Contratos que Vencen en los Próximos 2 Meses
                      </h3>
                    </div>
                    <p className="text-slate-300 mb-4">
                      Se encontraron <span className="font-bold text-orange-400">{expiringIn2Months.length}</span> contrato(s) próximos a finalizar. 
                      Es importante contactar a los inquilinos para renovación o preparar la búsqueda de nuevos inquilinos.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {expiringIn2Months.map(contract => {
                        const now = new Date();
                        const daysToTermination = Math.ceil((contract.terminationDate - now) / (1000 * 60 * 60 * 24));
                        return (
                          <div key={contract.leaseId} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-semibold text-sm">Contrato #{contract.leaseId}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${daysToTermination <= 30 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {daysToTermination} días
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm mb-1">
                              <IoPersonOutline className="inline w-3 h-3 mr-1" />
                              {contract.tenant}
                            </p>
                            <p className="text-slate-400 text-xs">
                              Vence: {formatDate(contract.terminationDate)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Lista de contratos con alertas */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Contratos con Alertas: {sortedContractDetails.length}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {sortedContractDetails.map((contract) => {
                  const alertType = getAlertType(contract.nextUpdate, contract.terminationDate);
                  const now = new Date();
                  const daysToUpdate = Math.ceil((contract.nextUpdate - now) / (1000 * 60 * 60 * 24));
                  const daysToTermination = Math.ceil((contract.terminationDate - now) / (1000 * 60 * 60 * 24));
                  
                  // Mapeo de clases CSS según tipo de alerta
                  const alertStyles = {
                    updateCritical: {
                      border: 'border-purple-500/30 hover:border-purple-500/50',
                      bg: 'bg-purple-500/20',
                      text: 'text-purple-400',
                      badge: 'bg-purple-500/20 text-purple-400'
                    },
                    updateWarning: {
                      border: 'border-violet-500/30 hover:border-violet-500/50',
                      bg: 'bg-violet-500/20',
                      text: 'text-violet-400',
                      badge: 'bg-violet-500/20 text-violet-400'
                    },
                    critical: {
                      border: 'border-red-500/30 hover:border-red-500/50',
                      bg: 'bg-red-500/20',
                      text: 'text-red-400',
                      badge: 'bg-red-500/20 text-red-400'
                    },
                    urgent: {
                      border: 'border-orange-500/30 hover:border-orange-500/50',
                      bg: 'bg-orange-500/20',
                      text: 'text-orange-400',
                      badge: 'bg-orange-500/20 text-orange-400'
                    },
                    warning: {
                      border: 'border-amber-500/30 hover:border-amber-500/50',
                      bg: 'bg-amber-500/20',
                      text: 'text-amber-400',
                      badge: 'bg-amber-500/20 text-amber-400'
                    },
                    info: {
                      border: 'border-blue-500/30 hover:border-blue-500/50',
                      bg: 'bg-blue-500/20',
                      text: 'text-blue-400',
                      badge: 'bg-blue-500/20 text-blue-400'
                    },
                    success: {
                      border: 'border-green-500/30 hover:border-green-500/50',
                      bg: 'bg-green-500/20',
                      text: 'text-green-400',
                      badge: 'bg-green-500/20 text-green-400'
                    }
                  };
                  
                  const styles = alertStyles[alertType.type];
                  
                  return (
                    <div
                      key={contract.leaseId}
                      className={`bg-white/5 backdrop-blur-xl rounded-xl border ${styles.border} p-6 transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`p-2 ${styles.bg} rounded-lg`}>
                              <IoDocumentTextOutline className={`w-5 h-5 ${styles.text}`} />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">
                                Contrato #{contract.leaseId}
                              </h4>
                              <div className={`inline-flex items-center px-2 py-1 ${styles.badge} rounded-full text-xs font-medium`}>
                                {alertType.label}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center space-x-2">
                              <IoPersonOutline className="w-4 h-4 text-blue-400" />
                              <div>
                                <p className="text-slate-400 text-xs">Inquilino</p>
                                <p className="text-white text-sm font-medium">{contract.tenant}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <IoCalendarOutline className="w-4 h-4 text-green-400" />
                              <div>
                                <p className="text-slate-400 text-xs">Fecha de Inicio</p>
                                <p className="text-white text-sm">{formatDate(contract.startDate)}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <IoTimeOutline className="w-4 h-4 text-amber-400" />
                              <div>
                                <p className="text-slate-400 text-xs">Próxima Actualización</p>
                                <p className={`text-sm font-medium ${daysToUpdate <= 7 ? 'text-amber-400' : 'text-white'}`}>
                                  {formatDate(contract.nextUpdate)}
                                  <span className="text-xs ml-1">({daysToUpdate} días)</span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <IoAlertCircleOutline className={`w-4 h-4 ${daysToTermination <= 30 ? 'text-red-400' : daysToTermination <= 60 ? 'text-orange-400' : 'text-blue-400'}`} />
                              <div>
                                <p className="text-slate-400 text-xs">Fecha de Culminación</p>
                                <p className={`text-sm font-medium ${
                                  daysToTermination <= 30 ? 'text-red-400' : 
                                  daysToTermination <= 60 ? 'text-orange-400' : 
                                  'text-white'
                                }`}>
                                  {formatDate(contract.terminationDate)}
                                  <span className="text-xs ml-1">({daysToTermination} días)</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadoAlertasContratos;