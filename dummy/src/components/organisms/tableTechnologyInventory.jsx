import { useState } from "react";
import {
  CircularProgress,
  Box,
} from "@mui/material";
import Button from "../atoms/button";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";
import Seeker from "../molecules/seeker";
import InputValidated from "../atoms/inputValidated";

function TechnologyInventoryTable({
  inventory = [],
  fields,
  editFields,
  loading,
  showForm,
  onToggleForm,

  getLabelByCode,
  categoryAssets,
  assets,
  brands,
  systemsOperative,
  offices,

  onChangeFeature,
  onSearch,
  valueText,
  valueFeature,

  onChangeText,

  onDelete,
  onEdit,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const handleValidatedDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Desactivar este registro?",
      text: "Podrás deshacer esta acción",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
    });

    if (result.isConfirmed) {
      await onDelete(id);
      Swal.fire("Desactivado", "El registro fue desactivado", "success");
    }
  };

  const handleEditClick = (record) => {
    setEditingId(record.cod_it_inventory);
    setEditData({ ...record });
  };

  const handleSaveEdit = async () => {
    const hasError = Object.values(fieldErrors).some((err) => err);
    if (hasError) {
        Swal.fire("Error", "Hay campos vacíos o inválidos.", "error");
        return;
    }
    
    const result = await Swal.fire({
        title: "¿Guardar cambios?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#9ca3af",
    });
    
    if (result.isConfirmed) {
        const isSaved = await onEdit(editingId, editData);
        if (isSaved) {
            setEditingId(null);
            setEditData({});
            setFieldErrors({});
            Swal.fire("Actualizado", "El activo fue modificado correctamente", "success");
        }
    } 
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setFieldErrors({});
  };

  return (
    <>
      {/* Barra superior */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
        {/* Buscador + botón */}
        <div className="flex items-center justify-center lg:justify-start lg:ml-9 w-full sm:w-auto">
          <Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
            <Seeker
              inputName="search"
              inputPlaceholder="Buscar..."
              btnName="Buscar"
              selectName="Filtrar por"
              fields={editFields}
              valueText={valueText}
              valueFeature={valueFeature}
              onChangeText={onChangeText}
              onChangeFeature={onChangeFeature}
              onClick={onSearch}
            />
          </Box>
          <div className="p-5 h-fit">
            <Button
              text={showForm ? "Cancelar" : "Agregar Activo"}
              onClick={onToggleForm}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto mb-4">
          <CircularProgress size={24} />
          <span>Cargando activos...</span>
        </div>
      )}

      {/* Sin registros */}
      {!loading && inventory.length === 0 && (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
          No se encontraron activos
        </div>
      )}

      {/* Tabla */}
      {!loading && inventory.length > 0 && (
        <div className="overflow-x-auto rounded-xl shadow-lg mt-4 w-full">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md rounded-tl-xl">#</th>
                <th className="py-4 px-6 text-center font-semibold">N° Serie</th>
                <th className="py-4 px-6 text-center font-semibold">Placa</th>
                <th className="py-4 px-6 text-center font-semibold">Estado</th>
                <th className="py-4 px-6 text-center font-semibold">Encargado</th>
                <th className="py-4 px-6 text-center font-semibold">Correo</th>
                <th className="py-4 px-6 text-center font-semibold">Etiqueta</th>
                <th className="py-4 px-6 text-center font-semibold">Departamento / Gerente de Producto</th>
                <th className="py-4 px-6 text-center font-semibold">Categoría</th>
                <th className="py-4 px-6 text-center font-semibold">Tipo</th>
                <th className="py-4 px-6 text-center font-semibold">Marca</th>
                <th className="py-4 px-6 text-center font-semibold">Modelo</th>
                <th className="py-4 px-6 text-center font-semibold">Sistema Operativo</th>
                <th className="py-4 px-6 text-center font-semibold">RAM</th>
                <th className="py-4 px-6 text-center font-semibold">Disco</th>
                <th className="py-4 px-6 text-center font-semibold">Procesador</th>
                <th className="py-4 px-6 text-center font-semibold">Oficina</th>
                <th className="py-4 px-6 text-center font-semibold">Cliente</th>
                <th className="py-4 px-6 text-center font-semibold">Leasing</th>
                <th className="py-4 px-6 text-center font-semibold">Detalles Leasing</th>
                <th className="py-4 px-6 text-center font-semibold">Observaciones</th>
                <th className="py-4 px-6 text-center font-semibold rounded-tr-xl">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {inventory.map((item, index) => {
                const isEditing = editingId === item.cod_it_inventory;
                return (
                  <tr key={item.it_inventory_id || index} className="hover:bg-blue-50 even:bg-gray-50">
                    <td className="py-3 px-4 text-center">{index + 1}</td>

                    {isEditing ? (
                      <>
                        {editFields.map((field) => (
                          <td key={field.name} className="py-4 px-6 text-center">
                            <InputValidated
                              name={field.name}
                              type={field.type || "text"}
                              value={editData[field.name] || ""}
                              placeholder={field.placeholder}
                              options={field.options || []}
                              restriction={field.restriction}
                              required={field.required}
                              validations={field.validations}
                              onChange={(e) =>
                                setEditData({ ...editData, [field.name]: e.target.value })
                              }
                              onError={(name, errorMsg) =>
                                setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }))
                              }
                              sx={{
                                "& .MuiInputBase-input": {
                                  backgroundColor: "#fff !important",
                                  ...(field.type === "textarea" ? { resize: "vertical" } : {}),
                                },
                                ...(field.width ? { width: field.width } : {}),
                              }}
                              formValues={editData}
                            />
                          </td>
                        ))}
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={handleSaveEdit}
                              disabled={Object.values(fieldErrors).some((err) => err)}
                              className={`rounded-lg px-3 py-2 flex items-center text-sm transition ${
                                Object.values(fieldErrors).some((err) => err)
                                  ? "bg-gray-400 cursor-not-allowed text-white"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                            >
                              <SaveIcon fontSize="small" className="mr-1" /> Guardar
                            </button>

                            <button
                              onClick={handleCancelEdit}
                              className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 flex items-center text-sm"
                            >
                              <CancelIcon fontSize="small" className="mr-1" /> Cancelar
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 text-center">{item.it_inventory_serial_number}</td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_plate}</td>
                        <td className="py-3 px-4 text-center">
                          {item.it_inventory_status === 1
                            ? "Activo"
                            : item.it_inventory_status === 2
                            ? "Inactivo"
                            : item.it_inventory_status === 3
                            ? "En Reparación"
                            : item.it_inventory_status === 4
                            ? "En Almacén"
                            : item.it_inventory_status === 5
                            ? "Perdido"
                            : "Otro"}
                        </td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_in_charge}</td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_email}</td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_label}</td>
                        <td className="py-3 px-4 text-center">
                          {item.it_inventory_department_or_product_manager}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getLabelByCode(categoryAssets, item.it_inventory_asset_category_code)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getLabelByCode(assets, item.it_inventory_asset_item_code)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getLabelByCode(brands, item.it_inventory_brand_item_code)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.it_inventory_model}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getLabelByCode(systemsOperative, item.it_inventory_so_item_code)}
                        </td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_RAM}</td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_disk_capacity}</td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_processor}</td>
                        <td className="py-3 px-4 text-center">
                          {getLabelByCode(offices, item.it_inventory_office_item_code)}
                        </td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_client}</td>
                        <td className="py-3 px-4 text-center">
                            {item.it_inventory_leasing ? "Sí" : "No"}
                        </td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_leasing_details}</td>
                        <td className="py-3 px-4 text-center">{item.it_inventory_observations}</td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center space-x-3">
                            <button
                            onClick={() => handleEditClick(item)}
                            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                            >
                              <EditIcon fontSize="small" />
                            </button>
                            <button
                              onClick={() => handleValidatedDelete(item.cod_it_inventory)}
                              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default TechnologyInventoryTable;
