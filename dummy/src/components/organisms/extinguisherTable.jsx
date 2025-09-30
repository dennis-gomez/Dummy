import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalElimination from "../molecules/modalElimination"; // 👈 importa el modal
import Seeker from "../molecules/seeker";
import { CircularProgress } from "@mui/material";
import Button from "../atoms/button";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";

const ExtinguisherTable = ({
  fields,
  extinguishers = [],
  isLoading = false,
  onDelete,
  onEdit,
  onSearch,
  valueText,
  valueFeature,
  onChangeText,
  onChangeFeature,
  showForm,
  setShowForm,
  setError,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (ext) => {
    setEditingId(ext.cod_extinguisher);
    setEditData({ ...ext });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    const isSaved = await onEdit(editingId, editData);
    if (isSaved) {
      setEditingId(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const getButtonName = () => (showForm ? "Cancelar" : "Agregar Extintor");

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">

{/* Contenedor principal: dos columnas */}
<div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
  {/* Columna 1: Buscador */}
  <div className="flex flex-wrap gap-3 bg-white  rounded-xl p-4 flex-1">
    <Seeker
      inputName={"search"}
      inputPlaceholder={"Buscar..."}
      btnName={"Buscar"}
      selectName={"Características"}
      fields={fields}
      onClick={onSearch}
      valueText={valueText}
      valueFeature={valueFeature}
      onChangeText={onChangeText}
      onChangeFeature={onChangeFeature}
    />
  </div>

  {/* Columna 2: Botón Agregar/Cancelar */}
  <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
    <div className="p-4 h-fit">
      <Button
        text={getButtonName()}
        onClick={() => {
          setShowForm(!showForm);
          if (setError) setError(null);
        }}
        className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      />
    </div>
  </div>
</div>

      {/* Mensaje cuando no hay registros */}
      {extinguishers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay extintores registrados
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl">
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
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {extinguishers.map((ext, index) => {
                const isEditing = editingId === ext.cod_extinguisher;
                return (
                  <tr
                    key={ext.cod_extinguisher}
                    className="hover:bg-blue-50 transition-all duration-200 even:bg-gray-50"
                  >
                    <td className="py-4 px-6 text-center align-middle font-medium text-gray-900">
                      {index + 1}
                    </td>

                    {fields.map((f) => (
                      <td
                        key={f.name}
                        className="py-4 px-6 text-center align-middle text-gray-700"
                      >
                        {isEditing ? (
                          f.type === "textarea" ? (
                            <textarea
                              value={editData[f.name] || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  [f.name]: e.target.value,
                                })
                              }
                              rows={f.rows || 2}
                              className="min-w-[200px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center resize-vertical"
                            />
                          ) : (
                            <input
                              type={f.type || "text"}
                              value={editData[f.name] || ""}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  [f.name]: e.target.value,
                                })
                              }
                              className="min-w-[200px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            />
                          )
                        ) : f.type === "date" ? (
                          formatDateDDMMYYYY(ext[f.name])
                        ) : (
                          ext[f.name] || "-"
                        )}
                      </td>
                    ))}

                    <td className="py-4 px-6 text-center align-middle">
                      <div className="flex justify-center space-x-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition flex items-center text-sm"
                            >
                              <SaveIcon className="mr-1" fontSize="small" />
                              Guardar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm"
                            >
                              <CancelIcon className="mr-1" fontSize="small" />
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(ext)}
                              aria-label="Editar extintor"
                              className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                            >
                              <EditIcon />
                            </button>

                            {/* 👇 Aquí usamos el mismo ModalElimination que en VehicleTable */}
                            <ModalElimination
                              message={"Eliminar extintor"}
                              onClick={() => onDelete(ext.cod_extinguisher)}
                            />
                          </>
                        )}
                      </div>
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

export default ExtinguisherTable;
