import { useState } from 'react';
import ReciboPdf from './ReciboPdf';

const ReciboPreview = () => {
  const [mockPayment] = useState({
    id: 1,
    amount: 1050000,
    paymentDate: new Date().toISOString(),
    period: "Noviembre 2025",
    type: "initial"
  });

  const [mockLease] = useState({
    id: 9,
    Property: {
      address: "Lavalle 437"
    },
    Tenant: {
      name: "RUBEN FERNANDO OLIVERA",
      cuil: "23-34094621-9",
      direccion: "Lavalle 332",
      ciudad: "Belen",
      provincia: "Catamarca"
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Preview de Recibo PDF</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Datos del Pago</h2>
              <div className="space-y-3 text-white">
                <div><span className="text-slate-400">ID:</span> {mockPayment.id}</div>
                <div><span className="text-slate-400">Monto:</span> ${Number(mockPayment.amount).toLocaleString('es-AR')}</div>
                <div><span className="text-slate-400">Tipo:</span> {mockPayment.type === 'initial' ? 'Pago Inicial' : 'Cuota'}</div>
                <div><span className="text-slate-400">Fecha:</span> {new Date(mockPayment.paymentDate).toLocaleDateString('es-AR')}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Datos del Cliente</h2>
              <div className="space-y-3 text-white">
                <div><span className="text-slate-400">Nombre:</span> {mockLease.Tenant.name}</div>
                <div><span className="text-slate-400">CUIL:</span> {mockLease.Tenant.cuil}</div>
                <div><span className="text-slate-400">Dirección:</span> {mockLease.Tenant.direccion}</div>
                <div><span className="text-slate-400">Localidad:</span> {mockLease.Tenant.ciudad}, {mockLease.Tenant.provincia}</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <ReciboPdf payment={mockPayment} lease={mockLease} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Vista del Componente</h2>
            <p className="text-slate-300 text-sm mb-4">
              Este es el componente ReciboPdf que se renderiza antes de convertirse a PDF.
              Edita ReciboPdf.jsx y los cambios se verán reflejados aquí automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReciboPreview;
