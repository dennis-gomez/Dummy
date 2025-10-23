import React, { useState, useEffect, useRef } from "react";
import {
  getInventoryMovementById,
  deleteInventoryMovement,
  destroyInventoryMovement
} from "../../services/inventoryMovementTIService";

import { deleteMovement } from "../../services/movementTIService";
import AssetModalButton from "../molecules/modalAssetSelector"; // Ajusta la ruta según tu proyecto

const TableMovementTI = ({
  movements,
  onUpdate,
  onDelete,
  availableAssets,
  categoryAssets,
  assets,
  brands,
  offices,
  systemsOperative,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [expandedRows, setExpandedRows] = useState([]);
  const [movementAssets, setMovementAssets] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (editingId && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [editingId]);

  const handleEditClick = (movement) => {
    setEditingId(movement.cod_movement);
    setEditForm({ ...movement });
  };

  const handleDeleteMovement = async (cod_movement) => {
    try {
      await deleteMovement(cod_movement);
      onDelete(cod_movement);
    } catch (err) {
      console.error("Error eliminando movimiento:", err);
    }
  };

  const handleDeleteMovementItem = async (cod_movement, cod_it_inventory) => {
    try {
      const result = await destroyInventoryMovement(cod_movement, cod_it_inventory);

      if (result?.success === false) {
        alert(result.message || "No se pudo eliminar el activo.");
        return;
      }

      const res = await getInventoryMovementById(cod_movement);
      setMovementAssets((prev) => ({ ...prev, [cod_movement]: res }));

      alert("Activo eliminado correctamente");
    } catch (err) {
      console.error("Error eliminando activo:", err);
      alert("Hubo un error al eliminar el activo.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSave = () => {
    const requiredFields = [
      "movement_date",
      "movement_owner",
      "movement_delivered_by",
      "movement_delivered_to",
    ];
    for (let field of requiredFields) {
      if (!editForm[field] || editForm[field].trim() === "") {
        alert(`El campo "${field}" es obligatorio`);
        return;
      }
    }
    onUpdate(editingId, editForm);
    setEditingId(null);
  };

  const handleCancel = () => setEditingId(null);

  const toggleExpand = async (id) => {
    const isExpanded = expandedRows.includes(id);
    if (isExpanded) {
      setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
      return;
    }
    setExpandedRows([...expandedRows, id]);
    if (!movementAssets[id]) {
      try {
        const res = await getInventoryMovementById(id);
        setMovementAssets((prev) => ({ ...prev, [id]: res || [] }));
      } catch (err) {
        console.error("Error al obtener activos del movimiento:", err);
      }
    }
  };

  const handleRemoveItem = async (cod_movement, cod_it_inventory) => {
    try {
      await deleteInventoryMovement(cod_movement, cod_it_inventory);
      const resMovement = await getInventoryMovementById(cod_movement);
      setMovementAssets((prev) => ({ ...prev, [cod_movement]: resMovement }));
      alert("Activo desactivado correctamente");
    } catch (err) {
      console.error("Error al desactivar activo:", err);
      alert("Error al desactivar activo");
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-2xl p-6 max-w-full mx-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <tr>
            <th className="py-4 px-6 text-center font-semibold rounded-tl-xl">#</th>
            <th className="py-4 px-6 text-center font-semibold">Fecha</th>
            <th className="py-4 px-6 text-center font-semibold">Responsable</th>
            <th className="py-4 px-6 text-center font-semibold">Entregado por</th>
            <th className="py-4 px-6 text-center font-semibold">Entregado a</th>
            <th className="py-4 px-6 text-center font-semibold">Observaciones</th>
            <th className="py-4 px-6 text-center font-semibold rounded-tr-xl">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => (
            <React.Fragment key={m.cod_movement}>
              <tr className={`hover:bg-blue-50 even:bg-gray-50 ${editingId === m.cod_movement ? "bg-yellow-50" : ""}`}>
                <td className="py-3 px-4 text-center">{m.cod_movement}</td>
                {editingId === m.cod_movement ? (
                  <>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="date"
                        name="movement_date"
                        value={editForm.movement_date}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full text-sm md:text-base"
                        ref={firstInputRef}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        name="movement_owner"
                        value={editForm.movement_owner}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full text-sm md:text-base"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        name="movement_delivered_by"
                        value={editForm.movement_delivered_by}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full text-sm md:text-base"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        name="movement_delivered_to"
                        value={editForm.movement_delivered_to}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full text-sm md:text-base"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        name="movement_observations"
                        value={editForm.movement_observations || ""}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full text-sm md:text-base"
                      />
                    </td>
                    <td className="py-3 px-4 text-center flex flex-col md:flex-row justify-center gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl font-medium"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-4 text-center">{m.movement_date}</td>
                    <td className="py-3 px-4 text-center">{m.movement_owner}</td>
                    <td className="py-3 px-4 text-center">{m.movement_delivered_by}</td>
                    <td className="py-3 px-4 text-center">{m.movement_delivered_to}</td>
                    <td className="py-3 px-4 text-center">{m.movement_observations || "-"}</td>
                    <td className="py-3 px-4 text-center flex flex-col md:flex-row justify-center gap-2">
                      <button
                        onClick={() => toggleExpand(m.cod_movement)}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium"
                      >
                        {expandedRows.includes(m.cod_movement) ? "Ocultar activos" : "Ver activos"}
                      </button>
                      <button
                        onClick={() => handleEditClick(m)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteMovement(m.cod_movement)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
                      >
                        Eliminar Movimiento
                      </button>
                    </td>
                  </>
                )}
              </tr>

              {expandedRows.includes(m.cod_movement) && (
                <tr className="bg-gray-50">
                  <td colSpan="7" className="p-4">
                    <div className="rounded-lg bg-white p-4 shadow-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-700 text-lg">
                          Activos en este movimiento:
                        </h4>
                        <AssetModalButton
                          movementId={m.cod_movement} // <-- Pasamos correctamente el movementId
                          onAssetsSelected={async () => {
                            const res = await getInventoryMovementById(m.cod_movement);
                            setMovementAssets((prev) => ({ ...prev, [m.cod_movement]: res }));
                          }}
                          availableAssets={availableAssets}
                          categoryAssets={categoryAssets}
                          assets={assets}
                          brands={brands}
                          offices={offices}
                          systemsOperative={systemsOperative}
                        />
                      </div>

                      {movementAssets[m.cod_movement]?.length > 0 ? (
                        <table className="min-w-full table-auto border-collapse">
                          <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                            <tr>
                              <th className="py-3 px-6 text-center font-semibold">Código Activo</th>
                              <th className="py-3 px-6 text-center font-semibold">Motivo</th>
                              <th className="py-3 px-6 text-center font-semibold">Descripción</th>
                              <th className="py-3 px-6 text-center font-semibold">Estado</th>
                              <th className="py-3 px-6 text-center font-semibold">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {movementAssets[m.cod_movement].map((item, index) => {
                              const status = Number(item.it_inventory_movement_is_active);
                              const statusText = status === 1 ? "Activo" : "Inactivo";
                              return (
                                <tr
                                  key={`${m.cod_movement}-${item.cod_inventory_movement}-${index}`}
                                  className={status === 0 ? "bg-red-100" : ""}
                                >
                                  <td className="py-3 px-4 text-center">{item.cod_it_inventory || "-"}</td>
                                  <td className="py-3 px-4 text-center">{item.it_inventory_movement_motive || "-"}</td>
                                  <td className="py-3 px-4 text-center">{item.it_inventory_movement_description || "-"}</td>
                                  <td className="py-3 px-4 text-center">{statusText}</td>
                                  <td className="py-3 px-4 text-center flex flex-col md:flex-row justify-center gap-2">
                                    {status === 1 && (
                                      <button
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
                                        onClick={() => handleRemoveItem(m.cod_movement, item.cod_it_inventory)}
                                      >
                                        Desactivar activo
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteMovementItem(m.cod_movement, item.cod_it_inventory)}
                                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium"
                                    >
                                      Eliminar Activo
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No hay activos registrados en este movimiento.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {movements.length === 0 && (
        <p className="text-center text-gray-500 p-4">No hay movimientos registrados.</p>
      )}
    </div>
  );
};

export default TableMovementTI;
