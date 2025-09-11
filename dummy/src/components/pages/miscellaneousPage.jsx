import React, { useState, useEffect } from "react";
import TableMiscellaneousPage from "../organisms/tableMiscellaneousPage";
import TableOptionServices from "../organisms/tableOptionService";
import TableSubcategorie from "../organisms/tableSubCategorie";
import { getCategorys, addCategory, deleteCategory, updateCategory } from "../../services/categoryService";
import { getServices, addService, deleteService, updateService } from "../../services/Service_service";
import { getItems, addItem, deleteItem, updateItem } from "../../services/itemService";


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

      const cats = await getCategorys(id);
      setCategories(cats);
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

  const handleDeleteItem = async (cod_category, cod_service, cod_item) => {
    await deleteItem(cod_category, cod_service, cod_item);
    const updated = await getItems(selectedServCod, selectedCatCod);
    setItems(updated);
  };

  const handleSaveEdit = async (cod_category, cod_service, cod_item, editValue) => {
    await updateItem(cod_category, cod_service, cod_item, editValue);
    const updated = await getItems(selectedServCod, selectedCatCod);
    setItems(updated);
  };

  // ==== AÑADIDO: crear servicio y refrescar lista de servicios ====
  const handleAddService = async (serviceName) => {
    const name = serviceName.trim();
    if (!name) return;
    try {
      await addService(name);
      const refreshed = await getServices();
      setServices(refreshed);
      // opcional: podrías seleccionar el nuevo servicio si tu API lo devuelve
    } catch (e) {
      console.error("No se pudo agregar el servicio:", e);
    }
  };

  // Refs para focus
  const serviciosRef = React.useRef(null);
  const categoriasRef = React.useRef(null);
  const itemsRef = React.useRef(null);

  // Focus en tabla de servicios al montar
  React.useEffect(() => {
    if (serviciosRef.current) serviciosRef.current.focus();
  }, []);

  // Focus en tabla de categorías cuando se selecciona servicio
  React.useEffect(() => {
    if (selectedServCod && categoriasRef.current) categoriasRef.current.focus();
  }, [selectedServCod]);

  // Focus en tabla de items cuando se selecciona categoría
  React.useEffect(() => {
    if (selectedCatCod && itemsRef.current) itemsRef.current.focus();
  }, [selectedCatCod]);

  return (
    <div style={{ padding: 24 }}>
      <style>{`
        .tables-flex {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
        }
        .panel {
          width: 100%;
          max-width: 600px;
          min-width: 340px;
          margin: 0 auto;
        }
      `}</style>

      <div className="tables-flex">
        {/* Panel 1: Servicios */}
        <div className="panel">
          <TableMiscellaneousPage
            services={services}
            selectedId={selectedServCod}
            onSelect={setSelectedServiceId}
            tableRef={serviciosRef}
            onAddItem={handleAddService}
            onEditService={async (cod, nombre) => { await updateService(cod, nombre); setServices(await getServices()); }}
            onDeleteService={async (cod) => { await deleteService(cod); setServices(await getServices()); }}
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
              tableRef={categoriasRef}
              addCategory={async (cod_service, name) => {
                await addCategory(cod_service, name); setCategories(await getCategorys(cod_service));
              }}
              updateCategory={async (cod_category, cod_service, name) => {
                await updateCategory(cod_category, cod_service, name); setCategories(await getCategorys(cod_service));
              }}
              deleteCategory={async (cod_category, cod_service) => {
                await deleteCategory(cod_category, cod_service); setCategories(await getCategorys(cod_service));
              }}
            />

          </div>
        )}

        {/* Panel 3: Items */}
        {selectedCatCod && (
          <div className="panel">
            <TableSubcategorie
              items={items}
              onClose={() => setSelectedSubCod(null)}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleSaveEdit}
              onAddItem={handleAddItem}
              tableRef={itemsRef}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MiscellaneousPage;
