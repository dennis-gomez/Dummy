import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import Form from "../organisms/form";
import ExtinguisherTable from "../organisms/ExtinguisherTable";
import {
  getAllExtinguishers,
  deleteExtinguisher,
  addExtinguisher,
  updateExtinguisher,
} from "../../services/extinguisherService";
import ModalAlert from "../molecules/modalAlert";

const ExtinguisherPage = () => {
  const [extinguishers, setExtinguishers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

const fields = [
  { name: "extinguisher_serial_number", placeholder: "Número de Serie", width: 250},
  { name: "extinguisher_manufacturing_date", placeholder: "Fecha de Fabricación", type: "date", width: 250, restriction :"cantAfterToday"},
  { name: "extinguisher_brand", placeholder: "Marca", width: 250 },
  { name: "extinguisher_agent", placeholder: "Agente", width: 250 },
  { name: "extinguisher_installation_date", placeholder: "Fecha de Instalación", type: "date", width: 250, restriction :"betweenManufactureAndToday"},
  { name: "extinguisher_type", placeholder: "Tipo", width: 250},
  { name: "extinguisher_capacity", placeholder: "Capacidad", width: 250},
  { name: "extinguisher_next_date_inspection", placeholder: "Próxima Inspección", type: "date", width: 250, restriction :"cantBeforeToday"},
  { name: "extinguisher_location", placeholder: "Ubicación", width: 250 },

  { name: "extinguisher_observations", placeholder: "Observaciones", type: "textarea", width: 780, required: false },
];


  const fetchData = async () => {
    try {
      const data = await getAllExtinguishers();
      setExtinguishers(data);
    } catch (err) {
      const message = err.response?.data?.message || "Error al obtener extintores.";
      setError(message);
      ModalAlert("Error", message, "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (formData) => {
    try {
      setError(null);
      await addExtinguisher(formData);
      ModalAlert("Éxito", "Extintor agregado exitosamente.", "success");
      fetchData();
      setShowForm(false);
    } catch (err) {
      const message = err.response?.data?.message || "Error al agregar extintor.";
      setError(message);
      ModalAlert("Error", message, "error");
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      setError(null);
      await updateExtinguisher(id, updatedData);
      ModalAlert("Éxito", "Extintor editado exitosamente.", "success");
      fetchData();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Error al editar extintor.";
      setError(message);
      ModalAlert("Error", message, "error");
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExtinguisher(id);
      ModalAlert("Éxito", "Extintor eliminado exitosamente.", "success");
      setExtinguishers((prev) => prev.filter((e) => e.cod_extinguisher !== id));
    } catch (err) {
      const message = err.response?.data?.message || "Error al eliminar extintor.";
      setError(message);
      ModalAlert("Error", message, "error");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Gestión de Extintores</h1>

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
          <Form
            fields={fields}
            onSubmit={handleAdd}
            titleBtn="Guardar Extintor"
          />
        </Box>     
      )}

      {/* 🔹 Bloque de errores como en VehiclePage */}
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
            setError(null); // 🔹 limpia el error al abrir/cerrar el form
          }}
        >
          {showForm ? "Cancelar" : "Agregar Extintor"}
        </Button>
      </Box>

      <ExtinguisherTable
        extinguishers={extinguishers}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ExtinguisherPage;
