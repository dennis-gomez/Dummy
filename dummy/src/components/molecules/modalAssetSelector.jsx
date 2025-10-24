import React, { useState, useEffect } from "react";
import AssetSelectorTI from "../organisms/AssetSelectorTI";
import { getTechnologyInventory } from "../../services/technologyInventoryService";
import { addItemToMovement } from "../../services/inventoryMovementTIService";
import ModalAlert from "../molecules/modalAlert";
import ModalConfirmation from "../molecules/modalConfirmation";
import InputMovement from "../atoms/inputMovement"; 


const Modal = ({ isOpen, onClose, children }) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        className="
          bg-white rounded-2xl shadow-lg relative 
          w-full max-w-3xl flex flex-col 
          max-h-[90vh] overflow-hidden
        "
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold z-10"
        >
          &times;
        </button>

        {/* Contenido scrollable */}
        <div
          className="p-6 overflow-y-auto"
          style={{
            maxHeight: "80vh",
            overflowX: "hidden",
            scrollBehavior: "smooth",
          }}
        >
          {children}

          {/* Scroll invisible para Chrome, Edge, Safari */}
          <style>{`
            div::-webkit-scrollbar {
              width: 0px;
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background: transparent;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

const AssetModalButton = ({ movementId, onAssetsSelected }) => {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    brand: "all",
    office: "all",
    so: "all",
  });

  const [form, setForm] = useState({ selectedAssets: [] });
  const [availableAssets, setAvailableAssets] = useState([]);

  const movementMotives = [
    { id: 1, description: "Préstamo" },
    { id: 2, description: "Compra" },
    { id: 3, description: "Devolución" },
    { id: 4, description: "Venta" },
    { id: 5, description: "Donación" },
  ];

  // Cargar activos disponibles
  useEffect(() => {
    if (!showModal) return;

    const fetchAssets = async () => {
      try {
        const response = await getTechnologyInventory();
        const data = response.data;
        const activeAssets = data.filter((asset) => asset.it_inventory_status === 1);
        setAvailableAssets(activeAssets);
      } catch (error) {
        console.error("Error al obtener los activos:", error);
        ModalAlert("Error", "No se pudieron cargar los activos disponibles", "error", 3000);
      }
    };

    fetchAssets();
  }, [showModal]);

  // Seleccionar / deseleccionar activo
  const handleSelectAsset = (assetId) => {
    const assetToAdd = availableAssets.find((asset) => asset.cod_it_inventory === assetId);

    if (!assetToAdd) {
      ModalAlert("Error", "Activo no encontrado", "error", 2000);
      return;
    }

    const isAlreadySelected = form.selectedAssets.some(
      (selected) => selected.cod_it_inventory === assetId
    );

    if (isAlreadySelected) {
      setForm((prev) => ({
        ...prev,
        selectedAssets: prev.selectedAssets.filter((selected) => selected.cod_it_inventory !== assetId),
      }));
      ModalAlert("Eliminado", "Activo removido", "info", 1500);
    } else {
      setForm((prev) => ({
        ...prev,
        selectedAssets: [
          ...prev.selectedAssets,
          { ...assetToAdd, it_inventory_movement_motive: "", it_inventory_movement_description: "" },
        ],
      }));
      ModalAlert("Agregado", "Activo agregado", "success", 1500);
    }
  };

  // Cambiar campos de motivo o descripción
  const handleAssetChange = (assetId, field, value) => {
    setForm((prev) => ({
      ...prev,
      selectedAssets: prev.selectedAssets.map((asset) =>
        asset.cod_it_inventory === assetId ? { ...asset, [field]: value } : asset
      ),
    }));
  };

  // Validación de campos obligatorios
  const isAssetValid = (asset) =>
    asset.cod_it_inventory &&
    asset.it_inventory_movement_motive &&
    asset.it_inventory_movement_description;

  // Guardar en backend
  const handleConfirmSave = async () => {
    if (!movementId) {
      ModalAlert("Error", "Falta el ID del movimiento", "error", 3000);
      return;
    }

    if (form.selectedAssets.length === 0) {
      ModalAlert("Error", "Debe seleccionar al menos un activo", "warning", 3000);
      return;
    }

    if (form.selectedAssets.some((a) => !isAssetValid(a))) {
      ModalAlert("Error", "Complete motivo y descripción para todos los activos", "error", 3000);
      return;
    }

    try {
      for (const asset of form.selectedAssets) {
        await addItemToMovement(movementId, {
          cod_it_inventory: asset.cod_it_inventory,
          it_inventory_movement_motive: asset.it_inventory_movement_motive,
          it_inventory_movement_description: asset.it_inventory_movement_description,
        });
      }
      onAssetsSelected(form.selectedAssets);
      setShowModal(false);
      setForm({ selectedAssets: [] });
      ModalAlert("Éxito", `${form.selectedAssets.length} activo(s) agregados correctamente`, "success", 3000);
    } catch (error) {
      console.error("Error al guardar activos:", error);
      ModalAlert("Error", "No se pudieron agregar los activos", "error", 3000);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ selectedAssets: [] });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-green-500 text-white rounded-xl font-medium"
      >
        Agregar Activos
      </button>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold mb-4">Agregar Activos</h2>

        <AssetSelectorTI
          availableAssets={availableAssets}
          filters={filters}
          setFilters={setFilters}
          form={form}
          setForm={setForm}
          onSelectAsset={handleSelectAsset}
        />

        {/* Campos motivo y descripción */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Detalles del Activo</h3>

          {form.selectedAssets.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay activos seleccionados</p>
          ) : (
            form.selectedAssets.map((asset) => (
              <div key={asset.cod_it_inventory} className="mb-5 p-4 border border-gray-200 rounded-lg bg-gray-50">
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
                    value={asset.it_inventory_movement_motive || ""}
                    onChange={(e) => handleAssetChange(asset.cod_it_inventory, "it_inventory_movement_motive", e.target.value)}
                    options={movementMotives.map((m) => ({ value: m.id, label: m.description }))}
                    required
                  />
                  <InputMovement
                    name={`desc-${asset.cod_it_inventory}`}
                    label="Descripción *"
                    type="textarea"
                    rows={3}
                    value={asset.it_inventory_movement_description || ""}
                    onChange={(e) => handleAssetChange(asset.cod_it_inventory, "it_inventory_movement_description", e.target.value)}
                    placeholder="Ingrese la descripción del movimiento..."
                    required
                  />
                </div>

                {!isAssetValid(asset) && (
                  <p className="text-red-500 text-xs mt-2">Complete todos los campos requeridos</p>
                )}

                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-blue-600">Ver datos completos del activo</summary>
                  <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">{JSON.stringify(asset, null, 2)}</pre>
                </details>
              </div>
            ))
          )}
        </div>

        {/* Botones finales */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-400 hover:bg-red-500 text-white rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>

          <ModalConfirmation
            message={`¿Está seguro que desea agregar ${form.selectedAssets.length} activo(s)?`}
            onClick={handleConfirmSave}
            confirmText={`Guardar (${form.selectedAssets.length})`}
            disabled={form.selectedAssets.length === 0 || form.selectedAssets.some((a) => !isAssetValid(a))}
            title="Confirmar Guardado"
            icon="question"
            buttonVariant="success"
          />
        </div>
      </Modal>
    </>
  );
};

export default AssetModalButton;
