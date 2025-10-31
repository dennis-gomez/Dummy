import { useState } from "react";
import { Tooltip, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ModalAlert from "../molecules/modalAlert";
import ModalElimination from "../molecules/modalElimination";
import InputValidated from "../atoms/inputValidatedSupplier";
import projectService from "../../services/projectService";

function TableProject({ projects, onRefresh }) {
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEditClick = (project) => {
    setEditRowId(project.cod_project);
    setEditData({ ...project });
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await projectService.updateProject(editRowId, editData);
      ModalAlert("Éxito", "Proyecto actualizado correctamente", "success", 2000);
      setEditRowId(null);
      setEditData({});
      onRefresh();
    } catch (error) {
      ModalAlert("Error", error.message || "No se pudo actualizar el proyecto", "error", 3000);
    }
  };

  const handleDelete = async (cod_project, projectName) => {
    try {
      await projectService.deleteProject(cod_project);
      ModalAlert("Eliminado", `Proyecto "${projectName}" desactivado correctamente`, "success", 2000);
      onRefresh();
    } catch (error) {
      ModalAlert("Error", error.message || "Error al desactivar el proyecto", "error", 3000);
    }
  };

  const handleReactivate = async (cod_project, projectName) => {
    try {
      await projectService.reactiveProject(cod_project);
      ModalAlert("Éxito", `Proyecto "${projectName}" reactivado correctamente`, "success", 2000);
      onRefresh();
    } catch (error) {
      ModalAlert("Error", error.message || "Error al reactivar el proyecto", "error", 3000);
    }
  };

  // Función para parsear tecnologías
  const parseTechnologies = (techString) => {
    if (!techString) return [];
    return techString.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0);
  };

  // Función para determinar el color del chip según la tecnología - CORREGIDA
  const getTechChipProps = (tech) => {
    const techLower = tech.toLowerCase();

    if (techLower.includes('react') || techLower.includes('angular') || techLower.includes('vue') || techLower.includes('html') || techLower.includes('css')) {
      return {
        sx: {
          backgroundColor: '#faf5ff',
          color: '#6b21a8',
          borderColor: '#d8b4fe',
          '&:hover': {
            backgroundColor: '#f3e8ff'
          },
          maxWidth: 'none',
          whiteSpace: 'nowrap', // Evita múltiples líneas
          height: 'auto',
          minHeight: '32px',
          padding: '4px 8px',
        }
      };
    } else if (techLower.includes('node') || techLower.includes('.net') || techLower.includes('c#') || techLower.includes('python') || techLower.includes('java')) {
      return {
        sx: {
          backgroundColor: '#f0fdf4',
          color: '#166534',
          borderColor: '#bbf7d0',
          '&:hover': {
            backgroundColor: '#dcfce7'
          },
          maxWidth: 'none',
          whiteSpace: 'nowrap',
          height: 'auto',
          minHeight: '32px',
          padding: '4px 8px',
        }
      };
    } else if (techLower.includes('sql') || techLower.includes('mongo') || techLower.includes('database') || techLower.includes('oracle')) {
      return {
        sx: {
          backgroundColor: '#fff7ed',
          color: '#9a3412',
          borderColor: '#fdba74',
          '&:hover': {
            backgroundColor: '#ffedd5'
          },
          maxWidth: 'none',
          whiteSpace: 'nowrap',
          height: 'auto',
          minHeight: '32px',
          padding: '4px 8px',
        }
      };
    } else if (techLower.includes('aws') || techLower.includes('azure') || techLower.includes('cloud') || techLower.includes('docker')) {
      return {
        sx: {
          backgroundColor: '#eff6ff',
          color: '#1e40af',
          borderColor: '#93c5fd',
          '&:hover': {
            backgroundColor: '#dbeafe'
          },
          maxWidth: 'none',
          whiteSpace: 'nowrap',
          height: 'auto',
          minHeight: '32px',
          padding: '4px 8px',
        }
      };
    } else if (techLower.includes('windows') || techLower.includes('iis') || techLower.includes('microsoft')) {
      return {
        sx: {
          backgroundColor: '#ecfeff',
          color: '#0e7490',
          borderColor: '#67e8f9',
          '&:hover': {
            backgroundColor: '#cffafe'
          },
          maxWidth: 'none',
          whiteSpace: 'nowrap',
          height: 'auto',
          minHeight: '32px',
          padding: '4px 8px',
        }
      };
    } else {
      return {
        sx: {
          backgroundColor: '#f9fafb',
          color: '#374151',
          borderColor: '#d1d5db',
          '&:hover': {
            backgroundColor: '#f3f4f6'
          },
          maxWidth: 'none',
          whiteSpace: 'nowrap',
          height: 'auto',
          minHeight: '32px',
          padding: '4px 8px',
        }
      };
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-7xl mx-auto mb-4">
        No hay proyectos registrados
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg w-full max-w-none">
      <table className="min-w-full table-auto border-collapse w-full">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md">ID</th>
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md">Proyecto</th>
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md">Empresa</th>
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md">Cliente</th>
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md">Sector</th>
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md min-w-[200px]">Descripción</th>
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md min-w-[400px]">Tecnologías</th>
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md min-w-[200px]">Contacto</th>
            <th className="py-6 px-20 text-center font-semibold text-sm md:text-md">Fechas</th>
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md">Estado</th>
            <th className="py-6 px-8 text-center font-semibold text-sm md:text-md">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr
              key={project.cod_project}
              className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
            >
              {/* ID */}
              <td className="py-2 px-3 text-center min-w-[200px]">{project.cod_project}</td>

              {/* Nombre */}
              <td className="py-2 px-3 text-center min-w-[200px]">
                {editRowId === project.cod_project ? (
                  <InputValidated
                    name="project_name"
                    value={editData.project_name || ""}
                    onChange={handleChange}
                    placeholder="Nombre"
                    label="Nombre"
                  />
                ) : (
                  <span>{project.project_name}</span>
                )}
              </td>

              {/* Empresa */}
              <td className="py-2 px-3 text-center min-w-[200px]">
                {editRowId === project.cod_project ? (
                  <InputValidated
                    name="project_company"
                    value={editData.project_company || ""}
                    onChange={handleChange}
                    placeholder="Empresa"
                    label="Empresa"
                  />
                ) : (
                  <span>{project.project_company}</span>
                )}
              </td>

              {/* Cliente */}
              <td className="py-2 px-3 text-center min-w-[200px]">
                {editRowId === project.cod_project ? (
                  <InputValidated
                    name="project_client_name"
                    value={editData.project_client_name || ""}
                    onChange={handleChange}
                    placeholder="Cliente"
                    label="Cliente"
                  />
                ) : (
                  <span>{project.project_client_name}</span>
                )}
              </td>

              {/* Sector */}
              <td className="py-2 px-3 text-center min-w-[200px]">
                {editRowId === project.cod_project ? (
                  <InputValidated
                    name="project_sector"
                    value={editData.project_sector || ""}
                    onChange={handleChange}
                    placeholder="Sector"
                    label="Sector"
                  />
                ) : (
                  <Chip label={project.project_sector} size="small" variant="outlined" />
                )}
              </td>

              {/* Descripción */}
              <td className="py-2 px-3 text-center min-w-[200px]">
                {editRowId === project.cod_project ? (
                  <InputValidated
                    name="project_description"
                    value={editData.project_description || ""}
                    onChange={handleChange}
                    placeholder="Descripción"
                    label="Descripción"
                     multiline
                  />
                ) : (
                  <span className="block break-words">{project.project_description || "—"}</span>
                )}
              </td>
              <td className="py-2 px-3 text-center min-w-[400px]">
                {editRowId === project.cod_project ? (
                  <InputValidated
                    name="project_technologies"
                    value={editData.project_technologies || ""}
                    onChange={handleChange}
                    placeholder="Ej: React, Node.js, MongoDB, Python, AWS, Docker..."
                    label="Tecnologías"
                    multiline
                    rows={4}
                    className="min-h-[100px] resize-y"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex flex-wrap gap-1 justify-center mb-1 w-full">
                      {parseTechnologies(project.project_technologies).slice(0, 2).map((tech, index) => (
                        <Tooltip key={index} title={tech} arrow>
                          <Chip
                            label={tech}
                            size="small"
                            variant="outlined"
                            {...getTechChipProps(tech)}
                          />
                        </Tooltip>
                      ))}
                    </div>
                    {parseTechnologies(project.project_technologies).length === 0 && (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                    {parseTechnologies(project.project_technologies).length > 2 && (
                      <Tooltip
                        title={
                          <div className="flex flex-wrap gap-1 max-w-[600px] p-3">
                            {parseTechnologies(project.project_technologies).map((tech, index) => (
                              <Chip
                                key={index}
                                label={tech}
                                size="small"
                                {...getTechChipProps(tech)}
                                className="m-1"
                                sx={{
                                  ...getTechChipProps(tech).sx,
                                  maxWidth: 'none',
                                  overflow: 'visible',
                                  whiteSpace: 'nowrap'
                                }}
                              />
                            ))}
                          </div>
                        }
                        arrow
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              maxWidth: 'none',
                              backgroundColor: 'white',
                              border: '1px solid #e5e7eb',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }
                          }
                        }}
                      >
                        <span className="text-xs text-blue-600 cursor-pointer hover:underline">
                          +{parseTechnologies(project.project_technologies).length - 2} más
                        </span>
                      </Tooltip>
                    )}
                  </div>
                )}
              </td>

              {/* Contacto */}
              <td className="py-2 px-3 text-center min-w-[200px]">
                {editRowId === project.cod_project ? (
                  <div className="flex flex-col gap-1 items-start">
                    <InputValidated
                      name="project_contact_full_name"
                      value={editData.project_contact_full_name || ""}
                      onChange={handleChange}
                      placeholder="Nombre contacto"
                      label="Nombre contacto"
                    />
                    <InputValidated
                      name="project_contact_phone"
                      value={editData.project_contact_phone || ""}
                      onChange={handleChange}
                      placeholder="Teléfono"
                      label="Teléfono"
                    />
                    <InputValidated
                      name="project_contact_email"
                      value={editData.project_contact_email || ""}
                      onChange={handleChange}
                      placeholder="Email"
                      label="Email"
                    />
                    <InputValidated
                      name="project_contact_position"
                      value={editData.project_contact_position || ""}
                      onChange={handleChange}
                      placeholder="Cargo"
                      label="Cargo"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 items-start">
                    <div>{project.project_contact_full_name || "—"}</div>
                    <div>{project.project_contact_phone || "—"}</div>
                    <div>{project.project_contact_email || "—"}</div>
                    <div>{project.project_contact_position || "—"}</div>
                  </div>
                )}
              </td>

              {/* Fechas */}
              <td className="py-2 px-3 text-center">
                {editRowId === project.cod_project ? (
                  <div className="flex flex-col gap-1">
                    <InputValidated
                      name="project_start_date"
                      type="date"
                      value={editData.project_start_date || ""}
                      onChange={handleChange}
                      label="Inicio"
                    />
                    <InputValidated
                      name="project_end_date"
                      type="date"
                      value={editData.project_end_date || ""}
                      onChange={handleChange}
                      label="Fin"
                    />
                  </div>
                ) : (
                  <div>
                    <div>Inicio: {project.project_start_date || "—"}</div>
                    <div>Fin: {project.project_end_date || "—"}</div>
                  </div>
                )}
              </td>

              {/* Estado */}
              <td className="py-2 px-3 text-center">
                <Chip
                  icon={project.project_is_active ? <CheckCircleIcon /> : undefined}
                  label={project.project_is_active ? "Activo" : "Inactivo"}
                  color={project.project_is_active ? "success" : "default"}
                  size="small"
                  variant={project.project_is_active ? "filled" : "outlined"}
                />
              </td>

              {/* Acciones */}
              <td className="py-2 px-3 text-center">
                {editRowId === project.cod_project ? (
                  <div className="flex flex-col justify-center items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center hover:bg-blue-700 w-max"
                    >
                      <SaveIcon className="mr-1" fontSize="small" /> Guardar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 flex items-center w-max"
                    >
                      <CancelIcon className="mr-1" fontSize="small" /> Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-center items-center">
                    <Tooltip title={project.project_is_active ? "Editar proyecto" : "Proyecto inactivo"}>
                      <button
                        onClick={() => handleEditClick(project)}
                        disabled={!project.project_is_active}
                        className={`text-blue-600 hover:text-blue-800 flex items-center ${!project.project_is_active ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <EditIcon fontSize="medium" />
                      </button>
                    </Tooltip>

                    {project.project_is_active ? (
                      <ModalElimination
                        message={`¿Deseas desactivar el proyecto "${project.project_name}"?`}
                        confirmText="Desactivar"
                        onClick={() => handleDelete(project.cod_project, project.project_name)}
                      />
                    ) : (
                      <ModalElimination
                        message={`¿Deseas reactivar el proyecto "${project.project_name}"?`}
                        confirmText="Reactivar"
                        onClick={() => handleReactivate(project.cod_project, project.project_name)}
                      />
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableProject;