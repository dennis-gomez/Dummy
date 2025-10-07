import { useState, useEffect } from "react"
import { 
    getActiveMaintenanceLogs, 
    getAllMaintenanceLogs,
    findMaintenanceLogs, 
    addMaintenanceLog, 
    deleteMaintenanceLog, 
    updateMaintenanceLog, 
} from "../services/vehicleMaintenanceService";

import { getItems } from "../services/itemService";

import {
    getActiveVehiclesNames,
    getAllVehiclesNames
} from "../services/vehicleService";

import ModalAlert from "../components/molecules/modalAlert";

export const useVehicleMaintenance = () => {

    //paginacion
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5); // 10 registros por página por defecto


    const [activeVehiclesItems, setActiveVehiclesItems] = useState([]); //opciones de combobox de vehiculos activos (agregar)
    const [allVehiclesItems, setAllVehiclesItems] = useState([]); //opciones de combobox de vehiculos activos y inactivos (editar)
    const [maintenanceTypes, setMaintenanceTypes] = useState([]); // tipos de manteniminetos
    const [showForm, setShowForm] = useState(false); // muestra de form
    const [loading, setLoading] = useState(false); //manejo de muestra de cargado
    const [error, setError] = useState(null); // manejo de errores

    const fields = [
        { name: "cod_vehicle", placeholder: "Vehículos", required: true, type: "select", options: activeVehiclesItems, width: 390},
        { name: "maintenance_type_item_code", placeholder: "Tipo de Maintenimiento", required: true, type: "select", options: maintenanceTypes, width: 390},
        { name: "maintenance_km_acumulate", placeholder: "Kilometraje Acumulado", type: "number", restriction: "vehicle_initial_km_restrictions", width: 390}, 
        { name: "maintenance_date", placeholder: "Fecha de Registro", required: true, type: "date", width: 390, restriction: "cantAfterToday" },
        { name: "maintenance_detail", placeholder: "Detalles", required: true, type: "textarea", width: 798},
    ];

    const editFields = [
        { name: "cod_vehicle", placeholder: "Vehículos", required: true, type: "select", options: allVehiclesItems, width: 200},
        { name: "maintenance_type_item_code", placeholder: "Tipo de Maintenimiento", required: true, type: "select", options: maintenanceTypes, width: 200},
        { name: "maintenance_km_acumulate", placeholder: "Kilometraje Acumulado", type: "number", restriction: "vehicle_initial_km_restrictions", width: 170}, 
        { name: "maintenance_date", placeholder: "Fecha de Registro", required: true, type: "date", width: 170, restriction: "cantAfterToday" },
        { name: "maintenance_detail", placeholder: "Detalles", required: true, type: "textarea", width: 300},
    ];

    // Estados para filtrado
    const [selectedVehicle, setSelectedVehicle] = useState("Todos"); //vehiculos a filtrar 
    const [searchField, setSearchField] = useState(fields[1]?.name || ""); //caracteristicas del vehiculo a filtrar
    const [searchText, setSearchText] = useState(""); //texto a buscar

    // Cargado de tipos de mantenimientos
    const fetchTypesOfMaintenance = async () => {
        try {
            const typesResp = await getItems(
                Number(import.meta.env.VITE_VEHICLE_SERVICE_CODE),
                Number(import.meta.env.VITE_VEHICLE_MAINTENANCE_CODE)
            );
            setMaintenanceTypes(typesResp.map(type => ({ value: type.cod_item, label: type.item_name })));
        } catch (err) {
            setError("Error al obtener tipos de libros");
            ModalAlert("Error", "Error al obtener tipos de libros", "error");
            return [];
        }
    };

    // Listado de registros de mantenimientos
    const fetchMaintenance = async (vehicleId = "", field = "", text = "", currentPage = page) => {
        try {
            setLoading(true);
            let response;
            if (field === "Inactivos") {
                response = await getAllMaintenanceLogs(currentPage, pageSize);
                setError(null);
            } else if (vehicleId === "Todos" && !String(text).trim()) {
                response = await getActiveMaintenanceLogs(currentPage, pageSize);
                setError(null);
            } else {
                response = await findMaintenanceLogs(vehicleId, field, text, currentPage, pageSize);
                setError(null);
            }
            setLogs(response.data);
            setTotalPages(response.totalPages || 1);

        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los registros.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    };

    //manejo de filtrado
    const handleSearch = async () => {
        await fetchMaintenance(selectedVehicle, searchField, searchText, 1);
        setPage(1);
    };

    // Resetear filtros y cargar todos los registros
    const handleResetSearch = async () => {
        setSelectedVehicle("Todos");
        setSearchField(fields[0]?.name || "");
        setSearchText("");
        setPage(1);
        await fetchMaintenance();
    };

    // Agregar registro
    const handleSubmit = async (formData) => {
        try {
            const dataToSend = {
                ...formData,
                maintenance_type_service_code: Number(import.meta.env.VITE_VEHICLE_SERVICE_CODE), 
                maintenance_type_category_code: Number(import.meta.env.VITE_VEHICLE_MAINTENANCE_CODE),
            };

            const response = await addMaintenanceLog(dataToSend);

            if (response.status === 201) {
                ModalAlert("Éxito", "Registro agregado exitosamente.", "success");
                await fetchMaintenance();
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
            const response = await updateMaintenanceLog(updatedData);
            if (response.status === 200) {
                ModalAlert("Éxito", "Registro editado exitosamente.", "success");
                await fetchMaintenance();
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

    // Inhabilitar registro
    const handleDelete = async (cod_maintenance) => {
        try {
            const response = await deleteMaintenanceLog(cod_maintenance);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message || "Registro eliminado.", "success");
                await fetchMaintenance();
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    useEffect(() => {
        fetchMaintenance();
        const init = async () => {
            await fetchTypesOfMaintenance();
            try {
                const activeVehicles = await getActiveVehiclesNames();
                const allVehicles = await getAllVehiclesNames();
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
        init();
    }, []);

    const handlePageChange = async (newPage) => {
        setPage(newPage);
        await fetchMaintenance(selectedVehicle, searchField, searchText, newPage);
    };


    return {
        logs,
        allVehiclesItems,
        page,
        totalPages,
        loading,
        error,
        setError,
        showForm,
        setShowForm,

        fields,
        editFields,

        maintenanceTypes, 

        selectedVehicle,
        setSelectedVehicle,
        searchField,
        setSearchField,
        searchText,
        setSearchText,

        handleSearch,
        //handleResetSearch,
        handleSubmit,
        handleEdit,
        handleDelete,
        handlePageChange,
        //setPage,
    };
};