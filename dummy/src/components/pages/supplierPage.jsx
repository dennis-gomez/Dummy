import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import TableSupplier from "../organisms/tableSupplier";
import SupplierForm from "../organisms/formSupplier";
import Seeker from "../molecules/seeker";
import Button from "../atoms/button";
import ModalAlert from "../molecules/modalAlert";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../../services/supplierService";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState("supplier_name");
  const [activeFilter, setActiveFilter] = useState("1"); // "1" = activos, "0" = inactivos

  // Campos disponibles para filtrar
  const fields = [
    { name: "supplier_name", placeholder: "Nombre del proveedor" },
    { name: "supplier_email", placeholder: "Correo electrónico" },
    { name: "supplier_phone", placeholder: "Teléfono" },
  ];

  // Cargar todos los proveedores aplicando filtro de activos/inactivos
  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      let data = await getAllSuppliers();

      // Convertir supplier_is_active a número por si acaso
      data = data.map(s => ({
        ...s,
        supplier_is_active: Number(s.supplier_is_active),
      }));

      // Filtrar por activo/inactivo
      if (activeFilter === "1") {
        data = data.filter(s => s.supplier_is_active === 1);
      } else if (activeFilter === "0") {
        data = data.filter(s => s.supplier_is_active === 0);
      }

      setSuppliers(data);
    } catch (error) {
      ModalAlert(
        "Error",
        error.message || "No se pudieron cargar los proveedores",
        "error",
        3000
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const text = searchText.trim().toLowerCase();
      let allSuppliers = await getAllSuppliers();

      // Convertir supplier_is_active a número
      allSuppliers = allSuppliers.map(s => ({
        ...s,
        supplier_is_active: Number(s.supplier_is_active),
      }));

      // Filtrar por activo/inactivo
      if (activeFilter === "1") {
        allSuppliers = allSuppliers.filter(s => s.supplier_is_active === 1);
      } else if (activeFilter === "0") {
        allSuppliers = allSuppliers.filter(s => s.supplier_is_active === 0);
      }

      const filtered = allSuppliers.filter((s) =>
        (s[searchFeature] || "").toString().toLowerCase().includes(text)
      );
      setSuppliers(filtered);
    } catch (error) {
      ModalAlert("Error", error.message || "Error al buscar proveedor", "error", 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Restaurar lista cuando se limpia el campo o cambia el filtro
  useEffect(() => {
    loadSuppliers();
  }, [searchText, activeFilter]);

  // Crear proveedor
  const handleAddSupplier = async (supplierData) => {
    try {
      await createSupplier(supplierData);
      ModalAlert("Éxito", "Proveedor agregado correctamente", "success", 2000);
      setShowForm(false);
      loadSuppliers();
    } catch (error) {
      ModalAlert("Error", error.message || "No se pudo agregar el proveedor", "error", 3000);
    }
  };

  // Actualizar proveedor
  const handleUpdateSupplier = async (id, supplierData) => {
    try {
      await updateSupplier(id, supplierData);
      ModalAlert("Éxito", "Proveedor actualizado correctamente", "success", 2000);
      loadSuppliers();
    } catch (error) {
      ModalAlert("Error", error.message || "No se pudo actualizar el proveedor", "error", 3000);
    }
  };

  // Eliminar proveedor
  const handleDeleteSupplier = async (id) => {
    try {
      await deleteSupplier(id);
      ModalAlert("Eliminado", "Proveedor deasctivado correctamente", "success", 2000);
      loadSuppliers();
    } catch (error) {
      ModalAlert("Error", error.message || "No se pudo desactivar el proveedor", "error", 3000);
    }
  };

  return (
    <div className="p-6 mt-6 rounded-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Proveedores
      </h1>

      {/* Formulario */}
      {showForm && (
        <div className="p-6 rounded-2xl mb-6 max-w-3xl mx-auto">
          <SupplierForm onAddSupplier={handleAddSupplier} />
        </div>
      )}

      {/* Buscador + Filtro + Botón agregar/cancelar */}
<div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4 items-center">
  {/* Buscador + Filtro */}
  <Box className="flex flex-1 flex-wrap gap-3 bg-white rounded-xl p-4 items-center">
    <Seeker
      inputName="search"
      inputPlaceholder="Buscar proveedor..."
      btnName="Buscar"
      selectName="Filtrar por"
      fields={fields}
      valueText={searchText}
      valueFeature={searchFeature}
      onChangeText={setSearchText}
      onChangeFeature={setSearchFeature}
      onClick={handleSearch}
    />

    {/* Filtro Activo/Inactivo */}
    <Box className="flex items-center gap-2 min-w-[150px]">
      <label htmlFor="activeFilter" className="font-medium">Estado:</label>
      <select
        id="activeFilter"
        value={activeFilter}
        onChange={(e) => setActiveFilter(e.target.value)}
        className="rounded-lg border p-2"
      >
        <option value="1">Activos</option>
        <option value="0">Inactivos</option>
      </select>
    </Box>
  </Box>

  {/* Botón Agregar/Cancelar */}
  <div className="flex-shrink-0">
    <Button
      text={showForm ? "Cancelar" : "Agregar Proveedor"}
      onClick={() => setShowForm(!showForm)}
      className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
    />
  </div>
</div>


      {/* Tabla */}
      {isLoading ? (
        <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
          <CircularProgress size={24} />
          <span>Cargando proveedores...</span>
        </div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-3xl mx-auto mb-4">
          No hay proveedores registrados
        </div>
      ) : (
        <TableSupplier
          suppliers={suppliers}
          onUpdateSupplier={handleUpdateSupplier}
          onChangeText={setSearchText}
          onDeleteSupplier={handleDeleteSupplier}
        />
      )}
    </div>
  );
};

export default SupplierPage;
