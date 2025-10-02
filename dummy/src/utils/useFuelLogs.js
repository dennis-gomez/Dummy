import { useState, useEffect } from "react"
import { 
    getActiveFuelLogs, 
    findFuelLogs, 
    addFuelLog, 
    deleteFuelLog, 
    updateFuelLog, 
} from "../services/fuelLogsService";

import { getItems } from "../services/itemService";

import {
    getActiveVehiclesNames,
    getAllVehiclesNames
} from "../services/vehicleService";

import ModalAlert from "../components/molecules/modalAlert";

export const useFuelLogs = () => {
    const [fuelLogs, setFuelLogs] = useState([]); //manejo de listado de registros de combustibles
    const [activeVehiclesItems, setActiveVehiclesItems] = useState([]); //opciones de combobox de vehiculos activos (agregar)
    const [allVehiclesItems, setAllVehiclesItems] = useState([]); //opciones de combobox de vehiculos activos y inactivos (editar)
    const [fuelTypes, setFuelTypes] = useState([]); //opciones de combobox de combustibles
    const [showForm, setShowForm] = useState(false); // muestra de form
    const [loading, setLoading] = useState(false); //manejo de muestra de cargado
    const [error, setError] = useState(null); // manejo de errores

    const fields = [
        { name: "cod_vehicle", placeholder: "Vehículos", required: true, type: "select", options: activeVehiclesItems, width: 780},
        { name: "fuel_log_route", placeholder: "Ruta", required: true, type: "textarea", width: 780},
        { name: "fuel_log_date", placeholder: "Fecha de Registro", required: true, type: "date", width: 382, restriction: "cantAfterToday" },
        { name: "fuel_log_type_item_code", placeholder: "Tipo de Combustible", required: true, type: "select", options: fuelTypes, width: 382},
        { name: "fuel_log_quantity", placeholder: "Cantidad", type: "number", restriction: "vehicle_initial_km_restrictions", width: 250},
        { name: "fuel_log_price", placeholder: "Precio", type: "number", restriction: "vehicle_initial_km_restrictions", width: 250},
        { name: "fuel_log_final_km", placeholder: "Kilometraje Recorrido", type: "number", restriction: "vehicle_initial_km_restrictions", width: 250}, 
    ];

    const editFields = [
        { name: "cod_vehicle", placeholder: "Vehículos", required: true, type: "select", options: activeVehiclesItems, width: 200},
        { name: "fuel_log_route", placeholder: "Ruta", required: true, type: "textarea", width: 200},
        { name: "fuel_log_date", placeholder: "Fecha de registro", required: true, type: "date", width: 150, restriction: "cantAfterToday" },
        { name: "fuel_log_type_item_code", placeholder: "Tipo de combustible", required: true, type: "select", options: fuelTypes, width: 200},
        { name: "fuel_log_final_km", placeholder: "Kilometraje recorrido", type: "number", restriction: "vehicle_initial_km_restrictions", width: 200},
        { name: "fuel_log_price", placeholder: "Precio", type: "number", restriction: "vehicle_initial_km_restrictions", width: 150},
        { name: "fuel_log_quantity", placeholder: "Cantidad", type: "number", restriction: "vehicle_initial_km_restrictions", width: 150},
    ];

    // Estados para filtrado
    const [selectedVehicle, setSelectedVehicle] = useState("Todos"); //vehiculos a filtrar 
    const [searchField, setSearchField] = useState(fields[0]?.name || ""); //caracteristicas del vehiculo a filtrar
    const [searchText, setSearchText] = useState(""); //texto a buscar

    // Cargado de tipos de combustible
    const fetchTypesOfFuel = async () => {
        try {
            const typesResp = await getItems(
                Number(import.meta.env.VITE_VEHICLE_SERVICE_CODE),
                Number(import.meta.env.VITE_VEHICLE_FUEL_CATEGORY_CODE)
            );
            setFuelTypes(typesResp.map(type => ({ value: type.cod_item, label: type.item_name })));
        } catch (err) {
            setError("Error al obtener tipos de libros");
            ModalAlert("Error", "Error al obtener tipos de libros", "error");
            return [];
        }
    };

    // Listado de registros de combustibles
    const fetchFuelLogs = async (vehicleId = "", field = "", text = "") => {
        try {
            setLoading(true);
            let response;
            if (vehicleId === "Todos" && !String(text).trim()) {
                response = await getActiveFuelLogs();
                setError(null);
            } else {
                response = await findFuelLogs(vehicleId, field, text);
                setError(null);
            }
            setFuelLogs(response.data);
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los registros.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    };

    //manejo de filtrado
    const handleSearch = async () => {
        await fetchFuelLogs(selectedVehicle, searchField, searchText);
    };

    // Resetear filtros y cargar todos los registros
    const handleResetSearch = async () => {
        setSelectedVehicle("Todos");
        setSearchField(fields[0]?.name || "");
        setSearchText("");
        await fetchFuelLogs();
    };

    // Agregar registro
    const handleSubmit = async (formData) => {
        try {
            const dataToSend = {
                ...formData,
                fuel_log_type_service_code: Number(import.meta.env.VITE_VEHICLE_SERVICE_CODE), 
                fuel_log_type_category_code: Number(import.meta.env.VITE_VEHICLE_FUEL_CATEGORY_CODE),
            };

            const response = await addFuelLog(dataToSend);

            if (response.status === 201) {
                ModalAlert("Éxito", "Registro agregado exitosamente.", "success");
                await fetchFuelLogs();
                setShowForm(false);
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al agregar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    // Editar registro de combustible
    const handleEdit = async (updatedData) => {
        try {
            const response = await updateFuelLog(updatedData);
            if (response.status === 200) {
                ModalAlert("Éxito", "Registro editado exitosamente.", "success");
                await fetchFuelLogs();
                setError(null);
            }
            return true;
        } catch (error) {
            const message = error.response?.data?.message || "Error al editar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
            return false;
        }
    };

    // Eliminar registro
    const handleDelete = async (cod_fuel_log) => {
        try {
            const response = await deleteFuelLog(cod_fuel_log);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message || "Registro eliminado.", "success");
                await fetchFuelLogs();
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    useEffect(() => {
        fetchFuelLogs();
        const loadVehicles = async () => {
            try {
                const activeVehicles = await getActiveVehiclesNames();
                const allVehicles = await getAllVehiclesNames();
                await fetchTypesOfFuel();

                setActiveVehiclesItems(
                    activeVehicles.data.map((i) => ({
                        name: i.cod_vehicle,
                        placeholder: i.vehicle_brand + " - " + i.vehicle_plate,
                        value: i.cod_vehicle,
                        label: i.vehicle_brand + " - " + i.vehicle_plate,
                    }))
                );
                setAllVehiclesItems(
                    allVehicles.data.map((i) => ({
                        name: i.cod_vehicle,
                        placeholder: i.vehicle_brand + " - " + i.vehicle_plate,
                        value: i.cod_vehicle,
                        label: i.vehicle_brand + " - " + i.vehicle_plate,
                    }))
                )

                console.log("SI", activeVehicles);
                console.log("NO", allVehicles.data);

                setError(null);
            } catch (error) {
                const message = error.response?.data?.message || "Error al obtener los catálogos de libros.";
                ModalAlert("Error", message, "error");
                setError(message);
            }
        };
        loadVehicles();
    }, []);
    
    return {
        fields,
        editFields,
        fuelLogs,
        allVehiclesItems,
        showForm,
        loading,
        error,
        setError,
        searchField,
        searchText,
        selectedVehicle,
        setShowForm,
        setSearchField,
        setSearchText,
        setSelectedVehicle,
        handleSearch,
        handleResetSearch,
        handleSubmit,
        handleEdit,
        handleDelete
    };

} 