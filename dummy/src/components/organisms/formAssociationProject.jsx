import { useState, useEffect } from "react";
import { Box, Grid, CircularProgress, TextField, Autocomplete } from "@mui/material";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidated";
import InputValidatedDate from "../atoms/inputValidatedDate";

const FormAssociationProject = ({ projects, rolesTypes, onSubmit }) => {
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

  // Simula carga de proyectos (puedes omitir si los recibes directo del prop)
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
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{ "& .MuiInputBase-root": { backgroundColor: "#fff !important" }, width: 850 }}
                  required
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

          {/* Resto de campos editables */}
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
                  if (value && formData.project_association_end_date_participation && new Date(value) > new Date(formData.project_association_end_date_participation)) {
                    return "La fecha de inicio debe ser menor a la fecha final.";
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
                  if (value && formData.project_association_start_date_participation && new Date(value) < new Date(formData.project_association_start_date_participation)) {
                    return "La fecha final debe ser mayor a la fecha de inicio.";
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
          <Button text="Guardar Proyecto" onClick={handleSubmit} type="submit" />
        </Box>
      </form>
    </Box>
  );
};

export default FormAssociationProject;
