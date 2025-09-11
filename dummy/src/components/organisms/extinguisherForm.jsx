import React from "react";
import { Box, TextField, Button, Typography, Grid, Paper } from "@mui/material";
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

const ExtinguisherForm = ({ extinguisher, setExtinguisher, onSubmit, onCancel }) => {
  return (
    <Paper
      sx={{
        maxWidth: 730,
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
          {/* Fila 1 */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={fieldLabels.extinguisher_serial_number}
              value={extinguisher.extinguisher_serial_number}
              onChange={(e) =>
                setExtinguisher({ ...extinguisher, extinguisher_serial_number: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <DatePicker
              label={fieldLabels.extinguisher_manufacturing_date}
              value={extinguisher.extinguisher_manufacturing_date || null}
              onChange={(newValue) =>
                setExtinguisher({ ...extinguisher, extinguisher_manufacturing_date: newValue })
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={fieldLabels.extinguisher_brand}
              value={extinguisher.extinguisher_brand}
              onChange={(e) =>
                setExtinguisher({ ...extinguisher, extinguisher_brand: e.target.value })
              }
            />
          </Grid>

          {/* Fila 2 */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={fieldLabels.extinguisher_agent}
              value={extinguisher.extinguisher_agent}
              onChange={(e) =>
                setExtinguisher({ ...extinguisher, extinguisher_agent: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <DatePicker
              label={fieldLabels.extinguisher_installation_date}
              value={extinguisher.extinguisher_installation_date || null}
              onChange={(newValue) =>
                setExtinguisher({ ...extinguisher, extinguisher_installation_date: newValue })
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={fieldLabels.extinguisher_type}
              value={extinguisher.extinguisher_type}
              onChange={(e) =>
                setExtinguisher({ ...extinguisher, extinguisher_type: e.target.value })
              }
            />
          </Grid>

          {/* Fila 3 */}
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={fieldLabels.extinguisher_capacity}
              value={extinguisher.extinguisher_capacity}
              onChange={(e) =>
                setExtinguisher({ ...extinguisher, extinguisher_capacity: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={4}>
            <DatePicker
              label={fieldLabels.extinguisher_last_date_inspection}
              value={extinguisher.extinguisher_last_date_inspection || null}
              onChange={(newValue) =>
                setExtinguisher({ ...extinguisher, extinguisher_last_date_inspection: newValue })
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={fieldLabels.extinguisher_location}
              value={extinguisher.extinguisher_location}
              onChange={(e) =>
                setExtinguisher({ ...extinguisher, extinguisher_location: e.target.value })
              }
            />
          </Grid>

          {/* Observaciones ocupa toda la fila */}
          <Grid item xs={12}>
            <TextField
              style={{ width: '720px' }}
              fullWidth
              multiline
              rows={4}
              label={fieldLabels.extinguisher_observations}
              value={extinguisher.extinguisher_observations}
              onChange={(e) =>
                setExtinguisher({
                  ...extinguisher,
                  extinguisher_observations: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

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
