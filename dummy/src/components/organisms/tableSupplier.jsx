import { useState } from "react";
import {
  IconButton,
  Tooltip,
  TextField,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import ModalAlert from "../molecules/ModalAlert";
import ModalElimination from "../molecules/ModalElimination";

function TableSupplier({ suppliers, onUpdateSupplier, onDeleteSupplier, isLoading }) {
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (supplier) => {
    setEditRowId(supplier.cod_supplier);
    setEditData({ ...supplier });
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await onUpdateSupplier(editRowId, editData);
      ModalAlert("Éxito", "Proveedor actualizado correctamente", "success", 2000);
      setEditRowId(null);
      setEditData({});
    } catch (error) {
      ModalAlert(
        "Error",
        error.message || "No se pudo actualizar el proveedor",
        "error",
        3000
      );
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
        <CircularProgress size={24} />
        <span>Cargando proveedores...</span>
      </div>
    );
  }
  if (suppliers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
        No hay proveedores registrados
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl shadow-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <th className="py-4 px-6 text-center font-semibold text-md">Código</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Nombre</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Teléfono</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Correo</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Fecha Registro</th>
            <th className="py-4 px-6 text-center font-semibold text-md">Activo</th>
            <th className="py-4 px-6 text-center font-semibold text-md rounded-tr-xl">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier, index) => (
            <tr
              key={supplier.cod_supplier}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
            >
              <td className="py-4 px-6 text-center font-medium">
                {supplier.supplier_code || `PROV-${supplier.cod_supplier}`}
              </td>
              <td className="py-4 px-6 text-center">
                {editRowId === supplier.cod_supplier ? (
                  <TextField
                    size="small"
                    value={editData.supplier_name || ""}
                    onChange={(e) => handleChange("supplier_name", e.target.value)}
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  supplier.supplier_name
                )}
              </td>
              <td className="py-4 px-6 text-center">
                {editRowId === supplier.cod_supplier ? (
                  <TextField
                    size="small"
                    value={editData.supplier_phone || ""}
                    onChange={(e) => handleChange("supplier_phone", e.target.value)}
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  supplier.supplier_phone
                )}
              </td>
              <td className="py-4 px-6 text-center">
                {editRowId === supplier.cod_supplier ? (
                  <TextField
                    size="small"
                    value={editData.supplier_email || ""}
                    onChange={(e) => handleChange("supplier_email", e.target.value)}
                    sx={{ backgroundColor: "white", borderRadius: 1 }}
                  />
                ) : (
                  supplier.supplier_email
                )}
              </td>
              <td className="py-4 px-6 text-center">
                {supplier.supplier_date
                  ? new Date(
                    supplier.supplier_date + "T00:00:00Z"
                  )
                    .toLocaleDateString("es-CR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      timeZone: "UTC",
                    })
                    .replace(/\//g, "-")
                  : "—"}
              </td>
              <td className="py-4 px-6 text-center">
                {editRowId === supplier.cod_supplier ? (
                  <select
                    value={editData.supplier_is_active ? 1 : 0}
                    onChange={(e) =>
                      handleChange("supplier_is_active", e.target.value === "1")
                    }
                    className="border rounded-md p-1"
                  >
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                ) : supplier.supplier_is_active ? (
                  <span className="text-green-600 font-semibold">Sí</span>
                ) : (
                  <span className="text-red-600 font-semibold">No</span>
                )}
              </td>

              {/* Acciones */}
              <td className="py-4 px-6 text-center flex gap-2 justify-center">
                {editRowId === supplier.cod_supplier ? (
                  <>
                    <Tooltip title="Guardar">
                      <IconButton onClick={handleSave} sx={{ color: "primary.main" }}>
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Cancelar">
                      <IconButton onClick={handleCancel} sx={{ color: "error.main" }}>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => handleEditClick(supplier)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <ModalElimination
                        message={`¿Deseas eliminar al proveedor "${supplier.supplier_name}"?`}
                        onClick={async () => {
                          try {
                            await onDeleteSupplier(supplier.cod_supplier);
                            ModalAlert(
                              "Eliminado",
                              "Proveedor eliminado correctamente",
                              "success",
                              2000
                            );
                          } catch (error) {
                            ModalAlert(
                              "Error",
                              error.message || "Error al eliminar el proveedor",
                              "error",
                              3000
                            );
                          }
                        }}
                      />
                    </Tooltip>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableSupplier;
