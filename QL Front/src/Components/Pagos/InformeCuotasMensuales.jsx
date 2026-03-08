import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPayments, getAllLeases } from '../../redux/Actions/actions';
import { 
  IoCalendarOutline, 
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCopyOutline,
  IoLogoWhatsapp,
  IoArrowBackOutline,
  IoFilterOutline,
  IoCashOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import { Link } from 'react-router-dom';

const InformeCuotasMensuales = () => {
  const dispatch = useDispatch();
  
  const allPayments = useSelector(state => state.allPayments);
  const allLeases = useSelector(state => state.leases);
  const loading = useSelector(state => state.loading);
  const adminInfo = useSelector(state => state.adminInfo);
  
  const payments = useMemo(() => allPayments || [], [allPayments]);
  const leases = useMemo(() => allLeases || [], [allLeases]);

  // Estados para filtros
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'paid', 'pending'

  useEffect(() => {
    dispatch(getAllPayments());
    dispatch(getAllLeases());
    
    // Establecer mes y año actual por defecto
    const now = new Date();
    setSelectedMonth(String(now.getMonth() + 1).padStart(2, '0'));
    setSelectedYear(String(now.getFullYear()));
  }, [dispatch]);

  // Función para generar el mensaje de WhatsApp para una cuota pendiente
  const generarMensajeRecordatorio = (cuota) => {
    const fechaVencimiento = new Date(cuota.fechaVencimiento);
    const nombreCliente = cuota.nombreCliente || 'Estimado cliente';
    const direccionPropiedad = cuota.direccionPropiedad || 'la propiedad';
    const monto = Number(cuota.monto).toLocaleString('es-AR', { 
      style: 'currency', 
      currency: 'ARS' 
    });
    const periodo = cuota.periodo || 'este mes';
    const numeroCuota = cuota.numeroCuota || '';

    return `Hola ${nombreCliente},

Le recordamos que tiene pendiente el pago de la cuota de alquiler correspondiente a ${periodo}${numeroCuota ? ` ${numeroCuota}` : ''}.

📍 Propiedad: ${direccionPropiedad}
💰 Monto: ${monto}
📅 Fecha de vencimiento: ${fechaVencimiento.toLocaleDateString('es-AR')}

Por favor, gestione el pago a la brevedad para evitar recargos.

Quedamos a su disposición ante cualquier consulta.

Saludos cordiales,
QL Inmobiliaria`;
  };

  // Función para copiar mensaje al portapapeles
  const copiarMensaje = async (mensaje, index) => {
    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 3000);
    } catch (error) {
      console.error('Error al copiar:', error);
      alert('Error al copiar el mensaje');
    }
  };

  // Generar opciones de meses y años
  const meses = useMemo(() => [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ], []);

  const años = useMemo(() => {
    const añoActual = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => añoActual - 2 + i);
  }, []);

  // Filtrar cuotas del mes seleccionado - TODOS los contratos activos
  const cuotasDelMes = useMemo(() => {
    if (!selectedMonth || !selectedYear) return [];

    const mesSeleccionado = parseInt(selectedMonth);
    const añoSeleccionado = parseInt(selectedYear);

    // Obtener todos los contratos activos
    const contratosActivos = leases.filter(lease => lease.status === 'active');

    // Para cada contrato activo, generar su cuota del mes
    const cuotasGeneradas = contratosActivos.map(contrato => {
      const fechaInicio = new Date(contrato.startDate);
      const mesesDesdeInicio = (añoSeleccionado - fechaInicio.getFullYear()) * 12 + 
                               (mesSeleccionado - (fechaInicio.getMonth() + 1));
      
      //Verificar si el contrato ya debería estar activo en el mes seleccionado
      if (mesesDesdeInicio < 0) return null; // Contrato aún no comenzó
      
      // Verificar si el contrato ya terminó
      if (mesesDesdeInicio >= contrato.totalMonths) return null; // Contrato ya terminó

      const numeroCuota = mesesDesdeInicio + 1;
      
      // Calcular fecha de vencimiento (primer día del mes seleccionado + 10 días)
      const fechaVencimiento = new Date(añoSeleccionado, mesSeleccionado - 1, 10);
      
      // Buscar si existe un pago registrado para este contrato en este mes
      const pagoRegistrado = payments.find(pago => 
        pago.leaseId === contrato.id && 
        pago.type === 'installment' &&
        pago.paymentDate && 
        new Date(pago.paymentDate).getMonth() === mesSeleccionado - 1 &&
        new Date(pago.paymentDate).getFullYear() === añoSeleccionado
      );

      const mesLabel = meses.find(m => m.value === selectedMonth)?.label || '';

      return {
        contratoId: contrato.id,
        pagoId: pagoRegistrado?.id,
        nombreCliente: contrato.Tenant?.name || 'Sin nombre',
        direccionPropiedad: contrato.Property?.address || 'Sin dirección',
        monto: pagoRegistrado?.amount || contrato.rentAmount,
        fechaVencimiento: fechaVencimiento,
        periodo: `${mesLabel} ${añoSeleccionado}`,
        numeroCuota: `(Cuota ${numeroCuota}/${contrato.totalMonths})`,
        esPagada: !!pagoRegistrado,
        fechaPago: pagoRegistrado?.paymentDate,
        // Datos adicionales para referencia
        cliente: contrato.Tenant,
        propiedad: contrato.Property,
        contrato: contrato
      };
    }).filter(cuota => cuota !== null); // Eliminar contratos que no aplican

    return cuotasGeneradas;
  }, [leases, payments, selectedMonth, selectedYear, meses]);

  // Separar en pagadas y pendientes
  const cuotasAnalisis = useMemo(() => {
    const pagadas = [];
    const pendientes = [];
    let totalPagado = 0;
    let totalPendiente = 0;

    cuotasDelMes.forEach(cuota => {
      const monto = Number(cuota.monto);
      
      if (cuota.esPagada) {
        pagadas.push(cuota);
        totalPagado += monto;
      } else {
        pendientes.push(cuota);
        totalPendiente += monto;
      }
    });

    return {
      pagadas,
      pendientes,
      totalPagado,
      totalPendiente,
      totalCuotas: cuotasDelMes.length
    };
  }, [cuotasDelMes]);

  // Aplicar filtro de estado
  const cuotasFiltradas = useMemo(() => {
    if (filterStatus === 'paid') return cuotasAnalisis.pagadas;
    if (filterStatus === 'pending') return cuotasAnalisis.pendientes;
    return [...cuotasAnalisis.pagadas, ...cuotasAnalisis.pendientes];
  }, [cuotasAnalisis, filterStatus]);

  // Verificar permisos
  if (!adminInfo || adminInfo.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-8 max-w-md text-center">
          <IoAlertCircleOutline className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h2>
          <p className="text-amber-300 mb-6">No tienes permisos para ver este informe.</p>
          <Link 
            to="/panel"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <IoArrowBackOutline />
            <span>Volver al Panel</span>
          </Link>
        </div>
      </div>
    );
  }

  if (loading && (payments.length === 0 || leases.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Cargando contratos y cuotas...</p>
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
            <Link 
              to="/PanelInformes" 
              className="text-white hover:text-blue-300 transition-colors duration-300 flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30"
            >
              <IoArrowBackOutline className="w-5 h-5" />
              <span className="hidden sm:inline">Volver</span>
            </Link>
            
            <div>
              <h1 className="text-xl font-bold text-white">Informe de Cuotas Mensuales</h1>
              <p className="text-slate-300 text-sm">Control de todos los contratos activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <IoFilterOutline className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Selector de Mes */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <IoCalendarOutline className="inline w-4 h-4 mr-1" />
                Mes
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                {meses.map(mes => (
                  <option key={mes.value} value={mes.value} className="bg-slate-800">
                    {mes.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Año */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Año
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                {años.map(año => (
                  <option key={año} value={año} className="bg-slate-800">
                    {año}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Estado */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all" className="bg-slate-800">Todas</option>
                <option value="paid" className="bg-slate-800">Pagadas</option>
                <option value="pending" className="bg-slate-800">Pendientes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm font-medium">Total Cuotas</span>
              <IoCashOutline className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{cuotasAnalisis.totalCuotas}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-300 text-sm font-medium">Pagadas</span>
              <IoCheckmarkCircleOutline className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{cuotasAnalisis.pagadas.length}</p>
            <p className="text-green-300 text-sm mt-2">
              {cuotasAnalisis.totalPagado.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-300 text-sm font-medium">Pendientes</span>
              <IoCloseCircleOutline className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">{cuotasAnalisis.pendientes.length}</p>
            <p className="text-red-300 text-sm mt-2">
              {cuotasAnalisis.totalPendiente.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-300 text-sm font-medium">Total General</span>
              <IoCashOutline className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {(cuotasAnalisis.totalPagado + cuotasAnalisis.totalPendiente).toLocaleString('es-AR', { 
                style: 'currency', 
                currency: 'ARS' 
              })}
            </p>
          </div>
        </div>

        {/* Lista de Cuotas */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Detalle de Cuotas ({cuotasFiltradas.length})
          </h2>

          {cuotasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <IoCalendarOutline className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No hay cuotas para el período seleccionado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cuotasFiltradas.map((cuota, index) => {
                const mensaje = !cuota.esPagada ? generarMensajeRecordatorio(cuota) : null;

                return (
                  <div 
                    key={`${cuota.contratoId}-${index}`}
                    className={`p-5 rounded-xl border transition-all duration-300 ${
                      cuota.esPagada 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Info Principal */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            cuota.esPagada ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {cuota.esPagada ? (
                              <IoCheckmarkCircleOutline className="w-6 h-6 text-green-400" />
                            ) : (
                              <IoCloseCircleOutline className="w-6 h-6 text-red-400" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">
                              {cuota.nombreCliente || 'Cliente sin nombre'}
                            </h3>
                            <p className="text-slate-300 text-sm mb-2">
                              📍 {cuota.direccionPropiedad || 'Dirección no disponible'}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm">
                              <span className="text-slate-400">
                                💰 <span className="text-white font-semibold">
                                  {Number(cuota.monto).toLocaleString('es-AR', { 
                                    style: 'currency', 
                                    currency: 'ARS' 
                                  })}
                                </span>
                              </span>
                              <span className="text-slate-400">
                                📅 <span className="text-white">
                                  {cuota.esPagada && cuota.fechaPago 
                                    ? new Date(cuota.fechaPago).toLocaleDateString('es-AR')
                                    : new Date(cuota.fechaVencimiento).toLocaleDateString('es-AR')
                                  }
                                </span>
                              </span>
                              <span className="text-slate-400">
                                📄 <span className="text-white">
                                  {cuota.periodo || 'Sin período'}
                                </span>
                              </span>
                              {cuota.numeroCuota && (
                                <span className="text-slate-400">
                                  🔢 <span className="text-white">
                                    {cuota.numeroCuota}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botón de WhatsApp para pendientes */}
                      {!cuota.esPagada && mensaje && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copiarMensaje(mensaje, index)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                              copiedIndex === index
                                ? 'bg-green-500 text-white'
                                : 'bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700'
                            }`}
                          >
                            {copiedIndex === index ? (
                              <>
                                <IoCheckmarkCircleOutline className="w-5 h-5" />
                                <span className="hidden sm:inline">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <IoLogoWhatsapp className="w-5 h-5" />
                                <IoCopyOutline className="w-5 h-5" />
                                <span className="hidden sm:inline">Copiar recordatorio</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Badge de estado */}
                      {cuota.esPagada && (
                        <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm font-medium border border-green-500/30">
                          ✓ Pagada
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InformeCuotasMensuales;
