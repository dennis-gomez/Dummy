import { useState, useEffect } from "react"
import { 
    getActiveMaintenanceLogs, 
    getAllMaintenanceLogs,
    findMaintenanceLogs, 
    addMaintenanceLog, 
    deleteMaintenanceLog, 
    updateMaintenanceLog, 
    reactivateMaintenanceLog,
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
        { name: "maintenance_detail", placeholder: "Detalles", required: false, type: "textarea", width: 798},
    ];

    const editFields = [
        { name: "cod_vehicle", placeholder: "Vehículos", required: true, type: "select", options: activeVehiclesItems, width: 200},
        { name: "maintenance_type_item_code", placeholder: "Tipo de Maintenimiento", required: true, type: "select", options: maintenanceTypes, width: 200},
        { name: "maintenance_km_acumulate", placeholder: "Kilometraje Acumulado", type: "number", restriction: "vehicle_initial_km_restrictions", width: 170}, 
        { name: "maintenance_date", placeholder: "Fecha de Registro", required: true, type: "date", width: 170, restriction: "cantAfterToday" },
        { name: "maintenance_detail", placeholder: "Detalles", required: false, type: "textarea", width: 300},
    ];

    // Estados para filtrado
    const [selectedVehicle, setSelectedVehicle] = useState("Todos"); //vehiculos a filtrar 
    const [searchField, setSearchField] = useState(fields[1]?.name || ""); //caracteristicas del vehiculo a filtrar
    const [searchText, setSearchText] = useState(""); //texto a buscar

    const [appliedRecord, setAppliedRecord] = useState("Todos");
    const [appliedField, setAppliedField] = useState(fields[1]?.name || "");
    const [appliedText, setAppliedText] = useState("");

    //manejo de ordenamiento de fecha maintenance_date
    const [sortConfig, setSortConfig] = useState({
        field: "maintenance_date",
        order: "DESC"
    });

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

    const fetchRecords = async (pageNum = page, filters = {}, customSortConfig = null) => {
        try {
            setLoading(true);
            let response;
            const { veh = appliedRecord, field = appliedField, text = appliedText } = filters;

            const currentSortConfig = customSortConfig || sortConfig;
    
            if (text === "Desactivados") {
                response = await getAllMaintenanceLogs(pageNum, pageSize, currentSortConfig.field, currentSortConfig.order);
            } else if ((veh === "Todos" && !String(text).trim()) || text === "Activos") {
                response = await getActiveMaintenanceLogs(pageNum, pageSize, currentSortConfig.field, currentSortConfig.order);
            } else {
                response = await findMaintenanceLogs(veh, field, text, pageNum, pageSize, currentSortConfig.field, currentSortConfig.order);
            }
            setLogs(response.data)
            setTotalPages(response.totalPages || 1);
            setPage(pageNum);
            setError(null);
        } catch (error) {
            setLogs([]);
            const message = error.response?.data?.message || "Error al obtener los registros.";
            ModalAlert("Error", message, "error");
        } finally {
            setLoading(false);
        }
    }; 

    const handleSort = async (field = "maintenance_date", order = null) => {
        const newOrder = order || (sortConfig.field === field && sortConfig.order === "ASC" ? "DESC" : "ASC");
        const newSortConfig = { field, order: newOrder };

        console.log("🔀 Ordenamiento solicitado:");
        console.log(" - Campo:", field);
        console.log(" - Orden:", newOrder);
        console.log(" - Configuración anterior:", sortConfig);
        console.log(" - Configuración nueva:", newSortConfig);

        setSortConfig(newSortConfig);
        await fetchRecords(1, {}, newSortConfig);
    };

    //manejo de filtrado
    const handleSearch = async () => {
        setAppliedRecord(selectedVehicle);
        setAppliedField(searchField);
        setAppliedText(searchText);
        await fetchRecords(1, { veh: selectedVehicle, field: searchField, text: searchText });
    };
    /*
    const handleSortByDate = async (sortOrder) => {
         try {
            setError(null);
            setLoading(true);
            const response = await findMaintenanceLogs(selectedVehicle, searchField, searchText, 1, pageSize, "maintenance_date", sortOrder);
            setLogs(response.data);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            const message = error.response?.data?.message || "Error al ordenar registros.";
            ModalAlert("Error", message, "error");
            setError(message);
        } finally {
            setLoading(false);
        }
    };
    */
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
                await fetchRecords(1, { veh: appliedRecord, field: appliedField, text: appliedText });
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
                await fetchRecords(page);
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
                ModalAlert("Éxito", response.data.message || "Registro desactivado.", "success");
                await fetchRecords(1);
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al desactivar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    // Reactivar registros inhabilitados
    const handleReactivate = async (cod_maintenance) => {
        try {
            const response = await reactivateMaintenanceLog(cod_maintenance);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message || "Registro reactivado exitosamente.", "success");
                await fetchRecords(1);
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al reactivar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchRecords(1);
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
        setLoading(true);
        await fetchRecords(newPage);
    };

    return {
        logs,
        allVehiclesItems,
        activeVehiclesItems,
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
        handleSubmit,
        handleEdit,
        handleDelete,
        handlePageChange,
        handleReactivate,
        //handleSortByDate,

        handleSort,
        sortConfig
    };
};