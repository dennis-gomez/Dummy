import useTableMiscellaneousPage from "/src/utils/useTableMiscellaneous";
import { tableValidator } from "/src/utils/tableValidator";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoTooltip from "../organisms/infoToolTip";

function TableMiscellaneousPage({
  services,
  onSelect,
  selectedId,
  onAddItem,
  onEditService,
  onDeleteService,
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
    startEdit,
    cancelEdit,
    saveEdit,
    remove,
  } = useTableMiscellaneousPage(services, onAddItem, onEditService, onDeleteService);

  // Confirmación al Agregar
  const handleValidatedAdd = async () => {
    const error = tableValidator({
      value: name,
      list: services.map((s) => s.service_name.toLowerCase()),
    });

    if (error) {
      Swal.fire({ icon: "error", title: "Validación", text: error });
      return;
    }

    const result = await Swal.fire({
      title: "¿Quieres agregar este servicio?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, agregar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await handleAdd();
      Swal.fire("Agregado", "El servicio fue agregado con éxito", "success");
    }
  };

  // Confirmación al Editar
  const handleValidatedEdit = async (srv) => {
    if (editValue.trim().length < 3) {
      Swal.fire({
        icon: "error",
        title: "Validación",
        text: "El nombre del servicio debe tener al menos 3 caracteres",
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
      await saveEdit(srv);
      Swal.fire("Actualizado", "El servicio fue modificado correctamente", "success");
    }
  };

  // Confirmación al Desactivar
  const handleValidatedDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Quieres desactivar este servicio?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await remove(id);
      Swal.fire("Desactivado", "El servicio fue desactivado", "success");
    }
  };

  return (
    <div className={`${isVisible ? "block" : "hidden"} mb-6`}>
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Nuevo servicio:
          </label>
          <input
            type="text"
            placeholder="Escribe un servicio"
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
        </div>

        <div className="flex justify-center sm:justify-start mt-2 sm:mt-0 w-full sm:w-auto">
          <InfoTooltip
            message="Aquí puedes agregar, editar o desactivar un servicio. Usa los botones de acciones para gestionar cada servicio."
            position="left"
            mobilePosition="bottom"
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto shadow-lg rounded-xl max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table
          ref={tableRef}
          aria-label="Tabla de Servicios"
          className="min-w-full border-collapse bg-white rounded-2xl shadow-lg"
        >
          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <tr>
              <th className="py-4 px-6 text-center font-semibold text-sm sm:text-md rounded-tl-xl">
                Código Servicio
              </th>
              <th className="py-4 px-6 text-center font-semibold text-sm sm:text-md">
                Servicio
              </th>
              <th className="py-4 px-6 text-center font-semibold text-sm sm:text-md rounded-tr-xl">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 px-6 text-center text-gray-500 italic bg-gray-50">
                  Sin servicios
                </td>
              </tr>
            ) : (
              services.map((srv) => {
                const isEditing = editingId === srv.cod_service;
                const isSelected = selectedId === srv.cod_service;

                return (
                  <tr
                    key={srv.cod_service}
                    onClick={(e) => {
                      // Evitar que se seleccione al clicar en los botones
                      if (
                        e.target.tagName !== "BUTTON" &&
                        e.target.tagName !== "svg" &&
                        e.target.tagName !== "path" &&
                        !isEditing
                      ) {
                        onSelect(srv.cod_service);
                      }
                    }}
                    className={`transition-all duration-200 even:bg-gray-50 cursor-pointer ${
                      isSelected ? "bg-blue-100" : "hover:bg-blue-50"
                    }`}
                  >
                    <td className="py-4 px-4 text-center text-xs sm:text-sm md:text-base font-medium text-gray-900">
                      {srv.cod_service}
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
                        srv.service_name
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center space-x-2 sm:space-x-3 flex-wrap gap-y-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleValidatedEdit(srv)}
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
                              onClick={() => startEdit(srv)}
                              className="text-blue-500 hover:text-blue-700 transition p-2 rounded-full hover:bg-blue-50"
                              aria-label="Editar servicio"
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <button
                              onClick={() => handleValidatedDelete(srv.cod_service)}
                              className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
                              aria-label="Desactivar servicio"
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

export default TableMiscellaneousPage;
