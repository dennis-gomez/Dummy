import React from "react";
import InputMovement from "../atoms/inputMovement"; 

//  Función auxiliar para traducir etiquetas
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
  onSelectAsset,
}) => {
  //  Manejar selección de activos
  const handleAssetSelect = (e) => {
    const assetId = Number(e.target.value);

    if (onSelectAsset) {
      onSelectAsset(assetId);
    } else {
      const isSelected = form.selectedAssets.some(
        (selected) => selected.cod_it_inventory === assetId
      );

      if (isSelected) {
        setForm((prev) => ({
          ...prev,
          selectedAssets: prev.selectedAssets.filter(
            (selected) => selected.cod_it_inventory !== assetId
          ),
        }));
      } else {
        const assetToAdd = availableAssets.find(
          (asset) => asset.cod_it_inventory === assetId
        );
        if (assetToAdd) {
          setForm((prev) => ({
            ...prev,
            selectedAssets: [
              ...prev.selectedAssets,
              {
                ...assetToAdd,
                it_inventory_movement_motive: "",
                it_inventory_movement_description: "",
              },
            ],
          }));
        }
      }
    }
  };

  // Filtrado dinámico
  const filteredAssets = availableAssets.filter((asset) => {
    const matchesCategory =
      filters.category === "all" ||
      String(asset.it_inventory_asset_category_code) === String(filters.category);
    const matchesType =
      filters.type === "all" ||
      String(asset.it_inventory_asset_item_code) === String(filters.type);
    const matchesBrand =
      filters.brand === "all" ||
      String(asset.it_inventory_brand_item_code) === String(filters.brand);
    const matchesOffice =
      filters.office === "all" ||
      String(asset.it_inventory_office_item_code) === String(filters.office);
    const matchesSO =
      filters.so === "all" ||
      String(asset.it_inventory_so_item_code) === String(filters.so);

    return (
      matchesCategory &&
      matchesType &&
      matchesBrand &&
      matchesOffice &&
      matchesSO
    );
  });

  return (
    <div className="mt-6">
      {/*  Filtros con InputMovement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <InputMovement
          name="category"
          label="Categoría"
          type="select"
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
          options={[
            { value: "all", label: "Todas las categorías" },
            ...[...new Set(availableAssets.map((a) => a.it_inventory_asset_category_code))].map(
              (cat) => ({
                value: cat,
                label: getLabelByCode(categoryAssets, cat) || `Categoría ${cat}`,
              })
            ),
          ]}
        />

        <InputMovement
          name="type"
          label="Tipo"
          type="select"
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
          options={[
            { value: "all", label: "Todos los tipos" },
            ...[...new Set(availableAssets.map((a) => a.it_inventory_asset_item_code))].map(
              (code) => ({
                value: code,
                label: getLabelByCode(assets, code) || `Tipo ${code}`,
              })
            ),
          ]}
        />

        <InputMovement
          name="brand"
          label="Marca"
          type="select"
          value={filters.brand}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, brand: e.target.value }))
          }
          options={[
            { value: "all", label: "Todas las marcas" },
            ...[...new Set(availableAssets.map((a) => a.it_inventory_brand_item_code))].map(
              (code) => ({
                value: code,
                label: getLabelByCode(brands, code) || `Marca ${code}`,
              })
            ),
          ]}
        />

        <InputMovement
          name="office"
          label="Oficina"
          type="select"
          value={filters.office}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, office: e.target.value }))
          }
          options={[
            { value: "all", label: "Todas las oficinas" },
            ...[...new Set(availableAssets.map((a) => a.it_inventory_office_item_code))].map(
              (code) => ({
                value: code,
                label: getLabelByCode(offices, code) || `Oficina ${code}`,
              })
            ),
          ]}
        />

        <InputMovement
          name="so"
          label="Sistema Operativo"
          type="select"
          value={filters.so}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, so: e.target.value }))
          }
          options={[
            { value: "all", label: "Todos los sistemas" },
            ...[...new Set(availableAssets.map((a) => a.it_inventory_so_item_code))].map(
              (code) => ({
                value: code,
                label: getLabelByCode(systemsOperative, code) || `SO ${code}`,
              })
            ),
          ]}
        />
      </div>

      {/* Lista de activos */}
      <div>
        <label className="font-semibold text-gray-700">Activos disponibles</label>
        <div className="rounded-lg p-3 max-h-60 overflow-y-auto bg-gray-50">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => {
              const isSelected = form.selectedAssets.some(
                (selected) => selected.cod_it_inventory === asset.cod_it_inventory
              );
              return (
                <label
                  key={asset.cod_it_inventory}
                  className="flex items-center space-x-2 py-1"
                >
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
            <p className="text-gray-500 text-sm">
              No hay activos que coincidan con los filtros.
            </p>
          )}
        </div>
      </div>

      {/* Tabla de activos seleccionados */}
      {form.selectedAssets.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-gray-700">
            Detalle de Activos Seleccionados
          </h3>
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
                  <td className="px-4 py-2 text-center">
                    {asset.it_inventory_name || asset.it_inventory_serial_number}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {asset.it_inventory_model || "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {asset.it_inventory_plate || "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {asset.it_inventory_in_charge || "-"}
                  </td>
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
