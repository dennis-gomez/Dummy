import * as React from "react";
import {
  Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Paper, Button
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModalElimination from "../molecules/modalElimination";
import InputValidated from "../atoms/inputValidated"; // 👈 tu input validado

function Row({
  item, tittles, subTitle, subTittles, onExpand, isOpen, suppliesList,
  onDeleteMedicKit, onDeleteSupply, onEditMedicKit, onEditSupply, changeStateSupply, onRowClose
}) {


React.useEffect(() => {
  if (!isOpen) {
    setEditingKit(false);
    setEditingSupplyId(null);
    setSupplyFormData({});
    setSupplyErrors({});
    changeStateSupply(false);
  }
}, [isOpen]);


  const idKey = tittles[0]?.key; // ID del kit
  const [editingKit, setEditingKit] = React.useState(false);
  const [kitFormData, setKitFormData] = React.useState({ ...item });
  const [editingSupplyId, setEditingSupplyId] = React.useState(null);
  const [supplyFormData, setSupplyFormData] = React.useState({});
  const [supplyErrors, setSupplyErrors] = React.useState({});

  // Guardar kit editado
  const handleSaveKit = () => {
    onEditMedicKit(kitFormData);
    setEditingKit(false);
  };

  // Guardar suplemento editado con validación
  const handleSaveSupply = () => {
    if (Object.values(supplyErrors).some((e) => e)) {
      alert("Corrige los errores antes de guardar");
      return;
    }
    onEditSupply(supplyFormData);
    setEditingSupplyId(null);
  };

  return (
    <React.Fragment>
      {/* fila principal */}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => onExpand(item[idKey])}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {tittles.map((col, index) => (
          <TableCell key={col.key} align="right">
            {editingKit && index !== 0 ? (
              <InputValidated
                name={col.key}
                type="text"
                value={kitFormData[col.key]}
                placeholder={col.label}
                onChange={(e) =>
                  setKitFormData({ ...kitFormData, [col.key]: e.target.value })
                }
              />
            ) : (
              item[col.key]
            )}
          </TableCell>
        ))}

        {/* acciones de kit */}
        <TableCell align="right">
          {editingKit ? (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mr: 1 }}
                onClick={handleSaveKit}
              >
                Guardar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={() => setEditingKit(false)}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="warning"
                size="small"
                sx={{ mr: 1 }}
                onClick={() => {
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={tittles.length + 2}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {subTitle}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => changeStateSupply(item[idKey])}
                  >
                    Agregar Suplemento
                  </Button>
                </div>
              </Typography>

              {suppliesList && suppliesList.length > 0 ? (
                <Table size="small" aria-label="supplies">
                  <TableHead>
                    <TableRow>
                      {subTittles.map((col) => (
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
                            <InputValidated
  name={col.key}
  type={
    col.key === "supply_quantity"
      ? "number"
      : col.key === "supply_expiration_date"
      ? "DateCanBefore"
      : "text"
  }
  value={supplyFormData[col.key]}
  placeholder={col.label}
  validations={[]} // no hace falta pasar objetos
  onChange={(e) =>
    setSupplyFormData({
      ...supplyFormData,
      [col.key]: e.target.value,
    })
  }
  onError={(name, err) =>
    setSupplyErrors((prev) => ({ ...prev, [name]: err }))
  }
/>

                            ) : (
                              supply[col.key]
                            )}
                          </TableCell>
                        ))}
                        <TableCell>
                          {editingSupplyId === supply[subTittles[1].key] ? (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={handleSaveSupply}
                              >
                                Guardar
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                onClick={() => setEditingSupplyId(null)}
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                sx={{ mr: 1 }}
                                onClick={() => {
                                  setEditingSupplyId(supply[subTittles[1].key]);
                                  setSupplyFormData({ ...supply });
                                }}
                              >
                                Editar
                              </Button>
                              <ModalElimination
                                message={"¿Quieres eliminar este suplemento medico?"}
                                onClick={() => onDeleteSupply(supply[subTittles[1].key])}
                              />
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

export default function CollapsibleTable({
  list, tittles, subTitle, subTittles, suppliesList,
  medicKitSelectedId, onSelect, onDeleteMedicKit, onDeleteSupply,
  onEditMedicKit, onEditSupply, changeStateSupply }) {
  const [openRowId, setOpenRowId] = React.useState(null);

const handleExpand = (id) => {
  const closing = openRowId === id;
  setOpenRowId(closing ? null : id);

  // Aviso al Row que se está cerrando para cancelar edición
  if (typeof onRowClose === "function" && closing) {
    onRowClose(id);
  }

  if (!closing && typeof onSelect === "function") {
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
          {list.map((item) => (
           <Row
  key={item[tittles[0].key]}
  item={item}
  tittles={tittles}
  subTitle={subTitle}
  subTittles={subTittles}
  onExpand={handleExpand}
  isOpen={item[tittles[0].key] === openRowId}
  suppliesList={item[tittles[0].key] === medicKitSelectedId ? suppliesList : []}
  onDeleteMedicKit={onDeleteMedicKit}
  onDeleteSupply={onDeleteSupply}
  onEditMedicKit={onEditMedicKit}
  onEditSupply={onEditSupply}
  changeStateSupply={changeStateSupply}
  onRowClose={() => {}} // 👈 lo usamos dentro del Row
/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
