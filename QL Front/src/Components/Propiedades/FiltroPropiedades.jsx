import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../../redux/Actions/actions";

const Filtro = () => {
  const dispatch = useDispatch();
  const { allProperties, loading, error } = useSelector((state) => state);

  const [filters, setFilters] = useState({
    city: "",
    type: "",
    typeProperty: "",
    priceMin: "",
    priceMax: "",
  });

  useEffect(() => {
    dispatch(getAllProperties());
  }, [dispatch]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredProperties = allProperties.filter((property) => {
    const { city, type, typeProperty, priceMin, priceMax } = filters;
    return (
      (!city || property.city.toLowerCase().includes(city.toLowerCase())) &&
      (!type || property.type === type) &&
      (!typeProperty || property.typeProperty === typeProperty) &&
      (!priceMin || property.price >= parseFloat(priceMin)) &&
      (!priceMax || property.price <= parseFloat(priceMax))
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Todas las Propiedades</h1>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          name="city"
          placeholder="Ciudad"
          value={filters.city}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">Tipo</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
        <select
          name="typeProperty"
          value={filters.typeProperty}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">Tipo de Propiedad</option>
          <option value="casa">Casa</option>
          <option value="departamento">Departamento</option>
          <option value="terreno">Terreno</option>
        </select>
        <input
          type="number"
          name="priceMin"
          placeholder="Precio Mínimo"
          value={filters.priceMin}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="priceMax"
          placeholder="Precio Máximo"
          value={filters.priceMax}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
      </div>

      {/* Resultados */}
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <div
              key={property.propertyId}
              className="p-4 border rounded shadow hover:shadow-lg"
            >
              <h2 className="font-bold text-lg">{property.address}</h2>
              <p>{property.city}, {property.neighborhood}</p>
              <p>Precio: ${property.price}</p>
              <p>Tipo: {property.type}</p>
              <p>Tipo de Propiedad: {property.typeProperty}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filtro;
