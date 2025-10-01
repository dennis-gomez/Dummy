import { useState, useEffect } from "react";
import {
  getAllExtinguishers,
  deleteExtinguisher,
  addExtinguisher,
  updateExtinguisher,
  getFindExtinguishers,
} from "../services/extinguisherService";
import { getItems } from "../services/itemService";
import ModalAlert from "../components/molecules/modalAlert";

export function useExtinguishers() {
  const [extinguishers, setExtinguishers] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Opciones dinámicas para agentes de extinción
  const [agentItems, setAgentItems] = useState([]);

  // Tipos de extintor estáticos
  const extinguisherTypes = [
    { value: "A", label: "A — Para sólidos" },
    { value: "B", label: "B — Para líquidos/gases inflamables" },
    { value: "C", label: "C — Para equipos energizados" },
    { value: "D", label: "D — Para metales combustibles" },
    { value: "K", label: "K — Para cocina: grasas y aceites" },
    { value: "ABC", label: "ABC — Para multipropósito (A+B+C)" },
    { value: "BC", label: "BC — Para líquidos y gases" },
    { value: "AB", label: "AB — Para sólidos y líquidos" },
  ];

  const extinguisherCapacityUnits = [
    { value: "Kg", label: "Kg" },
    { value: "L", label: "L" }
  ];

  // Campos para formularios y búsqueda
const fields = [
  { name: "extinguisher_serial_number", placeholder: "Número de Serie", width: 250 },
  { name: "extinguisher_brand", placeholder: "Marca", width: 250 },
  { name: "extinguisher_agente_item_code", placeholder: "Agente", type: "select", width: 250, options: agentItems },
  { name: "extinguisher_type", placeholder: "Tipo", type: "select", width: 250, options: extinguisherTypes },
  { name: "extinguisher_capacity_value", placeholder: "Capacidad", type: "number", width: 150 },
  { name: "extinguisher_capacity_unit", placeholder: "Unidad", type: "select", width: 100, options: extinguisherCapacityUnits },

  { name: "extinguisher_manufacturing_date", placeholder: "Fecha de Fabricación", type: "date", width: 250, restriction: "cantAfterToday" },
  { name: "extinguisher_last_maintenance_date", placeholder: "Último Mantenimiento", type: "date", width: 250, restriction: "cantAfterToday" },
  { name: "extinguisher_next_date_inspection", placeholder: "Próxima Inspección", type: "date", width: 250, restriction: "cantBeforeToday" },
  { name: "extinguisher_location", placeholder: "Ubicación", type: "textarea", width: 250 },
  { name: "extinguisher_observations", placeholder: "Observaciones", type: "textarea", width: 780, required: false },
];


  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState(fields[0]?.name || "");

  // 🔹 Obtener todos los extintores
  const fetchData = async () => {
    try {
      const data = await getAllExtinguishers();
      setExtinguishers(data);
    } catch (err) {
      const message = err.response?.data?.message || "Error al obtener extintores.";
      setError(message);
      ModalAlert("Error", message, "error");
    }
  };

  // 🔹 Obtener items dinámicos para agentes
  const fetchItems = async () => {
    try {
      const items = await getItems(
        Number(import.meta.env.VITE_OH_SERVICE_CODE),
        Number(import.meta.env.VITE_OH_EXTINGUISHER_CODE)
      );
      setAgentItems(
        items.map((i) => ({
          name: i.cod_item,
          placeholder: i.item_name,
          value: i.cod_item,
          label: i.item_name,
          service_cod: i.cod_service,
          category_cod: i.cod_category,
        }))
      );
    } catch (err) {
      const message = err.response?.data?.message || "Error al obtener items.";
      setError(message);
      ModalAlert("Error", message, "error");
    }
  };

  // 🔹 Buscar extintores
  const handleSearchExtinguishers = async (feature, text) => {
    try {
      setLoading(true);
      const data = await getFindExtinguishers(feature, text);
      setExtinguishers(data);
    } catch (err) {
      const message = err.response?.data?.message || "No se encuentra extintor.";
      setError(message);
      ModalAlert("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Agregar extintor
  const handleAdd = async (formData) => {
    try {
      setError(null);
      const selectedItem = agentItems.find(i => i.value === formData.extinguisher_agent);
      const payload = {
        ...formData,
        ...(selectedItem && {
          extinguisher_agent_service_cod: selectedItem.service_cod,
          extinguisher_agent_category_code: selectedItem.category_cod,
          extinguisher_agente_item_code: selectedItem.name,
        }),
      };
      await addExtinguisher(payload);
      ModalAlert("Éxito", "Extintor agregado exitosamente.", "success");
      fetchData();
      setShowForm(false);
    } catch (err) {
      const message = err.response?.data?.message || "Error al agregar extintor.";
      setError(message);
      ModalAlert("Error", message, "error");
    }
  };

  // 🔹 Editar extintor
  const handleEdit = async (id, updatedData) => {
    try {
      setError(null);
      const selectedItem = agentItems.find(i => i.value === updatedData.extinguisher_agent);
      const payload = {
        ...updatedData,
        ...(selectedItem && {
          extinguisher_agent_service_cod: selectedItem.service_cod,
          extinguisher_agent_category_code: selectedItem.category_cod,
          extinguisher_agente_item_code: selectedItem.name,
        }),
      };
      await updateExtinguisher(id, payload);
      ModalAlert("Éxito", "Extintor editado exitosamente.", "success");
      fetchData();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Error al editar extintor.";
      setError(message);
      ModalAlert("Error", message, "error");
      return false;
    }
  };

  // 🔹 Eliminar extintor
  const handleDelete = async (id) => {
    try {
      await deleteExtinguisher(id);
      ModalAlert("Éxito", "Extintor eliminado exitosamente.", "success");
      setExtinguishers(prev => prev.filter(e => e.cod_extinguisher !== id));
    } catch (err) {
      const message = err.response?.data?.message || "Error al eliminar extintor.";
      setError(message);
      ModalAlert("Error", message, "error");
    }
  };

  useEffect(() => {
    fetchData();
    fetchItems(); // 🔹 cargamos agentes al montar
  }, []);

  return {
    extinguishers,
    error,
    showForm,
    setShowForm,
    fields,
    handleAdd,
    handleEdit,
    handleDelete,
    searchText,
    searchFeature,
    setSearchText,
    setSearchFeature,
    setError,
    loading,
    handleSearchExtinguishers,
    agentItems,
    extinguisherTypes,
    extinguisherCapacityUnits
  };
}
