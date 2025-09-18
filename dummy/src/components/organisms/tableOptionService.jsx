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
  isVisible = true, // Controla visibilidad con transición
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
    <div
      className={`transition-all duration-500 ease-in-out transform origin-top ${
        isVisible ? "opacity-100 scale-100 max-h-screen" : "opacity-0 scale-95 max-h-0 overflow-hidden"
      }`}
    >
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Categorías</h2>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Nueva categoría:</label>
          <input
            type="text"
            placeholder="Escribe una categoría"
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
        aria-label="Tabla de Categorías"
        className="w-full border-collapse bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <tr>
            <th className="w-[110px] py-3 px-6 text-left font-semibold tracking-wide">Código Servicio</th>
            <th className="w-[110px] py-3 px-6 text-left font-semibold tracking-wide">Código Categoría</th>
            <th className="py-3 px-6 text-left font-semibold tracking-wide">Categoría</th>
            <th className="w-[180px] py-3 px-6 text-left font-semibold tracking-wide">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categoria.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 px-6 text-center text-gray-500 italic border border-gray-300">
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
                 className={`cursor-default transition-colors duration-300 ${
                  isSelected ? "bg-blue-100" : "hover:bg-blue-50"}`}
                >
                  <td className="py-4 px-6 border border-gray-300">{sub.cod_service}</td>
                  <td className="py-4 px-6 border border-gray-300">{sub.cod_category}</td>
                  <td
                    onClick={() => !isEditing && onSelectSub(sub.cod_category, sub.cod_service)}
                    className="py-4 px-6 border border-gray-300 select-none"
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full max-w-[280px] py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      />
                    ) : (
                      sub.category_name
                    )}
                  </td>
                  <td className="py-4 px-6 border border-gray-300">
                    {isEditing ? (
                      <div className="flex gap-3">
                        <Button text="Guardar" onClick={() => saveEdit(sub)} />
                        <Button text="Cancelar" onClick={cancelEdit} />
                      </div>
                    ) : (
                      <div className="flex gap-3">
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
    </div>
  );
}

export default TableOptionServices;
