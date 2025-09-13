import React from "react";
import ModalElimination from "../molecules/modalElimination";
import Button from "../atoms/button";
import "/src/styles/table.css";
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

  // 🔹 Validación al agregar
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
      <div className="titulo">Servicios</div>
      <div className="toolbar">
        <div className="input-group">
          <label>Nuevo servicio:</label>
          <input
            type="text"
            placeholder="Escribe un servicio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleValidatedAdd()}
          />
          <button className="btn" onClick={handleValidatedAdd} disabled={!name.trim()}>
            Agregar
          </button>
        </div>
      </div>

      <table ref={tableRef} className="tablas" aria-label="Tabla de Servicios">
        <thead>
          <tr>
            <th style={{ width: 140 }}>codigo servicio</th>
            <th>servicio</th>
            <th style={{ width: 180 }}>acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr><td colSpan={3}>Sin servicios</td></tr>
          ) : (
            services.map((srv) => {
              const isEditing = editingId === srv.cod_service;

              return (
                <tr key={srv.cod_service} className={selectedId === srv.cod_service ? "selected" : ""}>
                  <td>{srv.cod_service}</td>
                  <td onClick={() => !isEditing && onSelect(srv.cod_service)}>
                    {isEditing ? (
                      <input
                        className="inline-input"
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : srv.service_name}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="acciones">
                        <Button text="Guardar" onClick={() => saveEdit(srv)} />
                        <Button text="Cancelar" onClick={cancelEdit} />
                      </div>
                    ) : (
                      <div className="acciones">
                        <ModalElimination message="¿Quieres eliminar este servicio?" onClick={() => remove(srv.cod_service)} />
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
