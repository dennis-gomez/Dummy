import { useEffect, useState } from "react";
import { addVehicle, getVehicles, updateVehicle, deleteVehicle, getVehicleByFeature } from "../services/vehicleService";
import Swal from "sweetalert2";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "vehicle_brand", placeholder: "Marca", validations: [(v) => v && v.length > 20 ? "La marca debe tener máximo 20 caracteres." : null], width: 250 },
    { name: "vehicle_model", placeholder: "Modelo", validations: [(v) => v && v.length > 50 ? "El modelo debe tener máximo 50 caracteres." : null], width: 250 },
    { name: "vehicle_year", placeholder: "Año", type: "number", restriction: "vehicle_year_restrictions", width: 250 },
    { name: "vehicle_plate", placeholder: "Placa", validations: [(v) => v && v.length > 10 ? "La placa debe tener máximo 10 caracteres." : null], width: 250 },
    { name: "vehicle_initial_km", placeholder: "Kilometraje inicial", type: "number", width: 250 },
    { name: "vehicle_last_km_maintenance", placeholder: "Último mantenimiento (km)", type: "number", width: 250 },
    { name: "vehicle_frecuency_of_change", placeholder: "Frecuencia de cambio (km)", type: "number", width: 250 },
    { name: "vehicle_type_of_oil", placeholder: "Tipo de aceite", width: 250, multiline: true, rows: 2 },
    { name: "vehicle_spark_plug_model", placeholder: "Bujía", width: 250, multiline: true, rows: 2 },
    { name: "vehicle_tires_front", placeholder: "Llantas delanteras", width: 250, multiline: true, rows: 2 },
    { name: "vehicle_tires_back", placeholder: "Llantas traseras", width: 250, multiline: true, rows: 2 },
    { name: "bike_brake_pad", placeholder: "Pastillas de freno", width: 250, multiline: true, rows: 2 },
    { name: "vehicle_color", placeholder: "Color", validations: [(v) => v && v.length > 30 ? "El color debe tener máximo 30 caracteres." : null], width: 250 },
  ];

  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState(fields[0]?.name || "");

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await getVehicles();
      setVehicles(response.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Error al obtener los vehículos.";
      setError(msg);
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchVehicles = async (feature, text) => {
    try {
      setLoading(true);
      const response = await getVehicleByFeature(feature, text);
      setVehicles(response.data);
    } catch (err) {
      const msg = err.response?.data?.message || "No se encuentra vehículo.";
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const response = await addVehicle(formData);
      if (response.status === 201) {
        Swal.fire("Éxito", "Vehículo agregado exitosamente.", "success");
        await fetchVehicles();
        setShowForm(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error al agregar vehículo.";
      Swal.fire("Error", msg, "error");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (updatedData) => {
    const confirm = await Swal.fire({
      title: "¿Guardar cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
    });

    if (!confirm.isConfirmed) return false;

    try {
      setLoading(true);
      const response = await updateVehicle(updatedData);
      if (response.status === 200) {
        Swal.fire("Actualizado", "Vehículo editado exitosamente.", "success");
        await fetchVehicles();
      }
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Error al editar vehículo.";
      Swal.fire("Error", msg, "error");
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar este vehículo?",
      text: "No podrás deshacer esta acción",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const response = await deleteVehicle(id);
      if (response.status === 200) {
        Swal.fire("Eliminado", response.data.message, "success");
        await fetchVehicles();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error al eliminar vehículo.";
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return {
    vehicles,
    fields,
    searchText,
    searchFeature,
    setSearchText,
    setSearchFeature,
    showForm,
    setShowForm,
    error,
    setError,
    loading,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleSearchVehicles,
  };
};
