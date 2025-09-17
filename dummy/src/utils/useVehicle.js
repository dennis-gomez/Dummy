import { useEffect, useState } from "react";
import { addVehicle, getVehicles, updateVehicle, deleteVehicle } from "../services/vehicleService";
import ModalAlert from "../components/molecules/modalAlert";
//hh
export const useVehicles = () => {
    const [vehicles, setVehicles] = useState([]); // manejo de listado de vehiculos  
    const [showForm, setShowForm] = useState(false); // estado (true/false) para mostrar formulario
    const [error, setError] = useState(null); // manejo de errores por parte del backend

    const fields = [
        { 
            name: "vehicle_brand", 
            placeholder: "Marca", 
            validations: [
                (value) =>
                    value && value.length > 20 ? "La marca no puede superar los 20 caracteres" : null,
            ],
        },
        { 
            name: "vehicle_model", 
            placeholder: "Modelo", 
            validations: [
                (value) =>
                    value && value.length > 50 ? "El modelo no puede superar los 50 caracteres" : null,
            ],
        },
        { 
            name: "vehicle_year", 
            placeholder: "Año", 
            type: "number", 
            restriction: "vehicle_year_restrictions" 
        },
        { 
            name: "vehicle_plate", 
            placeholder: "Placa", 
            validations: [
                (value) =>
                    value && value.length > 10 ? "La placa no puede superar los 10 caracteres" : null,
            ],
        },
        { 
            name: "vehicle_initial_km", 
            placeholder: "Kilometraje inicial", 
            type: "number", 
            restriction: "vehicle_initial_km_restrictions" 
        },
        { 
            name: "vehicle_last_km_maintenance", 
            placeholder: "Último mantenimiento (km)", 
            type: "number", 
            restriction: "vehicle_last_km_maintenance_restrictions" 
        },
        { 
            name: "vehicle_frecuency_of_change", 
            placeholder: "Frecuencia de cambio (km)", 
            type: "number" 
        },
        { 
            name: "vehicle_type_of_oil", 
            placeholder: "Tipo de aceite", 
            validations: [
                (value) =>
                value && value.length > 50 ? "El tipo de aceite no puede superar los 50 caracteres" : null,
            ],
        },
        { 
            name: "vehicle_spark_plug_model", 
            placeholder: "Bujía", 
            validations: [
                (value) =>
                value && value.length > 50 ? "La bujía no puede superar los 50 caracteres" : null,
            ],
        },
        { 
            name: "vehicle_tires_front", 
            placeholder: "Llantas delanteras", 
            validations: [
                (value) =>
                value && value.length > 50 ? "Las llantas delanteras no puede superar los 50 caracteres" : null,
            ],
        },
        { 
            name: "vehicle_tires_back", 
            placeholder: "Llantas traseras", 
            validations: [
                (value) =>
                value && value.length > 50 ? "Las llantas traseras no puede superar los 50 caracteres" : null,
            ],
        },
        { 
            name: "bike_brake_pad", 
            placeholder: "Pastillas de freno", 
            validations: [
                (value) =>
                value && value.length > 50 ? "Las pastillas de freno no puede superar los 50 caracteres" : null,
            ],
        },
        { 
            name: "vehicle_color", 
            placeholder: "Color", 
            validations: [
                (value) =>
                value && value.length > 30 ? "El color no puede superar los 30 caracteres" : null,
            ],
        },
    ];

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
        showForm,
        setShowForm,
        error,
        setError,
        handleSubmit,
        handleEdit,
        handleDelete,
    };
};
