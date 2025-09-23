import { Box, Button, Typography, Grid, Paper } from "@mui/material";
import InputValidated from "../molecules/InputValidated";
import InputValidatedDate from "../molecules/InputValidatedDate";

const fieldLabels = {
  extinguisher_serial_number: "Número de Serie",
  extinguisher_brand: "Marca",
  extinguisher_agent: "Agente",
  extinguisher_type: "Tipo",
  extinguisher_capacity: "Capacidad",
  extinguisher_manufacturing_date: "Fecha de Fabricación",
  extinguisher_installation_date: "Fecha de Instalación",
  extinguisher_location: "Ubicación",
  extinguisher_next_date_inspection: "Próxima Inspección",
  extinguisher_observations: "Observaciones",
};

const extinguisherTypes = [
  { value: "A", label: "A — Para sólidos" },
  { value: "B", label: "B — Para líquidos/gases inflamables" },
  { value: "C", label: "C — Para equipos energizados" },
  { value: "D", label: "D — Para metales combustibles" },
  { value: "K", label: "K — Para cocina: grasas y aceites" },
  { value: "ABC", label: "ABC — Para multipropósito (A+B+C)" },
  { value: "BC", label: "BC — Para líquidos y gases" },
  { value: "AB", label: "AB — Para sólidos y líquidos" },
];

// Estilo común para todos los inputs
const whiteInputStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff',
  }
};

const ExtinguisherForm = ({ extinguisher, setExtinguisher, onSubmit, onCancel }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExtinguisher({ ...extinguisher, [name]: value });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setExtinguisher({ ...extinguisher, [name]: value });
  };

  return (
    <Paper
      sx={{
        maxWidth: 730,
        margin: "20px auto",
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "#d9d9d9",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Agregar Extintor
      </Typography>

      <Grid container spacing={2}>
        {/* Fila 1 */}
        <Grid item xs={4}>
          <InputValidated
            name="extinguisher_serial_number"
            placeholder={fieldLabels.extinguisher_serial_number}
            value={extinguisher.extinguisher_serial_number || ""}
            onChange={handleInputChange}
            sx={whiteInputStyle}
          />
        </Grid>
        <Grid item xs={4}>
          <InputValidatedDate
            name="extinguisher_manufacturing_date"
            placeholder={fieldLabels.extinguisher_manufacturing_date}
            value={extinguisher.extinguisher_manufacturing_date}
            onChange={handleDateChange}
            restriction="cantAfterToday"
            sx={whiteInputStyle}
          />
        </Grid>
        <Grid item xs={4}>
          <InputValidated
            name="extinguisher_brand"
            placeholder={fieldLabels.extinguisher_brand}
            value={extinguisher.extinguisher_brand || ""}
            onChange={handleInputChange}
            sx={whiteInputStyle}
          />
        </Grid>

        {/* Fila 2 */}
        <Grid item xs={4}>
          <InputValidated
            name="extinguisher_agent"
            placeholder={fieldLabels.extinguisher_agent}
            value={extinguisher.extinguisher_agent || ""}
            onChange={handleInputChange}
            sx={whiteInputStyle}
          />
        </Grid>
        <Grid item xs={4}>
          <InputValidatedDate
            name="extinguisher_installation_date"
            placeholder={fieldLabels.extinguisher_installation_date}
            value={extinguisher.extinguisher_installation_date}
            onChange={handleDateChange}
            restriction="betweenManufactureAndToday"
            sx={whiteInputStyle}
          />
        </Grid>
        <Grid item xs={4}>
          <InputValidated
            name="extinguisher_type"
            placeholder={fieldLabels.extinguisher_type}
            value={extinguisher.extinguisher_type || ""}
            onChange={handleInputChange}
            type="select"
            options={extinguisherTypes}
            sx={whiteInputStyle}
          />
        </Grid>

        {/* Fila 3 */}
        <Grid item xs={4}>
          <InputValidated
            name="extinguisher_capacity"
            placeholder={fieldLabels.extinguisher_capacity}
            value={extinguisher.extinguisher_capacity || ""}
            onChange={handleInputChange}
            sx={whiteInputStyle}
          />
        </Grid>
        <Grid item xs={4}>
          <InputValidatedDate
            name="extinguisher_next_date_inspection"
            placeholder={fieldLabels.extinguisher_next_date_inspection}
            value={extinguisher.extinguisher_next_date_inspection}
            onChange={handleDateChange}
            restriction="cantBeforeToday"
            sx={whiteInputStyle}
          />
        </Grid>
        <Grid item xs={4}>
          <InputValidated
            name="extinguisher_location"
            placeholder={fieldLabels.extinguisher_location}
            value={extinguisher.extinguisher_location || ""}
            onChange={handleInputChange}
            sx={whiteInputStyle}
          />
        </Grid>

        {/* Observaciones ocupa toda la fila */}
        <Grid item xs={12}>
          <InputValidated
            name="extinguisher_observations"
            placeholder={fieldLabels.extinguisher_observations}
            value={extinguisher.extinguisher_observations || ""}
            onChange={handleInputChange}
            type="textarea"
            required={false}
            sx={whiteInputStyle}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button onClick={onCancel} sx={{ mr: 2 }}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Guardar
        </Button>
      </Box>
    </Paper>
  );
};

export default ExtinguisherForm;