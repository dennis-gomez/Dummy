import React from "react";
import useTableOptionServices from "/src/utils/useTableOptionServices";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

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
  isVisible = true,
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

  // 🔹 Confirmar Guardar
  const handleValidatedSave = async (sub) => {
    if (editValue.trim().length < 3) {
      Swal.fire({
        icon: "error",
        title: "Validación",
        text: "El nombre de la categoría debe tener al menos 3 caracteres",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Quieres guardar los cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await saveEdit(sub);
      Swal.fire("Actualizado", "La categoría fue modificada correctamente", "success");
    }
  };

  // 🔹 Confirmar Eliminar
  const handleValidatedDelete = async (codCat, codServ) => {
    const result = await Swal.fire({
      title: "¿Quieres eliminar esta categoría?",
      text: "No podrás deshacer esta acción",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await remove(codCat, codServ);
      Swal.fire("Eliminado", "La categoría fue borrada", "success");
    }
  };

  return (
    <div className={`${isVisible ? "block" : "hidden"} mb-6`}>
      <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">Categorías</h2>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Nueva categoría:
          </label>
          <input
            type="text"
            placeholder="Escribe una categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidatedAdd()}
            className="border border-gray-300 rounded-lg py-2 px-4 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleValidatedAdd}
            disabled={!name.trim()}
            className={`rounded-lg py-2 px-5 text-white font-semibold transition ${name.trim()
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

      <div className="overflow-x-auto rounded-xl max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table
          ref={tableRef}
          aria-label="Tabla de Categorías"
          className="min-w-full border-collapse bg-white rounded-2xl shadow-lg"
        >
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <tr>
              <th className="py-4 px-6 text-center">Código Servicio</th>
              <th className="py-4 px-6 text-center">Código Categoría</th>
              <th className="py-4 px-6 text-center">Categoría</th>
              <th className="py-4 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoria.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-center text-gray-500 italic bg-gray-50">
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
                    className={`transition-all duration-200 even:bg-gray-50 ${isSelected ? "bg-blue-100" : "hover:bg-blue-50"
                      }`}
                  >
                    <td className="py-4 px-6 text-center">{sub.cod_service}</td>
                    <td className="py-4 px-6 text-center">{sub.cod_category}</td>
                    <td
                      onClick={() => !isEditing && onSelectSub(sub.cod_category, sub.cod_service)}
                      className="py-4 px-6 text-center cursor-pointer select-none text-gray-700"
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full max-w-[280px] py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition text-center mx-auto block"
                        />
                      ) : (
                        sub.category_name
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center space-x-3">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleValidatedSave(sub)}
                              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition flex items-center text-sm"
                            >
                              <SaveIcon className="mr-2" fontSize="small" />
                              Guardar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition flex items-center text-sm"
                            >
                              <CancelIcon className="mr-2" fontSize="small" />
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(sub)}
                              className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                              aria-label="Editar categoría"
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <button
                              onClick={() => handleValidatedDelete(sub.cod_category, sub.cod_service)}
                              className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                              aria-label="Eliminar categoría"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
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

export default TableOptionServices;
