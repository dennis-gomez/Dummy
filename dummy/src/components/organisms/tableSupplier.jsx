import { useState } from "react";
import { Tooltip, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalAlert from "../molecules/modalAlert";
import ModalElimination from "../molecules/modalElimination";
import InputValidated from "../atoms/inputValidatedSupplier";

function TableSupplier({ suppliers, onUpdateSupplier, onDeleteSupplier, isLoading }) {
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "supplier_name":
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 3) return "Debe tener al menos 3 caracteres";
        return "";
      case "supplier_phone":
        if (!value.trim()) return "El teléfono es obligatorio";
        const phoneRegex = /^[0-9\-+()]{8,15}$/;
        if (!phoneRegex.test(value)) return "Formato de teléfono inválido";
        return "";
      case "supplier_email":
        if (!value.trim()) return "El correo es obligatorio";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Correo inválido";
        return "";
      default:
        return "";
    }
  };

  const handleEditClick = (supplier) => {
    setEditRowId(supplier.cod_supplier);
    setEditData({ ...supplier });
    setErrors({});
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditData({});
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));

    // Validación en tiempo real
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const tempErrors = {};
    Object.keys(editData).forEach((key) => {
      const error = validateField(key, editData[key]);
      if (error) tempErrors[key] = error;
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await onUpdateSupplier(editRowId, editData);
      ModalAlert("Éxito", "Proveedor actualizado correctamente", "success", 2000);
      setEditRowId(null);
      setEditData({});
      setErrors({});
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
            <th className="py-4 px-6 text-center font-semibold text-md rounded-tr-xl">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier, index) => (
            <tr
              key={supplier.cod_supplier}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
            >
              <td className="py-4 px-6 text-center font-medium">
                {supplier.supplier_code || `PROV-${supplier.cod_supplier}`}
              </td>

              {/* Nombre */}
              <td className="py-4 px-6 text-center min-w-[180px] sm:min-w-[200px]">
                {editRowId === supplier.cod_supplier ? (
                  <div className="w-full">
                    <InputValidated
                      name="supplier_name"
                      value={editData.supplier_name || ""}
                      onChange={handleChange}
                      placeholder="Nombre"
                      label="Nombre"
                      error={errors.supplier_name}
                      sx={{ width: "100%" }}
                    />
                  </div>
                ) : (
                  <span className="block truncate">{supplier.supplier_name}</span>
                )}
              </td>

              {/* Teléfono */}
              <td className="py-4 px-6 text-center min-w-[180px] sm:min-w-[200px]">
                {editRowId === supplier.cod_supplier ? (
                  <div className="w-full">
                    <InputValidated
                      name="supplier_phone"
                      value={editData.supplier_phone || ""}
                      onChange={handleChange}
                      placeholder="Teléfono"
                      label="Teléfono"
                      error={errors.supplier_phone}
                      validationRules={{ phone: true, maxLength: 15 }}
                      sx={{ width: "100%" }}
                    />
                  </div>
                ) : (
                  <span className="block truncate">{supplier.supplier_phone}</span>
                )}
              </td>


              {/* Correo */}
              <td className="py-4 px-6 text-center">
                {editRowId === supplier.cod_supplier ? (
                  <InputValidated
                    name="supplier_email"
                    value={editData.supplier_email || ""}
                    onChange={handleChange}
                    placeholder="Correo"
                    label="Correo"
                    type="email"
                    error={errors.supplier_email}
                  />
                ) : (
                  supplier.supplier_email
                )}
              </td>

              {/* Fecha */}
              <td className="py-4 px-6 text-center">
                {supplier.supplier_date
                  ? new Date(supplier.supplier_date + "T00:00:00Z")
                    .toLocaleDateString("es-CR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      timeZone: "UTC",
                    })
                    .replace(/\//g, "-")
                  : "—"}
              </td>

              {/* Acciones */}
              <td className="py-4 px-6 text-center flex gap-3 justify-center ">
                {editRowId === supplier.cod_supplier ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center hover:bg-blue-700"
                    >
                      <SaveIcon className="mr-1" fontSize="small" /> Guardar
                    </button>

                    <button
                      onClick={handleCancel}
                      className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition flex items-center text-sm"
                    >
                      <CancelIcon className="mr-1" fontSize="small" /> Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <Tooltip title="Editar proveedor">
                      <button
                        onClick={() => handleEditClick(supplier)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <EditIcon />
                      </button>
                    </Tooltip>

                    <Tooltip title="Eliminar proveedor">
                      <ModalElimination
                        message={`¿Deseas desactivar al proveedor "${supplier.supplier_name}"?`}
                        confirmText="Desactivar"
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
