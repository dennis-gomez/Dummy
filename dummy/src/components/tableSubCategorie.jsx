import ModalElimination from "./modalElimination";
import { deleteItem } from "../services/itemService";
import React, { useState } from "react";

const styles = `
  .tabla { border-collapse: collapse; width: 100%; margin: 0; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .tabla th, .tabla td { border: 1px solid #e0e0e0; padding: 10px 14px; text-align: left; color: #000; }
  .tabla thead th { background: #1976d2; color: #fff; font-weight: 600; }
  .toolbar { margin: 0 0 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
  .btn { background: #1976d2; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; flex-shrink: 0; }
  .btn:disabled { opacity: .5; cursor: not-allowed; }
  .btn:hover { background: #1565c0; }
  .input-group { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
  .input-group label { font-size: 14px; color: #333; white-space: nowrap; }
  .input-group input { border: 1px solid #ccc; border-radius: 4px; padding: 6px 10px; min-width: 160px; flex: 1; }
`;

function TableSubcategorie({ items, onClose, onAddItem }) {
  const [name, setName] = useState("");

  if (!items) return null;

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await onAddItem(trimmed);    // <- el padre se encarga de llamar a la API y refrescar
    setName("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <>
      <style>{styles}</style>

      <div className="toolbar">
        <button className="btn" onClick={onClose}>Cerrar</button>
        <div className="input-group">
          <label>Nombre de item:</label>
          <input
            type="text"
            placeholder="Escribe un item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className="btn" onClick={handleAdd} disabled={!name.trim()}>
            Agregar
          </button>
        </div>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th style={{ width: 120 }}>codigo servicio</th>
            <th style={{ width: 120 }}>codigo categoria</th>
            <th style={{ width: 120 }}>codigo item</th>
            <th>items</th>
            <th style={{ width: 120 }}>acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={4}>Sin detalles</td></tr>
          ) : (
            items.map((det) => (
              <tr key={det.cod_item}>
                <td>{det.cod_service}</td>
                <td>{det.cod_category}</td>
                <td>{det.cod_item}</td>
                <td>{det.item_name}</td>
                <td>
                  <ModalElimination 
                    message={'¿Quieres eliminar este item?'} 
                    onClick={ () =>  deleteItem(det.cod_category, det.cod_service, det.cod_item) }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default TableSubcategorie;
