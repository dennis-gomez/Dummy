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
  
  // Si tuvieras un endpoint para búsquedas, lo puedes agregar aquí
  // searchSupplier,
} from "../../services/supplierService";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState("supplier_name");

  // Campos disponibles para filtrar
  const fields = [
    { name: "supplier_name", placeholder: "Nombre del proveedor" },
    { name: "supplier_email", placeholder: "Correo electrónico" },
    { name: "supplier_phone", placeholder: "Teléfono" },
  ];

  // Cargar todos los proveedores
  const loadSuppliers = async () => {
    try {
      setIsLoading(true);
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (error) {
      ModalAlert("Error", error.message || "No se pudieron cargar los proveedores", "error", 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadSuppliers();
      return;
    }

    try {
      setIsLoading(true);
      const text = searchText.trim().toLowerCase();
      const allSuppliers = await getAllSuppliers();
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

  // Restaurar lista cuando se limpia el campo
  useEffect(() => {
    if (!searchText.trim()) {
      loadSuppliers();
    }
  }, [searchText]);

  //Crear proveedor
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
      ModalAlert("Eliminado", "Proveedor eliminado correctamente", "success", 2000);
      loadSuppliers();
    } catch (error) {
      ModalAlert("Error", error.message || "No se pudo eliminar el proveedor", "error", 3000);
    }
  };

  // Cargar datos al iniciar
  useEffect(() => {
    loadSuppliers();
  }, []);

  return (
    <div className="p-6 mt-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gesti&oacute;n de Proveedores</h1>
       {/* Formulario */}
      {showForm && (
        <div className="p-6 rounded-2xl  mb-6 max-w-3xl mx-auto">
          <SupplierForm onAddSupplier={handleAddSupplier} />
        </div>
      )}
      {/* Buscador + Botón agregar/cancelar */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
        {/* Buscador */}
        <Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
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
        </Box>
        {/* Botón Agregar/Cancelar */}
        <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
          <div className="p-4 h-fit">
            <Button
              text={showForm ? "Cancelar" : "Agregar Proveedor"}
              onClick={() => setShowForm(!showForm)}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
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
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <TableSupplier
            suppliers={suppliers}
            onUpdateSupplier={handleUpdateSupplier}
            onChangeText={setSearchText}
            onDeleteSupplier={handleDeleteSupplier}
          />
        </div>
      )}
    </div>
  );
};

export default SupplierPage;
