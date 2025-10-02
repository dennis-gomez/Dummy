import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";
import InputValidated from "../atoms/inputValidated";

const DetailsTable = ({ fields, items, onDelete, onEdit, renderDelete, centered }) => {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({}); // Estado de errores

  const handleEditClick = (item, idx) => {
    setEditingIdx(idx);
    setEditData({ ...item });
    setEditErrors({}); // Limpiar errores al iniciar edición
  };

  const whiteInputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      overflow: "auto",
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "blue",
      },
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "blue",
    },
    "& .MuiInputLabel-root.Mui-error": {
      color: "inherit",
    },
  };

  const handleSaveEdit = () => {
    onEdit(editingIdx, editData);
    setEditingIdx(null);
    setEditData({});
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingIdx(null);
    setEditData({});
    setEditErrors({});
  };

  if (!items || items.length === 0) {
    return (
      <div className="p-6 mt-6 bg-white rounded-2xl">
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay suplementos registrados
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">
      <div className={`overflow-x-auto rounded-xl shadow-lg ${centered ? "flex justify-center" : ""}`}>
        <table className={`min-w-full ${centered ? "mx-auto" : ""}`}>
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider rounded-tl-xl text-center">#</th>
              {fields.map((f) => (
                <th
                  key={f.key}
                  className="py-4 px-6 font-semibold text-md capitalize tracking-wider text-center"
                >
                  {f.label}
                </th>
              ))}
              <th className="py-4 px-6 font-semibold text-md capitalize tracking-wider rounded-tr-xl text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-blue-50 transition-all duration-200 even:bg-gray-50 text-center"
              >
                <td className="py-4 px-6 align-middle font-medium text-gray-900">{index + 1}</td>

                {editingIdx === index ? (
                  <>
                    {fields.map((f) => (
                      <td key={f.key} className="py-4 px-6 align-middle text-center">
                        <InputValidated
                          name={f.key}
                          type={f.type || "text"}
                          placeholder={f.placeholder}
                          value={editData[f.key]}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEditData({ ...editData, [f.key]: value });

                            // Validación: campo obligatorio y no solo espacios
                            setEditErrors((prev) => ({
                              ...prev,
                              [f.key]: !value || !value.trim() ? "Campo obligatorio" : "",
                            }));
                          }}
                          required={f.required ?? true}
                          sx={{
                            ...whiteInputStyle,
                            "& .MuiOutlinedInput-root": {
                              ...whiteInputStyle["& .MuiOutlinedInput-root"],
                              minHeight: f.type === "textarea" ? "4rem" : "auto",
                              resize: f.type === "textarea" ? "vertical" : "none",
                            },
                          }}
                        />
                      </td>
                    ))}

                    <td className="py-4 px-6 align-middle text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          disabled={Object.values(editErrors).some((err) => err)} // Deshabilitar si hay errores
                          className={`bg-blue-600 text-white rounded-lg px-3 py-2 flex items-center text-sm ${
                            Object.values(editErrors).some((err) => err)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-blue-700"
                          }`}
                        >
                          <SaveIcon className="mr-1" fontSize="small" />
                          Guardar
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm"
                        >
                          <CancelIcon className="mr-1" fontSize="small" />
                          Cancelar
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    {fields.map((f) => (
                      <td
                        key={f.key}
                        className="py-4 px-6 align-middle text-gray-700 text-center"
                      >
                        {f.type === "date"
                          ? item[f.key]
                            ? formatDateDDMMYYYY(item[f.key])
                            : "-"
                          : item[f.key] || "-"}
                      </td>
                    ))}
                    <td className="py-4 px-6 align-middle text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          type="button"
                          onClick={() => handleEditClick(item, index)}
                          className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                        >
                          <EditIcon />
                        </button>
                        {renderDelete ? (
                          renderDelete(item, index)
                        ) : (
                          <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                          >
                            <DeleteIcon />
                          </button>
                        )}
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
  );
};

export default DetailsTable;