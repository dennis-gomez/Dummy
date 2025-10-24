import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AssetModalButton from "../molecules/modalAssetSelector";
import ModalAlert from "../molecules/modalAlert";
import ModalElimination from "../molecules/modalElimination";
import ModalConfirmation from "../molecules/modalConfirmation";

import {
  getInventoryMovementById,
  deleteInventoryMovement,
  destroyInventoryMovement
} from "../../services/inventoryMovementTIService";
import { deleteMovement } from "../../services/movementTIService";

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
    if (editingId && firstInputRef.current) firstInputRef.current.focus();
  }, [editingId]);

  const handleEditClick = (movement) => {
    setEditingId(movement.cod_movement);
    setEditForm({ ...movement });
  };

  const handleCancel = () => setEditingId(null);

  const handleSave = async () => {
    const requiredFields = ["movement_date", "movement_owner", "movement_delivered_by", "movement_delivered_to"];
    for (let field of requiredFields) {
      if (!editForm[field]?.trim()) {
        ModalAlert("Error", `El campo "${field}" es obligatorio`, "error", 2000);
        return;
      }
    }

    try {
      await onUpdate(editingId, editForm);
      setEditingId(null);
      ModalAlert("Éxito", "Movimiento actualizado correctamente", "success", 2000);
    } catch (error) {
      console.error("Error al actualizar movimiento:", error);
      ModalAlert("Error", "No se pudo actualizar el movimiento", "error", 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleExpand = async (id) => {
    if (expandedRows.includes(id)) {
      setExpandedRows((prev) => prev.filter((rowId) => rowId !== id));
    } else {
      setExpandedRows((prev) => [...prev, id]);
      if (!movementAssets[id]) {
        try {
          const res = await getInventoryMovementById(id);
          setMovementAssets((prev) => ({ ...prev, [id]: res || [] }));
        } catch (err) {
          console.error("Error al obtener activos del movimiento:", err);
          ModalAlert("Error", "No se pudieron cargar los activos del movimiento", "error", 3000);
        }
      }
    }
  };

  const handleDeleteMovement = async (cod_movement) => {
    try {
      await deleteMovement(cod_movement);
      onDelete(cod_movement);
      ModalAlert("Eliminado", "Movimiento eliminado correctamente", "success", 2000);
    } catch (err) {
      console.error(err);
      ModalAlert("Error", "No se pudo eliminar el movimiento", "error", 3000);
    }
  };

  const handleDeleteMovementItem = async (cod_movement, cod_it_inventory, status) => {
    // Validar que el activo esté inactivo antes de eliminar
    if (status === 1) {
      ModalAlert("Error", "Primero debe desactivar el activo antes de eliminarlo", "warning", 3000);
      return;
    }

    try {
      const result = await destroyInventoryMovement(cod_movement, cod_it_inventory);
      if (result?.success === false) {
        ModalAlert("Error", result.message || "No se pudo eliminar el activo", "error", 3000);
        return;
      }
      const res = await getInventoryMovementById(cod_movement);
      setMovementAssets((prev) => ({ ...prev, [cod_movement]: res }));
      ModalAlert("Éxito", "Activo eliminado correctamente", "success", 2000);
    } catch (err) {
      console.error(err);
      ModalAlert("Error", "Hubo un error al eliminar el activo", "error", 3000);
    }
  };

  const handleRemoveItem = async (cod_movement, cod_it_inventory) => {
    try {
      await deleteInventoryMovement(cod_movement, cod_it_inventory);
      const res = await getInventoryMovementById(cod_movement);
      setMovementAssets((prev) => ({ ...prev, [cod_movement]: res }));
      ModalAlert("Éxito", "Activo desactivado correctamente", "success", 2000);
    } catch (err) {
      console.error(err);
      ModalAlert("Error", "No se pudo desactivar el activo", "error", 3000);
    }
  };

  return (
    <div className="overflow-x-auto bg-white  rounded-2xl p-6 max-w-full mx-auto">
      <table className="min-w-full table-auto shadow-lg">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white ">
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
              <tr className={`hover:bg-blue-50 even:bg-gray-50 ${editingId === m.cod_movement ? "bg-blue-100" : ""}`}>
                <td className="py-3 px-4 text-center">{m.cod_movement}</td>

                {editingId === m.cod_movement ? (
                  <>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="date"
                        name="movement_date"
                        value={editForm.movement_date || ""}
                        onChange={handleInputChange}
                        ref={firstInputRef}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        name="movement_owner"
                        value={editForm.movement_owner || ""}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        name="movement_delivered_by"
                        value={editForm.movement_delivered_by || ""}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        name="movement_delivered_to"
                        value={editForm.movement_delivered_to || ""}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="text"
                        name="movement_observations"
                        value={editForm.movement_observations || ""}
                        onChange={handleInputChange}
                        className="border rounded px-3 py-2 w-full"
                      />
                    </td>
                    <td className="py-3 px-4 text-center flex gap-2 justify-center">
                      <ModalConfirmation
                        message="¿Está seguro que desea guardar los cambios en este movimiento?"
                        onClick={handleSave}
                        confirmText="Guardar"
                        title="Confirmar Guardado"
                        icon="question"
                        buttonVariant="primary"
                      />
                      <button
                        onClick={handleCancel}
                        className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm"
                      >
                        <CancelIcon className="mr-1" fontSize="small" /> Cancelar
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
                    <td className="py-3 px-4 text-center flex gap-2 justify-center">
                      <Tooltip title={expandedRows.includes(m.cod_movement) ? "Ocultar activos" : "Ver activos"}>
                        <button
                          onClick={() => toggleExpand(m.cod_movement)}
                          className="text-purple-600 hover:text-purple-700 transition-colors p-1"
                        >
                          {/* Cambio de ícono dinámico */}
                          {expandedRows.includes(m.cod_movement) ? (
                            <VisibilityOffIcon fontSize="medium" />
                          ) : (
                            <VisibilityIcon fontSize="medium" />
                          )}
                        </button>
                      </Tooltip>
                      <Tooltip title="Editar movimiento">
                        <button
                          onClick={() => handleEditClick(m)}
                          className="text-blue-600 hover:text-blue-700 transition-colors p-1"
                        >
                          <EditIcon fontSize="medium" />
                        </button>
                      </Tooltip>
                      <Tooltip title="Eliminar movimiento">
                        <ModalElimination
                          message="¿Está seguro que desea eliminar este movimiento?"
                          onClick={() => handleDeleteMovement(m.cod_movement)}
                          confirmText="Sí, Eliminar"
                        />
                      </Tooltip>
                    </td>
                  </>
                )}
              </tr>

              {/* Filas de activos */}
              {expandedRows.includes(m.cod_movement) && (
                <tr className="bg-gray-50">
                  <td colSpan="7" className="p-4">
                    <div className="rounded-lg bg-white p-4 shadow-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-700 text-lg">Activos en este movimiento:</h4>
                        <AssetModalButton
                          movementId={m.cod_movement}
                          onAssetsSelected={async () => {
                            try {
                              const res = await getInventoryMovementById(m.cod_movement);
                              setMovementAssets((prev) => ({ ...prev, [m.cod_movement]: res }));
                              ModalAlert("Éxito", "Activos actualizados correctamente", "success", 2000);
                            } catch (error) {
                              console.error("Error al cargar activos:", error);
                              ModalAlert("Error", "No se pudieron cargar los activos actualizados", "error", 3000);
                            }
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
                            {movementAssets[m.cod_movement].map((item, idx) => {
                              const status = Number(item.it_inventory_movement_is_active);
                              return (
                                <tr key={`${m.cod_movement}-${idx}`} className={status === 0 ? "bg-red-100" : ""}>
                                  <td className="py-3 px-4 text-center">{item.cod_it_inventory || "-"}</td>
                                  <td className="py-3 px-4 text-center">{item.it_inventory_movement_motive || "-"}</td>
                                  <td className="py-3 px-4 text-center">{item.it_inventory_movement_description || "-"}</td>
                                  <td className="py-3 px-4 text-center">{status === 1 ? "Activo" : "Inactivo"}</td>
                                  <td className="py-3 px-4 text-center flex gap-2 justify-center">
                                    {status === 1 && (
                                      <Tooltip title="Desactivar activo">
                                        <button
                                          onClick={() => handleRemoveItem(m.cod_movement, item.cod_it_inventory)}
                                          className="text-yellow-500 hover:text-yellow-600 transition-colors p-1"
                                        >
                                          <CloseIcon fontSize="medium" />
                                        </button>
                                      </Tooltip>
                                    )}
                                    <Tooltip title={status === 1 ? "Debe desactivar el activo primero" : "Eliminar activo"}>
                                      <span>
                                        <ModalElimination
                                          message="¿Está seguro que desea eliminar permanentemente este activo del movimiento?"
                                          onClick={() => handleDeleteMovementItem(m.cod_movement, item.cod_it_inventory, status)}
                                          disabled={status === 1}
                                          confirmText="Sí, Eliminar"
                                        />
                                      </span>
                                    </Tooltip>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-gray-500 text-sm">No hay activos registrados en este movimiento.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {movements.length === 0 && <p className="text-center text-gray-500 p-4">No hay movimientos registrados.</p>}
    </div>
  );
};

export default TableMovementTI;