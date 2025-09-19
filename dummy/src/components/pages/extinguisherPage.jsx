// src/components/pages/ExtinguisherPage.jsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Form from "../organisms/form";
import ExtinguisherTable from "../organisms/ExtinguisherTable";
import { useExtinguishers } from "../../utils/useExtinguishers";

const ExtinguisherPage = () => {
  const {
    extinguishers,
    error,
    showForm,
    setShowForm,
    fields,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useExtinguishers();

  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gestión de Extintores</h1>

      {showForm && (
        <Box
          sx={{
            maxWidth: 900,
            margin: "20px auto",
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h6" gutterBottom color="textPrimary">
            Agregar Extintor
          </Typography>
          <Form fields={fields} onSubmit={handleAdd} titleBtn="Guardar Extintor" />
        </Box>
      )}

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

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancelar" : "Agregar Extintor"}
        </Button>
      </Box>

      <ExtinguisherTable
        fields={fields}
        extinguishers={extinguishers}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ExtinguisherPage;
