import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalElimination from "../molecules/modalElimination";
import Seeker from "../molecules/seeker";
import { CircularProgress, Box } from "@mui/material";
import Button from "../atoms/button";

const OHPersonnelTable = ({
  fields,
  personnel = [],
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
  setError,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (p) => {
    setEditingId(p.cod_personnel);
    setEditData({ ...p });
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

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">

      {/* Contenedor principal: buscador + botón */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">

        {/* Columna 1: buscador */}
        <Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
          <Seeker
            inputName="search"
            inputPlaceholder="Buscar personal..."
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
              text={showForm ? "Cancelar" : "Agregar Personal"}
              onClick={() => {
                onToggleForm();
                if (setError) setError(null);
              }}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Contenido de la tabla */}
      {isLoading ? (
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
          <CircularProgress size={24} />
          <span>Cargando personal...</span>
        </div>
      ) : personnel.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay personal registrado
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl w-12">#</th>
                {fields.map(f => (
                  <th key={f.name} className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                    {f.placeholder}
                  </th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl w-32">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((p, index) => {
                const isEditing = editingId === p.cod_personnel;
                return (
                  <tr key={p.cod_personnel} className={`hover:bg-blue-50 transition-all duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="py-4 px-6 text-center font-medium text-gray-900">{index + 1}</td>

                    {fields.map(f => (
                      <td key={f.name} className="py-4 px-6 text-center text-gray-700">
                        {isEditing ? (
                          <input
                            type={f.type || "text"}
                            value={editData[f.name] || ""}
                            onChange={(e) => setEditData({ ...editData, [f.name]: e.target.value })}
                            className="min-w-[100px] w-full max-w-[280px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                          />
                        ) : (
                          p[f.name] || "-"
                        )}
                      </td>
                    ))}

                    <td className="py-4 px-6 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={handleSaveEdit} className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 flex items-center">
                            <SaveIcon className="mr-1" fontSize="small" /> Guardar
                          </button>
                          <button onClick={handleCancelEdit} className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 flex items-center">
                            <CancelIcon className="mr-1" fontSize="small" /> Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition">
                            <EditIcon />
                          </button>
                          <ModalElimination message="Eliminar personal" onClick={() => onDelete(p.cod_personnel)} />
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OHPersonnelTable;
