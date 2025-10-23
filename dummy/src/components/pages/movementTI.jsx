import React, { useEffect, useState } from "react";
import {
  getActiveMovements,
  updateMovement,
  deleteMovement,
} from "../../services/movementTIService";
import TableMovementTI from "../organisms/tableMovementTI";
import FormMovementTI from "../organisms/formMovementTI";
import Seeker from "../molecules/seeker";
import Button from "../atoms/button";

const MovementTI = () => {
  const [movements, setMovements] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState("it_inventory_name"); // campo ejemplo para Seeker

  // Campos disponibles para Seeker (solo visual)
  const fields = [
    { name: "it_inventory_name", placeholder: "Nombre del activo" },
    { name: "it_inventory_serial_number", placeholder: "Número de serie" },
    { name: "it_inventory_model", placeholder: "Modelo" },
  ];

  useEffect(() => {
    loadMovements();
  }, [refresh]);

  const loadMovements = async () => {
    try {
      const data = await getActiveMovements();
      setMovements(data);
    } catch (err) {
      console.error("Error al cargar movimientos activos:", err);
    }
  };

  const handleCreate = async (formData) => {
    console.log("Crear movimiento recibido:", formData);
    setRefresh(!refresh);
    setShowForm(false);
  };

  const handleUpdate = async (cod_movement, updatedData) => {
    try {
      await updateMovement({ cod_movement, ...updatedData });
      alert("Movimiento actualizado correctamente");
      setRefresh(!refresh);
    } catch (err) {
      console.error("Error al actualizar movimiento:", err);
      alert("Error al actualizar movimiento");
    }
  };

  const handleDelete = async (cod_movement) => {
    if (window.confirm("¿Eliminar este movimiento?")) {
      try {
        await deleteMovement(cod_movement);
        setRefresh(!refresh);
      } catch (err) {
        console.error("Error al eliminar movimiento:", err);
        alert("Error al eliminar movimiento");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gesti&oacute;n de movimientos TI</h1>
      {/* Formulario mostrar/ocultar */}
      {showForm && (
        <div className="p-6 rounded-2xl mb-6">
          <FormMovementTI onSubmit={handleCreate} />
        </div>
      )}
      {/* Buscador + Botón mostrar/ocultar formulario */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4 items-center">
        <div className="flex-1">
          <Seeker
            inputName="search"
            inputPlaceholder="Buscar movimiento..."
            btnName="Buscar"
            selectName="Filtrar por"
            fields={fields}
            valueText={searchText}
            valueFeature={searchFeature}
            onChangeText={setSearchText}
            onChangeFeature={setSearchFeature}
            onClick={() => { }}
          />
        </div>
        <div className="flex-shrink-0">
          <Button
            text={showForm ? "Cancelar" : "Agregar Movimiento"}
            onClick={() => setShowForm(!showForm)}
            className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          />
        </div>
      </div>
      {/* Tabla de movimientos */}
      <TableMovementTI
        movements={movements}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MovementTI;
