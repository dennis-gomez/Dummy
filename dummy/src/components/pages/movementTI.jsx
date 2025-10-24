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
import ModalAlert from "../molecules/modalAlert"; 

const MovementTI = () => {
  const [movements, setMovements] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState("it_inventory_name");

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
      ModalAlert("Error", "No se pudieron cargar los movimientos", "error", 3000);
    }
  };

  const handleCreate = async (formData) => {
    try {
      console.log("Crear movimiento recibido:", formData);
      setRefresh(!refresh);
      setShowForm(false);
      ModalAlert("Éxito", "Movimiento creado correctamente", "success", 2000);
    } catch (error) {
      console.error("Error al crear movimiento:", error);
      ModalAlert("Error", "No se pudo crear el movimiento", "error", 3000);
    }
  };

  const handleUpdate = async (cod_movement, updatedData) => {
    try {
      await updateMovement({ cod_movement, ...updatedData });
      setRefresh(!refresh);
      ModalAlert("Éxito", "Movimiento actualizado correctamente", "success", 2000);
    } catch (err) {
      console.error("Error al actualizar movimiento:", err);
      ModalAlert("Error", "No se pudo actualizar el movimiento", "error", 3000);
    }
  };

  const handleDelete = async (cod_movement) => {
    try {
      await deleteMovement(cod_movement);
      setRefresh(!refresh);
      ModalAlert("Éxito", "Movimiento eliminado correctamente", "success", 2000);
    } catch (err) {
      console.error("Error al eliminar movimiento:", err);
      ModalAlert("Error", "No se pudo eliminar el movimiento", "error", 3000);
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
          <button
            type="button" // importante si no es submit
            onClick={() => setShowForm(!showForm)}
            className={`
      px-5 py-2  sm:w-48 rounded-md font-semibold text-white transition-colors duration-300
      ${showForm
                ? "bg-blue-600 hover:bg-red-500"  // Cuando es "Cancelar"
                : "bg-blue-600 hover:bg-green-500" // Cuando es "Agregar Movimiento"
              }
    `}
          >
            {showForm ? "Cancelar" : "Agregar Movimiento"}
          </button>
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
