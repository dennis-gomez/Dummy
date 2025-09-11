import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Input from "../atoms/input";
import { useState } from "react";

const fields = [
  { name: "vehicle_brand", placeholder: "Marca" },
  { name: "vehicle_model", placeholder: "Modelo" },
  { name: "vehicle_year", placeholder: "Año", type: "number" },
  { name: "vehicle_plate", placeholder: "Placa" },
  { name: "vehicle_initial_km", placeholder: "Kilometraje inicial", type: "number" },
  { name: "vehicle_last_km_maintenance", placeholder: "Último mantenimiento (km)", type: "number" },
  { name: "vehicle_type_of_oil", placeholder: "Tipo de aceite" },
  { name: "vehicle_frecuency_of_change", placeholder: "Frecuencia de cambio (km)", type: "number" },
  { name: "vehicle_spark_plug_model", placeholder: "Bujía" },
  { name: "vehicle_tires_front", placeholder: "Llantas delanteras" },
  { name: "vehicle_tires_back", placeholder: "Llantas traseras" },
  { name: "bike_brake_pad", placeholder: "Pastillas de freno" },
  { name: "vehicle_color", placeholder: "Color" }
];

function FormVehicle({ onSubmit }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box 
        sx={{ flexGrow: 1, p: 3, maxWidth: 800, margin: "0 auto" }}
        color={"red"}
    >
      <form onSubmit={handleSubmit}>
        <Grid 
            container spacing={2}
        >
            {fields.map((field, index) => {
                const isLastSingle = fields.length % 2 !== 0 && index === fields.length - 1;
                return (
                    <Grid 
                        item xs={12} 
                        sm={isLastSingle ? 12 : 6} 
                        key={field.name}
                    >
                        <Input
                            name={field.name}
                            type={field.type || "text"}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
                    </Grid>
                );
            })}
            <Grid item xs={12}>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                >
                    Guardar Vehículo
                </Button>
            </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default FormVehicle;
