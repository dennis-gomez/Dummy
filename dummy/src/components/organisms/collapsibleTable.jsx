import * as React from "react";
import {Box,Collapse,IconButton,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,
Typography,Paper,Button,TextField} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModalElimination from "../molecules/modalElimination";
import dayjs from "dayjs";

function Row({item, tittles, subTitle, subTittles, onExpand, isOpen, suppliesList,
onDeleteMedicKit, onDeleteSupply,onEditMedicKit,onEditSupply,}) {

  const idKey = tittles[0]?.key; // ID del kit
  const [editingKit, setEditingKit] = React.useState(false);
  const [kitFormData, setKitFormData] = React.useState({ ...item });
  const [editingSupplyId, setEditingSupplyId] = React.useState(null);
  const [supplyFormData, setSupplyFormData] = React.useState({});

  // Guardar kit editado
  const handleSaveKit = () => {
    onEditMedicKit(kitFormData);
    setEditingKit(false);
  };

  // Guardar suplemento editado
  const handleSaveSupply = (supplyId) => {
    onEditSupply(supplyFormData);
    setEditingSupplyId(null);
  };

  return (
    <React.Fragment>
      {/* fila principal */}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small"
            onClick={() => onExpand(item[idKey])}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {tittles.map((col, index) => (
          <TableCell key={col.key} align="right">
            {editingKit && index !== 0 ? ( // El ID (index 0) no editable
              <TextField value={kitFormData[col.key]}
                onChange={(e) => setKitFormData({ ...kitFormData, [col.key]: e.target.value })}
                size="small"
              />
            ) : (item[col.key])}
          </TableCell>
        ))}

        {/* acciones de kit */}
        <TableCell align="right">
          {editingKit ? (
            <>
              <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }} onClick={handleSaveKit}> 
                Guardar 
              </Button>

              <Button variant="outlined" color="secondary" size="small" onClick={() => setEditingKit(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="warning" size="small" sx={{ mr: 1 }} onClick={() => {
                  setEditingKit(true);
                  setKitFormData({ ...item });
                }}
              >
                Editar
              </Button>
              <ModalElimination
                message={"¿Quieres eliminar este kit médico?"}
                onClick={() => onDeleteMedicKit(item[idKey])}
              />
            </>
          )}
        </TableCell>
      </TableRow>

      {/* subtabla */}
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={tittles.length + 2}
        >
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {subTitle}
              </Typography>
              {suppliesList && suppliesList.length > 0 ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Table size="small" aria-label="supplies">
                    <TableHead>
                      <TableRow>
                        {subTittles.map((col, index) => (
                          <TableCell key={col.key}>{col.label}</TableCell>
                        ))}
                        <TableCell>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {suppliesList.map((supply) => (
                        <TableRow key={supply[subTittles[0].key]}>
                          {subTittles.map((col, index) => (
                            <TableCell key={col.key}>
                              {editingSupplyId === supply[subTittles[1].key] ? (
                                col.key === "supply_expiration_date" ? (
                                  <DatePicker value={dayjs(supplyFormData[col.key])} 
                                  onChange={(newValue) => setSupplyFormData({...supplyFormData,
                                        [col.key]: newValue ? newValue.toDate() : null,
                                    })}
                                    slotProps={{ textField: { size: "small" } }}
                                  />

                                ) : index !== 0 && index !== 1 ? ( // El ID (primer columna) no editable
                                  <TextField value={supplyFormData[col.key]} size="small"
                                    onChange={(e) => setSupplyFormData({...supplyFormData,
                                        [col.key]: e.target.value,
                                      })
                                    }
                                  />
                                ) : (supply[col.key])
                              ) : (supply[col.key])}
                            </TableCell>
                          ))}
                          <TableCell>
                            {editingSupplyId === supply[subTittles[1].key] ? (
                              <>
                                <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}
                                  onClick={() => handleSaveSupply(supply[subTittles[1].key])}>
                                  Guardar
                                </Button>

                                <Button variant="outlined" color="secondary" size="small"
                                  onClick={() => setEditingSupplyId(null)}>
                                  Cancelar
                                </Button>
                              </>

                            ) : (
                              <>
                                <Button variant="contained" color="warning" size="small" sx={{ mr: 1 }}
                                  onClick={() => { setEditingSupplyId(supply[subTittles[1].key]);
                                    setSupplyFormData({ ...supply });
                                  }}
                                >
                                  Editar
                                </Button>

                                <ModalElimination
                                  message={"¿Quieres eliminar este suplemento medico?"}
                                  onClick={() =>onDeleteSupply(supply[subTittles[1].key])}
                                />
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </LocalizationProvider>
              ) : (
                <Typography variant="body2">No hay suplementos</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable({list, tittles, subTitle, subTittles, suppliesList,
  medicKitSelectedId,  onSelect, onDeleteMedicKit, onDeleteSupply, onEditMedicKit, onEditSupply,}) {
  
    const [openRowId, setOpenRowId] = React.useState(null);
  const handleExpand = (id) => {
    setOpenRowId((prev) => (prev === id ? null : id));
    if (id !== openRowId && typeof onSelect === "function") {
      onSelect(id);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {tittles.map((col) => (
              <TableCell key={col.key} align="right">
                {col.label}
              </TableCell>
            ))}
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((item, index) => (
            <Row
              key={index}
              item={item}
              tittles={tittles}
              subTitle={subTitle}
              subTittles={subTittles}
              onExpand={handleExpand}
              isOpen={item[tittles[0].key] === openRowId}
              suppliesList={item.cod_medic_kit === medicKitSelectedId ? suppliesList : []}
              onDeleteMedicKit={onDeleteMedicKit}
              onDeleteSupply={onDeleteSupply}
              onEditMedicKit={onEditMedicKit}
              onEditSupply={onEditSupply}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}