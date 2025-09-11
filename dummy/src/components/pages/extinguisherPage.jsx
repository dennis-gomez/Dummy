import React, { useState, useEffect } from "react";
import ExtinguisherTable from "../organisms/ExtinguisherTable";
import { getAllExtinguishers, deleteExtinguisher, addExtinguisher, updateExtinguisher } from "../../services/extinguisherService";

const ExtinguisherPage = () => {
  const [extinguishers, setExtinguishers] = useState([]);

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

  const handleAdd = async (newData) => {
    await addExtinguisher(newData);
    fetchData();
  };

  return (
    <div style={{ padding: 24 }}>
      <ExtinguisherTable
        extinguishers={extinguishers}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default ExtinguisherPage;
