import Form from "../organisms/form";
import {addVehicle, getVehicles, updateVehicle, deleteVehicle} from "../../services/vehicleService";
import { useEffect, useState } from "react";
import VehicleTable from "../organisms/vehicleTable";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ModalAlert from "../molecules/modalAlert";

function VehiclePage() {

    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    const fields = [
    { 
        name: "vehicle_brand", 
        placeholder: "Marca", 
        validations: [ 
            (value) => value && value.length > 20 ? "La marca no puede superar los 20 caracteres" : null
        ]
    },
    { 
        name: "vehicle_model", 
        placeholder: "Modelo", 
        validations: [ 
            (value) => value && value.length > 50 ? "El modelo no puede superar los 50 caracteres" : null
        ]
    },
    { 
        name: "vehicle_year", 
        placeholder: "Año", 
        type: "number", 
        restriction: "vehicle_year_restrictions", 
    },
    { 
        name: "vehicle_plate", 
        placeholder: "Placa", 
        validations: [ 
            (value) => value && value.length > 10 ? "La placa no puede superar los 10 caracteres" : null
        ]
    },
    { 
        name: "vehicle_initial_km", 
        placeholder: "Kilometraje inicial", 
        type: "number", 
        restriction: "vehicle_initial_km_restrictions", 
    },
    { 
        name: "vehicle_last_km_maintenance", 
        placeholder: "Último mantenimiento (km)", 
        type: "number", 
        restriction: "vehicle_last_km_maintenance_restrictions", 
    },
    { 
        name: "vehicle_frecuency_of_change", 
        placeholder: "Frecuencia de cambio (km)", 
        type: "number", 
    },
    { 
        name: "vehicle_type_of_oil", 
        placeholder: "Tipo de aceite", 
        validations: [ 
            (value) => value && value.length > 50 ? "El tipo de aceite no puede superar los 50 caracteres" : null
        ]
    },
    { 
        name: "vehicle_spark_plug_model", 
        placeholder: "Bujía", 
        validations: [ 
            (value) => value && value.length > 50 ? "La bujía no puede superar los 50 caracteres" : null
        ]
    },
    { 
        name: "vehicle_tires_front", 
        placeholder: "Llantas delanteras", 
        validations: [ 
            (value) => value && value.length > 50 ? "Las llantas delanteras no puede superar los 50 caracteres" : null
        ]
    },
    { 
        name: "vehicle_tires_back", 
        placeholder: "Llantas traseras", 
        validations: [ 
            (value) => value && value.length > 50 ? "Las llantas traseras no puede superar los 50 caracteres" : null
        ]
    },
    { 
        name: "bike_brake_pad", 
        placeholder: "Pastillas de freno", 
        validations: [ 
            (value) => value && value.length > 50 ? "Las pastillas de freno no puede superar los 50 caracteres" : null
        ]
    },
    { 
        name: "vehicle_color", 
        placeholder: "Color",
        validations: [ 
            (value) => value && value.length > 30 ? "El color no puede superar los 30 caracteres" : null
        ]
    }
    ];

    const handleSubmit = async ( formData ) => {
        try {
            setError(null);
            const response = await addVehicle(formData);
            if(response.status === 201){
                ModalAlert("Éxito", "Vehículo agregado exitosamente.", "success");
                fetchVehicles();
                setShowForm(false);
            }
        } catch (error) {
            const messege = error.response?.data?.message || "Error al agregar vehículo.";
            ModalAlert("Error", messege, "error");
            setError(messege);
        }
    };

    const handleEdit = async ( updatedData ) => {
        try {
            setError(null);
            const response = await updateVehicle(updatedData);
            if(response.status === 200){
                ModalAlert("Éxito", "Vehículo editado exitosamente.", "success");
                fetchVehicles();
            }
            return true;
        } catch (error) {
            const messege = error.response?.data?.message || "Error al editar vehículo.";
            ModalAlert("Error", messege, "error");
            setError(messege);
            return false;
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteVehicle(id);
            if (response.status === 200) {
                ModalAlert("Éxito", response.data.message, "success");
                fetchVehicles();
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar vehículo.";
            ModalAlert("Error", message, "error");
        }
    }

    const fetchVehicles = async () => {
        try {
            const response = await getVehicles();
            setVehicles(response.data);
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los vehículos.";
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

            
            {error && (
                <Box
                    sx={{
                    p: 2,
                    mt: 3,
                    maxWidth: 800,
                    margin: "0 auto",
                    borderRadius: 2,
                    backgroundColor: "#fdecea", // rojo muy suave
                    border: "1px solid #f5c2c7", // borde rojo
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    }}
                >
                    <span style={{ color: "#b71c1c", fontWeight: "bold" }}>Error: </span>
                    <Typography sx={{ color: "#b71c1c" }}>{error}.</Typography>
                </Box>
            )}


            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button  
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        setShowForm(!showForm);
                        setError(null);
                    }}
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