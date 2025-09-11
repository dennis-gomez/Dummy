import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import ExtinguisherTable from "../organisms/ExtinguisherTable";
import ExtinguisherForm from "../organisms/extinguisherForm";
import { getAllExtinguishers, deleteExtinguisher, addExtinguisher, updateExtinguisher } from "../../services/extinguisherService";

const ExtinguisherPage = () => {
  const [extinguishers, setExtinguishers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExtinguisher, setNewExtinguisher] = useState({
    extinguisher_serial_number: "",
    extinguisher_brand: "",
    extinguisher_agent: "",
    extinguisher_type: "",
    extinguisher_capacity: "",
    extinguisher_manufacturing_date: "",
    extinguisher_installation_date: "",
    extinguisher_location: "",
    extinguisher_last_date_inspection: "",
    extinguisher_observations: ""
  });

  const fetchData = async () => {
    const data = await getAllExtinguishers();
    setExtinguishers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteExtinguisher(id);
    setExtinguishers(extinguishers.filter(e => e.cod_extinguisher !== id));
  };

  const handleEdit = async (id, updatedData) => {
    await updateExtinguisher(id, updatedData);
    setExtinguishers(extinguishers.map(e => e.cod_extinguisher === id ? updatedData : e));
  };

  const handleAdd = async () => {
    await addExtinguisher(newExtinguisher);
    setNewExtinguisher({
      extinguisher_serial_number: "",
      extinguisher_brand: "",
      extinguisher_agent: "",
      extinguisher_type: "",
      extinguisher_capacity: "",
      extinguisher_manufacturing_date: "",
      extinguisher_installation_date: "",
      extinguisher_location: "",
      extinguisher_last_date_inspection: "",
      extinguisher_observations: ""
    });
    setShowAddForm(false);
    fetchData();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Gestión de Extintores</h1>

      {/* Formulario de agregar extintor */}
      {showAddForm && (
        <ExtinguisherForm
          extinguisher={newExtinguisher}
          setExtinguisher={setNewExtinguisher}
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Botón para mostrar el formulario de agregar */}
      {!showAddForm && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAddForm(true)}
          >
            Agregar Extintor
          </Button>
        </div>
      )}


      {/* Tabla de extintores */}
      <ExtinguisherTable
        extinguishers={extinguishers}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default ExtinguisherPage;
