import React, { useState } from "react";
import ModalElimination from "../molecules/modalElimination";
import Button from "../atoms/button";

const styles = `
  .tabla { border-collapse: collapse; width: 100%; margin: 0; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .tabla th, .tabla td { border: 1px solid #e0e0e0; padding: 10px 14px; text-align: left; color: #000; }
  .tabla thead th { background: #1976d2; color: #fff; font-weight: 600; }
  .fila { cursor: default; } /* el tr ya no selecciona, lo hacen los td */
  .fila:hover { background: #e3f2fd; }
  .th-yellow { background: #fff176; color: #000; font-weight: 700; }
  .selected { outline: 2px solid #1976d2; }
  .titulo { margin: 0 0 8px; font-weight: 600; }
  .toolbar { margin: 0 0 8px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: space-between; }
  .input-group { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .input-group label { font-size: 14px; color: #333; white-space: nowrap; }
  .input-group input { border: 1px solid #ccc; border-radius: 4px; padding: 6px 10px; min-width: 200px; }
  .btn { background: #1976d2; color: #fff; border: none; border-radius: 4px; padding: 8px 14px; cursor: pointer; }
  .btn:disabled { opacity: .5; cursor: not-allowed; }
  .btn:hover { background: #1565c0; }
  .acciones { display: flex; gap: 8px; }
  .inline-input { width: 100%; max-width: 280px; padding: 6px 8px; border: 1px solid #ccc; border-radius: 4px; }
`;

function TableMiscellaneousPage({
  services,
  onSelect,
  selectedId,
  onAddItem,        
  onEditService,
  onDeleteService,
  tableRef,
}) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Agregar servicio
  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const exists = services.some(
      (s) => s.service_name?.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      alert("Ya existe un servicio con ese nombre.");
      return;
    }
    await onAddItem(trimmed);
    setName("");
  };
  const onKeyDown = (e) => { if (e.key === "Enter") handleAdd(); };

  // Editar inline
  const startEdit = (srv) => {
    setEditingId(srv.cod_service);
    setEditValue(srv.service_name || "");
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };
  const saveEdit = async (srv) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    if (trimmed === (srv.service_name || "").trim()) {
      cancelEdit();
      return;
    }
    const exists = services.some(
      (s) =>
        s.cod_service !== srv.cod_service &&
        s.service_name?.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      alert("Ya existe un servicio con ese nombre.");
      return;
    }
    await onEditService?.(srv.cod_service, trimmed);
    cancelEdit();
  };

  // Eliminar
  const remove = async (cod_service) => {
   console.log("Deleting service:", cod_service);
  await onDeleteService?.(cod_service);
 };

  return (
    <>
      <style>{styles}</style>

      <div className="titulo">Servicios</div>
      <div className="toolbar">
        <div className="input-group">
          <label>Nuevo servicio:</label>
          <input
            type="text"
            placeholder="Escribe un servicio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className="btn" onClick={handleAdd} disabled={!name.trim()}>
            Agregar
          </button>
        </div>
      </div>

      <table ref={tableRef} className="tabla" aria-label="Tabla de Servicios">
        <thead>
          <tr>
            <th className="th-yellow" style={{ width: 140 }}>codigo servicio</th>
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
              const isSelected = selectedId === srv.cod_service;

              return (
                <tr
                  key={srv.cod_service}
                  className={`fila ${isSelected ? "selected" : ""}`}
                  aria-selected={isSelected}
                >
                  <td onClick={() => onSelect(srv.cod_service)} style={{ cursor: "pointer" }}>
                    {srv.cod_service}
                  </td>

                  <td onClick={() => !isEditing && onSelect(srv.cod_service)} style={{ cursor: isEditing ? "default" : "pointer" }}>
                    {isEditing ? (
                      <input
                        className="inline-input"
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      srv.service_name
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="acciones">
                        <Button text="Guardar" onClick={() => saveEdit(srv)} />
                        <Button text="Cancelar" onClick={cancelEdit} />
                      </div>
                    ) : (
                      <div className="acciones">
                       <ModalElimination
                        message={"¿Quieres eliminar este servicio?"}
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
