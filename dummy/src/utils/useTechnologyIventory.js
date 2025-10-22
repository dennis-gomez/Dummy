import { useState, useEffect } from "react"
import { 
    getTechnologyInventory, 
    searchTechnologyInventory, 
    addTechnologyInventory, 
    updateTechnologyInventory,
    deleteTechnologyInventory, 
} from "../services/technologyInventoryService";
import { getItems } from "../services/itemService";
import { getCategorys } from "../services/categoryService"
import ModalAlert from "../components/molecules/modalAlert";

export const useTechnologyInventory = () => {

    const [inventory, setInventory] = useState([]);

    const [showForm, setShowForm] = useState(false); // muestra de form
    const [loading, setLoading] = useState(false); //manejo de muestra de cargado
    const [error, setError] = useState(null); // manejo de errores

    /*
     * Variables de Catalogos  
    */
    const [offices, setOffices] = useState([]) //cargado de oficinas
    const [systemsOperative, setSystemsOperative] = useState([{ value: 0, label: "No tiene", placeholder: "No tiene", name: null }]); //cargado de sistemas operativos
    const [brands, setBrands] = useState([])//cargado de marcas de equipos
    const [categoryAssets, setCategoryAssets] = useState([])// categorias de equipos = {perifericos, equipos, redes, etc}
    const [assets, setAssets] = useState([])

    
    const fields = [
        { name: "it_inventory_serial_number", placeholder: "Número de Serie", required: true, width: 387, validations: [(value) => value && value.length > 50 ? "Número de serie debe tener máximo 50 caracteres." : null,], restriction: "unique" },
        { name: "it_inventory_plate", placeholder: "Placa", required: false, width: 387, validations: [(value) => value && value.length > 25 ? "Placa debe tener máximo 25 caracteres." : null,] },
        { name: "it_inventory_label", placeholder: "Etiqueta", required: false, width: 387, validations: [(value) => value && value.length > 50 ? "Etiqueta debe tener máximo 50 caracteres." : null,] },
        { name: "it_inventory_office_item_code", placeholder: "Oficina", required: true, type: "select", options: offices, width: 387 },
        { name: "it_inventory_in_charge", placeholder: "Encargado de Equipo", required: true, width: 387, validations: [(value) => value && value.length > 100 ? "Encargado del equipo debe tener máximo 100 caracteres." : null,] },
        { name: "it_inventory_email", placeholder: "Correo de Encargado", required: true, type: "email", width: 387, validations: [(value) => value && value.length > 50 ? "Correo debe tener máximo 50 caracteres." : null,]},
        { name: "it_inventory_department_or_product_manager", placeholder: "Departamento o Gerente de Producto", required: true, width: 387, validations: [(value) => value && value.length > 100 ? "Departamento o gerente de producto debe tener máximo 100 caracteres." : null,]},
        { name: "it_inventory_client", placeholder: "Cliente", required: false, width: 387, validations: [(value) => value && value.length > 100 ? "Cliente debe tener máximo 100 caracteres." : null,]},
        { name: "it_inventory_asset_category_code", placeholder: "Categoría", required: true, type: "select", options: categoryAssets, width: 253 },
        { name: "it_inventory_asset_item_code", placeholder: "Tipo de Equipo", required: true, type: "select", options: assets, width: 253 },
        { name: "it_inventory_brand_item_code", placeholder: "Marca", required: true, type: "select", options: brands, width: 253 },
        { name: "it_inventory_model", placeholder: "Modelo", required: false, width: 253, validations: [(value) => value && value.length > 50 ? "Modelo debe tener máximo 50 caracteres." : null,] },
        { name: "it_inventory_so_item_code", placeholder: "Sistema Operativo", required: false, type: "select", options: systemsOperative, width: 253 },
        { name: "it_inventory_RAM", placeholder: "RAM", required: false, width: 253, validations: [(value) => value && value.length > 10 ? "RAM debe tener máximo 10 caracteres." : null,] },
        { name: "it_inventory_disk_capacity", placeholder: "Capacidad de Disco", required: false, width: 253, validations: [(value) => value && value.length > 10 ? "Capacidad del disco debe tener máximo 10 caracteres." : null,] },
        { name: "it_inventory_processor", placeholder: "Procesador", required: false, width: 253, validations: [(value) => value && value.length > 20 ? "Procesador debe tener máximo 20 caracteres." : null,] },
        { name: "it_inventory_leasing", placeholder: "Leasing", required: true, width: 253, type: "select", options: [
            { name: "No", placeholder: "No" , value: false, label: "No" },
            { name: "Sí", placeholder: "Sí" , value: true, label: "Sí" },
        ],},
        { name: "it_inventory_leasing_details", placeholder: "Detalles del Leasing", required: false, type: "textarea", width: 800, validations: [(value) => value && value.length > 250 ? "Los detalles del leasing debe tener máximo 250 caracteres." : null,] },
        { name: "it_inventory_observations", placeholder: "Observaciones", required: false, type: "textarea", width: 800},
    ];

    const editFields = [
        { name: "it_inventory_serial_number", placeholder: "Número de Serie", required: true, width: 200, validations: [(value) => value && value.length > 50 ? "Número de serie debe tener máximo 50 caracteres." : null,] },
        { name: "it_inventory_plate", placeholder: "Placa", required: false, width: 200, validations: [(value) => value && value.length > 25 ? "Placa debe tener máximo 25 caracteres." : null,] },
        { name: "it_inventory_status", placeholder: "Estado de Equipo", required: true, type:"select", options:[
            { value: 1, label: "Activo", name: 1, placeholder: "Activo" },
            { value: 2, label: "Inactivo", name: 2, placeholder: "Inactivo" }, 
            { value: 3, label: "En Reparación", name: 3, placeholder: "En Reparación" }, 
            { value: 4, label: "En Almacén", name: 4, placeholder: "En Almacén" }, 
            { value: 5, label: "Perdido", name: 5, placeholder: "Perdido" }, 
            { value: 6, label: "Inactivo", name: 6, placeholder: "Inactivo" }
        ], width: 170 },
        { name: "it_inventory_in_charge", placeholder: "Encargado de Equipo", required: true, width: 253,  validations: [(value) => value && value.length > 100 ? "Encargado del equipo debe tener máximo 100 caracteres." : null,]},
        { name: "it_inventory_email", placeholder: "Correo de Encargado", required: true, type: "email", width: 253, validations: [(value) => value && value.length > 50 ? "Correo debe tener máximo 50 caracteres." : null,] },
        { name: "it_inventory_label", placeholder: "Etiqueta", required: false, width: 253, validations: [(value) => value && value.length > 50 ? "Etiqueta debe tener máximo 50 caracteres." : null,] },
        { name: "it_inventory_department_or_product_manager", placeholder: "Departamento / Gerente de Producto", required: true, width: 300, validations: [(value) => value && value.length > 100 ? "Departamento o gerente de producto debe tener máximo 100 caracteres." : null,]},
        { name: "it_inventory_asset_category_code", placeholder: "Categoría", required: true, type: "select", options: categoryAssets, width: 200 },
        { name: "it_inventory_asset_item_code", placeholder: "Tipo de Equipo", required: true, type: "select", options: assets, width: 200 },
        { name: "it_inventory_brand_item_code", placeholder: "Marca", required: true, type: "select", options: brands, width: 200 },
        { name: "it_inventory_model", placeholder: "Modelo", required: false, width: 200, validations: [(value) => value && value.length > 50 ? "Modelo debe tener máximo 50 caracteres." : null,] },
        { name: "it_inventory_so_item_code", placeholder: "Sistema Operativo", required: false, type: "select", options: systemsOperative, width: 200 },
        { name: "it_inventory_RAM", placeholder: "RAM", required: false, width: 200,  validations: [(value) => value && value.length > 10 ? "RAM debe tener máximo 10 caracteres." : null,]},
        { name: "it_inventory_disk_capacity", placeholder: "Capacidad de Disco", required: false, width: 200, validations: [(value) => value && value.length > 10 ? "Capacidad del disco debe tener máximo 10 caracteres." : null,] },
        { name: "it_inventory_processor", placeholder: "Procesador", required: false, width: 200, validations: [(value) => value && value.length > 20 ? "Procesador debe tener máximo 20 caracteres." : null,] },
        { name: "it_inventory_office_item_code", placeholder: "Oficina", required: true, type: "select", options: offices, width: 200 },
        { name: "it_inventory_client", placeholder: "Cliente", required: false, width: 250, validations: [(value) => value && value.length > 100 ? "Cliente debe tener máximo 100 caracteres." : null,] },
        { name: "it_inventory_leasing", placeholder: "Leasing", required: true, width: 100, type: "select", options: [
            { name: 0, placeholder: "No" , value: 0, label: "No" },
            { name: 1, placeholder: "Sí" , value: 1, label: "Sí" },
        ],},
        { name: "it_inventory_leasing_details", placeholder: "Detalles del Leasing", required: false, type: "textarea", width: 400, validations: [(value) => value && value.length > 250 ? "Los detalles del leasing debe tener máximo 250 caracteres." : null,] },
        { name: "it_inventory_observations", placeholder: "Observaciones", required: false, type: "textarea", width: 400 },
    ];


    const [searchText, setSearchText] = useState("");
    const [searchFeature, setSearchFeature] = useState(editFields[0]?.name || "");

    // Cargado de oficinas
    const fetchOffice = async () => {
        try {
            const typesResp = await getItems(
                Number(import.meta.env.VITE_PM_TASK_SERVICE_CODE),
                Number(import.meta.env.VITE_TI_TYPE_OFFICE_CODE)
            );

            setOffices(typesResp.map(type => ({ 
                value: type.cod_item, 
                label: type.item_name, 
                name: type.cod_item,  
                placeholder: type.item_name
            })));
        } catch (err) {
            setError("Error al obtener oficinas");
            ModalAlert("Error", "Error al obtener oficinas", "error");
            return [];
        }
    };
    // Cargado de oficinas
    const fetchSystemsOperative = async () => {
        try {
            const typesResp = await getItems(
                Number(import.meta.env.VITE_TI_SERVICE_CODE),
                Number(import.meta.env.VITE_TI_SO_CATEGORY_CODE)
            );

            setSystemsOperative([
                { value: 0, label: "No tiene", placeholder: "No tiene", name: null },
                ...typesResp.map(type => ({ 
                    value: type.cod_item, 
                    label: type.item_name, 
                    name: type.cod_item, 
                    placeholder: type.item_name
                }))
            ]);

            
        } catch (err) {
            setError("Error al obtener los sistemas operativos");
            ModalAlert("Error", "Error al obtener sistemas operativos", "error");
            return [];
        }
    };
    // Cargado de oficinas
    const fetchBrands = async () => {
        try {
            const typesResp = await getItems(
                Number(import.meta.env.VITE_TI_SERVICE_CODE),
                Number(import.meta.env.VITE_TI_BRAND_CATEGORY_CODE)
            );
            setBrands(typesResp.map(type => ({ 
                value: type.cod_item, 
                label: type.item_name, 
                name:type.cod_item, 
                placeholder: type.item_name
            })));
        } catch (err) {
            setError("Error al obtener marcas de equipos");
            ModalAlert("Error", "Error al obtener marcas de equipos", "error");
            return [];
        }
    };
    // Cargado de Categorias de equipo
    const fetchCategoryAssets = async () => {
        try {
            const typesResp = await getCategorys(
                Number(import.meta.env.VITE_TI_SERVICE_CODE),  
            );

            const filtered = typesResp.filter(
                type => type.cod_category !== 1 && type.cod_category !== 2
            ); // no incluye los sistemas operativos y los no relacionados en equipos

            setCategoryAssets(
                filtered.map(type => ({
                    value: type.cod_category,
                    label: type.category_name,
                    name: type.cod_category,
                    placeholder: type.category_name
                }))
            );
        } catch (err) {
            setError("Error al obtener categorias de equipos");
            ModalAlert("Error", "Error al obtener categorias de equipos", "error");
            return [];
        }
    };
    // Cargado de Equipo
    const fetchAssets = async (it_inventory_asset_category_code) => {
        try {
            const typesResp = await getItems(
                Number(import.meta.env.VITE_TI_SERVICE_CODE),
                Number(it_inventory_asset_category_code)
            );
            setAssets(typesResp.map(type => ({ 
                value: type.cod_item, 
                label: type.item_name, 
                name: type.cod_item,
                placeholder: type.item_name 
            })));
        } catch (err) {
            setError("Error al obtener equipos");
            ModalAlert("Error", "Error al obtener equipos", "error");
            return [];
        }
    };

    //obtener activos de inventarios
    const getActiveInventory = async () => {
        try {
            const data = await getTechnologyInventory();
            setInventory(data.data);
        } catch (err) {
            setError("Error al obtener equipos");
            ModalAlert("Error", "Error al obtener equipos", "error");
            return [];
        }
    };

    //agregar un activo al inventario de TI
    const handleSubmit = async (formData) => {
        try {
            const dataToSend = {
                ...formData,
                it_inventory_status: 1,
                it_inventory_asset_service_code: Number(import.meta.env.VITE_TI_SERVICE_CODE),
                it_inventory_brand_service_code: Number(import.meta.env.VITE_TI_SERVICE_CODE),
                it_inventory_brand_category_code: Number(import.meta.env.VITE_TI_BRAND_CATEGORY_CODE),
                it_inventory_so_service_code: Number(import.meta.env.VITE_TI_SERVICE_CODE),
                it_inventory_so_category_code: Number(import.meta.env.VITE_TI_SO_CATEGORY_CODE),
                it_inventory_office_service_code: Number(import.meta.env.VITE_TI_SERVICE_CODE),
                it_inventory_office_category_code: Number(import.meta.env.VITE_TI_TYPE_OFFICE_CODE),
                it_inventory_last_update_date: new Date().toISOString().split("T")[0],
                it_inventory_so_item_code: formData.it_inventory_so_item_code === 0 ? null : formData.it_inventory_so_item_code,
                it_inventory_leasing: true
            };

            const response = await addTechnologyInventory(dataToSend);

            if (response.status === 201) {
                ModalAlert("Éxito", "Registro agregado exitosamente.", "success");
                await getActiveInventory();
                setShowForm(false);
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al agregar un activo.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    // inhabilitar equipo
    const handleDelete = async (cod_it_inventory) => {
        try {
            const response = await deleteTechnologyInventory(cod_it_inventory);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message || "Registro desactivado.", "success");
                getActiveInventory();
                setError(null);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al desactivar registro.";
            ModalAlert("Error", message, "error");
            setError(message);
        }
    };

    //busqueda de activos
    const handleSearch = async (feature, text) => {
        try {
            setLoading(true);
            let response;
            response = await searchTechnologyInventory(feature, text);
            setInventory(response.data);
            setError(null);
        } catch (err) {
            const msg = err.response?.data?.message || "No se encuentran activos.";
            Swal.fire("Error", msg, "error");
        } finally {
            setLoading(false);
        }
    };

    //editar el activo
    const handleEdit = async (cod_it_inventory, updatedData) => {
        try {
            const response = await updateTechnologyInventory(cod_it_inventory, updatedData);
            if (response.status === 200) {
                ModalAlert("Éxito", "Activo editado exitosamente.", "success");
                await getActiveInventory();
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

    //helper para traducir el codigo a label
    const getLabelByCode = (list, code) => {
        const found = list.find(item => item.value === code);
        return found ? found.label : code; // Si no encuentra, muestra el código
    };

    useEffect(() => {
        const init = async () => {
            getActiveInventory();

            await fetchCategoryAssets();
            await fetchAssets(3);
            await fetchBrands();
            await fetchOffice();
            await fetchSystemsOperative();
        };
        init();
    }, []);

    return {
        inventory,

        fields, 
        editFields,
        showForm, 
        setShowForm,
        error,
        setError,
        loading,

        searchText,
        searchFeature, 
        setSearchText,
        setSearchFeature,

        getLabelByCode,
        categoryAssets, 
        assets, 
        brands, 
        systemsOperative, 
        offices,
        
        handleSearch,
        handleSubmit, 
        handleDelete,
        handleEdit, 

        fetchAssets
    }
}