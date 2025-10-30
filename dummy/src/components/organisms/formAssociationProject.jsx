import { useState, useEffect } from "react";
import { Box, Grid, CircularProgress, TextField, Autocomplete } from "@mui/material";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidated";
import InputValidatedDate from "../atoms/inputValidatedDate";
import { parseDateWithoutTimezone } from "../../utils/generalUtilities";

const FormAssociationProject = ({ 
  associations, 
  projects, 
  rolesTypes, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    cod_project: "",
    project_association_role_item_code: "",
    project_association_start_date_participation: "",
    project_association_end_date_participation: "",
    project_association_technology_details: "",
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [projectError, setProjectError] = useState("");
  const hasErrors = !!projectError || Object.values(errors).some((err) => !!err);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 300);
  }, []); 

  const handleProjectSelect = (event, newValue) => {
    setSelectedProject(newValue);
    setFormData((prev) => ({
      ...prev,
      cod_project: newValue?.cod_project || "",
      project_association_technology_details: newValue?.project_technologies || "",
    }));

    //validar el proyecto repetido
    if (newValue) {
      const alreadyAssociated = associations.some(
        (assoc) => assoc.cod_project === newValue.cod_project
      );
      if (alreadyAssociated) {
        setProjectError("Este proyecto ya está asociado al perfil.");
      } else {
        setProjectError("");
      }
    } else {
      setProjectError("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleError = (name, errorMessage) => {
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectError) return;

    const hasErrors = Object.values(errors).some((err) => !!err);
    if (!hasErrors) onSubmit(formData);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          {/* Autocomplete de proyectos */}
          <Grid item xs={12}>
            <Autocomplete
              options={projects}
              getOptionLabel={(option) =>
                `${option.project_client_name} - ${option.project_company}`
              }
              value={selectedProject}
              onChange={handleProjectSelect}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar Proyecto"
                  placeholder="Seleccione un Proyecto"
                  variant="outlined"
                  error={!!projectError}
                  helperText={projectError || " "}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-root": { backgroundColor: "#fff !important" },
                    "& .MuiFormHelperText-root": {
                      color: "#2563eb", // 💙 color azul personalizado
                      fontWeight: 500,
                    },
                    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#2563eb", // 💙 borde azul cuando hay error
                    },
                    "& .MuiFormLabel-root.Mui-error": {
                      color: "#2563eb", // 💙 label azul en error
                    },
                    width: 850,
                  }}
                />
              )}
            />
          </Grid>

          {/* Campos autocompletados solo lectura de proyectos */}
          {selectedProject && (
            <>
              <Grid item xs={4}>
                <InputValidated
                  name="project_name"
                  type="text"
                  placeholder="Nombre del Proyecto"
                  value={selectedProject.project_name}
                  sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff !important" }, width: 272 }}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <InputValidated
                  name="project_company"
                  type="text"
                  placeholder="Compañía"
                  value={selectedProject.project_company}
                  sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff !important" }, width: 272 }}
                  disabled
                />
              </Grid>
              <Grid item xs={4}>
                <InputValidated
                  name="project_client_name"
                  type="text"
                  placeholder="Cliente"
                  value={selectedProject.project_client_name}
                  sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff !important" }, width: 272 }}
                  disabled
                />
              </Grid>
            </>
          )}

          {/* Campos editables */}
          <Grid item xs={4}>
            <InputValidated
              name="project_association_role_item_code"
              type="select"
              placeholder="Rol"
              value={formData.project_association_role_item_code}
              onChange={handleChange}
              options={rolesTypes}
              sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff !important" }, width: 272 }}
              required
              onError={handleError}
            />
          </Grid>

          <Grid item xs={4}>
            <InputValidatedDate
              name="project_association_start_date_participation"
              placeholder="Fecha Inicio"
              value={formData.project_association_start_date_participation}
              onChange={handleChange}
              onError={handleError}
              restriction={"cantAfterToday"}
              validations={[
                (value) => {
                  const selectedDate = parseDateWithoutTimezone(value);
                  const endParticipation= parseDateWithoutTimezone(formData.project_association_end_date_participation);
                  const startProject = parseDateWithoutTimezone(selectedProject.project_start_date);
                  const endProject = parseDateWithoutTimezone(selectedProject.project_end_date);
                  
                  if (selectedDate && formData.project_association_end_date_participation && selectedDate > endParticipation) {
                    return "La fecha de inicio debe ser menor a la fecha final.";
                  }
                  console.log("fecha", selectedDate, "fecha inicio", startProject, "fecha fin", endProject)
                  if (selectedDate < startProject || selectedDate > endProject) {
                    return "La fecha de participación debe estar dentro del rango del proyecto.";
                  }
                  return null;
                }
              ]}
              required
              sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff !important" }, width: 272 }}
            />
          </Grid>

          <Grid item xs={4}>
            <InputValidatedDate
              name="project_association_end_date_participation"
              placeholder="Fecha Final"
              value={formData.project_association_end_date_participation}
              onChange={handleChange}
              onError={handleError}
              restriction={"cantAfterToday"}
              validations={[
                (value) => {
                  const selectedDate = parseDateWithoutTimezone(value);
                  const startParticipation= parseDateWithoutTimezone(formData.project_association_start_date_participation);
                  const startProject = parseDateWithoutTimezone(selectedProject.project_start_date);
                  const endProject = parseDateWithoutTimezone(selectedProject.project_end_date);

                  if (selectedDate && formData.project_association_start_date_participation && selectedDate < startParticipation) {
                    return "La fecha final debe ser mayor a la fecha de inicio.";
                  }
                  if (selectedDate < startProject || selectedDate > endProject) {
                    return "La fecha de participación debe estar dentro del rango del proyecto.";
                  }
                  return null;
                }
              ]}
              required
              sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff !important" }, width: 272 }}
            />
          </Grid>

          <Grid item xs={12}>
            <InputValidated
              name="project_association_technology_details"
              type="textarea"
              placeholder="Descripción o Tecnologías utilizadas"
              value={formData.project_association_technology_details}
              onChange={handleChange}
              sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff !important" }, width: 850 }}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
          <Button 
            text="Guardar Proyecto" 
            onClick={handleSubmit} 
            type="submit" 
            disabled={hasErrors || loading} 
          />
        </Box>
      </form>
    </Box>
  );
};

export default FormAssociationProject;
