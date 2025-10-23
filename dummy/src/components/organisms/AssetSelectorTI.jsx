import React from "react";

// Función auxiliar para traducir etiquetas
const getLabelByCode = (list = [], code) => {
  if (!list || !Array.isArray(list)) return "";
  const found = list.find(
    (item) => item.value === code || item.code === code || item.id === code
  );
  return found ? found.label || found.name || found.description || "" : "";
};

const AssetSelectorTI = ({
  availableAssets = [],
  categoryAssets = [],
  assets = [],
  brands = [],
  offices = [],
  systemsOperative = [],
  filters,
  setFilters,
  form,
  setForm,
  onSelectAsset, // 🔹 NUEVA PROP
}) => {
  const handleAssetSelect = (e) => {
    const assetId = Number(e.target.value);
    
    if (onSelectAsset) {
      // 🔹 USAR LA FUNCIÓN DEL PADRE SI ESTÁ DISPONIBLE
      onSelectAsset(assetId);
    } else {
      // Lógica anterior como fallback
      const isSelected = form.selectedAssets.some(
        selected => selected.cod_it_inventory === assetId
      );

      if (isSelected) {
        setForm(prev => ({
          ...prev,
          selectedAssets: prev.selectedAssets.filter(
            selected => selected.cod_it_inventory !== assetId
          )
        }));
      } else {
        const assetToAdd = availableAssets.find(asset => asset.cod_it_inventory === assetId);
        if (assetToAdd) {
          setForm(prev => ({
            ...prev,
            selectedAssets: [
              ...prev.selectedAssets,
              {
                ...assetToAdd, // 🔹 Pasar objeto completo
                it_inventory_movement_motive: "",
                it_inventory_movement_description: ""
              }
            ]
          }));
        }
      }
    }
  };

  const filteredAssets = availableAssets.filter((asset) => {
    const matchesCategory =
      filters.category === "all" || String(asset.it_inventory_asset_category_code) === String(filters.category);
    const matchesType =
      filters.type === "all" || String(asset.it_inventory_asset_item_code) === String(filters.type);
    const matchesBrand =
      filters.brand === "all" || String(asset.it_inventory_brand_item_code) === String(filters.brand);
    const matchesOffice =
      filters.office === "all" || String(asset.it_inventory_office_item_code) === String(filters.office);
    const matchesSO =
      filters.so === "all" || String(asset.it_inventory_so_item_code) === String(filters.so);

    return matchesCategory && matchesType && matchesBrand && matchesOffice && matchesSO;
  });

  return (
    <div className="mt-6">
      {/* 🔍 Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <select
          value={filters.category}
          onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
          className="bg-white border border-gray-300 rounded-lg p-2 w-full"
        >
          <option value="all">Todas las categorías</option>
          {[...new Set(availableAssets.map((a) => a.it_inventory_asset_category_code))].map((cat) => {
            const label = getLabelByCode(categoryAssets, cat);
            return <option key={cat} value={cat}>{label || `Categoría ${cat}`}</option>;
          })}
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
          className="bg-white border border-gray-300 rounded-lg p-2 w-full"
        >
          <option value="all">Todos los tipos</option>
          {[...new Set(availableAssets.map((a) => a.it_inventory_asset_item_code))].map((code) => {
            const label = getLabelByCode(assets, code);
            return <option key={code} value={code}>{label || `Tipo ${code}`}</option>;
          })}
        </select>

        <select
          value={filters.brand}
          onChange={(e) => setFilters((p) => ({ ...p, brand: e.target.value }))}
          className="bg-white border border-gray-300 rounded-lg p-2 w-full"
        >
          <option value="all">Todas las marcas</option>
          {[...new Set(availableAssets.map((a) => a.it_inventory_brand_item_code))].map((code) => {
            const label = getLabelByCode(brands, code);
            return <option key={code} value={code}>{label || `Marca ${code}`}</option>;
          })}
        </select>

        <select
          value={filters.office}
          onChange={(e) => setFilters((p) => ({ ...p, office: e.target.value }))}
          className="bg-white border border-gray-300 rounded-lg p-2 w-full"
        >
          <option value="all">Todas las oficinas</option>
          {[...new Set(availableAssets.map((a) => a.it_inventory_office_item_code))].map((code) => {
            const label = getLabelByCode(offices, code);
            return <option key={code} value={code}>{label || `Oficina ${code}`}</option>;
          })}
        </select>

        <select
          value={filters.so}
          onChange={(e) => setFilters((p) => ({ ...p, so: e.target.value }))}
          className="bg-white border border-gray-300 rounded-lg p-2 w-full"
        >
          <option value="all">Todos los sistemas</option>
          {[...new Set(availableAssets.map((a) => a.it_inventory_so_item_code))].map((code) => {
            const label = getLabelByCode(systemsOperative, code);
            return <option key={code} value={code}>{label || `SO ${code}`}</option>;
          })}
        </select>
      </div>

      {/* 📦 Lista de activos */}
      <div>
        <label className="font-semibold text-gray-700">Activos disponibles</label>
        <div className="rounded-lg p-3 max-h-60 overflow-y-auto bg-gray-50">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => {
              const isSelected = form.selectedAssets.some(
                selected => selected.cod_it_inventory === asset.cod_it_inventory
              );
              
              return (
                <label key={asset.cod_it_inventory} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    value={asset.cod_it_inventory}
                    checked={isSelected}
                    onChange={handleAssetSelect}
                  />
                  <span>
                    <strong>({asset.cod_it_inventory})</strong>{" "}
                    {asset.it_inventory_name || asset.it_inventory_serial_number} —{" "}
                    {asset.it_inventory_model || "Sin modelo"} |{" "}
                    {asset.it_inventory_plate || "Sin placa"} |{" "}
                    {asset.it_inventory_in_charge || "Sin responsable"}
                  </span>
                </label>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No hay activos que coincidan con los filtros.</p>
          )}
        </div>
      </div>

      {/* 📋 Tabla de activos seleccionados */}
      {form.selectedAssets.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-700">Detalle de Activos Seleccionados</h3>
          <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <tr>
                <th className="py-4 px-2 text-center font-semibold">Código</th>
                <th className="py-4 px-2 text-center font-semibold">Nombre / Serial</th>
                <th className="py-4 px-2 text-center font-semibold">Modelo</th>
                <th className="py-4 px-2 text-center font-semibold">Placa</th>
                <th className="py-4 px-2 text-center font-semibold">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {form.selectedAssets.map((asset) => (
                <tr key={asset.cod_it_inventory} className="hover:bg-gray-100">
                  <td className="px-4 py-2 text-center">{asset.cod_it_inventory}</td>
                  <td className="px-4 py-2 text-center">{asset.it_inventory_name || asset.it_inventory_serial_number}</td>
                  <td className="px-4 py-2 text-center">{asset.it_inventory_model || "-"}</td>
                  <td className="px-4 py-2 text-center">{asset.it_inventory_plate || "-"}</td>
                  <td className="px-4 py-2 text-center">{asset.it_inventory_in_charge || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssetSelectorTI;