import React, { useState, useEffect } from "react";
import TableMiscellaneousPage from "../TableMiscellaneousPage";
import TableOptionServices from "../tableOptionService";
import TableSubcategorie from "../tableSubCategorie";
import { getServices } from "../../services/Service_service";
import { getCategorys } from "../../services/categoryService";
import { getItems, addItem } from "../../services/itemService";

function MiscellaneousPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedServCod, setSelectedServCod] = useState(null);
  const [selectedCatCod, setSelectedSubCod] = useState(null);

  // Cargar servicios SOLO una vez al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResp = await getServices();
        setServices(servicesResp);
        console.log("services:", servicesResp);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  // Seleccionar servicio -> limpiar dependencias y cargar categorías
  const setSelectedServiceId = async (id) => {
    try {
      setSelectedServCod(id);
      // Limpiar dependencias inmediatamente (evita el “doble click”)
      setSelectedSubCod(null);
      setItems([]);
      setCategories([]);

      console.log("Selected service ID:", id);
      const cats = await getCategorys(id);
      setCategories(cats);
      console.log("categories:", cats);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  // Seleccionar categoría -> cargar items
  const setSelectedCategoryId = async (id_category, id_service) => {
    try {
      setSelectedSubCod(id_category);
      console.log("Selected Category ID:", id_category);
      const its = await getItems(id_service, id_category);
      setItems(its);
      console.log("items:", its);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  // Agregar item y refrescar lista
  const handleAddItem = async (itemName) => {
    if (!selectedServCod || !selectedCatCod) return;
    try {
      await addItem(
        Number(selectedServCod),
        Number(selectedCatCod),
        itemName.trim()
      );
      const updated = await getItems(selectedServCod, selectedCatCod);
      setItems(updated);
    } catch (err) {
      console.error("No se pudo agregar el item:", err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <style>{`
        .tables-flex {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          overflow-x: auto;
        }
        .panel { flex: 1; min-width: 340px; }
      `}</style>

      <div className="tables-flex">
        {/* Panel 1: Servicios */}
        <div className="panel">
          <TableMiscellaneousPage
            services={services}
            selectedId={selectedServCod}
            onSelect={setSelectedServiceId}
          />
        </div>

        {/* Panel 2: Categorías */}
        {selectedServCod && (
          <div className="panel">
            <TableOptionServices
              categoria={categories}
              onClose={() => setSelectedServCod(null)}
              onSelectSub={setSelectedCategoryId}
              selectedService={selectedServCod}
              selectedCatCod={selectedCatCod}
            />
          </div>
        )}

        {/* Panel 3: Items */}
        {selectedCatCod && (
          <div className="panel">
            <TableSubcategorie
              items={items}
              onClose={() => setSelectedSubCod(null)}
              onAddItem={handleAddItem}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MiscellaneousPage;
