import React from "react";
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
  isVisible = true, // Controla la visibilidad con transición
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
    <div
      className={`transition-all duration-500 ease-in-out transform origin-top ${
        isVisible ? "opacity-100 scale-100 max-h-screen" : "opacity-0 scale-95 max-h-0 overflow-hidden"
      }`}
    >
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Servicios</h2>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Nuevo servicio:</label>
          <input
            type="text"
            placeholder="Escribe un servicio"
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
        </div>
      </div>

      <table
        ref={tableRef}
        aria-label="Tabla de Servicios"
        className="w-full border-collapse bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <thead className="bg-gradient-to-r from-blue-700 to-blue-600 text-white">
          <tr>
            <th className="w-[140px] py-3 px-6 text-left font-semibold tracking-wide">Código Servicio</th>
            <th className="py-3 px-6 text-left font-semibold tracking-wide">Servicio</th>
            <th className="w-[180px] py-3 px-6 text-left font-semibold tracking-wide">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 px-6 text-center text-gray-500 italic">
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
                  className={`cursor-default transition-colors duration-300 ${
                    isSelected ? "bg-blue-100" : "hover:bg-blue-50"
                  }`}
                >
                  <td className="py-4 px-6 border-b border-gray-200">{srv.cod_service}</td>
                  <td
                    onClick={() => !isEditing && onSelect(srv.cod_service)}
                    className="py-4 px-6 border-b border-gray-200 select-none"
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full max-w-[280px] py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      />
                    ) : (
                      srv.service_name
                    )}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {isEditing ? (
                      <div className="flex gap-3">
                        <Button text="Guardar" onClick={() => saveEdit(srv)} />
                        <Button text="Cancelar" onClick={cancelEdit} />
                      </div>
                    ) : (
                      <div className="flex gap-3">
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
    </div>
  );
}

export default TableMiscellaneousPage;
