import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const ExtinguisherTable = ({ extinguishers, onDelete, onEdit, onAdd }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [openAddDialog, setOpenAddDialog] = useState(false);
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

  // Agregar extintor
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
    setOpenAddDialog(false);
  };

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lista de Extintores ({extinguishers.length})
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={() => setOpenAddDialog(true)}
      >
        Agregar Extintor
      </Button>

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
                    {/* Columna índice */}
                    <TableCell>{index + 1}</TableCell>

                      <TableCell>
                        <TextField value={editData.extinguisher_serial_number} onChange={(e) =>
                            setEditData({...editData, extinguisher_serial_number: e.target.value})} />
                      </TableCell>
                      <TableCell>
                        <TextField value={editData.extinguisher_brand} onChange={(e) =>
                            setEditData({...editData, extinguisher_brand: e.target.value})} />
                      </TableCell>
                      <TableCell>
                        <TextField value={editData.extinguisher_agent} onChange={(e) =>
                            setEditData({...editData, extinguisher_agent: e.target.value})} />
                      </TableCell>
                      <TableCell>
                        <TextField value={editData.extinguisher_type} onChange={(e) =>
                            setEditData({...editData, extinguisher_type: e.target.value})} />
                      </TableCell>
                      <TableCell>
                        <TextField value={editData.extinguisher_capacity} onChange={(e) =>
                            setEditData({...editData, extinguisher_capacity: e.target.value})} />
                      </TableCell>
                      <TableCell>
                        <TextField value={editData.extinguisher_location} onChange={(e) =>
                            setEditData({...editData, extinguisher_location: e.target.value})} />
                      </TableCell>
                      <TableCell>
                        <TextField value={editData.extinguisher_last_date_inspection || ""} onChange={(e) =>
                            setEditData({...editData, extinguisher_last_date_inspection: e.target.value})} />
                      </TableCell>
                      <TableCell>
                        <TextField value={editData.extinguisher_observations || ""} onChange={(e) =>
                            setEditData({...editData, extinguisher_observations: e.target.value})} />
                      </TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={handleSaveEdit} sx={{ mr: 1 }}> Guardar </Button>
                      <Button variant="outlined" color="secondary" onClick={handleCancelEdit}> Cancelar </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    {/* Columna índice */}
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
                      <Button color="error" onClick={() => onDelete(ext.cod_extinguisher)}><DeleteIcon /></Button>
                      <Button color="primary" onClick={() => handleEditClick(ext)}><EditIcon /></Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Agregar Extintor</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          {Object.keys(newExtinguisher).map((key) => (
            <TextField
              key={key}
              label={key.replace(/_/g, " ").replace("extinguisher ", "")}
              value={newExtinguisher[key]}
              type={key.includes("date") ? "date" : "text"}
              InputLabelProps={key.includes("date") ? { shrink: true } : {}}
              onChange={(e) =>
                setNewExtinguisher({
                  ...newExtinguisher,
                  [key]: e.target.value,
                })
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAdd}>
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ExtinguisherTable;
