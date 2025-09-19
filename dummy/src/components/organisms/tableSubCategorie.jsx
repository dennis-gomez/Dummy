import React from "react";
import ModalElimination from "../molecules/modalElimination";
import Button from "../atoms/button";
import useTableSubcategorie from "/src/utils/useTableSubcategorie";
import { tableValidator } from "/src/utils/tableValidator";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

function TableSubcategorie({
  items,
  onClose,
  onDeleteItem,
  onAddItem,
  onEditItem,
  tableRef,
  isVisible = true,
}) {
  const {
    name,
    setName,
    editingId,
    editValue,
    setEditValue,
    handleAdd,
    handleEditClick,
    handleSaveEdit,
    handleCancel,
  } = useTableSubcategorie(items, onAddItem, onEditItem);

  if (!items) return null;

  const handleValidatedAdd = async () => {
    const error = tableValidator({
      value: name,
      list: items.map((i) => i.item_name.toLowerCase()),
    });

    if (error) {
      Swal.fire({ icon: "error", title: "Validación", text: error });
      return;
    }
    await handleAdd();
  };

  const handleValidatedSave = async (det) => {
    const error = tableValidator({
      value: editValue,
      list: items
        .filter((i) => i.cod_item !== det.cod_item)
        .map((i) => i.item_name.toLowerCase()),
    });

    if (error) {
      Swal.fire({ icon: "error", title: "Validación", text: error });
      return;
    }
    await handleSaveEdit(det.cod_category, det.cod_service, det.cod_item);
  };

  return (
    <div
      className={`transition-all duration-500 ease-in-out transform origin-top ${
        isVisible ? "opacity-100 scale-100 max-h-screen" : "opacity-0 scale-95 max-h-0 overflow-hidden"
      }`}
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">Items</h2>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Nombre de item:</label>
          <input
            type="text"
            placeholder="Escribe un item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidatedAdd()}
            className="border border-gray-300 rounded-lg py-2 px-4 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleValidatedAdd}
            disabled={!name.trim()}
            className={`rounded-lg py-2 px-5 text-white font-semibold transition ${
              name.trim()
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer focus:ring-4 focus:ring-blue-300"
                : "bg-blue-600 opacity-50 cursor-not-allowed"
            }`}
          >
            Agregar
          </button>
          <button
            onClick={onClose}
            className="rounded-lg py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer border-0 focus:ring-4 focus:ring-blue-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table
          ref={tableRef}
          aria-label="Tabla de Items"
          className="min-w-full border-collapse bg-white rounded-2xl shadow-lg"
        >
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <tr>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider rounded-tl-xl">
                Código Servicio
              </th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">
                Código Categoría
              </th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">
                Código Item
              </th>
              <th className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider">
                Items
              </th>
              <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tr-xl">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 px-6 text-center text-gray-500 italic bg-gray-50">
                  Sin detalles
                </td>
              </tr>
            ) : (
              items.map((det) => {
                const isEditing = editingId === det.cod_item;

                return (
                  <tr
                    key={det.cod_item}
                    className="transition-all duration-200 even:bg-gray-50 hover:bg-blue-50"
                  >
                    <td className="py-4 px-6 align-middle font-medium text-gray-900">
                      {det.cod_service}
                    </td>
                    <td className="py-4 px-6 align-middle font-medium text-gray-900">
                      {det.cod_category}
                    </td>
                    <td className="py-4 px-6 align-middle font-medium text-gray-900">
                      {det.cod_item}
                    </td>
                    <td className="py-4 px-6 align-middle text-gray-700">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full max-w-[280px] py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                      ) : (
                        det.item_name
                      )}
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <div className="flex justify-center space-x-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleValidatedSave(det)}
                              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition flex items-center text-sm"
                            >
                              <SaveIcon className="mr-2" fontSize="small" />
                              Guardar
                            </button>
                            <button
                              onClick={handleCancel}
                              className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition flex items-center text-sm"
                            >
                              <CancelIcon className="mr-2" fontSize="small" />
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(det)}
                              className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                              aria-label="Editar item"
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <ModalElimination
                              message="¿Quieres eliminar este item?"
                              onClick={() => onDeleteItem(det.cod_category, det.cod_service, det.cod_item)}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableSubcategorie;