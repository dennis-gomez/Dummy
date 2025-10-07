import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";
import { getItems, getAllItemsByService } from "../services/itemService";
import { getCategorys } from "../services/categoryService";

import { getAllRevisions, getFindRevisions, updateRevision, deleteRevision, addRevisionWithPlan } from "../services/pmRevisionService";
import { getAllActionPlans, findActionPlans, addActionPlan, updateActionPlan, deleteActionPlan } from "../services/pmActionPlanService";

export const usePMRevisionAndPlan = () => {

    const [revisions, setRevisions] = useState([]);
    const [actionPlans, setActionPlans] = useState([]);

    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [loading, setLoading] = useState(false);

    const [revisionAreaCategories, setRevisionAreaCategories] = useState([]);
    const [revisionAreaItem, setRevisionAreaItem] = useState([]);
    const [revisionAreaItemAll, setRevisionAreaItemAll] = useState([]);
    const [revisionTasksItem, setRevisionTasksItem] = useState([]);


    const revisionStatusOptions = [
        { value: "true", label: "Pasó" },
        { value: "false", label: "No pasó" }
    ];

    const fields = [
        { name: "revision_area_category_code", placeholder: "Área revisada", type: "select", width: 250, options: revisionAreaCategories, required: true },
        { name: "revision_area_item_code", placeholder: "Objetos revisados", type: "select", width: 250, options: revisionAreaItem, required: true },
        { name: "revision_task_item_code", placeholder: "Tarea realizada", type: "select", width: 250, options: revisionTasksItem, required: true },

        { name: "revision_date", placeholder: "Fecha de Revisión", width: 250, type: "date", required: true, restriction: "cantAfterToday" },
        { name: "revision_quantity", placeholder: "Cantidad Revisada", width: 250, type: "number", required: true },
        { name: "revision_responsible_name", placeholder: "Responsable", width: 250, type: "text" },
        { name: "revision_status", placeholder: "Estado de la Revisión", width: 250, type: "select", options: revisionStatusOptions, required: true },
        { name: "revision_date_follow_up", placeholder: "Fecha de Seguimiento", type: "date", width: 250, restriction: "cantBeforeToday" },
        { name: "revision_observations", placeholder: "Observaciones", width: 780, type: "textarea", required: false },

        { name: "action_plan_rev_quantity_failed", placeholder: "Cantidad Fallida", type: "number", width: 250, required: true },
        { name: "action_plan_responsible_name", placeholder: "Responsable a Cargo", type: "text", width: 250, required: true },
        { name: "action_plan_details", placeholder: "Detalles del Plan de Acción", type: "textarea", width: 780, required: true },

    ];

    const fieldsRevision = [
        { name: "revision_date", placeholder: "Fecha de Revisión", width: 250, type: "date", required: true, restriction: "cantAfterToday"},
        { name: "revision_area_category_code", placeholder: "Área", type: "select", width: 250, options: revisionAreaCategories, required: true },
        { name: "revision_area_item_code", placeholder: "Item", type: "select", width: 250, options: revisionAreaItemAll, required: true },
        { name: "revision_task_item_code", placeholder: "Tarea", type: "select", width: 250, options: revisionTasksItem, required: true },
        { name: "revision_quantity", placeholder: "Cantidad Revisada", width: 250, type: "number", required: true },
        { name: "revision_status", placeholder: "Estado de la Revisión", width: 250, type: "select", options: revisionStatusOptions, required: true },
        { name: "revision_responsible_name", placeholder: "Responsable", width: 250, type: "text" },
        { name: "revision_observations", placeholder: "Observaciones", width: 780, type: "textarea", required: false },
        { name: "revision_date_follow_up", placeholder: "Fecha de Seguimiento", type: "date", width: 250, restriction: "cantBeforeToday" },
    ];

    const fieldsActionPlan = [
        { name: "action_plan_rev_quantity_failed", placeholder: "Cantidad Fallida", type: "number", width: 250, required: true },
        { name: "action_plan_details", placeholder: "Detalles del Plan de Acción", type: "textarea", width: 780, required: true },
        { name: "action_plan_responsible_name", placeholder: "Responsable a Cargo", type: "text", width: 250, required: true },
    ];

    const [selectedArea, setSelectedArea] = useState("Todos");
    const [searchText, setSearchText] = useState("");
    const [searchFeature, setSearchFeature] = useState(fields[0]?.name || "");

const getSpecificOptions = (categoryCode) => {
  console.log("Category Code:", categoryCode);
  return revisionAreaItemAll.filter(item => item.category_cod === categoryCode);
};



    // 🔹 Obtener todos los planes y revisiones
    const fetchData = async () => {
        try {
            setError(null);
            const data1 = await getAllRevisions();


            const data2 = await getAllActionPlans();
            setRevisions(data1);
            setActionPlans(data2);
        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener revisiones y planes.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };


    const fetchAreaCategory = async () => {
        try {
            setError(null);
            const areas = await getCategorys(Number(import.meta.env.VITE_PM_AREAS_SERVICE_CODE));
            setRevisionAreaCategories(
                areas.map((a) => ({
                    name: a.cod_category,
                    placeholder: a.category_name,
                    value: a.cod_category,
                    label: a.category_name,
                    service_cod: a.cod_service,
                }))
            );

        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener las áreas de mantenimiento.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };

    const fetchAllCategoryItems = async () => {
        try {
            setError(null);
            const items = await getAllItemsByService(Number(import.meta.env.VITE_PM_AREAS_SERVICE_CODE));
            setRevisionAreaItemAll(
                items.map((i) => ({
                    name: i.cod_item,
                    placeholder: i.item_name,
                    value: i.cod_item,
                    label: i.item_name,
                    service_cod: i.cod_service,
                    category_cod: i.cod_category,
                }))
            );

        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener items de las categorías.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };

    const fetchAreaItems = async (revision_area_category_code) => {
        try {
            setError(null);
            const items = await getItems(
                Number(import.meta.env.VITE_PM_AREAS_SERVICE_CODE),
                Number(revision_area_category_code)
            );
            setRevisionAreaItem(
                items.map((i) => ({
                    name: i.cod_item,
                    placeholder: i.item_name,
                    value: i.cod_item,
                    label: i.item_name,
                    service_cod: i.cod_service,
                    category_cod: i.cod_category,
                }))
            );
        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener items.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };


    const fetchTaskItems = async () => {
        try {
            setError(null);
            const items = await getItems(
                Number(import.meta.env.VITE_PM_TASK_SERVICE_CODE),
                Number(import.meta.env.VITE_PM_TASK_CATEGORY_CODE)
            );
            setRevisionTasksItem(
                items.map((i) => ({
                    name: i.cod_item,
                    placeholder: i.item_name,
                    value: i.cod_item,
                    label: i.item_name,
                    service_cod: i.cod_service,
                    category_cod: i.cod_category,
                }))
            );
        } catch (err) {
            const message = err.response?.data?.message || "Error al obtener items.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };





/*
    // Listado de registros para 3 selects y búsqueda
    const handleFuncSearch = async (revision_area_category_code = "", field = "", text = "") => {
        try {
            setLoading(true);
            let response;
            if (revision_area_category_code === "Todos" && !String(text).trim()) {
                response = await fetchData();
                setError(null);
            } else {
                response = await getFindRevisionsAt(revision_area_category_code, field, text);
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


    // Resetear filtros y cargar todos los registros
    const handleResetSearch = async () => {
        setSelectedVehicle("Todos");
        setSearchField(fields[0]?.name || "");
        setSearchText("");
        await fetchFuelLogs();
    };

*/






    // 🔹 Buscar revisiones y planes
    const handleSearchRevisionsAndPlans = async (feature, text) => {
        try {
            setError(null);
            setLoading(true);
            const data1 = await getFindRevisions(feature, text);
            const data2 = await findActionPlans(feature, text);

            if (data1.length != 0) {
                const newRequest = await findActionPlans("action_plan_cod_revision", data1[0].cod_revision);
                setRevisions(data1);
                setActionPlans(newRequest);
            }
            else if (data2.length != 0) {
                const newRequest = await getFindRevisions("cod_revision", data2[0].action_plan_cod_revision);
                setActionPlans(data2);
                setRevisions(newRequest);
            }

        } catch (err) {
            const message = err.response?.data?.message || "No se encontraron resultados.";
            setError(message);
            ModalAlert("Error", "No se encuentran revisiones o planes de acción.", "error");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Agregar plan/revisión
    const handleAdd = async (formData) => {
        try {
            setError(null);

            const selectedAction1 = revisionTasksItem.find((i) => i.value === formData.revision_task_item_code);
            const selectedAction2 = revisionAreaItem.find((i) => i.value === formData.revision_area_item_code);

            const payload = {
                ...formData,
                ...(selectedAction1 && {
                    revision_task_service_code: selectedAction1.service_cod,
                    revision_task_category_code: selectedAction1.category_cod,
                    revision_task_item_code: selectedAction1.name,
                }),
                ...(selectedAction2 && {
                    revision_area_service_code: selectedAction2.service_cod,
                    revision_area_category_code: selectedAction2.category_cod,
                    revision_area_item_code: selectedAction2.name,
                }),
            };

            await addRevisionWithPlan(payload);
            ModalAlert("Éxito", "Plan/Revision agregado exitosamente.", "success");
            fetchData();
            setShowForm(false);
        } catch (err) {
            const message = err.response?.data?.message || "Error al agregar registro.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };


    // 🔹 Editar plan/revisión
    const handleEditRevision = async (cod_revision, formData) => {
        try {
            setError(null);
            
            const selectedAction1 = revisionTasksItem.find((i) => i.value === formData.revision_task_item_code);
            const selectedAction2 = revisionAreaItem.find((i) => i.value === formData.revision_area_item_code);

            console.log("Selected Action 1:", selectedAction1);
            console.log("Selected Action 2:", selectedAction2);

            const payload = {
                ...formData,
                ...(selectedAction1 && {
                    revision_task_service_code: selectedAction1.service_cod,
                    revision_task_category_code: selectedAction1.category_cod,
                    revision_task_item_code: selectedAction1.name,
                }),
                ...(selectedAction2 && {
                    revision_area_service_code: selectedAction2.service_cod,
                    revision_area_category_code: selectedAction2.category_cod,
                    revision_area_item_code: selectedAction2.name,
                }),
            };

            await updateRevision(cod_revision, formData);
            ModalAlert("Éxito", "Registro editado exitosamente.", "success");
            fetchData();
            return true;
        } catch (err) {
            const message = err.response?.data?.message || "Error al editar registro.";
            setError(message);
            ModalAlert("Error", message, "error");
            return false;
        }
    };


    // 🔹 Eliminar plan/revisión
    const handleDeleteRevision = async (cod_revision) => {
        try {
            setError(null);
            await deleteRevision(cod_revision);
            ModalAlert("Éxito", "Revisión eliminada exitosamente.", "success");
            await fetchData();
        } catch (err) {
            const message = err.response?.data?.message || "Error al eliminar revisión.";
            setError(message);
            ModalAlert("Error", message, "error");
        }
    };



    const handleEditActionPlan = async (cod_accion_plan, data) => {
        try {
            setError(null);
            const res = await updateActionPlan(cod_accion_plan, data);
            ModalAlert("Éxito", "Plan de acción actualizado correctamente", "success");
            await fetchData();
            return res;
        } catch (err) {
            const message = err.response?.data?.message || "Error al actualizar plan de acción.";
            ModalAlert("Error", message, "error");
            setError(message)
            return false;
        }
    };

    const handleDeleteActionPlan = async (cod_accion_plan) => {
        try {
            setError(null);
            const res = await deleteActionPlan(cod_accion_plan);
            ModalAlert("Éxito", res.message || "Plan de acción eliminado", "success");
            await fetchData();
            return res;
        } catch (err) {
            const message = err.response?.data?.message || "Error al eliminar plan de acción.";
            ModalAlert("Error", message, "error");
            setError(message);
            return false;
        }
    };


    useEffect(() => {
        fetchData();
        fetchAreaCategory();
        fetchTaskItems();
        fetchAllCategoryItems();
    }, []);


    return {
        revisions,
        actionPlans,
        error,
        showForm,
        setShowForm,
        fields,
        fieldsRevision,
        fieldsActionPlan,
        handleAdd,
        handleEditRevision,
        handleDeleteRevision,
        handleEditActionPlan,
        handleDeleteActionPlan,
        fetchAreaItems,
        searchText,
        searchFeature,
        setSearchText,
        setSearchFeature,
        setError,
        loading,
        handleSearchRevisionsAndPlans,

        revisionAreaCategories,
        revisionAreaItem,
        revisionAreaItemAll,
        revisionTasksItem,
        revisionStatusOptions,

        fetchAllCategoryItems,
        getSpecificOptions
    };
};

