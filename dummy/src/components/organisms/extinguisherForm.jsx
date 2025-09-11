import React from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const fieldLabels = {
  extinguisher_serial_number: "Número de Serie",
  extinguisher_brand: "Marca",
  extinguisher_agent: "Agente",
  extinguisher_type: "Tipo",
  extinguisher_capacity: "Capacidad",
  extinguisher_manufacturing_date: "Fecha de Fabricación",
  extinguisher_installation_date: "Fecha de Instalación",
  extinguisher_location: "Ubicación",
  extinguisher_last_date_inspection: "Última Inspección",
  extinguisher_observations: "Observaciones",
};

// Definimos qué campos son fechas
const dateFields = [
  "extinguisher_manufacturing_date",
  "extinguisher_installation_date",
  "extinguisher_last_date_inspection",
];

const ExtinguisherForm = ({ extinguisher, setExtinguisher, onSubmit, onCancel }) => {
  const normalFields = Object.keys(extinguisher).filter(
    (key) => key !== "extinguisher_observations"
  );

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "20px auto",
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Agregar Extintor
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
<Grid container spacing={2}>
  {normalFields.map((key) => {
    const gridSize = 4; // 3 columnas

    if (dateFields.includes(key)) {
      return (
        <Grid key={key} xs={{ span: gridSize }}>
          <DatePicker
            label={fieldLabels[key]}
            value={extinguisher[key] || null}
            onChange={(newValue) =>
              setExtinguisher({ ...extinguisher, [key]: newValue })
            }
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      );
    }

    return (
      <Grid key={key} xs={{ span: gridSize }}>
        <TextField
          fullWidth
          label={fieldLabels[key]}
          value={extinguisher[key]}
          onChange={(e) =>
            setExtinguisher({ ...extinguisher, [key]: e.target.value })
          }
        />
      </Grid>
    );
  })}

  {/* Observaciones ocupa toda la fila */}
  <Grid xs={{ span: 12 }}>
    <TextField
      fullWidth
      multiline
      rows={4}
      label={fieldLabels.extinguisher_observations}
      value={extinguisher.extinguisher_observations}
      onChange={(e) =>
        setExtinguisher({ ...extinguisher, extinguisher_observations: e.target.value })
      }
    />
  </Grid>
</Grid>

      </LocalizationProvider>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onCancel} sx={{ mr: 2 }}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default ExtinguisherForm;
