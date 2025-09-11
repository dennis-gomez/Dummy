import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, TextField
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ExtinguisherTable = ({ extinguishers, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Lista de Extintores
      </Typography>
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
                        value={editData.extinguisher_location || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_location: e.target.value })
                        }
                        multiline
                        rows={2}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Fecha de inspección"
                          value={editData.extinguisher_last_date_inspection ? dayjs(editData.extinguisher_last_date_inspection) : null}
                          onChange={(newValue) =>
                            setEditData({
                              ...editData,
                              extinguisher_last_date_inspection: newValue ? newValue.format("YYYY-MM-DD") : "",
                            })
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.extinguisher_observations || ""}
                        onChange={(e) =>
                          setEditData({ ...editData, extinguisher_observations: e.target.value })
                        }
                        multiline
                        rows={4}
                        variant="outlined"
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
