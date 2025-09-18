import ModalElimination from "../molecules/modalElimination";
import Button from "../atoms/button";
import useTableMiscellaneousPage from "/src/utils/useTableMiscellaneous";
import { tableValidator } from "/src/utils/tableValidator";
import Swal from "sweetalert2";

function TableMiscellaneousPage({
  services,
  onSelect,
  selectedId,
  onAddItem,
  onEditService,
  onDeleteService,
  tableRef,
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

  const handleValidatedAdd = async () => {
    const error = tableValidator({
      value: name,
      list: services.map((s) => s.service_name.toLowerCase()),
    });

    if (error) {
      Swal.fire({ icon: "error", title: "Validación", text: error });
      return;
    }
    await handleAdd();
  };

  return (
    <>
      <h2 className="mb-2 font-semibold text-lg">Servicios</h2>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <label className="text-sm text-gray-800 whitespace-nowrap">Nuevo servicio:</label>
          <input
            type="text"
            placeholder="Escribe un servicio"
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
        </div>
      </div>

      <table
        ref={tableRef}
        aria-label="Tabla de Servicios"
        className="w-full border-collapse m-0 bg-white rounded-lg overflow-hidden shadow-md"
      >
        <thead>
          <tr>
            <th className="w-[140px] border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              codigo servicio
            </th>
            <th className="border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              servicio
            </th>
            <th className="w-[180px] border border-gray-300 py-2.5 px-3.5 text-left bg-blue-700 text-white font-semibold">
              acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan={3} className="border border-gray-300 py-2.5 px-3.5 text-center">
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
                  className={`cursor-default hover:bg-blue-100 ${
                    isSelected ? "outline outline-2 outline-blue-700 bg-blue-100" : ""
                  }`}
                >
                  <td className="border border-gray-300 py-2.5 px-3.5">{srv.cod_service}</td>
                  <td
                    onClick={() => !isEditing && onSelect(srv.cod_service)}
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
                      srv.service_name
                    )}
                  </td>
                  <td className="border border-gray-300 py-2.5 px-3.5">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button text="Guardar" onClick={() => saveEdit(srv)} />
                        <Button text="Cancelar" onClick={cancelEdit} />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <ModalElimination
                          message="¿Quieres eliminar este servicio?"
                          onClick={() => remove(srv.cod_service)}
                        />
                        <Button text="Editar" onClick={() => startEdit(srv)} />
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

export default TableMiscellaneousPage;
