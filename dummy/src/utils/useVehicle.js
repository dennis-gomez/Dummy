import { useEffect, useState } from "react";
import { addVehicle, getVehicles, updateVehicle, deleteVehicle, getVehicleByFeature } from "../services/vehicleService";
import Swal from "sweetalert2";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

      const fields = [
        { name: "vehicle_brand", placeholder: "Marca", validations: [(value) => value && value.length > 20 ? "La marca debe tener máximo 20 caracteres." : null,], width: 383 },
        { name: "vehicle_model", placeholder: "Modelo", validations: [(value) => value && value.length > 50 ? "El modelo debe tener máximo 50 caracteres." : null,], width: 383 },
        { name: "vehicle_year", placeholder: "A\u00F1o", type: "number", restriction: "vehicle_year_restrictions", width: 250 },
        { name: "vehicle_plate", placeholder: "Placa", restriction: "unique", validations: [(value) => value && value.length > 10 ? "La placa debe tener máximo 10 caracteres." : null, ], width: 250, },
        { name: "vehicle_initial_km", placeholder: "Kilometraje Inicial", type: "number", restriction: "vehicle_initial_km_restrictions",   
            validations: [
                (value, allValues) => {
                if (
                    allValues.vehicle_last_km_maintenance &&
                    Number(value) < Number(allValues.vehicle_last_km_maintenance)
                ) {
                    return "El kilometraje inicial debe ser mayor o igual al del último mantenimiento.";
                }
                return null;
                },
            ],
            width: 250
        },
        { name: "vehicle_last_km_maintenance", placeholder: "\u00DAltimo Mantenimiento (km)", type: "number", restriction: "vehicle_last_km_maintenance_restrictions", 
            validations: [
                (value, allValues) => {
                if (
                    allValues.vehicle_initial_km &&
                    Number(value) > Number(allValues.vehicle_initial_km)
                ) {
                    return "El último mantenimiento no puede superar el kilometraje inicial.";
                }
                return null;
                },
            ],
            width: 250
        },
        { name: "vehicle_frecuency_of_change", placeholder: "Frecuencia De Cambio (km)", type: "number", width: 250 },
        { name: "vehicle_type_of_oil", placeholder: "Tipo De Aceite", validations: [ (value) => value && value.length > 50 ? "El tipo de aceite debe tener máximo 50 caracteres." : null, ], width: 250, multiline: true, rows: 2 },
        { name: "vehicle_spark_plug_model", placeholder: "Buj\u00EDa", validations: [(value) => value && value.length > 50 ? "La bujía debe tener máximo 50 caracteres." : null,], width: 250, multiline: true, rows: 2 },
        { name: "vehicle_tires_front", placeholder: "Llantas Delanteras", validations: [ (value) => value && value.length > 50 ? "Las llantas delanteras deben tener máximo 50 caracteres." : null, ], width: 250, multiline: true, rows: 2 },
        { name: "vehicle_tires_back", placeholder: "Llantas Traseras", validations: [ (value) => value && value.length > 50 ? "Las llantas traseras deben tener máximo 50 caracteres." : null, ], width: 250, multiline: true, rows: 2 },
        { name: "bike_brake_pad", placeholder: "Pastillas De Freno", validations: [ (value) => value && value.length > 50 ? "Las pastillas de freno deben tener máximo 50 caracteres." : null, ], width: 383, multiline: true, rows: 2 },
        { name: "vehicle_color", placeholder: "Color", validations: [(value) => value && value.length > 30 ? "El color debe tener máximo 30 caracteres." : null,],width: 383},
    ];

    const editFields = [
        { name: "vehicle_brand", placeholder: "Marca", validations: [(value) => value && value.length > 20 ? "La marca debe tener máximo 20 caracteres." : null,], width: 150 },
        { name: "vehicle_model", placeholder: "Modelo", validations: [(value) => value && value.length > 50 ? "El modelo debe tener máximo 50 caracteres." : null,], width: 150 },
        { name: "vehicle_year", placeholder: "A\u00F1o", type: "number", restriction: "vehicle_year_restrictions", width: 100 },
        { name: "vehicle_plate", placeholder: "Placa", restriction: "unique", validations: [(value) => value && value.length > 10 ? "La placa debe tener máximo 10 caracteres." : null, ], width: 130 },
        { name: "vehicle_initial_km", placeholder: "Kilometraje Inicial", type: "number", restriction: "vehicle_initial_km_restrictions", width: 175, required: false},
        { name: "vehicle_last_km_maintenance", placeholder: "\u00DAltimo Mantenimiento", type: "number", restriction: "vehicle_last_km_maintenance_restrictions", width: 205, required: false},
        { name: "vehicle_frecuency_of_change", placeholder: "Frecuencia De Cambio", type: "number", width: 205 },
        { name: "vehicle_type_of_oil", placeholder: "Tipo De Aceite", validations: [ (value) => value && value.length > 50 ? "El tipo de aceite debe tener máximo 50 caracteres." : null, ], width: 150, multiline: true, rows: 2 },
        { name: "vehicle_spark_plug_model", placeholder: "Buj\u00EDa", validations: [(value) => value && value.length > 50 ? "La bujía debe tener máximo 50 caracteres." : null,], width: 150, multiline: true, rows: 2 },
        { name: "vehicle_tires_front", placeholder: "Llantas Delanteras", validations: [ (value) => value && value.length > 50 ? "Las llantas delanteras deben tener máximo 50 caracteres." : null, ], width: 150, multiline: true, rows: 2 },
        { name: "vehicle_tires_back", placeholder: "Llantas Traseras", validations: [ (value) => value && value.length > 50 ? "Las llantas traseras deben tener máximo 50 caracteres." : null, ], width: 150, multiline: true, rows: 2 },
        { name: "bike_brake_pad", placeholder: "Pastillas De Freno", validations: [ (value) => value && value.length > 50 ? "Las pastillas de freno deben tener máximo 50 caracteres." : null, ], width: 150, multiline: true, rows: 2 },
        { name: "vehicle_color", placeholder: "Color", validations: [(value) => value && value.length > 30 ? "El color debe tener máximo 30 caracteres." : null,],width: 120},
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
      setError(null);
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
        setError(null);
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
        setError(null);
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
    try {
      setLoading(true);
      const response = await deleteVehicle(id);
      if (response.status === 200) {
        Swal.fire("Eliminado", response.data.message, "success");
        await fetchVehicles();
        setError(null);
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
    editFields,
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
