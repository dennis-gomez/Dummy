import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Typography, TextField
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import ModalElimination from "../molecules/modalElimination";

const VehicleTable = ({ 
  fields, 
  vehicles, 
  onDelete, 
  onEdit 
}) => {
    
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Activar edición
  const handleEditClick = ( vehicle ) => {
    setEditingId( vehicle.cod_vehicle );
    setEditData({ ...vehicle });
  };

  // Guardar edición
  const handleSaveEdit = async () => {
    const isSaved = await onEdit(editData);
    if(isSaved){
      setEditingId(null);
      setEditData({});
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lista de Vehículos
      </Typography>

      {/* visualizacion de tabla vehiculo */}
      {vehicles.length === 0 ? (
        <Typography variant="body1">
          No hay vehículos disponibles. Haz clic en "Agregar vehículo" para crear uno nuevo.
        </Typography>
      ):(
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                {fields.map((f) => (
                  editingId !== null && f.name !== "vehicle_initial_km" ? (
                    <TableCell key={f.name}>
                      {f.placeholder} {/* Cuando hay edición y no es vehicle_initial_km */}
                    </TableCell>
                  ) : editingId === null ? (
                    <TableCell key={f.name}>
                      {f.placeholder} {/* cuando no hay edición */}
                    </TableCell>
                  ) : null // Caundo hay edicion y es vehicle_initial_km: no se muestra
                ))}
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {vehicles.map((vehicle, index) => (
                <TableRow key={vehicle.cod_vehicle}>
                  <TableCell>{index + 1}</TableCell>

                  {/*Muestra textfield para editar cuando se selecciona un vehiculo para editar*/}
                  {editingId === vehicle.cod_vehicle ? (
                    <>
                      {fields.map((f) => (
                        f.name !== "vehicle_initial_km" && (
                          <TableCell 
                            key={f.name}
                          > 
                            <TextField
                              type={f.type || "text"}
                              value={editData[f.name] || ""}
                              onChange={(e) =>
                                setEditData({ ...editData, [f.name]: e.target.value })
                              }
                              sx={{ width: "120px" }}
                              multiline={f.multiline || false}
                              rows={f.rows || 1}   
                            />
                          </TableCell>
                        )
                      ))}
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveEdit}
                          sx={{ mr: 1 }}
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      {fields.map((f) => (
                        <TableCell key={f.name}>
                          {vehicle[f.name] || "-"}
                        </TableCell>
                      ))}
                      <TableCell>
                        <ModalElimination
                          message={`¿Estás seguro de eliminar el vehículo?`}
                          onClick={() => onDelete(vehicle.cod_vehicle)}
                        />
                        <Button color="primary" onClick={() => handleEditClick(vehicle)}>
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
      )}  
    </Paper>
  );
};

export default VehicleTable;
