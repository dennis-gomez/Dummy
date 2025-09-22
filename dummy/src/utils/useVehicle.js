import { useEffect, useState } from "react";
import { addVehicle, getVehicles, updateVehicle, deleteVehicle, getVehicleByFeature } from "../services/vehicleService";
import ModalAlert from "../components/molecules/modalAlert";

export const useVehicles = () => {
    const [vehicles, setVehicles] = useState([]); // manejo de listado de vehiculos  
    const [showForm, setShowForm] = useState(false); // estado (true/false) para mostrar formulario
    const [error, setError] = useState(null); // manejo de errores por parte del backend

    const [loading, setLoading] = useState(false); // manejo de loading al encontrar vehiculos

    const fields = [
        { 
            name: "vehicle_brand", 
            placeholder: "Marca", 
            validations: [
                (value) =>
                    value && value.length > 20 ? "La marca debe tener máximo 20 caracteres." : null,
            ],
            width: 250
        },
        { 
            name: "vehicle_model", 
            placeholder: "Modelo", 
            validations: [
                (value) =>
                    value && value.length > 50 ? "El modelo debe tener máximo 50 caracteres." : null,
            ],
            width: 250
        },
        { 
            name: "vehicle_year", 
            placeholder: "Año", 
            type: "number", 
            restriction: "vehicle_year_restrictions", 
            width: 250
        },
        { 
            name: "vehicle_plate", 
            placeholder: "Placa", 
            validations: [
                (value) =>
                    value && value.length > 10 ? "La placa debe tener máximo 10 caracteres." : null,
            ],
            width: 250
        },
        { 
            name: "vehicle_initial_km", 
            placeholder: "Kilometraje inicial", 
            type: "number", 
            restriction: "vehicle_initial_km_restrictions", 
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
        { 
            name: "vehicle_last_km_maintenance", 
            placeholder: "Último mantenimiento (km)", 
            type: "number", 
            restriction: "vehicle_last_km_maintenance_restrictions", 
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
        { 
            name: "vehicle_frecuency_of_change", 
            placeholder: "Frecuencia de cambio (km)", 
            type: "number", 
            width: 250
        },
        { 
            name: "vehicle_type_of_oil", 
            placeholder: "Tipo de aceite", 
            validations: [
                (value) =>
                value && value.length > 50 ? "El tipo de aceite debe tener máximo 50 caracteres." : null,
            ],
            width: 250, 
            multiline: true,
            rows: 2 
        },
        { 
            name: "vehicle_spark_plug_model", 
            placeholder: "Bujía", 
            validations: [
                (value) =>
                value && value.length > 50 ? "La bujía debe tener máximo 50 caracteres." : null,
            ],
            width: 250, 
            multiline: true,
            rows: 2 
        },
        { 
            name: "vehicle_tires_front", 
            placeholder: "Llantas delanteras", 
            validations: [
                (value) =>
                value && value.length > 50 ? "Las llantas delanteras deben tener máximo 50 caracteres." : null,
            ],
            width: 250,
            multiline: true,
            rows: 2 
        },
        { 
            name: "vehicle_tires_back", 
            placeholder: "Llantas traseras", 
            validations: [
                (value) =>
                value && value.length > 50 ? "Las llantas traseras deben tener máximo 50 caracteres." : null,
            ],
            width: 250,
            multiline: true,
            rows: 2 
        },
        { 
            name: "bike_brake_pad", 
            placeholder: "Pastillas de freno", 
            validations: [
                (value) =>
                value && value.length > 50 ? "Las pastillas de freno deben tener máximo 50 caracteres." : null,
            ],
            width: 250, 
            multiline: true,
            rows: 2 
        },
        { 
            name: "vehicle_color", 
            placeholder: "Color", 
            validations: [
                (value) =>
                value && value.length > 30 ? "El color debe tener máximo 30 caracteres." : null,
            ],
            width: 250
        },
    ];

    const [searchText, setSearchText] = useState(""); //manejo de text para buscar vehiculo
    const [searchFeature, setSearchFeature] = useState(fields[0]?.name || ""); //manejo de caracteristica para buscar vehiculo

    // listado de vehiculos
    const fetchVehicles = async () => {
        try {
            const response = await getVehicles();
            setVehicles(response.data);
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los vehículos.";
            setError(message);
        }
    };

    const handleSearchVehicles = async (feature, text) => {
        try {
            setLoading(true);
            const response = await getVehicleByFeature(feature, text);
            setVehicles(response.data);
        } catch (error) {
            const message = error.response?.data?.message || "No se encuentra vehículo.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    };

    // guardado de formulario del vehiculo 
    const handleSubmit = async (formData) => {
        try {
            setError(null);
            const response = await addVehicle(formData);
            if (response.status === 201) {
                ModalAlert("Éxito", "Vehículo agregado exitosamente.", "success");
                fetchVehicles();
                setShowForm(false);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al agregar vehículo.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    // edicion del vehiculo
    const handleEdit = async (updatedData) => {
        try {
            setError(null);
            const response = await updateVehicle(updatedData);
            if (response.status === 200) {
                ModalAlert("Éxito", "Vehículo editado exitosamente.", "success");
                fetchVehicles();
            }
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Error al editar vehículo.";
            ModalAlert("Error", message, "error");
            setError(message);
            return false;
        }
    };

    // eliminacion de vehiculo
    const handleDelete = async (id) => {
        try {
            const response = await deleteVehicle(id);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message, "success");
                fetchVehicles();
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar vehículo.";
            ModalAlert("Error", message, "error");
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
