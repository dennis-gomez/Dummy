import Form from "../organisms/form";
import {addVehicle, getVehicles, updateVehicle, deleteVehicle} from "../../services/vehicleService";
import { useEffect, useState } from "react";
import VehicleTable from "../organisms/vehicleTable";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";

function VehiclePage() {

    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);

    //estructura de los campos del formulario
    const fields = [
        { name: "vehicle_brand", placeholder: "Marca" },
        { name: "vehicle_model", placeholder: "Modelo" },
        { name: "vehicle_year", placeholder: "Año", type: "number" },
        { name: "vehicle_plate", placeholder: "Placa" },
        { name: "vehicle_initial_km", placeholder: "Kilometraje inicial", type: "number" },
        { name: "vehicle_last_km_maintenance", placeholder: "Último mantenimiento (km)", type: "number" },
        { name: "vehicle_frecuency_of_change", placeholder: "Frecuencia de cambio (km)", type: "number" },
        { name: "vehicle_type_of_oil", placeholder: "Tipo de aceite" },
        { name: "vehicle_spark_plug_model", placeholder: "Bujía" },
        { name: "vehicle_tires_front", placeholder: "Llantas delanteras" },
        { name: "vehicle_tires_back", placeholder: "Llantas traseras" },
        { name: "bike_brake_pad", placeholder: "Pastillas de freno" },
        { name: "vehicle_color", placeholder: "Color" }
    ];

    const handleSubmit = async ( formData ) => {
        try {
            const vehicles = await addVehicle(formData);
            fetchVehicles();
            setShowForm(false);
        }catch (error) {
            console.error("Error adding vehicle:", error);
        }
    };

    const handleEdit = async ( updatedData ) => {
        try {
            const updatedVehicles = await updateVehicle(updatedData);
            fetchVehicles();
        }catch (error) {
            console.error("Error editing vehicle:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const deletedVehicles = await deleteVehicle(id);
            fetchVehicles();
        }catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    }

    const fetchVehicles = async () => {
        try {
            const data = await getVehicles();
            setVehicles(data);
        }catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    useEffect(() => { 
        fetchVehicles();
    }, []);

    return(
        <div style={{ padding: 24 }}>
            <h1>Gestión de Vehiculos</h1>
            {showForm && (
                <Box
                    sx={{
                        maxWidth: 800,
                        margin: "20px auto",
                        p: 3,
                        boxShadow: 3,       
                        borderRadius: 2,    
                        backgroundColor: "#fff",
                    }}
                >
                    <Typography variant="h6" gutterBottom color="textPrimary" >
                        Agregar vehículo 
                    </Typography>
                    <Form 
                        fields={fields}
                        onSubmit={handleSubmit}
                        titleBtn={"Guardar vehículo"}
                    />
                </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button  
                    color="primary"
                    variant="contained"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Cancelar" : "Agregar Vehículo"}
                </Button>
            </Box>

            <VehicleTable
                fields={fields}
                vehicles={vehicles}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </div>
    );
}

export default VehiclePage;