import { usePersonal } from "../../utils/usePersonal";
import PersonalTable from "../organisms/personalTable";
import { Box, Typography } from "@mui/material";

function PersonalPage () {

    const {
        personal, 
    
        fields,
        editFields,

        loading,
        error,
        showForm,
        setShowForm,

        searchText, 
        searchField,
        setSearchText, 
        setSearchField,
        handleSearch, 

        totalPages, 
        page, 
        onPageChange
    } = usePersonal()

    return (
        <div style={{ padding: 24 }}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gesti&oacute;n de Personal</h1>

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
                            Agregar Personal
                        </h3>
                    </div> 
                    {/*
                    <Form 
                        fields={fields.filter(field)} 
                        onSubmit={handleSubmit}
                        values={vehicles.map(v => ({ value: v.vehicle_plate, id: v.cod_vehicle }))}
                        titleBtn={"Guardar Personal"}
                    />
                    */}
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

            <PersonalTable
                personal={personal}
                fields={fields}
                editFields={editFields}
                isLoading={loading}
                totalPages={totalPages}
                currentPage={page}
                onPageChange={onPageChange}

                searchText={searchText}
                searchField={searchField}
                setSearchText={setSearchText} 
                setSearchField={setSearchField}
                handleSearch={handleSearch} 
            />
        </div>
    );
}

export default PersonalPage;