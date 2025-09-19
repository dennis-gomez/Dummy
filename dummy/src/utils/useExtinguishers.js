// src/hooks/useExtinguishers.js
import { useState, useEffect } from "react";
import {
  getAllExtinguishers,
  deleteExtinguisher,
  addExtinguisher,
  updateExtinguisher,
} from "../services/extinguisherService";
import ModalAlert from "../components/molecules/modalAlert";

export function useExtinguishers() {
  const [extinguishers, setExtinguishers] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const fields = [
    { name: "extinguisher_serial_number", placeholder: "Número de Serie", width: 250 },
    { name: "extinguisher_manufacturing_date", placeholder: "Fecha de Fabricación", type: "date", width: 250, restriction: "cantAfterToday" },
    { name: "extinguisher_brand", placeholder: "Marca", width: 250 },
    { name: "extinguisher_agent", placeholder: "Agente", width: 250 },
    { name: "extinguisher_installation_date", placeholder: "Fecha de Instalación", type: "date", width: 250, restriction: "betweenManufactureAndToday" },
    { name: "extinguisher_type", placeholder: "Tipo", type: "select", width: 250, options: extinguisherTypes },
    { name: "extinguisher_capacity", placeholder: "Capacidad", width: 250 },
    { name: "extinguisher_next_date_inspection", placeholder: "Próxima Inspección", type: "date", width: 250, restriction: "cantBeforeToday" },
    { name: "extinguisher_location", placeholder: "Ubicación", width: 250 },
    { name: "extinguisher_observations", placeholder: "Observaciones", type: "textarea", width: 780, required: false },
  ];

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (formData) => {
    try {
      setError(null);
      await addExtinguisher(formData);
      ModalAlert("Éxito", "Extintor agregado exitosamente.", "success");
      fetchData();
      setShowForm(false);
    } catch (err) {
      const message = err.response?.data?.message || "Error al agregar extintor.";
      setError(message);
      ModalAlert("Error", message, "error");
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      setError(null);
      await updateExtinguisher(id, updatedData);
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

  const handleDelete = async (id) => {
    try {
      await deleteExtinguisher(id);
      ModalAlert("Éxito", "Extintor eliminado exitosamente.", "success");
      setExtinguishers((prev) => prev.filter((e) => e.cod_extinguisher !== id));
    } catch (err) {
      const message = err.response?.data?.message || "Error al eliminar extintor.";
      setError(message);
      ModalAlert("Error", message, "error");
    }
  };

  return {
    extinguishers,
    error,
    showForm,
    setShowForm,
    fields,
    handleAdd,
    handleEdit,
    handleDelete,
  };
}
