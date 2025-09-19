import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";

const ExtinguisherTable = ({ fields, extinguishers, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (ext) => {
    setEditingId(ext.cod_extinguisher);
    setEditData({ ...ext });
  };

  const handleSaveEdit = async () => {
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
    <div className="p-6 mt-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Lista de Extintores
      </h2>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">
                #
              </th>
              {fields.map((f) => (
                <th
                  key={f.name}
                  className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider"
                >
                  {f.placeholder}
                </th>
              ))}
              <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tr-xl">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {extinguishers.map((ext, index) => (
              <tr
                key={ext.cod_extinguisher}
                className="hover:bg-blue-50 transition-all duration-200 even:bg-gray-50"
              >
                <td className="py-4 px-6 align-middle font-medium text-gray-900">
                  {index + 1}
                </td>

                {editingId === ext.cod_extinguisher ? (
                  <>
                    {fields.map((f) => (
                      <td key={f.name} className="py-4 px-6 align-middle">
                        {f.type === "textarea" ? (
                          <textarea
                            value={editData[f.name] || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                [f.name]: e.target.value,
                              })
                            }
                            rows={f.rows || 2}
                            className="min-w-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            className="min-w-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      </td>
                    ))}
                    <td className="py-4 px-6 align-middle">
                      <div className="flex justify-center space-x-2">
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
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    {fields.map((f) => (
                      <td
                        key={f.name}
                        className="py-4 px-6 align-middle text-gray-700"
                      >
                        {f.type === "date"
                          ? formatDateDDMMYYYY(ext[f.name])
                          : ext[f.name] || "-"}
                      </td>
                    ))}
                    <td className="py-4 px-6 align-middle">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => onDelete(ext.cod_extinguisher)}
                          aria-label="Eliminar extintor"
                          className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                        >
                          <DeleteIcon />
                        </button>
                        <button
                          onClick={() => handleEditClick(ext)}
                          aria-label="Editar extintor"
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
  );
};

export default ExtinguisherTable;
