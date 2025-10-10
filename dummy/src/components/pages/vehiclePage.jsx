import { Box, Typography } from "@mui/material";
import Form from "../organisms/form";
import VehicleTable from "../organisms/vehicleTable";
import { useVehicles } from "../../utils/useVehicle";

function VehiclePage() {
    const {
        vehicles,
        fields,
        editFields, 
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
        handleReactivate,
    } = useVehicles();

    return (
        <div style={{ padding: 24 }}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gesti&oacute;n de Veh&iacute;culos</h1>
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
                    textAlign: "center",
                }}
                >
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                            Agregar Vehículo
                        </h3>
                    </div> 
                    <Form 
                    fields={fields.filter(field => field.name !== "vehicle_is_active")} 
                    onSubmit={handleSubmit}
                    values={vehicles.map(v => ({ value: v.vehicle_plate, id: v.cod_vehicle }))}
                    titleBtn={"Guardar vehículo"} />
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
                <Typography sx={{ color: "#b71c1c" }}>{error}</Typography>
                </Box>
            )}
            {/* Tabla de vehiculos */}
            <VehicleTable
                fields={fields}
                editFields={editFields}
                vehicles={vehicles}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSearch={handleSearchVehicles}
                isLoading={loading}
                valueText={searchText}
                valueFeature={searchFeature}
                onChangeText={setSearchText}
                onChangeFeature={setSearchFeature}
                onToggleForm={() => {
                    setShowForm(!showForm);
                    setError(null);
                }}
                onReactivate={handleReactivate}
                showForm={showForm}
            />
        </div>
    );
}

export default VehiclePage;