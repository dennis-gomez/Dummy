import { useState, useEffect } from "react"
import { 
    getActiveFuelLogs, 
    getAllFuelLogs,
    findFuelLogs, 
    addFuelLog, 
    deleteFuelLog, 
    updateFuelLog, 
    reactivateFuelLogs, 
} from "../services/fuelLogsService";

import { getItems } from "../services/itemService";

import {
    getActiveVehiclesNames,
    getAllVehiclesNames
} from "../services/vehicleService";

import ModalAlert from "../components/molecules/modalAlert";

export const useFuelLogs = () => {
    const [fuelLogs, setFuelLogs] = useState([]); //manejo de listado de registros de combustibles
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);

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
        { name: "fuel_log_quantity", placeholder: "Cantidad en Litros", type: "number", width: 250},
        { name: "fuel_log_price", placeholder: "Precio", type: "number", width: 250},
        { name: "fuel_log_final_km", placeholder: "Kilometraje Recorrido", type: "number", width: 250}, 
    ];

    const editFields = [
        { name: "cod_vehicle", placeholder: "Vehículos", required: true, type: "select", options: activeVehiclesItems, width: 200},
        { name: "fuel_log_route", placeholder: "Ruta", required: true, type: "textarea", width: 200},
        { name: "fuel_log_date", placeholder: "Fecha de Registro", required: true, type: "date", width: 150, restriction: "cantAfterToday" },
        { name: "fuel_log_type_item_code", placeholder: "Tipo de Combustible", required: true, type: "select", options: fuelTypes, width: 200},
        { name: "fuel_log_quantity", placeholder: "Cantidad en Litros", type: "number", width: 150},
        { name: "fuel_log_price", placeholder: "Precio", type: "number", width: 150},
        { name: "fuel_log_final_km", placeholder: "Kilometraje Recorrido", type: "number", width: 200},
    ];

    // Estados para filtrado
    const [selectedVehicle, setSelectedVehicle] = useState("Todos"); //vehiculos a filtrar 
    const [searchField, setSearchField] = useState(fields[1]?.name || ""); //caracteristicas del vehiculo a filtrar
    const [searchText, setSearchText] = useState(""); //texto a buscar

    //Estados para busqueda aplicada anteriormente, evita una mala paginacion
    const [appliedVehicle, setAppliedVehicle] = useState("Todos");
    const [appliedField, setAppliedField] = useState(fields[1]?.name || "");
    const [appliedText, setAppliedText] = useState("");

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
    const fetchFuelLogs = async (vehicleId = "", field = "", text = "", currentPage = page) => {
        try {
            setLoading(true);
            let response;
            if (text === "Activos" || (vehicleId === "Todos" && !String(text).trim()) ){
                response = await getActiveFuelLogs(currentPage, pageSize);
            } else if (text === "Desactivados" ) {
                response = await getAllFuelLogs(currentPage, pageSize);
                setError(null);
            } else {
                response = await findFuelLogs(vehicleId, field, text, currentPage, pageSize);
                setError(null);
            }
            setPage(currentPage);
            setFuelLogs(response.data.data);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            setFuelLogs(null); // si no existe registros con los criterios esperados, se elimina lista para forzar a volver a listar
            const message = error.response?.data?.message || "Error al obtener los registros.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    };

    //manejo de filtrado
    const handleSearch = async () => {
        //guardado de filtrado anterior
        setAppliedVehicle(selectedVehicle);
        setAppliedField(searchField);
        setAppliedText(searchText);
        await fetchFuelLogs(selectedVehicle, searchField, searchText, 1);
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
                await fetchFuelLogs(appliedVehicle, appliedField, appliedText, 1);
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
                await fetchFuelLogs(appliedVehicle, appliedField, appliedText, page);
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
                ModalAlert("Éxito", response.data.message || "Registro desactivado.", "success");
                await fetchFuelLogs(appliedVehicle, appliedField, appliedText, 1);
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al desactivar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    // Reactivar registros inhabilitados
    const handleReactivate = async (cod_fuel_log) => {
        try {
            const response = await reactivateFuelLogs(cod_fuel_log);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message || "Registro reactivado exitosamente.", "success");
                await fetchFuelLogs(appliedVehicle, appliedField, appliedText, 1);
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al reactivar registro.";
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
                        placeholder: i.vehicle_brand + "  -  " + i.vehicle_plate,
                        value: i.cod_vehicle,
                        label: i.vehicle_brand + "  -  " + i.vehicle_plate,
                    }))
                );
                setAllVehiclesItems(
                    allVehicles.data.map((i) => ({
                        name: i.cod_vehicle,
                        placeholder: i.vehicle_brand + "  -  " + i.vehicle_plate,
                        value: i.cod_vehicle,
                        label: i.vehicle_brand + "  -  " + i.vehicle_plate,
                    }))
                );
                setError(null);
            } catch (error) {
                const message = error.response?.data?.message || "Error al obtener los catálogos de libros.";
                ModalAlert("Error", message, "error");
                setError(message);
            }
        };
        loadVehicles();
    }, []);

    const handlePageChange = async (newPage) => {
        await fetchFuelLogs(appliedVehicle, appliedField, appliedText, newPage);
    };
    
    return {
        fields,
        editFields,
        fuelLogs,

        page,
        totalPages,
        handlePageChange,

        allVehiclesItems,
        activeVehiclesItems,

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
        handleDelete, 
        handleReactivate
    };

} 