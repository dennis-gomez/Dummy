import { useState, useEffect, useRef } from "react";
import { getCategorys, addCategory, deleteCategory, updateCategory } from "../services/categoryService";
import { getServices, addService, deleteService, updateService } from "../services/Service_service";
import { getItems, addItem, deleteItem, updateItem } from "../services/itemService";

export default function useMiscellaneousPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedServCod, setSelectedServCod] = useState(null);
  const [selectedCatCod, setSelectedSubCod] = useState(null);

  // refs para focus
  const serviciosRef = useRef(null);
  const categoriasRef = useRef(null);
  const itemsRef = useRef(null);

  // cargar servicios al inicio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResp = await getServices();
        setServices(servicesResp);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
      }
    };
    fetchData();
  }, []);

  // seleccionar servicio
  const setSelectedServiceId = async (id) => {
    try {
      setSelectedServCod(id);
      setSelectedSubCod(null);
      setItems([]);
      setCategories([]);

      const cats = await getCategorys(id);
      setCategories(cats);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // seleccionar categoría
  const setSelectedCategoryId = async (id_category, id_service) => {
    try {
      setSelectedSubCod(id_category);
      const its = await getItems(id_service, id_category);
      setItems(its);
    } catch (error) {
      console.error("Error al obtener items:", error);
    }
  };

  // CRUD de servicios
  const handleAddService = async (serviceName) => {
    const name = serviceName.trim();
    if (!name) return;
    try {
      await addService(name);
      setServices(await getServices());
    } catch (e) {
      console.error("No se pudo agregar el servicio:", e);
    }
  };

  const handleEditService = async (cod, nombre) => {
    await updateService(cod, nombre);
    setServices(await getServices());
  };

  const handleDeleteService = async (cod) => {
    await deleteService(cod);
    setServices(await getServices());

    if (selectedServCod === cod) {
      setSelectedServCod(null);
      setCategories([]);
      setSelectedSubCod(null);
      setItems([]);
    }
  };

  // CRUD de categorías
  const handleAddCategory = async (cod_service, name) => {
    await addCategory(cod_service, name);
    setCategories(await getCategorys(cod_service));
  };

  const handleEditCategory = async (cod_category, cod_service, name) => {
    await updateCategory(cod_category, cod_service, name);
    setCategories(await getCategorys(cod_service));
  };

  const handleDeleteCategory = async (cod_category, cod_service) => {
    await deleteCategory(cod_category, cod_service);
    const refreshed = await getCategorys(cod_service);
    setCategories(refreshed);

    if (selectedCatCod === cod_category) {
      setSelectedSubCod(null);
      setItems([]);
    }
  };

  // CRUD de items
  const handleAddItem = async (itemName) => {
    if (!selectedServCod || !selectedCatCod) return;
    await addItem(Number(selectedServCod), Number(selectedCatCod), itemName.trim());
    setItems(await getItems(selectedServCod, selectedCatCod));
  };

  const handleEditItem = async (cod_category, cod_service, cod_item, editValue) => {
    try {
      // 🔹 Orden corregido: cod_service primero
      await updateItem(
        Number(cod_service),
        Number(cod_category),
        Number(cod_item),
        editValue.trim()
      );
      setItems(await getItems(selectedServCod, selectedCatCod));
    } catch (error) {
      console.error("Error al actualizar item:", error);
    }
  };

  const handleDeleteItem = async (cod_category, cod_service, cod_item) => {
    await deleteItem(cod_category, cod_service, cod_item);
    setItems(await getItems(selectedServCod, selectedCatCod));
  };

  return {
    services,
    categories,
    items,
    selectedServCod,
    selectedCatCod,
    setSelectedServiceId,
    setSelectedCategoryId,
    handleAddService,
    handleEditService,
    handleDeleteService,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    serviciosRef,
    categoriasRef,
    itemsRef,
    setSelectedServCod,
    setSelectedSubCod,
    setItems,
    setCategories,
  };
}
