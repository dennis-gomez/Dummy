import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, TextField
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import ExtinguisherForm from "./extinguisherForm"; // Asegúrate de importar tu formulario

const ExtinguisherTable = ({ extinguishers, onDelete, onEdit, onAdd }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false); // Controla visibilidad del formulario
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

  // Activar edición
  const handleEditClick = (ext) => {
    setEditingId(ext.cod_extinguisher);
    setEditData({ ...ext });
  };

  // Guardar edición
  const handleSaveEdit = () => {
    onEdit(editingId, editData);
    setEditingId(null);
    setEditData({});
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Guardar nuevo extintor desde el formulario
  const handleAdd = () => {
    onAdd(newExtinguisher);
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
    setShowAddForm(false); // Oculta el formulario luego de agregar
  };

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lista de Extintores ({extinguishers.length})
      </Typography>

      {/* Botón para mostrar el formulario */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => setShowAddForm(true)}
      >
        Agregar Extintor
      </Button>

      {/* Formulario visible solo cuando showAddForm es true */}
      {showAddForm && (
        <ExtinguisherForm
          extinguisher={newExtinguisher}
          setExtinguisher={setNewExtinguisher}
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Num. Serial</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Agente</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Última Inspección</TableCell>
              <TableCell>Observaciones</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {extinguishers.map((ext, index) => (
              <TableRow key={ext.cod_extinguisher}>
                {editingId === ext.cod_extinguisher ? (
                  <>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <TextField
                        value={editData.extinguisher_serial_number}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_serial_number: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.extinguisher_brand}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_brand: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.extinguisher_agent}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_agent: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.extinguisher_type}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_type: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.extinguisher_capacity}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_capacity: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.extinguisher_location}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_location: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.extinguisher_last_date_inspection || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_last_date_inspection: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.extinguisher_observations || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_observations: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={handleSaveEdit} sx={{ mr: 1 }}>
                        Guardar
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                        Cancelar
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{ext.extinguisher_serial_number}</TableCell>
                    <TableCell>{ext.extinguisher_brand}</TableCell>
                    <TableCell>{ext.extinguisher_agent}</TableCell>
                    <TableCell>{ext.extinguisher_type}</TableCell>
                    <TableCell>{ext.extinguisher_capacity}</TableCell>
                    <TableCell>{ext.extinguisher_location}</TableCell>
                    <TableCell>{ext.extinguisher_last_date_inspection || "-"}</TableCell>
                    <TableCell>{ext.extinguisher_observations || "-"}</TableCell>
                    <TableCell>
                      <Button color="error" onClick={() => onDelete(ext.cod_extinguisher)}>
                        <DeleteIcon />
                      </Button>
                      <Button color="primary" onClick={() => handleEditClick(ext)}>
                        <EditIcon />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ExtinguisherTable;
