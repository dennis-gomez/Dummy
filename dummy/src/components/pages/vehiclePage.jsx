import Container from "@mui/material/Container";
import Form from "../organisms/form";
import {addVehicle, getVehicles} from "../../services/vehicleService";

function VehiclePage() {

    //estructura de los campos del formulario
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

    const handleSubmit = async (formData) => {
        try {
            const vehicles = await addVehicle(formData);
        }catch (error) {
            console.error("Error adding vehicle:", error);
        }
    };

    const handleVehicles = async () => {

    };

    return(
        <Container maxWidth="sm">
            <Form 
                fields={fields}
                onSubmit={handleSubmit}
                titleBtn={"Agregar vehículo"}
            />
        </Container>
    );
}

export default VehiclePage;