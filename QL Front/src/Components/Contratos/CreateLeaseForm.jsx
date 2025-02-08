import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createLease } from '../../redux/Actions/actions';  // Asegúrate de que la acción esté correctamente importada

const CreateLeaseForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    propertyId: '',
    locador: '',
    locatario: '',
    startDate: '',
    rentAmount: '',
    updateFrequency: '',
    commission: '',
    totalMonths: '',
    inventory: '',
  });

  const { propertyId, locador, locatario, startDate, rentAmount, updateFrequency, commission, totalMonths, inventory } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const leaseData = {
      propertyId,
      locador,
      locatario,
      startDate,
      rentAmount,
      updateFrequency,
      commission,
      totalMonths,
      inventory,
    };
    dispatch(createLease(leaseData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Property ID:</label>
        <input
          type="text"
          name="propertyId"
          value={propertyId}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Dueño:</label>
        <input
          type="text"
          name="locador"
          value={locador}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Inquilino:</label>
        <input
          type="text"
          name="locatario"
          value={locatario}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Inicio Contrato:</label>
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Precio:</label>
        <input
          type="number"
          name="rentAmount"
          value={rentAmount}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Plazo de Actualización:</label>
        <select
          name="updateFrequency"
          value={updateFrequency}
          onChange={handleInputChange}
          required
        >
          <option value="semestral">Semestral</option>
          <option value="cuatrimestral">Cuatrimestral</option>
          <option value="anual">Anual</option>
        </select>
      </div>
      <div>
        <label>Commision:</label>
        <input
          type="number"
          name="commission"
          value={commission}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Meses de contrato total:</label>
        <input
          type="number"
          name="totalMonths"
          value={totalMonths}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <label>Inventario:</label>
        <textarea
          name="inventory"
          value={inventory}
          onChange={handleInputChange}
          required
        ></textarea>
      </div>
      <button type="submit">Crear Contrato</button>
    </form>
  );
};

export default CreateLeaseForm;

