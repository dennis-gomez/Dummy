import Form from "../organisms/form";
import {addVehicle, getVehicles, updateVehicle, deleteVehicle} from "../../services/vehicleService";
import { useEffect, useState } from "react";
import VehicleTable from "../organisms/vehicleTable";

function VehiclePage() {

    const [vehicles, setVehicles] = useState([]);

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

    const handleSubmit = async ( formData ) => {
        try {
            const vehicles = await addVehicle(formData);
            fetchVehicles();
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
        <>
            <Form 
                fields={fields}
                onSubmit={handleSubmit}
                titleBtn={"Agregar vehículo"}
            />
            <VehicleTable
                fields={fields}
                vehicles={vehicles}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
        </>
    );
}

export default VehiclePage;