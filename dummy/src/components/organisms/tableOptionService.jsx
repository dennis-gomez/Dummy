import React from "react";
import ModalElimination from "../molecules/modalElimination";
import Button from "../atoms/button";
import useTableOptionServices from "/src/utils/useTableOptionServices";

function TableOptionServices({
  categoria,
  onClose,
  onSelectSub,
  selectedService,
  selectedCatCod,
  addCategory,
  updateCategory,
  deleteCategory,
  tableRef,
}) {
  const {
    name,
    setName,
    editingId,
    editValue,
    setEditValue,
    handleValidatedAdd,
    startEdit,
    cancelEdit,
    saveEdit,
    remove,
  } = useTableOptionServices(
    categoria,
    selectedService,
    addCategory,
    updateCategory,
    deleteCategory
  );

  if (!categoria) return null;

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <label className="text-sm text-gray-800 whitespace-nowrap">Nueva categoría:</label>
          <input
            type="text"
            placeholder="Escribe una categoría"
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
        aria-label="Tabla de Categorías"
        className="w-full border-collapse m-0 bg-white rounded-lg overflow-hidden shadow-md"
      >
        <thead>
          <tr>
            <th className="w-[110px] border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              codigo servicio
            </th>
            <th className="w-[110px] border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              codigo categoría
            </th>
            <th className="border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              categoría
            </th>
            <th className="w-[180px] border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {categoria.length === 0 ? (
            <tr>
              <td colSpan={4} className="border border-gray-300 py-2.5 px-3.5 text-center">
                Sin categorías
              </td>
            </tr>
          ) : (
            categoria.map((sub) => {
              const isEditing = editingId === sub.cod_category;
              const isSelected = selectedCatCod === sub.cod_category;

              return (
                <tr
                  key={sub.cod_category}
                  className={`cursor-default hover:bg-blue-100 ${
                    isSelected ? "outline outline-2 outline-blue-700 bg-blue-100" : ""
                  }`}
                >
                  <td className="border border-gray-300 py-2.5 px-3.5">{sub.cod_service}</td>
                  <td className="border border-gray-300 py-2.5 px-3.5">{sub.cod_category}</td>
                  <td
                    onClick={() => !isEditing && onSelectSub(sub.cod_category, sub.cod_service)}
                    className="border border-gray-300 py-2.5 px-3.5"
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full max-w-[280px] py-1.5 px-2 border border-gray-300 rounded"
                      />
                    ) : (
                      sub.category_name
                    )}
                  </td>
                  <td className="border border-gray-300 py-2.5 px-3.5">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button text="Guardar" onClick={() => saveEdit(sub)} />
                        <Button text="Cancelar" onClick={cancelEdit} />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <ModalElimination
                          message="¿Quieres eliminar esta categoría?"
                          onClick={() => remove(sub.cod_category, sub.cod_service)}
                        />
                        <Button text="Editar" onClick={() => startEdit(sub)} />
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

export default TableOptionServices;
