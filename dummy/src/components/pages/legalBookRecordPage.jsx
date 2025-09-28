import React from "react";
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
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Gestión de Registros
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
          <Typography variant="h6" gutterBottom color="textPrimary">
            Agregar Registro
          </Typography>

          <Form
            fields={fields}
            onSubmit={handleSubmit}
            formTitle="Agregar Registro"
            titleBtn="Guardar Registro"
          />
        </Box>
      )}

      {/* Errores */}
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
          }}
        >
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
    </div>
  );
}

export default LegalBookRecordPage;
