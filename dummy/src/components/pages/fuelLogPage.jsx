import { useFuelLogs } from "../../utils/useFuelLogs";
import FuelLogsTable from "../organisms/fuelLogsTable";
import { Box, Typography } from "@mui/material";
import Form from "../organisms/form";

function FuelLogPage() {
    const {
        fields,
        editFields,
        fuelLogs,
        allVehiclesItems,
        showForm,
        loading,
        error,
        setError, 
        searchField,
        searchText,
        selectedVehicle, 
        setSelectedVehicle,
        setShowForm,
        setSearchField,
        setSearchText,
        handleSearch,
        handleResetSearch,
        handleSubmit,
        handleEdit,
        handleDelete
    } = useFuelLogs();

    return(
        <>
            <div style={{ padding: 24 }}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Gestión de Registros de Combustibles
            </h1>

            {/* Formulario dinámico */}
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Agregar Registro
                </h3>

                <Form
                    fields={fields}
                    onSubmit={handleSubmit}
                    formTitle="Agregar Registro"
                    titleBtn="Guardar Registro"
                />
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

            {/* Tabla de registros */}
            <FuelLogsTable
                fields={fields}
                editFields={editFields}
                fuelLogs={fuelLogs}
                allVehiclesItems={allVehiclesItems} 
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSearch={handleSearch}
                onToggleForm={() => {
                    setShowForm(!showForm);
                    setError(null);
                }}
                searchText={searchText}
                setSearchText={setSearchText}
                showForm={showForm}
                isLoading={loading}
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                searchField={searchField}
                setSearchField={setSearchField}
                fuelTypes={fields.find(f => f.name === "fuel_log_type_item_code")?.options || []}
            />
            </div>
        </>
    );
}

export default FuelLogPage;