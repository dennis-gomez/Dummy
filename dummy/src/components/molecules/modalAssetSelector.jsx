import React, { useState, useEffect } from "react";
import AssetSelectorTI from "../organisms/AssetSelectorTI";
import { getTechnologyInventory } from "../../services/technologyInventoryService";
import { addItemToMovement } from "../../services/inventoryMovementTIService";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold"
        >
          &times;
        </button>
        {children}
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

  const [form, setForm] = useState({
    selectedAssets: [],
  });

  const [availableAssets, setAvailableAssets] = useState([]);

  const movementMotives = [
    { id: 1, description: "Prestamo" },
    { id: 2, description: "Compra" },
    { id: 3, description: "Devolución" },
    { id: 4, description: "Venta" },
    { id: 5, description: "Donación" },
  ];

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await getTechnologyInventory();
        const data = response.data;
        const activeAssets = data.filter(asset => asset.it_inventory_status === 1);
        setAvailableAssets(activeAssets);
        console.log("✅ Activos disponibles:", activeAssets);
      } catch (error) {
        console.error("Error al obtener los activos:", error);
      }
    };

    if (showModal) fetchAssets();
  }, [showModal]);

  // 🔹 DEBUG: Ver estructura de los activos
  useEffect(() => {
    if (form.selectedAssets.length > 0) {
      console.log("🔍 Estructura del primer activo:", form.selectedAssets[0]);
    }
  }, [form.selectedAssets]);

  const handleSelectAsset = (assetId) => {
    console.log("🔄 Intentando seleccionar activo ID:", assetId);
    
    const assetToAdd = availableAssets.find(asset => asset.cod_it_inventory === assetId);
    
    if (!assetToAdd) {
      console.error("❌ No se encontró el activo con ID:", assetId);
      return;
    }

    console.log("✅ Activo encontrado:", assetToAdd);

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

  const isAssetValid = (asset) => {
    return asset.cod_it_inventory && 
           asset.it_inventory_movement_motive && 
           asset.it_inventory_movement_description;
  };

  const handleSave = async () => {
    if (!movementId) {
      alert("❌ No se ha proporcionado un ID de movimiento.");
      return;
    }

    if (form.selectedAssets.length === 0) {
      alert("❌ No se han seleccionado activos.");
      return;
    }

    // 🔹 Verificar que todos los activos tengan los campos requeridos
    const invalidAssets = form.selectedAssets.filter(asset => !isAssetValid(asset));
    if (invalidAssets.length > 0) {
      alert("❌ Todos los activos deben tener los campos 'motivo' y 'descripción' completos.");
      return;
    }

    try {
      for (let asset of form.selectedAssets) {
        console.log("📤 Enviando activo al backend:", {
          cod_it_inventory: asset.cod_it_inventory,
          it_inventory_movement_motive: asset.it_inventory_movement_motive,
          it_inventory_movement_description: asset.it_inventory_movement_description,
        });

        await addItemToMovement(movementId, {
          cod_it_inventory: asset.cod_it_inventory,
          it_inventory_movement_motive: asset.it_inventory_movement_motive,
          it_inventory_movement_description: asset.it_inventory_movement_description,
        });
      }

      onAssetsSelected(form.selectedAssets);
      setShowModal(false);
      setForm({ selectedAssets: [] });
      alert("✅ Activos agregados exitosamente al movimiento.");
    } catch (error) {
      console.error("Error agregando activos al movimiento:", error);
      alert("❌ Error al agregar activos al movimiento");
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
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
      >
        Seleccionar Activos
      </button>

      <Modal isOpen={showModal} onClose={handleCloseModal}>
        <h2 className="text-xl font-bold mb-4">Seleccionar Activos</h2>
        
        <AssetSelectorTI
          availableAssets={availableAssets}
          filters={filters}
          setFilters={setFilters}
          form={form}
          setForm={setForm}
          onSelectAsset={handleSelectAsset}
        />

        {/* Campos para ingresar motivo y descripción del activo */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Detalles del Activo</h3>
          
          {form.selectedAssets.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay activos seleccionados
            </p>
          ) : (
            form.selectedAssets.map((asset) => (
              <div 
                key={asset.cod_it_inventory} 
                className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                {/* 🔹 CORREGIDO: Usar los nombres de campo correctos */}
                <div className="mb-3 pb-2 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-700">
                    {asset.it_inventory_name || asset.it_inventory_serial_number || "Sin nombre"} - {asset.it_inventory_serial || "Sin serial"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Código: {asset.cod_it_inventory}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {/* 🔹 CORREGIDO: Usar nombres de campo consistentes */}
                    Modelo: {asset.it_inventory_model || asset.it_inventory_model || "N/A"} | 
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
                      placeholder="Ingrese la descripción del movimiento..."
                      className="w-full bg-white border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                </div>

                {!isAssetValid(asset) && (
                  <p className="text-red-500 text-xs mt-2">
                    ⚠ Complete todos los campos requeridos
                  </p>
                )}

                {/* 🔹 DEBUG: Mostrar todos los campos disponibles */}
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-blue-600">Ver datos completos del activo</summary>
                  <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify(asset, null, 2)}
                  </pre>
                </details>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={form.selectedAssets.length === 0 || form.selectedAssets.some(asset => !isAssetValid(asset))}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
          >
            Guardar ({form.selectedAssets.length})
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AssetModalButton;