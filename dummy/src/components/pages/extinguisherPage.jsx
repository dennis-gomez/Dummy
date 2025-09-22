// src/components/pages/ExtinguisherPage.jsx
import { Box, Typography } from "@mui/material";
import Form from "../organisms/form";
import ExtinguisherTable from "../organisms/extinguisherTable";
import { useExtinguishers } from "../../utils/useExtinguishers";
import Button from "../atoms/button"; // Importar tu botón personalizado

const ExtinguisherPage = () => {
  const {
    fields,
    extinguishers,
    searchText,
    searchFeature,
    setSearchText,
    setSearchFeature,
    showForm,
    setShowForm,
    error,
    setError,
    loading,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSearchExtinguishers,
  } = useExtinguishers();

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 text-center flex-1">
        
        Gestión de Extintores
      
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
            Agregar Extintor
          </Typography>
          <Form
            fields={fields}
            onSubmit={handleAdd}
            titleBtn={"Guardar Extintor"}
          />
        </Box>
      )}

      {/* Errores del backend */}
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

      {/* Botón toggle */}
      {/* Botón personalizado en lugar del Button de MUI */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          text={showForm ? "Cancelar" : "Agregar Extintor"}
          onClick={() => {
            setShowForm(!showForm);
            setError(null);
          }}
        />
      </Box>

      {/* Tabla de extintores */}
      <ExtinguisherTable
        fields={fields}
        extinguishers={extinguishers}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSearch={handleSearchExtinguishers}
        isLoading={loading}
        valueText={searchText}
        valueFeature={searchFeature}
        onChangeText={setSearchText}
        onChangeFeature={setSearchFeature}
      />
    </div>
  );
};

export default ExtinguisherPage;