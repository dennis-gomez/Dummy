import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalElimination from "../molecules/modalElimination";
import Seeker from "../molecules/seeker";
import { Box, Typography, CircularProgress } from "@mui/material";

const VehicleTable = ({ fields, vehicles, isLoading, onDelete, onEdit, onSearch, valueText, valueFeature, onChangeText, onChangeFeature }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (vehicle) => {
    setEditingId(vehicle.cod_vehicle);
    setEditData({ ...vehicle });
  };

  const handleSaveEdit = async () => {
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

  // Filtrar campos para excluir vehicle_initial_km en modo edición
  const displayFields = fields.filter(f => 
    editingId === null || f.name !== "vehicle_initial_km"
  );

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lista de Vehículos</h2>

      {vehicles.length === 0 ? (
        // ✅ MENSAJE CORREGIDO - igual que "No hay suplementos registrados"
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay vehículos registrados
        </div>
      ) : (
        <div>
          {/* Buscador */}
          <div className="flex justify-start mb-4">
            
            {isLoading ? (
                <div 
                  className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto"
                >
                <p className="text-gray-700 font-medium mb-2">Cargando vehículos...</p>
                <CircularProgress />
              </div>
            ) : (
              <Seeker
                inputName={'search'}
                inputPlaceholder={'Buscar...'}
                btnName={'Buscar'}
                selectName={'Caracteristicas'}
                fields={fields}
                onClick={onSearch}
                valueText={valueText}
                valueFeature={valueFeature}
                onChangeText={onChangeText}
                onChangeFeature={onChangeFeature}
              />
            )}

          </div>
          {/* Tabla */}
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">#</th>
                  {displayFields.map((f) => (
                    <th
                      key={f.name}
                      className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider"
                    >
                      {f.placeholder}
                    </th>
                  ))}
                  <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tr-xl">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle, index) => (
                  <tr
                    key={vehicle.cod_vehicle}
                    className="hover:bg-blue-50 transition-all duration-200 even:bg-gray-50"
                  >
                    <td className="py-4 px-6 align-middle font-medium text-gray-900">
                      {index + 1}
                    </td>

                    {editingId === vehicle.cod_vehicle ? (
                      <>
                        {displayFields.map((f) => (
                          <td
                            key={f.name}
                            className="py-4 px-6 align-middle"
                          >
                            <input
                              type={f.type || "text"}
                              value={editData[f.name] || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, [f.name]: e.target.value })
                              }
                              className="min-w-[100px] py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                            />
                          </td>
                        ))}
                        <td className="py-4 px-6 align-middle">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition flex items-center"
                            >
                              <SaveIcon className="mr-1" fontSize="small" />
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition flex items-center"
                            >
                              <CancelIcon className="mr-1" fontSize="small" />
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {displayFields.map((f) => (
                          <td
                            key={f.name}
                            className="py-4 px-6 align-middle text-gray-700"
                          >
                            {vehicle[f.name] || "-"}
                          </td>
                        ))}
                        <td className="py-4 px-6 align-middle">
                          <div className="flex justify-center space-x-3">
                            <ModalElimination
                              message={'Eliminar vehículo'}
                              onClick={() => onDelete(vehicle.cod_vehicle)}
                            />
                            <button
                              onClick={() => handleEditClick(vehicle)}
                              aria-label="Editar vehículo"
                              className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                            >
                              <EditIcon />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTable;