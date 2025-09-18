import React from "react";
import ModalElimination from "../molecules/modalElimination";
import Button from "../atoms/button";
import useTableSubcategorie from "/src/utils/useTableSubcategorie";
import { tableValidator } from "/src/utils/tableValidator";
import Swal from "sweetalert2";

function TableSubcategorie({
  items,
  onClose,
  onDeleteItem,
  onAddItem,
  onEditItem,
  tableRef,
  isVisible = true, // Controla visibilidad con transición
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

  // 🔹 Validación al agregar
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

  // 🔹 Validación al editar
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
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Items</h2>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Nombre de item:</label>
          <input
            type="text"
            placeholder="Escribe un item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidatedAdd()}
            className="border border-gray-300 rounded-md py-2 px-3 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleValidatedAdd}
            disabled={!name.trim()}
            className={`rounded-md py-2 px-5 text-white font-semibold transition ${
              name.trim()
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer focus:ring-4 focus:ring-blue-300"
                : "bg-blue-600 opacity-50 cursor-not-allowed"
            }`}
          >
            Agregar
          </button>
          <button
            onClick={onClose}
            className="rounded-md py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer border-0 focus:ring-4 focus:ring-blue-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>

      <table
        ref={tableRef}
        aria-label="Tabla de Items"
        className="w-full border-collapse bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <tr>
            <th className="w-[120px] py-3 px-6 text-left font-semibold tracking-wide">Código Servicio</th>
            <th className="w-[120px] py-3 px-6 text-left font-semibold tracking-wide">Código Categoría</th>
            <th className="w-[120px] py-3 px-6 text-left font-semibold tracking-wide">Código Item</th>
            <th className="py-3 px-6 text-left font-semibold tracking-wide">Items</th>
            <th className="w-[120px] py-3 px-6 text-left font-semibold tracking-wide">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-4 px-6 text-center text-gray-500 italic border border-gray-300">
                Sin detalles
              </td>
            </tr>
          ) : (
            items.map((det) => {
              const isEditing = editingId === det.cod_item;

              return (
                <tr
                  key={det.cod_item}
                  className="cursor-default hover:bg-blue-50 transition-colors duration-300"
                >
                  <td className="py-4 px-6 border border-gray-300">{det.cod_service}</td>
                  <td className="py-4 px-6 border border-gray-300">{det.cod_category}</td>
                  <td className="py-4 px-6 border border-gray-300">{det.cod_item}</td>
                  <td className="py-4 px-6 border border-gray-300">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full max-w-[280px] py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      />
                    ) : (
                      det.item_name
                    )}
                  </td>
                  <td className="py-4 px-6 border border-gray-300">
                    {isEditing ? (
                      <div className="flex gap-3">
                        <Button text="Guardar" onClick={() => handleValidatedSave(det)} />
                        <Button text="Cancelar" onClick={handleCancel} />
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <ModalElimination
                          message="¿Quieres eliminar este item?"
                          onClick={() => onDeleteItem(det.cod_category, det.cod_service, det.cod_item)}
                        />
                        <Button text="Editar" onClick={() => handleEditClick(det)} />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableSubcategorie;
