import React, { useState } from "react";
import ModalElimination from "../molecules/modalElimination";
import Button from "../atoms/button";

const styles = `
  .tabla { border-collapse: collapse; width: 100%; margin: 0; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .tabla th, .tabla td { border: 1px solid #e0e0e0; padding: 10px 14px; text-align: left; color: #000; }
  .tabla thead th { background: #1976d2; color: #fff; font-weight: 600; }
  .fila { cursor: default; }
  .fila:hover { background: #e3f2fd; }
  .selected { outline: 2px solid #1976d2; background: #e3f2fd; }
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

function TableOptionServices({
  categoria,
  onClose,
  onSelectSub,
  selectedService,
  selectedCatCod,
  addCategory,
  updateCategory,
  deleteCategory,
  tableRef
}) {
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  if (!categoria) return null;

  // Agregar categoría
  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const exists = categoria.some(
      (c) => c.category_name?.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      alert("Ya existe una categoría con ese nombre.");
      return;
    }
    await addCategory(selectedService, trimmed);
    setName("");
  };
  const onKeyDown = (e) => { if (e.key === "Enter") handleAdd(); };

  // Editar
  const startEdit = (cat) => {
    setEditingId(cat.cod_category);
    setEditValue(cat.category_name || "");
  };
  const cancelEdit = () => { setEditingId(null); setEditValue(""); };
  const saveEdit = async (cat) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    if (trimmed === (cat.category_name || "").trim()) {
      cancelEdit();
      return;
    }
    const exists = categoria.some(
      (c) =>
        c.cod_category !== cat.cod_category &&
        c.category_name?.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      alert("Ya existe una categoría con ese nombre.");
      return;
    }
    await updateCategory(cat.cod_category, cat.cod_service, trimmed);
    cancelEdit();
  };

  // Eliminar
  const remove = async (cod_category, cod_service) => {
    console.log("Deleting category:", cod_category, cod_service);
    await deleteCategory(cod_category, cod_service);
  };

  return (
    <>
      <style>{styles}</style>

      <div className="toolbar">
        <div className="input-group">
          <label>Nueva categoría:</label>
          <input
            type="text"
            placeholder="Escribe una categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className="btn" onClick={handleAdd} disabled={!name.trim()}>
            Agregar
          </button>
        </div>
        <button className="btn" onClick={onClose}>Cerrar</button>
      </div>

      <table ref={tableRef} className="tabla" aria-label="Tabla de Categorías">
        <thead>
          <tr>
            <th style={{ width: 110 }}>codigo servicio</th>
            <th style={{ width: 110 }}>codigo categoría</th>
            <th>categoría</th>
            <th style={{ width: 180 }}>acciones</th>
          </tr>
        </thead>
        <tbody>
          {categoria.length === 0 ? (
            <tr><td colSpan={4}>Sin categorías</td></tr>
          ) : (
            categoria.map((sub) => {
              const isEditing = editingId === sub.cod_category;
              const isSelected = selectedCatCod === sub.cod_category;

              return (
                <tr
                  key={sub.cod_category}
                  className={`fila ${isSelected ? "selected" : ""}`}
                  aria-selected={isSelected}
                >
                  <td onClick={() => onSelectSub(sub.cod_category, sub.cod_service)} style={{ cursor: "pointer" }}>
                    {sub.cod_service}
                  </td>
                  <td>{sub.cod_category}</td>
                  <td onClick={() => !isEditing && onSelectSub(sub.cod_category, sub.cod_service)} style={{ cursor: isEditing ? "default" : "pointer" }}>
                    {isEditing ? (
                      <input
                        className="inline-input"
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    ) : (
                      sub.category_name
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="acciones">
                        <Button text="Guardar" onClick={() => saveEdit(sub)} />
                        <Button text="Cancelar" onClick={cancelEdit} />
                      </div>
                    ) : (
                      <div className="acciones">
                        <ModalElimination
                          message={"¿Quieres eliminar esta categoría?"}
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
