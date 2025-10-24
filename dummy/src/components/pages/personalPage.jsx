import { usePersonal } from "../../utils/usePersonal";
import { usePersonalFormation } from "../../utils/usePersonalFormation";
import PersonalTable from "../organisms/personalTable";
import { Box, Typography } from "@mui/material";
import Form from "../organisms/form";
import PersonalFormation from "../organisms/tablePersonalFormation";

function PersonalPage() {

    const {
        personal,

        fields,
        editFields,

        loading,
        error,
        setError,
        showForm,
        setShowForm,

        searchText,
        searchField,
        setSearchText,
        setSearchField,
        handleSearch,

        totalPages,
        page,
        onPageChange,

        handleDelete,
        handleReactivate,
        handleEdit,
        handleSubmit,
    } = usePersonal(); // hook para gestion de personal

    const {
        person,
        showFormation,
        handleOpenFormation,
        handleCloseFormation,

    } = usePersonalFormation(); //hook para el manejo de formacion

    return (
        <div style={{ padding: 24 }}>
            {showFormation ? (
                <>
                    <PersonalFormation
                        person={person}
                        handleCloseFormation={handleCloseFormation}

                    />
                </>
            ) : (
                <>
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

                            <Form
                                fields={fields.filter(field => field.name !== "personal_is_active")}
                                onSubmit={handleSubmit}
                                values={personal.map(v => ({ value: v.personal_identification, id: v.personal_cod }))} //pasar todos los personales
                                titleBtn={"Guardar Personal"}
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

                    <PersonalTable
                        personal={personal}
                        fields={fields}
                        editFields={editFields}
                        isLoading={loading}
                        totalPages={totalPages}
                        currentPage={page}
                        onPageChange={onPageChange}

                        showForm={showForm}

                        searchText={searchText}
                        searchField={searchField}
                        setSearchText={setSearchText}
                        setSearchField={setSearchField}
                        handleSearch={handleSearch}

                        handleDelete={handleDelete}
                        handleReactivate={handleReactivate}
                        handleEdit={handleEdit}

                        onToggleForm={() => {
                            setShowForm(!showForm);
                            setError(null);
                        }}
                        handleOpenFormation={handleOpenFormation}
                    />
                </>
            )}
        </div>
    );
}

export default PersonalPage;