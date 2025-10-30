import { useState, useEffect } from "react";
import ModalAlert from "../components/molecules/modalAlert";

import { getProfilesByPersonId, getProfileSummary, } from "../services/profileService";
import { getPersonal, fetchPersonalSummary } from "../services/personalService";

import { getSpecializedTrainingPDF } from "../services/specializedTrainingService";

export const useResumeTableLicitation = () => {
  // 📋 Estado general
  const [personal, setPersonal] = useState([]);

  // 🧾 Resumen de perfil (resultado del SP)
  const [profileSummaries, setProfileSummaries] = useState({});

  // 🔄 Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 🧠 Selección actual
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // ⚙️ Estado de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Campos base de la persona (para generar cabeceras dinámicas si lo deseas)

  const optionsSignature = [
    { value: true, label: "Sí", name: true, placeholder: "Sí" },
    { value: false, label: "No", name: false, placeholder: "No" },
  ];

  const optionsStatus = [
    { value: true, label: "Activo", name: true, placeholder: "Activo" },
    { value: false, label: "Inactivo", name: false, placeholder: "Inactivo" },
  ];


  const personFields = [
    { name: "personal_identification", placeholder: "Identificacion/ID", required: true, width: 382, },
    { name: "personal_first_name", placeholder: "Nombre", required: true, width: 382, },
    { name: "personal_last_name_1", placeholder: "Primer Apellido", required: true, width: 382, },
    { name: "personal_last_name_2", placeholder: "Segundo Apellido", required: true, width: 382, },
    { name: "personal_birth_date", placeholder: "Fecha de Nacimiento", required: true, type: "date", width: 382, },
    { name: "personal_phone_number", placeholder: "Número de Teléfono", width: 382, },
    { name: "personal_country_of_residence", placeholder: "País de Residencia", width: 382, },
    { name: "personal_has_digital_signature", placeholder: "Firma Digital", width: 382, type: "select", options: optionsSignature, },
    { name: "personal_is_active", placeholder: "Estados", type: "select", options: optionsStatus, },
  ];


  // 🔹 Campos para "profile"
  const featureFields_profile = [
    { value: "profile_role_cod_item", name: "profile_role_cod_item", placeholder: "Rol profesional", label: "Rol profesional" },
    { value: "profile_years_of_experience", name: "profile_years_of_experience", placeholder: "Años de experiencia", label: "Años de experiencia", type: "number" },
  ];

  // 🔹 Campos para "academic"
  const featureFields_academic = [
    { value: "academic_training_carrer", name: "academic_training_carrer", placeholder: "Carrera", label: "Carrera" },
    { value: "academic_training_institution", name: "academic_training_institution", placeholder: "Institución", label: "Institución" },
    { value: "academic_training_start_date", name: "academic_training_start_date", placeholder: "Fecha inicio", label: "Fecha inicio", type: "date" },
    { value: "academic_training_end_date", name: "academic_training_end_date", placeholder: "Fecha fin", label: "Fecha fin", type: "date" },
    { value: "academic_training_date_obtaining", name: "academic_training_date_obtaining", placeholder: "Fecha obtención título", label: "Fecha obtención título", type: "date" },
    { value: "academic_training_title_item_code", name: "academic_training_title_item_code", placeholder: "Código título", label: "Código título" },
  ];

  // 🔹 Campos para "training" (especializadas)
  const featureFields_training = [
    { value: "training_name", name: "training_name", placeholder: "Nombre capacitación", label: "Nombre capacitación" },
    { value: "training_institution", name: "training_institution", placeholder: "Institución", label: "Institución" },
    { value: "training_number", name: "training_number", placeholder: "Número capacitación", label: "Número" },
    { value: "training_description", name: "training_description", placeholder: "Descripción", label: "Descripción" },
    { value: "training_start_date", name: "training_start_date", placeholder: "Fecha inicio", label: "Fecha inicio", type: "date" },
    { value: "training_end_date", name: "training_end_date", placeholder: "Fecha fin", label: "Fecha fin", type: "date" },
    { value: "training_hours", name: "training_hours", placeholder: "Horas", label: "Horas", type: "number" },
    { value: "training_validity", name: "training_validity", placeholder: "Validez", label: "Validez", type: "date" },
  ];

  // 🔹 Campos para "experience" (Project_Association)
  const featureFields_experience = [
    { value: "project_association_technology_details", name: "project_association_technology_details", placeholder: "Tecnologías usadas", label: "Tecnologías usadas" },
    { value: "project_association_role_item_code", name: "project_association_role_item_code", placeholder: "Rol en proyecto", label: "Rol en proyecto" },
    { value: "project_association_start_date_participation", name: "project_association_start_date_participation", placeholder: "Fecha inicio participación", label: "Fecha inicio participación", type: "date" },
    { value: "project_association_end_date_participation", name: "project_association_end_date_participation", placeholder: "Fecha fin participación", label: "Fecha fin participación", type: "date" },
  ];

  // 🔹 Campos para "project"
  const featureFields_project = [
    { value: "project_name", name: "project_name", placeholder: "Nombre del proyecto", label: "Nombre del proyecto" },
    { value: "project_company", name: "project_company", placeholder: "Empresa", label: "Empresa" },
    { value: "project_client_name", name: "project_client_name", placeholder: "Cliente", label: "Cliente" },
    { value: "project_sector", name: "project_sector", placeholder: "Sector", label: "Sector" },
    { value: "project_description", name: "project_description", placeholder: "Descripción", label: "Descripción" },
    { value: "project_technologies", name: "project_technologies", placeholder: "Tecnologías", label: "Tecnologías" },
    { value: "project_start_date", name: "project_start_date", placeholder: "Fecha inicio", label: "Fecha inicio", type: "date" },
    { value: "project_end_date", name: "project_end_date", placeholder: "Fecha fin", label: "Fecha fin", type: "date" },
    { value: "project_contact_full_name", name: "project_contact_full_name", placeholder: "Nombre contacto", label: "Nombre contacto" },
    { value: "project_contact_phone", name: "project_contact_phone", placeholder: "Teléfono contacto", label: "Teléfono contacto", type: "phone" },
    { value: "project_contact_email", name: "project_contact_email", placeholder: "Email contacto", label: "Email contacto" },
    { value: "project_contact_position", name: "project_contact_position", placeholder: "Cargo contacto", label: "Cargo contacto" },
  ];


  const contextOptions = [
    { value: "person", name: "person", placeholder: "Datos personales", label: "Datos personales", options: personFields },
    { value: "profile", name: "profile", placeholder: "Perfiles", label: "Perfiles", options: featureFields_profile },
    { value: "academic", name: "academic", placeholder: "Formación académica", label: "Formación académica", options: featureFields_academic },
    { value: "training", name: "training", placeholder: "Capacitaciones especializadas", label: "Capacitaciones especializadas", options: featureFields_training },
    { value: "experience", name: "experience", placeholder: "Experiencia en proyectos", label: "Experiencia en proyectos", options: featureFields_experience },
    { value: "project", name: "project", placeholder: "Proyectos", label: "Proyectos", options: featureFields_project },
  ];




  // 📦 Cargar personal y sus perfiles
  const fetchPersonalWithProfiles = async (
    pageNum = page,
    limit = pageSize
  ) => {
    try {
      setLoading(true);

      // 1️⃣ Traer personal
      const resp = await getPersonal(pageNum, limit);
      const personalData = resp.data || [];

      // 2️⃣ Traer perfiles de cada persona en paralelo
      const personalWithProfiles = await Promise.all(
        personalData.map(async (person) => {
          try {
            const profiles = await getProfilesByPersonId(person.personal_cod);
            return { ...person, profiles: profiles || [] };
          } catch (err) {
            console.error(
              `Error cargando perfiles de ${person.personal_cod}`,
              err
            );
            return { ...person, profiles: [] };
          }
        })
      );

      // 3️⃣ Guardar resultados
      setPersonal(personalWithProfiles);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.currentPage || 1);
    } catch (err) {
      console.error(err);
      setError("Error al obtener personal con perfiles");
      ModalAlert("Error", "Error al obtener personal con perfiles", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🎯  Cargar resumen del perfil (llamando al SP)
  const fetchProfileSummary = async (personal_cod, profile_cod) => {
    if (!personal_cod || !profile_cod) return;
    try {
      setLoading(true);
      const data = await getProfileSummary(personal_cod, profile_cod);

      // Guardar por persona
      setProfileSummaries((prev) => ({
        ...prev,
        [personal_cod]: data || {},
      }));

      console.log("✅ Resumen del perfil cargado:", data);
    } catch (err) {
      console.error("Error obteniendo resumen del perfil:", err);
      ModalAlert("Error", "No se pudo obtener el resumen del perfil.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openPDF = async (relativePath) => {
    try {
      console.log("Abriendo PDF desde ruta:", relativePath);
      const pdfBlob = await getSpecializedTrainingPDF(relativePath);
      const pdfUrl = URL.createObjectURL(pdfBlob); // ya es un blob válido
      window.open(pdfUrl, "_blank"); // abre en nueva pestaña
    } catch (error) {
      console.error("Error al abrir el PDF:", error);
    }
  };



  // 🔍 Buscar resumen de personal según los filtros del seeker (con perfiles incluidos)
  const fetchFilteredPersonalSummary = async ({ context, feature, text, pageNum = page, limit = pageSize }) => {

    try {

      console.log("Iniciando búsqueda filtrada con:", { context, feature, text, pageNum, limit });

       if (context === 0) {
        await fetchPersonalWithProfiles(pageNum, limit);
        return;

      } else  if (context !== 0 && (!feature || !text || feature.trim() === "" || text.trim() === "")) {
        ModalAlert("Aviso", "Debes completar los campos requeridos para la búsqueda.", "warning");
        return;
      }

      setLoading(true);

      // 1️⃣ Llamar al servicio de búsqueda
      const resp = await fetchPersonalSummary({
        context,
        feature,
        text,
        page: pageNum,
        limit,
      });

      const personalData = resp.data || [];

      // 2️⃣ Obtener perfiles de cada persona
      const personalWithProfiles = await Promise.all(
        personalData.map(async (person) => {
          try {
            const profiles = await getProfilesByPersonId(person.personal_cod);
            return { ...person, profiles: profiles || [] };
          } catch (err) {
            console.error(`Error cargando perfiles de ${person.personal_cod}`, err);
            return { ...person, profiles: [] };
          }
        })
      );

      // 3️⃣ Actualizar el estado
      setPersonal(personalWithProfiles);
      setTotalPages(resp.totalPages || 1);
      setPage(resp.currentPage || 1);

      console.log("✅ Resultados filtrados con perfiles:", personalWithProfiles);
    } catch (err) {
      console.error("Error en búsqueda filtrada:", err);
      setError("Error al obtener resultados filtrados");
      ModalAlert("Error", "No se pudo obtener los resultados filtrados", "error");
    } finally {
      setLoading(false);
    }
  };






  // 🧩 Efecto inicial + recarga cuando cambia la página
  useEffect(() => {
    fetchPersonalWithProfiles(page, pageSize);
  }, [page]);

  return {
    // datos
    personal,
    profileSummaries,

    // selección
    selectedPerson,
    selectedProfile,
    setSelectedPerson,
    setSelectedProfile,

    // paginación
    page,
    totalPages,
    pageSize,
    setPage,
    setPageSize,

    // UI
    loading,
    error,
    personFields,
    contextOptions,

    // funciones
    fetchPersonalWithProfiles,
    fetchFilteredPersonalSummary,
    fetchProfileSummary,
    openPDF,
  };
};
