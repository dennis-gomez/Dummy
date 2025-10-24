import React, { useState, useEffect } from "react";
import { getTechnologyInventory } from "../../services/technologyInventoryService";
import { createMovement } from "../../services/movementTIService";
import Box from "@mui/material/Box";
import AssetSelectorTI from "./AssetSelectorTI";
import ModalAlert from "../molecules/modalAlert";
import ModalConfirmation from "../molecules/modalConfirmation";
import InputMovement from "../atoms/inputMovement";

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
    selectedAssets: initialData.selectedAssets || [],
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

  const movementMotives = [
    { id: 1, description: "Traslado" },
    { id: 2, description: "Ajuste de Inventario" },
    { id: 3, description: "Devolución" },
    { id: 4, description: "Venta" },
    { id: 5, description: "Donación" },
  ];

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const response = await getTechnologyInventory();
        const data = response.data || response;
        const activos = data.filter(
          (asset) => Number(asset.it_inventory_status) === 1
        );
        setAvailableAssets(activos);
      } catch (err) {
        console.error("Error al cargar activos:", err);
        ModalAlert(
          "Error",
          "No se pudieron cargar los activos disponibles",
          "error",
          3000
        );
      }
    };
    loadAssets();
  }, []);

  const handleSelectAsset = (assetId) => {
    const assetToAdd = availableAssets.find(
      (asset) => asset.cod_it_inventory === assetId
    );

    if (!assetToAdd) {
      ModalAlert("Error", "No se encontró el activo seleccionado", "error", 2000);
      return;
    }

    const isAlreadySelected = form.selectedAssets.some(
      (selected) => selected.cod_it_inventory === assetId
    );

    if (isAlreadySelected) {
      setForm((prev) => ({
        ...prev,
        selectedAssets: prev.selectedAssets.filter(
          (selected) => selected.cod_it_inventory !== assetId
        ),
      }));
      ModalAlert("Eliminado", "Activo removido de la selección", "info", 1500);
    } else {
      const assetWithMovementFields = {
        ...assetToAdd,
        it_inventory_movement_motive: "",
        it_inventory_movement_description: "",
      };

      setForm((prev) => ({
        ...prev,
        selectedAssets: [...prev.selectedAssets, assetWithMovementFields],
      }));
      ModalAlert("Agregado", "Activo agregado a la selección", "success", 1500);
    }
  };

  const handleAssetChange = (assetId, field, value) => {
    setForm((prev) => {
      const updatedAssets = prev.selectedAssets.map((asset) => {
        if (asset.cod_it_inventory === assetId) {
          return { ...asset, [field]: value };
        }
        return asset;
      });
      return { ...prev, selectedAssets: updatedAssets };
    });
  };

  const isAssetValid = (asset) =>
    asset.cod_it_inventory &&
    asset.it_inventory_movement_motive &&
    asset.it_inventory_movement_description;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const validateForm = () => {
  // Mapeo de nombres de campos a etiquetas legibles
  const fieldLabels = {
    movement_date: "Fecha",
    movement_owner: "Responsable",
    movement_delivered_by: "Entregado por",
    movement_delivered_to: "Entregado a",
  };

  // Validar los campos obligatorios del movimiento
  for (let field in fieldLabels) {
    const value = form[field];
    const strValue = value != null ? String(value) : "";

    if (strValue.trim() === "") {
      ModalAlert(
        "Error",
        `El campo "${fieldLabels[field]}" es obligatorio`,
        "error",
        3000
      );
      return false;
    }
  }

  // Validar selección de activos
  if (form.selectedAssets.length === 0) {
    ModalAlert(
      "Error",
      "Debes seleccionar al menos un activo para el movimiento",
      "warning",
      3000
    );
    return false;
  }

  // Validar que cada activo tenga motivo y descripción
  if (form.selectedAssets.some((asset) => !isAssetValid(asset))) {
    ModalAlert(
      "Error",
      "Todos los activos deben tener los campos 'Motivo' y 'Descripción' completos",
      "error",
      3000
    );
    return false;
  }

  return true;
};


  const submitMovement = async () => {
    setLoading(true);
    try {
      const items = form.selectedAssets.map((asset) => ({
        cod_it_inventory: asset.cod_it_inventory,
        it_inventory_movement_motive: asset.it_inventory_movement_motive,
        it_inventory_movement_description: asset.it_inventory_movement_description,
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

      await createMovement(movementData);
      ModalAlert("Éxito", "Movimiento creado exitosamente", "success", 3000);

      if (typeof onSubmit === "function") onSubmit(form);

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
      ModalAlert(
        "Error",
        "Ocurrió un error al crear el movimiento",
        "error",
        3000
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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

    maxHeight: "80vh",
    overflowY: "auto",
    overflowX: "hidden",
    scrollBehavior: "smooth",


    "&::-webkit-scrollbar": {
      width: 0, // barra de scroll invisible en Chrome, Edge, Safari
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "transparent",
    },
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE y Edge Legacy
  }}
>


      <h2 className="text-xl text-center font-bold mb-4 text-gray-700">
        Registrar Movimiento
      </h2>

      {/* Datos del movimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputMovement
          name="movement_date"
          label="Fecha *"
          type="date"
          value={form.movement_date}
          onChange={handleChange}
          required
        />
        <InputMovement
          name="movement_owner"
          label="Responsable *"
          value={form.movement_owner}
          onChange={handleChange}
          required
        />
        <InputMovement
          name="movement_delivered_by"
          label="Entregado por *"
          value={form.movement_delivered_by}
          onChange={handleChange}
          required
        />
        <InputMovement
          name="movement_delivered_to"
          label="Entregado a *"
          value={form.movement_delivered_to}
          onChange={handleChange}
          required
        />
      </div>

      {/* Observaciones con InputMovement tipo textarea */}
      <div className="mt-4">
        <InputMovement
          name="movement_observations"
          label="Observaciones"
          type="textarea"
          rows={3}
          value={form.movement_observations}
          onChange={handleChange}
        />
      </div>

      {/* Componente AssetSelectorTI */}
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

      {/* Detalles del activo */}
      {form.selectedAssets.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Detalles del Activo</h3>
          {form.selectedAssets.map((asset) => (
            <div
              key={asset.cod_it_inventory}
              className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="mb-3 pb-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-700">
                  {asset.it_inventory_name || asset.it_inventory_serial_number || "Sin nombre"}
                </h4>
                <p className="text-sm text-gray-500">Código: {asset.cod_it_inventory}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Modelo: {asset.it_inventory_model || "N/A"} | Placa: {asset.it_inventory_plate || asset.it_inventory_plaque || "N/A"}
                </p>
              </div>

              <div className="space-y-3">
                <InputMovement
                  name={`motive-${asset.cod_it_inventory}`}
                  label="Motivo *"
                  type="select"
                  value={asset.it_inventory_movement_motive}
                  onChange={(e) =>
                    handleAssetChange(asset.cod_it_inventory, "it_inventory_movement_motive", e.target.value)
                  }
                  options={movementMotives.map((m) => ({ value: m.id, label: m.description }))}
                  required
                />

                <InputMovement
                  name={`desc-${asset.cod_it_inventory}`}
                  label="Descripción *"
                  type="textarea"
                  rows={3}
                  value={asset.it_inventory_movement_description}
                  onChange={(e) =>
                    handleAssetChange(asset.cod_it_inventory, "it_inventory_movement_description", e.target.value)
                  }
                  required
                />
              </div>

              {!isAssetValid(asset) && (
                <p className="text-red-500 text-xs mt-2">
                  Complete todos los campos requeridos para este activo
                </p>
              )}

              <details className="mt-2 text-xs">
                <summary className="cursor-pointer text-blue-600">Ver datos completos del activo</summary>
                <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">
                  {JSON.stringify(asset, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}

      {/* Botón guardar */}
      <div className="flex justify-center mt-6">
        <ModalConfirmation
          message={`¿Está seguro que desea crear el movimiento con ${form.selectedAssets.length} activo(s)?`}
          onClick={submitMovement}
          confirmText={loading ? "Guardando..." : `Guardar Movimiento (${form.selectedAssets.length})`}
          disabled={
            loading ||
            form.selectedAssets.length === 0 ||
            form.selectedAssets.some((asset) => !isAssetValid(asset))
          }
          title="Confirmar Creación de Movimiento"
          icon="question"
          buttonVariant="primary"
        />
      </div>
    </Box>
  );
};

export default FormMovementTI;
