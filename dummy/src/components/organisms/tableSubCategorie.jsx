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
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <label className="text-sm text-gray-800 whitespace-nowrap">Nombre de item:</label>
          <input
            type="text"
            placeholder="Escribe un item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidatedAdd()}
            className="border border-gray-300 rounded py-1.5 px-2.5 min-w-[200px]"
          />
          <button
            onClick={handleValidatedAdd}
            disabled={!name.trim()}
            className={`rounded py-2 px-3.5 text-white ${
              name.trim()
                ? "bg-blue-700 hover:bg-blue-800 cursor-pointer"
                : "bg-blue-700 opacity-50 cursor-not-allowed"
            } border-0`}
          >
            Agregar
          </button>
          <button
            onClick={onClose}
            className="rounded py-2 px-3.5 bg-blue-700 hover:bg-blue-800 text-white cursor-pointer border-0"
          >
            Cerrar
          </button>
        </div>
      </div>

      <table
        ref={tableRef}
        aria-label="Tabla de Items"
        className="w-full border-collapse m-0 bg-white rounded-lg overflow-hidden shadow-md"
      >
        <thead>
          <tr>
            <th className="w-[120px] border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              codigo servicio
            </th>
            <th className="w-[120px] border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              codigo categoria
            </th>
            <th className="w-[120px] border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              codigo item
            </th>
            <th className="border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              items
            </th>
            <th className="w-[120px] border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="border border-gray-300 py-2.5 px-3.5 text-center">
                Sin detalles
              </td>
            </tr>
          ) : (
            items.map((det) => {
              const isEditing = editingId === det.cod_item;

              return (
                <tr
                  key={det.cod_item}
                  className="cursor-default hover:bg-blue-100"
                >
                  <td className="border border-gray-300 py-2.5 px-3.5">{det.cod_service}</td>
                  <td className="border border-gray-300 py-2.5 px-3.5">{det.cod_category}</td>
                  <td className="border border-gray-300 py-2.5 px-3.5">{det.cod_item}</td>
                  <td className="border border-gray-300 py-2.5 px-3.5">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full max-w-[280px] py-1.5 px-2 border border-gray-300 rounded"
                      />
                    ) : (
                      det.item_name
                    )}
                  </td>
                  <td className="border border-gray-300 py-2.5 px-3.5">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button text="Guardar" onClick={() => handleValidatedSave(det)} />
                        <Button text="Cancelar" onClick={handleCancel} />
                      </div>
                    ) : (
                      <div className="flex gap-2">
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
    </>
  );
}

export default TableSubcategorie;
