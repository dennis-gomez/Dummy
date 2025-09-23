import { Box, Typography } from "@mui/material";
import Button from "../atoms/button";
import Form from "../organisms/form";
import VehicleTable from "../organisms/vehicleTable";
import { useVehicles } from "../../utils/useVehicle";

function VehiclePage() {
    const {
        vehicles,
        fields,
        searchText,
        searchFeature, 
        setSearchText,
        setSearchFeature,
        showForm,
        setShowForm,
        error,
        setError,
        loading, 
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearchVehicles,
    } = useVehicles();

    return (
        <div style={{ padding: 24 }}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gestión de Vehículos</h1>
 <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button 
                    text={showForm ? "Cancelar" : "Agregar Vehículo"} 
                    onClick={() => { 
                        setShowForm(!showForm);
                        setError(null);
                    }}
                />
            </Box>
            {/* Formulario dinamico */}
            {showForm && (
                <Box
                sx={{
                    maxWidth: 900,
                    margin: "20px auto",
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "#d9d9d9",
                }}
                >
                    <Typography variant="h6" gutterBottom color="textPrimary">
                        Agregar vehículo
                    </Typography>
                    <Form fields={fields} onSubmit={handleSubmit} titleBtn={"Guardar vehículo"} />
                </Box>
            )}

            {/* Errores manejados por el backend */}
            {error && (
                <Box
                sx={{
                    p: 2,
                    mt: 3,
                    maxWidth: 800,
                    margin: "0 auto",
                    borderRadius: 2,
                    backgroundColor: "#fdecea",
                    border: "1px solid #f5c2c7",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
                >
                <span style={{ color: "#b71c1c", fontWeight: "bold" }}>Error: </span>
                <Typography sx={{ color: "#b71c1c" }}>{error}.</Typography>
                </Box>
            )}
            {/* Tabla de vehiculos */}
            <VehicleTable
                fields={fields}
                vehicles={vehicles}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSearch={handleSearchVehicles}
                isLoading={loading}
                valueText={searchText}
                valueFeature={searchFeature}
                onChangeText={setSearchText}
                onChangeFeature={setSearchFeature}
            />
        </div>
    );
}

export default VehiclePage;