import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";
import { getItems } from "../services/itemService";
import {
  addGuarantee,
  deleteGuarantee,
  findGuarantees,
  getAllGuarantees,
  getGuaranteeById,
  getGuaranteesResume,
  updateGuarantee,
} from "../services/guaranteeService";

export const useGuarantees = () => {
  const STATUS_OPTIONS = [
    { label: "Todas", value: "Todas" },
    { label: "Activa", value: 1 },
    { label: "Vencida", value: 2 },
    { label: "Próxima a vencer", value: 3 },
    { label: "Desactivada", value: 4 },
  ];

  const CURRENCY_OPTIONS = [
    { label: "USD", value: 1 },
    { label: "CRC", value: 2 },
  ];

  const CATEGORY_OPTIONS = [
    { label: "Bancaria", value: "Bancaria" },
    { label: "Efectivo", value: "Efectivo" },
  ];

  const [guaranteesList, setGuaranteesList] = useState([]);
  const [selectedGuaranteeId, setSelectedGuaranteeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [entityItems, setEntityItems] = useState([]);
  const [applicantItems, setApplicantItems] = useState([]);
  const [alertItems, setAlertItems] = useState([]);
  const [resumeData, setResumeData] = useState([]);
  const [isCreatingGuarantee, setIsCreatingGuarantee] = useState(false);
  const [sortOrder, setSortOrder] = useState(""); // "asc" o "desc"

  const [totalPages, setTotalPages] = useState(1); // Estado para total de páginas
  const [currentPage, setCurrentPage] = useState(1); // Estado para página actual

  const handleSortByExpirationDate = (
    searchFeature,
    searchText,
    currentPage,
    limit = 5,
    options,
    order
  ) => {
    if (options == 1) {
      // actualizar el estado para render
      fetchGuarantees(currentPage, limit, searchFeature, searchText, order); // usar el nuevo valor
      console.log("Ordenado por fecha de expiración:", order);
    } else {
      handleSearchGuarantees(
        searchFeature,
        searchText,
        currentPage,
        limit,
        order
      ); // usar el nuevo valor
    }
  };

  const resumeFields = [
    { name: "entidad", label: "Entidad" },
    { name: "activas", label: "Activas" },
    { name: "vencidas", label: "Vencidas" },
    { name: "proximas_a_vencer", label: "Próximas a vencer" },
    { name: "dinero_activo", label: "Dinero Activo ₡" },
    { name: "dinero_por_vencer", label: "Dinero por vencer ₡" },
    { name: "dinero_activo_usd", label: "Dinero Activo USD" },
    { name: "dinero_por_vencer_usd", label: "Dinero por vencer USD" },
  ];

  const fields = [
    {
      name: "cod_guarantee",
      label: "Código",
      type: "text",
      editable: false,
      grid: 4,
      width: 200,
    },

    {
      name: "guarantee_entity_item_code",
      placeholder: "Entidad",
      label: "Entidad",
      type: "select",
      editable: true,
      grid: 4,
      width: 150,
      options: entityItems,
    },
    {
      name: "guarantee_applicant_item_code",
      placeholder: "Solicitante",
      label: "Solicitante",
      type: "select",
      editable: true,
      grid: 4,
      width: 150,
      options: applicantItems,
    },
    {
      name: "guarantee_number",
      placeholder: "Número",
      label: "Número",
      type: "text",
      editable: true,
      grid: 4,
      width: 225,
    },
    {
      name: "guarantee_type",
      placeholder: "Tipo",
      label: "Tipo",
      type: "text",
      editable: true,
      grid: 4,
      width: 225,
    },

    {
      name: "guarantee_issue_date",
      placeholder: "Fecha de Emisión",
      label: "Fecha de Emisión",
      type: "date",
      editable: true,
      restriction: "cantAfterToday",
      grid: 4,
      width: 150,
    },
    {
      name: "guarantee_expiration_date",
      placeholder: "Fecha de Expiración",
      label: "Fecha de Expiración",
      type: "date",
      editable: true,
      grid: 4,
      width: 150,
      restriction: "cantBeforeToday",
    },
    {
      name: "guarantee_procedure",
      placeholder: "Procedimiento",
      label: "Procedimiento",
      type: "text",
      editable: true,
      grid: 4,
      width: 225,
    },
    {
      name: "guarantee_email_contact_alert",
      placeholder: "Email de alerta",
      label: "Email de alerta",
      type: "email",
      editable: true,
      grid: 4,
      width: 225,
    },

    {
      name: "guarantee_currency",
      placeholder: "Moneda",
      label: "Moneda",
      type: "select",
      editable: true,
      grid: 4,
      width: 150,
      options: CURRENCY_OPTIONS,
    },
    {
      name: "guarantee_alert_time_item_code",
      placeholder: "Alerta(Días)",
      label: "Alerta(Días)",
      type: "select",
      editable: true,
      grid: 4,
      width: 150,
      options: alertItems,
    },
    {
      name: "guarantee_amount",
      placeholder: "Monto",
      label: "Monto",
      type: "number",
      editable: true,
      grid: 4,
      width: 225,
    },
    {
      name: "guarantee_status",
      placeholder: "Estado",
      label: "Estado",
      type: "select",
      editable: true,
      grid: 4,
      width: 225,
      options: STATUS_OPTIONS,
    },
    {
      name: "guarantee_category",
      placeholder: "Categoría",
      label: "Categoría",
      type: "select",
      editable: true,
      grid: 4,
      width: 225,
      options: CATEGORY_OPTIONS,
    },

    {
      name: "guarantee_beneficiary",
      placeholder: "Beneficiario",
      label: "Beneficiario",
      type: "textarea",
      editable: true,
      grid: 4,
      width: 800,
    }, // 49rem ≈ 784px
  ];

  // Campos buscables dinámicos
  const entityOptionsForSelect = entityItems.map((opt) => ({
    name: opt.value,
    placeholder: opt.label,
  }));
  const applicantOptionsForSelect = applicantItems.map((opt) => ({
    name: opt.value,
    placeholder: opt.label,
  }));
  const alertOptionsForSelect = alertItems.map((opt) => ({
    name: opt.value,
    placeholder: opt.label,
  }));

  const searchFields = fields
    .filter(
      (f) =>
        f.name !== "cod_guarantee" &&
        f.name !== "guarantee_entity_service_code" &&
        f.name !== "guarantee_entity_category_code" &&
        f.name !== "guarantee_applicant_service_code" &&
        f.name !== "guarantee_applicant_category_code" &&
        f.name !== "guarantee_alert_time_service_code" &&
        f.name !== "guarantee_alert_time_category_code"
    )
    .map((f) => ({
      name: f.name,
      placeholder: f.label,
      type: f.type,
      options:
        f.name === "guarantee_entity_item_code"
          ? entityOptionsForSelect
          : f.name === "guarantee_applicant_item_code"
          ? applicantOptionsForSelect
          : f.name === "guarantee_alert_time_item_code"
          ? alertOptionsForSelect
          : f.options?.map((o) => ({ name: o.value, placeholder: o.label })) ||
            [],
    }));

  // Funciones fetch, add, edit, delete, search (igual que tu código original)
  const fetchGuarantees = async (
    page = 1,
    limit = 5,
    searchFeature = "",
    searchText = "",
    sortOrder = ""
  ) => {
    try {
      setLoading(true);

      let resp;

      if (searchText && searchFeature && searchText !== "Todas") {
        // 👇 Llama a la API de búsqueda con paginación
        resp = await findGuarantees(
          searchFeature,
          searchText,
          page,
          limit,
          sortOrder
        );
      } else {
        // 👇 Llama al listado general con paginación
        resp = await getAllGuarantees(page, 5, sortOrder);
      }

      // 👇 Ajusta según lo que retorne tu backend (count, rows)
      setGuaranteesList(resp.guarantees || []);
      setTotalPages(resp.totalPages || 1);
      setCurrentPage(resp.page || 1);
    } catch (err) {
      console.error(err);
      setError("Error al obtener garantías");
      ModalAlert("Error", "Error al obtener garantías", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const entity = await getItems(
        Number(import.meta.env.VITE_GUARANTEE_SERVICE_CODE),
        Number(import.meta.env.VITE_GUARANTEE_ENTITY_CATEGORY_CODE)
      );
      const applicant = await getItems(
        Number(import.meta.env.VITE_GUARANTEE_SERVICE_CODE),
        Number(import.meta.env.VITE_GUARANTEE_APPLICANT_CATEGORY_CODE)
      );

      const alert = await getItems(
        Number(import.meta.env.VITE_GUARANTEE_SERVICE_CODE),
        Number(import.meta.env.VITE_GUARANTEE_ALERT_TIME_CATEGORY_CODE)
      );
      setEntityItems(
        entity.map((e) => ({ label: e.item_name, value: e.cod_item }))
      );
      setApplicantItems(
        applicant.map((a) => ({ label: a.item_name, value: a.cod_item }))
      );
      setAlertItems(
        alert.map((a) => ({ label: a.item_name, value: a.cod_item }))
      );
    } catch (err) {
      ModalAlert("Error", "Error al obtener items", "error");
    }
  };
  const handleSearchGuarantees = async (feature, text, page = 1, limit = 5) => {
    try {
      setLoading(true);

      const searchText = String(text || "").trim();

      // 👇 Si no hay texto, vuelve al fetch general
      if (!searchText) {
        await fetchGuarantees(page, limit, sortOrder);
        return;
      }

      // 👇 Llama a la API de búsqueda con paginación
      const resp = await findGuarantees(
        feature,
        searchText,
        page,
        limit,
        sortOrder
      );

      //Manejo del formato según tu backend
      const guarantees = resp.guarantees || resp.rows || [];
      const totalPages = resp.totalPages || 1;

      console.log("longitud de garantías encontradas:", guarantees.length);

      if (guarantees.length === 0) {
        ModalAlert(
          "Información",
          "No se encontraron garantías con ese término",
          "info"
        );

        return;
      }

      console.log("llego hasta aqui");
      setGuaranteesList(guarantees);
      setTotalPages(totalPages);
      setCurrentPage(resp.page || page);
    } catch (err) {
      console.error(err);
      ModalAlert("Error", "Error al buscar garantías", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuarantee = async (formData) => {
    const { cod_guarantee, guarantee_status, ...rest } = formData; // quitamos si acaso vienen del formulario
    const dataToSend = {
      ...rest,

      // Garantías → todos los service_code = 7
      guarantee_entity_service_code: Number(
        import.meta.env.VITE_GUARANTEE_SERVICE_CODE
      ),
      guarantee_applicant_service_code: Number(
        import.meta.env.VITE_GUARANTEE_SERVICE_CODE
      ),
      guarantee_alert_time_service_code: Number(
        import.meta.env.VITE_GUARANTEE_SERVICE_CODE
      ),

      // Categorías
      guarantee_entity_category_code: Number(
        import.meta.env.VITE_GUARANTEE_ENTITY_CATEGORY_CODE
      ),
      guarantee_applicant_category_code: Number(
        import.meta.env.VITE_GUARANTEE_APPLICANT_CATEGORY_CODE
      ),
      guarantee_alert_time_category_code: Number(
        import.meta.env.VITE_GUARANTEE_ALERT_TIME_CATEGORY_CODE
      ),

      // Flags
      guarantee_is_notified: 0,
    };

    try {
      await addGuarantee(dataToSend);
      ModalAlert("Éxito", "Garantía agregada exitosamente", "success");
      setIsCreatingGuarantee(false);
      fetchGuarantees();
    } catch (err) {
      ModalAlert("Error", "Error al agregar garantía", "error");
    }
  };

  const handleEditGuarantee = async (id, formData) => {
    try {
      formData = { ...formData, guarantee_is_notified: 0 }; // reset notificación al editar

      const resp = await updateGuarantee(id, formData);
      ModalAlert("Éxito", "Garantía actualizada exitosamente", "success");
      fetchGuarantees();
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al actualizar garantía";
      ModalAlert("Error", message, "error");
    }
  };

  const handleDeleteGuarantee = async (id, status) => {
    try {
      const resp = await deleteGuarantee(id, status);
      if (status == 4) {
        ModalAlert("Éxito", "Garantía Desactivada exitosamente", "success");
      } else {
        ModalAlert("Éxito", "Garantía reactivada exitosamente", "success");
      }

      fetchGuarantees();
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al eliminar garantía";
      ModalAlert("Error", message, "error");
    }
  };

  const fetchGuaranteesResumeData = async () => {
    try {
      const resp = await getGuaranteesResume();
      const data = resp || [];
      setResumeData(data);
      return data;
    } catch (err) {
      ModalAlert("Error", "Error al obtener resumen de garantías", "error");
      return [];
    }
  };

  useEffect(() => {
    fetchGuarantees();
    fetchItems();
    fetchGuaranteesResumeData();
  }, []);

  return {
    guaranteesList,
    selectedGuaranteeId,
    setSelectedGuaranteeId,
    loading,
    error,
    fields,
    searchFields, // <- exportamos campos buscables
    fetchGuarantees,
    handleAddGuarantee,
    handleEditGuarantee,
    handleDeleteGuarantee,
    handleSearchGuarantees,
    fetchGuaranteesResume: fetchGuaranteesResumeData,
    entityItems,
    applicantItems,
    alertItems,
    resumeData,
    STATUS_OPTIONS,
    CURRENCY_OPTIONS,
    CATEGORY_OPTIONS,
    resumeFields,
    entityOptionsForSelect,
    applicantOptionsForSelect,
    alertOptionsForSelect,
    isCreatingGuarantee,
    setIsCreatingGuarantee,
    totalPages,
    currentPage,
    handleSortByExpirationDate,
  };
};
