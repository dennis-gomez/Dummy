import { useState } from "react";
import { IconButton, Tooltip, TextField, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../atoms/button"; // mismo que en "Agregar Caja Chica"

function PettyCashTable({ cashBoxes, onDelete, onEdit, onViewRecords, isLoading }) {
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (box) => {
    setEditRowId(box.cod_petty_cash);
    setEditData({ ...box });
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onEdit(editRowId, editData);
    setEditRowId(null);
    setEditData({});
  };

  // 🟦 Manejo de estados: cargando, vacío o tabla
  if (isLoading) {
    return (
      <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
        <CircularProgress size={24} />
        <span>Cargando cajas chicas...</span>
      </div>
    );
  }

  if (cashBoxes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
        No hay cajas chicas registradas
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <th className="py-4 px-6 text-center font-semibold text-md w-12">#</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Fecha creación</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Monto original</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Monto actual</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Activo</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Acciones</th>
            <th className="py-4 px-6 text-center font-semibold text-md rounded-tr-xl">
              Registros
            </th>
          </tr>
        </thead>
        <tbody>
          {cashBoxes.map((box, index) => (
            <tr
              key={box.cod_petty_cash}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
            >
              <td className="py-4 px-6 text-center">{index + 1}</td>

              {/* Fecha creación */}
              <td className="py-4 px-6 text-center">
                {editRowId === box.cod_petty_cash ? (
                  <TextField
                    type="date"
                    size="small"
                    value={editData.petty_cash_creation_date || ""}
                    onChange={(e) => handleChange("petty_cash_creation_date", e.target.value)}
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  box.petty_cash_creation_date
                )}
              </td>

              {/* Monto original */}
              <td className="py-4 px-6 text-center">
                {editRowId === box.cod_petty_cash ? (
                  <TextField
                    type="number"
                    size="small"
                    value={editData.petty_cash_original_amount || ""}
                    onChange={(e) => handleChange("petty_cash_original_amount", e.target.value)}
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  box.petty_cash_original_amount
                )}
              </td>

              {/* Monto actual */}
              <td className="py-4 px-6 text-center">
                {editRowId === box.cod_petty_cash ? (
                  <TextField
                    type="number"
                    size="small"
                    value={editData.petty_cash_actual_amount || ""}
                    onChange={(e) => handleChange("petty_cash_actual_amount", e.target.value)}
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  box.petty_cash_actual_amount
                )}
              </td>

              {/* Activo */}
              <td className="py-4 px-6 text-center">
                {editRowId === box.cod_petty_cash ? (
                  <select
                    value={editData.petty_cash_is_active ? 1 : 0}
                    onChange={(e) =>
                      handleChange("petty_cash_is_active", e.target.value === "1")
                    }
                    className="border rounded-md p-1"
                  >
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                ) : box.petty_cash_is_active ? (
                  "Sí"
                ) : (
                  "No"
                )}
              </td>

              {/* Acciones */}
              <td className="py-4 px-6 text-center flex gap-2 justify-center">
                {editRowId === box.cod_petty_cash ? (
                  <>
                    <Tooltip title="Guardar">
                      <IconButton onClick={handleSave} sx={{ color: "primary.main" }}>
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar">
                      <IconButton onClick={handleCancel} sx={{ color: "error.main" }}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleEditClick(box)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => onDelete(box.cod_petty_cash)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </td>

              {/* Botón Ver Registros */}
              <td className="py-4 px-6 text-center">
                <Button
                  text="Ver Registros"
                  onClick={() => onViewRecords(box.cod_petty_cash)}
                  className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PettyCashTable;
