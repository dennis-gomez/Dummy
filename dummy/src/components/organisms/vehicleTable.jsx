import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalElimination from "../molecules/modalElimination";
import Seeker from "../molecules/seeker";
import { CircularProgress, Box } from "@mui/material";
import Button from "../atoms/button";

const VehicleTable = ({
  fields,
  vehicles = [],
  isLoading = false,
  onDelete,
  onEdit,
  onSearch,
  valueText,
  valueFeature,
  onChangeText,
  onChangeFeature,
  showForm,
  onToggleForm,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (vehicle) => {
    setEditingId(vehicle.cod_vehicle);
    setEditData({ ...vehicle });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const isSaved = await onEdit(editData);
    if (isSaved) {
      setEditingId(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">

      {/* Contenedor principal: buscador + botón */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">

        {/* Columna 1: buscador */}
        <Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
          <Seeker
            inputName="search"
            inputPlaceholder="Buscar vehículo..."
            btnName="Buscar"
            selectName="Filtrar por"
            fields={fields}
            valueText={valueText}
            valueFeature={valueFeature}
            onChangeText={onChangeText}
            onChangeFeature={onChangeFeature}
            onClick={onSearch}
          />
        </Box>

        {/* Columna 2: botón Agregar/Cancelar */}
        <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
          <div className="p-4 h-fit">
            <Button
              text={showForm ? "Cancelar" : "Agregar Vehículo"}
              onClick={onToggleForm}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Contenido de la tabla */}
      {/* Contenido tabla */}
{isLoading ? (
  // 🌀 Solo loader cuando está cargando
  <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
    <CircularProgress size={24} />
    <span>Cargando vehículos...</span>
  </div>
) : vehicles.length === 0 ? (
  // 📭 Solo mensaje vacío cuando ya cargó pero no hay resultados
    <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
    No hay vehículos registrados
  </div>
) : (
  // 📋 Render de tabla normal
  <div className="overflow-x-auto rounded-xl shadow-lg">
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl w-12">
            #
          </th>
          {fields.map((f) => (
            <th
              key={f.name}
              className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider"
            >
              {f.placeholder}
            </th>
          ))}
          <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl w-32">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((vehicle, index) => {
          const isEditing = editingId === vehicle.cod_vehicle;
          return (
            <tr
              key={vehicle.cod_vehicle}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="py-4 px-6 text-center">{index + 1}</td>
              {fields.map((f) => (
                <td key={f.name} className="py-4 px-6 text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData[f.name] || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, [f.name]: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    vehicle[f.name]
                  )}
                </td>
              ))}
              <td className="py-4 px-6 text-center flex gap-2 justify-center">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-800"
                    >
                      <SaveIcon />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-600 hover:text-red-800"
                    >
                      <CancelIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(vehicle)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <EditIcon />
                    </button>
                    <ModalElimination
                      onConfirm={() => onDelete(vehicle.cod_vehicle)}
                    />
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default VehicleTable;
