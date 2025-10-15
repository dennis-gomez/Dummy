import useTableOptionServices from "../../utils/useTableOptionServices";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoTooltip from "../organisms/infoToolTip";

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

  const handleValidatedDeactivate = async (codCat, codServ) => {
    const result = await Swal.fire({
      title: "¿Quieres desactivar esta categoría?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await remove(codCat, codServ);
      Swal.fire("Desactivada", "La categoría fue desactivada", "success");
    }
  };

  return (
    <div className={`${isVisible ? "block" : "hidden"} mb-6`}>
      {/* HEADER con input, botones y tooltip */}
      <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Nueva categoría:
          </label>
          <input
            type="text"
            placeholder="Escribe una categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidatedAdd()}
            className="border bg-white border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={handleValidatedAdd}
            disabled={!name.trim()}
            className={`rounded-lg py-2 px-5 text-white font-semibold transition w-full sm:w-auto ${
              name.trim()
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer focus:ring-4 focus:ring-blue-300"
                : "bg-blue-600 opacity-50 cursor-not-allowed"
            }`}
          >
            Agregar
          </button>
          <button
            onClick={onClose}
            className="rounded-lg py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer border-0 focus:ring-4 focus:ring-blue-300 w-full sm:w-auto"
          >
            Cerrar
          </button>
        </div>

        {/* Tooltip informativo */}
        <div className="flex justify-center sm:justify-start mt-2 sm:mt-0 w-full sm:w-auto">
          <InfoTooltip
            message="Aquí puedes gestionar las categorías asociadas a un servicio. Puedes agregar nuevas, editarlas o desactivarlas según sea necesario."
            position="left"
            mobilePosition="bottom"
          />
        </div>
      </div>

      {/* TABLA RESPONSIVE */}
      <div className="overflow-x-auto shadow-lg rounded-xl max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table
          ref={tableRef}
          aria-label="Tabla de Categorías"
          className="min-w-full border-collapse bg-white rounded-2xl shadow-lg"
        >
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <tr>
              <th className="py-4 px-6 text-center font-semibold text-sm sm:text-md">
                Cód. Servicio
              </th>
              <th className="py-4 px-6 text-center font-semibold text-sm sm:text-md">
                Cód. Categoría
              </th>
              <th className="py-4 px-6 text-center font-semibold text-sm sm:text-md">
                Categoría
              </th>
              <th className="py-4 px-6 text-center font-semibold text-sm sm:text-md">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categoria.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 px-6 text-center text-gray-500 italic bg-gray-50"
                >
                  Sin categorías
                </td>
              </tr>
            ) : (
              categoria.map((sub) => {
                const isEditing = editingId === sub.cod_category;
                const isSelected = selectedCatCod === sub.cod_category;

                const handleRowClick = (e) => {
                  if (e.target.closest("button")) return; // evitar que los botones disparen selección
                  onSelectSub(sub.cod_category, sub.cod_service);
                };

                return (
                  <tr
                    key={sub.cod_category}
                    onClick={handleRowClick}
                    className={`transition-all duration-200 even:bg-gray-50 ${
                      isSelected ? "bg-blue-100" : "hover:bg-blue-50"
                    }`}
                  >
                    <td className="py-4 px-4 text-center text-xs sm:text-sm md:text-base">
                      {sub.cod_service}
                    </td>
                    <td className="py-4 px-4 text-center text-xs sm:text-sm md:text-base">
                      {sub.cod_category}
                    </td>
                    <td className="py-4 px-4 text-center text-xs sm:text-sm md:text-base">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full max-w-[280px] py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition text-center mx-auto block"
                        />
                      ) : (
                        sub.category_name
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center space-x-2 sm:space-x-3 flex-wrap gap-y-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleValidatedSave(sub)}
                              className="bg-blue-600 text-white rounded-lg px-3 sm:px-4 py-2 hover:bg-blue-700 transition flex items-center text-xs sm:text-sm"
                            >
                              <SaveIcon className="mr-2" fontSize="small" />
                              Guardar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 hover:bg-gray-100 transition flex items-center text-xs sm:text-sm"
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
                              onClick={() =>
                                handleValidatedDeactivate(sub.cod_category, sub.cod_service)
                              }
                              className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                              aria-label="Desactivar categoría"
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
