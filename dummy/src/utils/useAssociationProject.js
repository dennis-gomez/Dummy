import { useState, useEffect } from "react";
import {
  addAssociationProject,
  getAssociationProject,
  updateAssociationProject,
  findAssociationProject,
} from "../services/associationProjectService";
import projectService from "../services/projectService";
import ModalAlert from "../components/molecules/modalAlert";
import Swal from "sweetalert2";
import { getItems } from "../services/itemService";
import {
  parseDateWithoutTimezone,
  formatDateDDMMYYYY,
} from "../utils/generalUtilities";

export const useAssociationProject = (profileCod) => {
  const [associations, setAssociations] = useState([]); //lista de fromaciones academicas
  const [rolesTypes, setRolesTypes] = useState([]); //listado de titulo o grados academicas
  const [projects, setProjects] = useState([]); //listado de proyectos

  /*
   * Variables de paginacion
   */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(2);

  /*
   * Estados para manejo de formularios (muestra, errores y carga)
   */
  const [showFormAssociations, setShowFormAssociations] = useState(false);
  const [errorAssociations, setErrorAssociations] = useState(null);
  const [isLoadingAssociation, setLoadingAssociation] = useState(false);

  /*
   * Fields de manejo de formularios dinamicos
   */
  const fieldsAssociation = [
    {
      name: "cod_project",
      placeholder: "Proyecto",
      required: true,
      type: "select",
      options: projects,
      width: 800,
    },
    {
      name: "project_association_role_item_code",
      placeholder: "Roles",
      required: true,
      type: "select",
      options: rolesTypes,
      width: 255,
    },
    {
      name: "project_association_start_date_participation",
      placeholder: "Fecha Inico",
      type: "date",
      restriction: "cantAfterToday",
      width: 255,
      validations: [
        (value, allValues) => {
          if (
            value &&
            allValues.project_association_end_date_participation &&
            new Date(value) <
              new Date(allValues.project_association_end_date_participation)
          ) {
            return "La fecha de inicio debe ser menor a la fecha final.";
          }
          return null;
        },
      ],
    },
    {
      name: "project_association_end_date_participation",
      placeholder: "Fecha Final",
      required: true,
      type: "date",
      width: 255,
      restriction: "cantAfterToday",
      validations: [
        (value, allValues) => {
          if (
            value &&
            allValues.project_association_start_date_participation &&
            new Date(value) >
              new Date(allValues.project_association_start_date_participation)
          ) {
            return "La fecha final debe ser mayor a la fecha de inicio.";
          }
          return null;
        },
      ],
    },
    {
      name: "project_association_technology_details",
      placeholder: "Tecnologias",
      required: false,
      type: "textarea",
      width: 800,
    },
  ];

  /*
   * Fields de manejo de formularios edicion
   */
  const editFieldsAssociation = [
    {
      name: "cod_project",
      placeholder: "Proyecto",
      required: true,
      type: "select",
      options: projects,
      width: 150,
    },
    {
      name: "project_association_role_item_code",
      placeholder: "Roles",
      required: true,
      type: "select",
      options: rolesTypes,
      width: 150,
    },
    {
      name: "project_association_start_date_participation",
      placeholder: "Fecha Inico",
      type: "date",
      restriction: "cantAfterToday",
      width: 150,
      validations: [
        (value, allValues) => {
          const project = projects.find(
            (p) => p.cod_project === allValues.cod_project
          );
          const selectedDate = parseDateWithoutTimezone(value);
          const startProject = parseDateWithoutTimezone(
            project.project_start_date
          );
          const endProject = parseDateWithoutTimezone(project.project_end_date);
          const endParticipation = parseDateWithoutTimezone(
            allValues.project_association_end_date_participation
          );

          if (
            selectedDate &&
            endParticipation &&
            selectedDate > endParticipation
          ) {
            return "La fecha de inicio debe ser menor a la fecha final.";
          }
          if (selectedDate < startProject || selectedDate > endProject) {
            return `La fecha de participación debe estar dentro del rango del proyecto (desde ${formatDateDDMMYYYY(
              project.project_start_date
            )} hasta ${formatDateDDMMYYYY(project.project_end_date)}).`;
          }
          return null;
        },
      ],
    },
    {
      name: "project_association_end_date_participation",
      placeholder: "Fecha Final",
      required: true,
      type: "date",
      width: 150,
      restriction: "cantAfterToday",
      validations: [
        (value, allValues) => {
          const project = projects.find(
            (p) => p.cod_project === allValues.cod_project
          );
          const selectedDate = parseDateWithoutTimezone(value);
          const startProject = parseDateWithoutTimezone(
            project.project_start_date
          );
          const endProject = parseDateWithoutTimezone(project.project_end_date);
          const startProjectParticipation = parseDateWithoutTimezone(
            allValues.project_association_start_date_participation
          );

          if (
            selectedDate &&
            startProjectParticipation &&
            selectedDate < startProjectParticipation
          ) {
            return "La fecha final debe ser mayor a la fecha de inicio.";
          }
          if (selectedDate < startProject || selectedDate > endProject) {
            return `La fecha de participación debe estar dentro del rango del proyecto (desde ${formatDateDDMMYYYY(
              project.project_start_date
            )} hasta ${formatDateDDMMYYYY(project.project_end_date)}).`;
          }
          return null;
        },
      ],
    },
    {
      name: "project_association_technology_details",
      placeholder: "Tecnologias",
      required: false,
      type: "textarea",
      width: 400,
    },
  ];

  /*
   * Constantes para el manejo de filtrado
   */
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState(
    fieldsAssociation[0]?.name || ""
  );

  /*
   * Manejo de historial para evitar busqueda con la paginacion
   */
  const [appliedField, setAppliedField] = useState(
    fieldsAssociation[1]?.name || ""
  );
  const [appliedText, setAppliedText] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  /*
   *  Obtener listado de roles
   */
  const fetchRoles = async () => {
    try {
      const typesResp = await getItems(
        Number(import.meta.env.VITE_ROLE_SERVICE_CODE),
        Number(import.meta.env.VITE_ROLE_CATEGORY_CODE)
      );
      setRolesTypes(
        typesResp.map((type) => ({
          value: type.cod_item,
          label: type.item_name,
          placeholder: type.item_name,
          name: type.cod_item,
        }))
      );
    } catch (err) {
      setErrorAssociations("Error al obtener roles");
      ModalAlert("Error", "Error al obtener roles", "error");
      return [];
    }
  };

  /*
   *  Obtener listado de associaciones a proyectos
   */
  const fetchAssociation = async (pageNum = page, projectsData = projects) => {
    try {
      setLoadingAssociation(true);
      const resp = await getAssociationProject(profileCod, pageNum, pageSize);
      const enriched = resp.data.data.map((assoc) => {
        const project = projectsData.find(
          (p) => p.cod_project === assoc.cod_project
        );
        return {
          ...assoc,
          project_name: project?.project_name || "Proyecto no encontrado",
          project_company: project?.project_company || "Empresa no disponible",
          project_client_name:
            project?.project_client_name || "Cliente no disponible",
        };
      });
      setAssociations(enriched);
      setTotalPages(resp.data.totalPages || 1);
      setPage(resp.data.currentPage || 1);
    } catch {
      setErrorAssociations("Error al obtener asociaciones");
      ModalAlert("Error", "Error al obtener asociaciones", "error");
    } finally {
      setLoadingAssociation(false);
    }
  };

  /*
   *  Agregar associaciones a proyectos
   */
  const handleSubmitAssociation = async (formData) => {
    try {
      setLoadingAssociation(true);
      const dataToSend = {
        ...formData,
        profile_cod: Number(profileCod),
        project_association_role_service_code: Number(
          import.meta.env.VITE_ROLE_SERVICE_CODE
        ),
        project_association_role_category_code: Number(
          import.meta.env.VITE_ROLE_CATEGORY_CODE
        ),
      };

      const response = await addAssociationProject(dataToSend);
      if (response.status === 201) {
        Swal.fire("Éxito", "Asociación agregado exitosamente.", "success");
        await fetchAssociation(profileCod);
        setShowFormAssociations(false);
        setErrorAssociations(null);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Error al agregar asociación .";
      Swal.fire("Error", msg, "error");
      setErrorAssociations(msg);
    } finally {
      setLoadingAssociation(false);
    }
  };

  /*
   * Edicion de formacion academica
   */
  const handleEditAssociation = async (updatedData) => {
    const confirm = await Swal.fire({
      title: "¿Guardar cambios?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
    });

    if (!confirm.isConfirmed) return false;

    try {
      setLoadingAssociation(true);
      const response = await updateAssociationProject(updatedData);
      if (response.status === 200) {
        Swal.fire("Actualizado", "Asociación editado exitosamente.", "success");
        await fetchAssociation(profileCod);
        setErrorAssociations(null);
      }
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || "Error al editar.";
      Swal.fire("Error", msg, "error");
      setErrorAssociations(msg);
      return false;
    } finally {
      setLoadingAssociation(false);
    }
  };

  //busqueda de activos
  const handleSearch = async () => {
    try {
      setLoadingAssociation(true);
      setAppliedField(searchFeature);
      setAppliedText(searchText);
      setIsFiltering(true);

      const resp = await findAssociationProject(
        1,
        pageSize,
        searchFeature,
        searchText,
        profileCod
      );

      const enriched = resp.data.data.map((assoc) => {
        const project = projects.find(
          (p) => p.cod_project === assoc.cod_project
        );
        return {
          ...assoc,
          project_name: project?.project_name || "Proyecto no encontrado",
          project_company: project?.project_company || "Empresa no disponible",
          project_client_name:
            project?.project_client_name || "Cliente no disponible",
        };
      });
      setAssociations(enriched);
      setTotalPages(resp.data.totalPages || 1);
      setPage(resp.data.currentPage || 1);
    } catch {
      ModalAlert("Error", "Error al filtrar asociaciones", "error");
    } finally {
      setLoadingAssociation(false);
    }
  };

  /*
   * Mantener filtro al cambiar de página
   */
  const findAndSetFiltered = async (pageNum = 1) => {
    try {
      setLoadingAssociation(true);
      const resp = await findAssociationProject(
        pageNum,
        pageSize,
        appliedField,
        appliedText,
        profileCod
      );
      const enriched = resp.data.data.map((assoc) => {
        const project = projects.find(
          (p) => p.cod_project === assoc.cod_project
        );
        return {
          ...assoc,
          project_name: project?.project_name || "Proyecto no encontrado",
          project_company: project?.project_company || "Empresa no disponible",
          project_client_name:
            project?.project_client_name || "Cliente no disponible",
        };
      });
      setAssociations(enriched);
      setTotalPages(resp.data.totalPages || 1);
      setPage(resp.data.currentPage || 1);
    } catch {
      ModalAlert("Error", "Error al filtrar asociaciones", "error");
    } finally {
      setLoadingAssociation(false);
    }
  };

  /*
   * Cambiar página
   */
  const onPageChange = async (newPage) => {
    if (isFiltering) {
      await findAndSetFiltered(newPage);
    } else {
      await fetchAssociation(newPage, projects);
    }
  };

  /*
   * Inicialización
   */
  useEffect(() => {
    const fetchData = async () => {
      await fetchRoles();
      const projectsData = await projectService.getAllProjects();
      const mappedProjects = projectsData.map((project) => ({
        ...project,
        name: project.cod_project,
        placeholder: project.project_company,
        value: project.cod_project,
      }));
      setProjects(mappedProjects);
      await fetchAssociation(1, mappedProjects);
    };
    fetchData();
  }, []);

  return {
    associations,
    rolesTypes,
    projects,

    fieldsAssociation,
    editFieldsAssociation,
    errorAssociations,
    setErrorAssociations,

    showFormAssociations,
    setShowFormAssociations,

    isLoadingAssociation,

    handleSubmitAssociation,
    handleEditAssociation,

    searchText,
    searchFeature,
    setSearchText,
    setSearchFeature,

    handleSearch,

    onPageChange,
    page,
    totalPages,
  };
};
