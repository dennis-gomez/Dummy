import { useLegalBookRecord } from "../../utils/useLegalBookRecord";
import LegalBookRecordTable from "../organisms/legalBookRecordTable";
import { Box, Typography } from "@mui/material";
import Form from "../organisms/form";

function LegalBookRecordPage() {
    const {
        legalBookRecords,
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
        handleSearchRecord,
    } = useLegalBookRecord();

    return (
        <>
            <h1>Gesti&oacute;n de Registros</h1>

            {/* Formulario dinamico */}
            {showForm && (
                <Box>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                            Agregar registro
                        </h3>
                    </div> 
                    <Form fields={fields} onSubmit={handleSubmit} titleBtn={"Guardar registro"} />
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

            {/* Tabla de registros */}
            <LegalBookRecordTable
                fields={fields}
                legalBookRecords={legalBookRecords}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSearch={handleSearchRecord}
                isLoading={loading}
                valueText={searchText}
                valueFeature={searchFeature}
                onChangeText={setSearchText}
                onChangeFeature={setSearchFeature}
                onToggleForm={() => {
                    setShowForm(!showForm);
                    setError(null);
                }}
                showForm={showForm}
            />
        </>
    );
} 
export default LegalBookRecordPage