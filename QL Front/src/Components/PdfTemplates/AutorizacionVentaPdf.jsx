/* eslint-disable react/prop-types */
import { jsPDF } from "jspdf";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoDocumentTextOutline, IoCreateOutline } from "react-icons/io5";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AutorizacionVentaPdf = ({ property, onEdit }) => {
  const [authData, setAuthData] = useState(null);

  // Cargar datos de autorización al montar el componente
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/property/${property.propertyId}/sale-authorization`
        );
        if (response.data.success) {
          setAuthData(response.data);
        }
      } catch (error) {
        console.error('Error al cargar autorización:', error);
      }
    };

    if (property && property.propertyId) {
      loadAuthData();
    }
  }, [property]);

  const generatePdf = () => {
    const doc = new jsPDF();
    const maxWidth = 170;
    let currentY = 15;

    // Usar datos guardados o datos por defecto
    const auth = authData?.authorization || {};
    const client = authData?.client || {};
    const propertyData = authData?.property || property;

    const ownerName = auth.ownerName || client.name || 'N/A';
    const ownerCuil = auth.ownerCuil || client.cuil || 'N/A';
    const ownerAddress = auth.ownerAddress || client.address || 'N/A';
    const price = auth.salePrice || propertyData.price || 0;
    const currency = auth.currency || propertyData.currency || 'ARS';
    const validityDays = auth.validityDays || 360;
    
    // Formatear precio con símbolo de moneda
    const currencySymbol = currency === 'USD' ? 'U$S' : '$';
    const formattedPrice = `${currencySymbol} ${Number(price).toLocaleString('es-AR')}`;
    const currencyName = currency === 'USD' ? 'Dólares Estadounidenses' : 'Pesos Argentinos';
    
    // Calcular fecha de creación
    const createdDate = auth.createdDate ? new Date(auth.createdDate) : new Date();
    const dateText = createdDate.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Título
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('AUTORIZACION DE VENTA', 15, currentY);
    currentY += 5;
    // Línea debajo del título
    doc.line(15, currentY, 195, currentY);
    currentY += 10;

    // Texto introductorio
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    const introText = `En la ciudad de Belén, provincia de Catamarca, entre el ${ownerName}, CUIL ${ownerCuil}, con domicilio en ${ownerAddress}, denominado EL PROPIETARIO por una parte y Q+L Servicios inmobiliarios, Tel celular 3835 521584-410338 con domicilio en Av. Cubas Nº50 de la ciudad de Belén, en adelante denominado LA INMOBILIARIA han llegado a un acuerdo para la autorización de venta del inmueble bajo las siguientes condiciones.`;
    const introLines = doc.splitTextToSize(introText, maxWidth);
    doc.text(introLines, 20, currentY);
    currentY += introLines.length * 8 + 10;

    // PRIMERO: Descripción de la propiedad
    const superficieText = propertyData.superficieTotal || propertyData.superficieCubierta || 'N/A';
    const firstText = `PRIMERO: EL PROPIETARIO autoriza a la INMOBILIARIA para que por su cuenta y orden proceda a ofrecer a la venta ${propertyData.typeProperty || 'propiedad'} sito en ${propertyData.address}. Superficie ${superficieText}. Datos proporcionados por el propietario.`;
    const firstTextLines = doc.splitTextToSize(firstText, maxWidth);
    doc.text(firstTextLines, 20, currentY);
    currentY += firstTextLines.length * 8 + 10;

    // SEGUNDA: Precio
    const precioReferencia = propertyData.precioReferencia || price;
    const formattedPrecioRef = `${currencySymbol} ${Number(precioReferencia).toLocaleString('es-AR')}`;
    const secondText = `SEGUNDA: El precio pactado para el vendedor es ${formattedPrice} ${currencyName} (Precio de referencia: ${formattedPrecioRef})`;
    const secondLines = doc.splitTextToSize(secondText, maxWidth);
    doc.text(secondLines, 20, currentY);
    currentY += secondLines.length * 8 + 10;

    // TERCERO: Autorización de publicidad
    const thirdText = `TERCERO: El PROPIETARIO autoriza a la INMOBILIARIA a la publicación en las redes sociales, a realizar visitas pre pactadas asistidas con personal de la firma, como así también la colocación de cartel publicitario.`;
    const thirdLines = doc.splitTextToSize(thirdText, maxWidth);
    doc.text(thirdLines, 20, currentY);
    currentY += thirdLines.length * 8 + 10;

    // CUARTO: Validez y comisión
    const fourthText = `CUARTO: Esta autorización es válida por el término de ${validityDays} días a contar desde la fecha. A su vencimiento, este plazo quedara automáticamente prorrogado por otro igual, salvo previa cancelación por medio fehaciente. La Inmobiliaria solo podrá recibir la comisión si es que vende la propiedad. Si la venta la realiza el propietario gracias a datos proporcionados por agencia inmobiliaria, tendrá derecho a reclamar la comisión del 4%.`;
    const fourthLines = doc.splitTextToSize(fourthText, maxWidth);
    doc.text(fourthLines, 20, currentY);
    currentY += fourthLines.length * 8 + 10;

    // Texto personalizado (si existe)
    if (auth.customText) {
      const customLines = doc.splitTextToSize(auth.customText, maxWidth);
      doc.text(customLines, 20, currentY);
      currentY += customLines.length * 8 + 10;
    }

    // Lugar y fecha
    const fullDateText = `Lugar y fecha. Celebrado en la ciudad de Belén al día ${dateText}.`;
    const dateLines = doc.splitTextToSize(fullDateText, maxWidth);
    doc.text(dateLines, 20, currentY);
    currentY += dateLines.length * 8 + 25;

    // Firmas
    doc.text(`…………………………………..`, 30, currentY);
    doc.text(`…………………………………`, 130, currentY);
    currentY += 8;
    doc.text(`"Propietario"`, 35, currentY);
    doc.text(`Arq. Mariana Lobeto`, 125, currentY);
    currentY += 6;
    doc.text(`"Q+L Servicios"`, 130, currentY);

    // Nombre del archivo
    const fileName = `autorizacion_venta_${propertyData.address}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="flex gap-2">
      {onEdit && (
        <button 
          onClick={onEdit} 
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg"
        >
          <IoCreateOutline className="w-5 h-5" />
          Editar
        </button>
      )}
      <button 
        onClick={generatePdf} 
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg"
      >
        <IoDocumentTextOutline className="w-5 h-5" />
        Generar PDF
      </button>
    </div>
  );
};

export default AutorizacionVentaPdf;



