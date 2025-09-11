import Container from "@mui/material/Container";
import FormVehicle from "../organisms/formVehicle";
import {addVehicle, getVehicles} from "../../services/vehicleService";

function VehiclePage() {

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
            <FormVehicle 
                onSubmit={handleSubmit}
                getVehicles={handleVehicles} 
            />
        </Container>
    );
}

export default VehiclePage;