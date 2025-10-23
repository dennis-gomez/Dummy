import React, { useState, useEffect } from "react";
import { getTechnologyInventory } from "../../services/technologyInventoryService";
import { createMovement } from "../../services/movementTIService";
import Box from "@mui/material/Box";
import AssetSelectorTI from "./AssetSelectorTI";

const FormMovementTI = ({
  onSubmit,
  initialData = {},
  categoryAssets = [],
  assets = [],
  brands = [],
  offices = [],
  systemsOperative = [],
}) => {
  const [form, setForm] = useState({
    movement_date: initialData.movement_date || "",
    movement_owner: initialData.movement_owner || "",
    movement_delivered_by: initialData.movement_delivered_by || "",
    movement_delivered_to: initialData.movement_delivered_to || "",
    movement_observations: initialData.movement_observations || "",
    selectedAssets: initialData.selectedAssets || [], // Ahora objetos completos, no solo IDs
  });

  const [availableAssets, setAvailableAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    brand: "all",
    office: "all",
    so: "all",
  });

  // Definir los motivos posibles
  const movementMotives = [
    { id: 1, description: "Traslado" },
    { id: 2, description: "Ajuste de Inventario" },
    { id: 3, description: "Devolución" },
    { id: 4, description: "Venta" },
    { id: 5, description: "Donación" },
  ];

  // 🔹 Cargar activos disponibles
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await getTechnologyInventory();
        const data = response.data || response;
        const activos = data.filter(
          (asset) => Number(asset.it_inventory_status) === 1
        );
        setAvailableAssets(activos);
        console.log("Activos cargados:", activos);
      } catch (err) {
        console.error("Error al cargar activos disponibles:", err);
      }
    };
    loadAssets();
  }, []);

  // 🔹 Función para manejar selección de activos (similar a AssetModalButton)
  const handleSelectAsset = (assetId) => {
    console.log("🔄 Intentando seleccionar activo ID:", assetId);
    
    const assetToAdd = availableAssets.find(asset => asset.cod_it_inventory === assetId);
    
    if (!assetToAdd) {
      console.error("❌ No se encontró el activo con ID:", assetId);
      return;
    }

    const isAlreadySelected = form.selectedAssets.some(
      selected => selected.cod_it_inventory === assetId
    );

    if (isAlreadySelected) {
      setForm(prev => ({
        ...prev,
        selectedAssets: prev.selectedAssets.filter(
          selected => selected.cod_it_inventory !== assetId
        )
      }));
    } else {
      const assetWithMovementFields = {
        ...assetToAdd,
        it_inventory_movement_motive: "",
        it_inventory_movement_description: ""
      };
      
      setForm(prev => ({
        ...prev,
        selectedAssets: [...prev.selectedAssets, assetWithMovementFields]
      }));
    }
  };

  // 🔹 Función para actualizar campos específicos de activos
  const handleAssetChange = (assetId, field, value) => {
    setForm(prevState => {
      const updatedAssets = prevState.selectedAssets.map(asset => {
        if (asset.cod_it_inventory === assetId) {
          return { 
            ...asset,
            [field]: value 
          };
        }
        return asset;
      });

      return { ...prevState, selectedAssets: updatedAssets };
    });
  };

  // 🔹 Función para verificar si un activo tiene todos los campos requeridos
  const isAssetValid = (asset) => {
    return asset.cod_it_inventory && 
           asset.it_inventory_movement_motive && 
           asset.it_inventory_movement_description;
  };

  // 🔸 Manejo de cambios en inputs del movimiento
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔸 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.selectedAssets.length === 0) {
      alert("Debes seleccionar al menos un activo para el movimiento.");
      return;
    }

    // 🔹 Verificar que todos los activos tengan los campos requeridos
    const invalidAssets = form.selectedAssets.filter(asset => !isAssetValid(asset));
    if (invalidAssets.length > 0) {
      alert("❌ Todos los activos deben tener los campos 'motivo' y 'descripción' completos.");
      return;
    }

    setLoading(true);
    try {
      const items = form.selectedAssets.map((asset) => ({
        cod_it_inventory: asset.cod_it_inventory,
        it_inventory_movement_motive: asset.it_inventory_movement_motive, // Motivo individual por activo
        it_inventory_movement_description: asset.it_inventory_movement_description, // Descripción individual
        it_inventory_movement_is_active: true,
      }));

      const movementData = {
        movement_date: form.movement_date,
        movement_owner: form.movement_owner,
        movement_delivered_by: form.movement_delivered_by,
        movement_delivered_to: form.movement_delivered_to,
        movement_observations: form.movement_observations,
        items,
      };

      console.log("Datos a enviar:", movementData);

      await createMovement(movementData);
      alert("✅ Movimiento creado exitosamente.");

      if (typeof onSubmit === "function") onSubmit(form);

      // Reset
      setForm({
        movement_date: "",
        movement_owner: "",
        movement_delivered_by: "",
        movement_delivered_to: "",
        movement_observations: "",
        selectedAssets: [],
      });
      setFilters({
        category: "all",
        type: "all",
        brand: "all",
        office: "all",
        so: "all",
      });
    } catch (err) {
      console.error("Error al crear movimiento:", err.response?.data || err.message);
      alert("❌ Ocurrió un error al crear el movimiento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        backgroundColor: "#d9d9d9",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: 3,
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h2 className="text-xl text-center font-bold mb-4 text-gray-700">
        Registrar Movimiento
      </h2>

      {/* 🧾 Datos del movimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
          <input
            type="date"
            name="movement_date"
            value={form.movement_date}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
          <input
            type="text"
            name="movement_owner"
            value={form.movement_owner}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entregado por *</label>
          <input
            type="text"
            name="movement_delivered_by"
            value={form.movement_delivered_by}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entregado a *</label>
          <input
            type="text"
            name="movement_delivered_to"
            value={form.movement_delivered_to}
            onChange={handleChange}
            required
            className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
        <textarea
          name="movement_observations"
          value={form.movement_observations}
          onChange={handleChange}
          placeholder="Observaciones generales del movimiento..."
          className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="2"
        />
      </div>

      {/* 🧩 Componente AssetSelectorTI con la nueva funcionalidad */}
      <AssetSelectorTI
        availableAssets={availableAssets}
        categoryAssets={categoryAssets}
        assets={assets}
        brands={brands}
        offices={offices}
        systemsOperative={systemsOperative}
        filters={filters}
        setFilters={setFilters}
        form={form}
        setForm={setForm}
        onSelectAsset={handleSelectAsset}
      />

      {/* 🔹 Sección de detalles del activo (similar a AssetModalButton) */}
      {form.selectedAssets.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Detalles del Activo</h3>
          
          {form.selectedAssets.map((asset) => (
            <div 
              key={asset.cod_it_inventory} 
              className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              {/* Información del activo */}
              <div className="mb-3 pb-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-700">
                  {asset.it_inventory_name || asset.it_inventory_serial_number || "Sin nombre"} - {asset.it_inventory_serial || "Sin serial"}
                </h4>
                <p className="text-sm text-gray-500">
                  Código: {asset.cod_it_inventory}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Modelo: {asset.it_inventory_model || "N/A"} | 
                  Placa: {asset.it_inventory_plate || asset.it_inventory_plaque || "N/A"}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo *
                  </label>
                  <select
                    value={asset.it_inventory_movement_motive || ""}
                    onChange={(e) => handleAssetChange(asset.cod_it_inventory, "it_inventory_movement_motive", e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccionar motivo</option>
                    {movementMotives.map((motive) => (
                      <option key={motive.id} value={motive.id}>
                        {motive.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    value={asset.it_inventory_movement_description || ""}
                    onChange={(e) => handleAssetChange(asset.cod_it_inventory, "it_inventory_movement_description", e.target.value)}
                    placeholder="Ingrese la descripción del movimiento para este activo..."
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>
              </div>

              {!isAssetValid(asset) && (
                <p className="text-red-500 text-xs mt-2">
                  ⚠ Complete todos los campos requeridos para este activo
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Botón guardar */}
      <div className="flex justify-center mt-6">
        <button
          type="submit"
          disabled={loading || form.selectedAssets.length === 0 || form.selectedAssets.some(asset => !isAssetValid(asset))}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
        >
          {loading ? "Guardando..." : `Guardar Movimiento (${form.selectedAssets.length})`}
        </button>
      </div>
    </Box>
  );
};

export default FormMovementTI;