import { useLegalBookRecord } from "../../utils/useLegalBookRecord";
import LegalBookRecordTable from "../organisms/legalBookRecordTable";
import { Box, Typography } from "@mui/material";
import Form from "../organisms/form";

function LegalBookRecordPage() {
    const {
        books,
        legalBookRecords,
        fields, 
        searchText,
        setSearchText,
        selectedBook,
        setSelectedBook,
        searchField,
        setSearchField,
        showForm,
        setShowForm,
        error,
        setError,
        loading, 
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch,
        handleResetSearch,
    } = useLegalBookRecord();

    return (
        <>
            <h1>Gestión de Registros</h1>

            {/* Formulario dinámico */}
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

            {/* Errores */}
            {error && (
                <Box sx={{ p: 2, mt: 3, maxWidth: 800, margin: "0 auto", borderRadius: 2, backgroundColor: "#fdecea", border: "1px solid #f5c2c7" }}>
                    <Typography sx={{ color: "#b71c1c" }}>Error: {error}</Typography>
                </Box>
            )}

            {/* Tabla de registros */}
            <LegalBookRecordTable
                fields={fields}
                books={books}
                legalBookRecords={legalBookRecords}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSearch={handleSearch}
                onResetSearch={handleResetSearch}
                isLoading={loading}
                searchText={searchText}
                setSearchText={setSearchText}
                selectedBook={selectedBook}
                setSelectedBook={setSelectedBook}
                searchField={searchField}
                setSearchField={setSearchField}
                onToggleForm={() => {
                    setShowForm(!showForm);
                    setError(null);
                }}
                showForm={showForm}
            />
        </>
    );
} 

export default LegalBookRecordPage;