import useTableSubcategorie from "/src/utils/useTableSubcategorie";
import { tableValidator } from "/src/utils/tableValidator";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoTooltip from "../organisms/infoToolTip";

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

    const result = await Swal.fire({
      title: "¿Quieres agregar este item?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, agregar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await handleAdd();
      Swal.fire("Agregado", "El item fue agregado con éxito", "success");
    }
  };

  const handleValidatedSave = async (det) => {
    if (editValue.trim().length < 3) {
      Swal.fire({
        icon: "error",
        title: "Validación",
        text: "El nombre del item debe tener al menos 3 caracteres",
      });
      return;
    }

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
      await handleSaveEdit(det.cod_category, det.cod_service, det.cod_item);
      Swal.fire("Actualizado", "El item fue modificado correctamente", "success");
    }
  };

  const handleValidatedDelete = async (codCat, codServ, codItem) => {
    const result = await Swal.fire({
      title: "¿Quieres eliminar este item?",
      text: "No podrás deshacer esta acción",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await onDeleteItem(codCat, codServ, codItem);
      Swal.fire("Eliminado", "El item fue borrado", "success");
    }
  };

  return (
    <div className={`${isVisible ? "block" : "hidden"} mb-6`}>
      {/* HEADER con input, botones y tooltip */}
      <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Nombre de item:
          </label>
          <input
            type="text"
            placeholder="Escribe un item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidatedAdd()}
            className="border bg-white border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto min-w-[220px] focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
            className="rounded-lg py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer border-0 focus:ring-4 focus:ring-blue-300 w-full sm:w-auto transition"
          >
            Cerrar
          </button>
        </div>

        {/* Tooltip informativo */}
        <div className="flex justify-center sm:justify-start mt-2 sm:mt-0 w-full sm:w-auto">
          <InfoTooltip
            message="Aquí puedes agregar, editar o eliminar items asociados a una categoría y servicio. Usa los botones de acciones para gestionar cada item."
            position="left"
            mobilePosition="bottom"
          />
        </div>
      </div>

      {/* TABLA RESPONSIVE */}
      <div className="overflow-x-auto shadow-lg rounded-xl max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table
          ref={tableRef}
          aria-label="Tabla de Items"
          className="min-w-full border-collapse bg-white rounded-2xl shadow-lg"
        >
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <tr>
              <th className="py-4 px-6 font-semibold text-sm sm:text-md text-center">
                Cód. Servicio
              </th>
              <th className="py-4 px-6 font-semibold text-sm sm:text-md text-center">
                Cód. Categoría
              </th>
              <th className="py-4 px-6 font-semibold text-sm sm:text-md text-center">
                Cód. Item
              </th>
              <th className="py-4 px-6 font-semibold text-sm sm:text-md text-center">
                Items
              </th>
              <th className="py-4 px-6 font-semibold text-sm sm:text-md text-center">
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
                    className={`transition-all duration-200 even:bg-gray-50 hover:bg-blue-50`}
                  >
                    <td className="py-4 px-4 text-center text-xs sm:text-sm md:text-base">
                      {det.cod_service}
                    </td>
                    <td className="py-4 px-4 text-center text-xs sm:text-sm md:text-base">
                      {det.cod_category}
                    </td>
                    <td className="py-4 px-4 text-center text-xs sm:text-sm md:text-base">
                      {det.cod_item}
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
                        det.item_name
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center space-x-2 sm:space-x-3 flex-wrap gap-y-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleValidatedSave(det)}
                              className="bg-blue-600 text-white rounded-lg px-3 sm:px-4 py-2 hover:bg-blue-700 transition flex items-center text-xs sm:text-sm"
                            >
                              <SaveIcon className="mr-2" fontSize="small" />
                              Guardar
                            </button>
                            <button
                              onClick={handleCancel}
                              className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 hover:bg-gray-100 transition flex items-center text-xs sm:text-sm"
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
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <button
                              onClick={() =>
                                handleValidatedDelete(det.cod_category, det.cod_service, det.cod_item)
                              }
                              className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
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

export default TableSubcategorie;
