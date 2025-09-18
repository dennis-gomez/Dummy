import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities.js";

const ExtinguisherTable = ({ extinguishers, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (ext) => {
    setEditingId(ext.cod_extinguisher);
    setEditData({ ...ext });
  };

  const handleSaveEdit = () => {
    onEdit(editingId, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lista de Extintores</h2>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">#</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Num. Serial</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Marca</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Agente</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Tipo</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Capacidad</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Fecha Fabricación</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Fecha Instalación</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Ubicación</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Siguiente Inspección</th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">Observaciones</th>
              <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tr-xl">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {extinguishers.map((ext, index) => (
              <tr
                key={ext.cod_extinguisher}
                className="hover:bg-blue-50 transition-all duration-200 even:bg-gray-50"
              >
                {editingId === ext.cod_extinguisher ? (
                  <>
                    <td className="py-4 px-6 align-middle font-medium text-gray-900">{index + 1}</td>
                    <td className="py-4 px-6 align-middle">
                      <input
                        type="text"
                        value={editData.extinguisher_serial_number || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_serial_number: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <input
                        type="text"
                        value={editData.extinguisher_brand || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_brand: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <input
                        type="text"
                        value={editData.extinguisher_agent || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_agent: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <input
                        type="text"
                        value={editData.extinguisher_type || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_type: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <input
                        type="text"
                        value={editData.extinguisher_capacity || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_capacity: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <input
                        type="date"
                        value={editData.extinguisher_manufacturing_date || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_manufacturing_date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <input
                        type="date"
                        value={editData.extinguisher_installation_date || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_installation_date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <textarea
                        value={editData.extinguisher_location || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_location: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                      />
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <input
                        type="date"
                        value={editData.extinguisher_next_date_inspection || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_next_date_inspection: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <textarea
                        value={editData.extinguisher_observations || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_observations: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                      />
                    </td>
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
                    <td className="py-4 px-6 align-middle font-medium text-gray-900">{index + 1}</td>
                    <td className="py-4 px-6 align-middle text-gray-700">{ext.extinguisher_serial_number}</td>
                    <td className="py-4 px-6 align-middle text-gray-700">{ext.extinguisher_brand}</td>
                    <td className="py-4 px-6 align-middle text-gray-700">{ext.extinguisher_agent}</td>
                    <td className="py-4 px-6 align-middle text-gray-700">{ext.extinguisher_type}</td>
                    <td className="py-4 px-6 align-middle text-gray-700">{ext.extinguisher_capacity}</td>
                    <td className="py-4 px-6 align-middle text-gray-700">
                      {formatDateDDMMYYYY(ext.extinguisher_manufacturing_date)}
                    </td>
                    <td className="py-4 px-6 align-middle text-gray-700">
                      {formatDateDDMMYYYY(ext.extinguisher_installation_date)}
                    </td>
                    <td className="py-4 px-6 align-middle text-gray-700">{ext.extinguisher_location}</td>
                    <td className="py-4 px-6 align-middle text-gray-700">
                      {formatDateDDMMYYYY(ext.extinguisher_next_date_inspection)}
                    </td>
                    <td className="py-4 px-6 align-middle text-gray-700">{ext.extinguisher_observations || "-"}</td>
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