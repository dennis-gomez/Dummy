import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "../atoms/button";
import ModalElimination from "../molecules/modalElimination";

function Row({
  item,
  tittles,
  subTitle,
  subTittles,
  onExpand,
  isOpen,
  suppliesList,
  onDeleteMedicKit,
  onDeleteSupply,
}) {
  const idKey = tittles[0]?.key;

  return (
    <React.Fragment>
      {/* fila principal */}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => onExpand(item[idKey])}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {tittles.map((col) => (
          <TableCell key={col.key} align="right">
            {item[col.key]}
          </TableCell>
        ))}

        {/* acciones de kit */}
        <TableCell align="right">
          <Button
            text="Editar"
            color="warning"
            onClick={() => alert("Editar kit " + item[idKey])}
            style={{ marginRight: 8 }}
          />
         <ModalElimination
                        message={"¿Quieres eliminar este kit médico?"}
                        onClick={() =>
                          onDeleteMedicKit(item[idKey])
                        }
                      />
        </TableCell>
      </TableRow>

      {/* subtabla */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={tittles.length + 2}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {subTitle}
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
                    {suppliesList.map((supply, idx) => (
                      <TableRow key={idx}>
                        {subTittles.map((col) => (
                          <TableCell key={col.key}>{supply[col.key]}</TableCell>
                        ))}
                        <TableCell>
                          <Button
                            text="Editar"
                            color="warning"
                            onClick={() => alert("Editar " + supply[subTittles[1].key])}
                            style={{ marginRight: 8 }}
                          />
                          <ModalElimination
                        message={"¿Quieres eliminar este suplemento medico?"}
                        onClick={() =>
                          onDeleteSupply(supply[subTittles[1].key])
                        }
                      />
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
  list,
  tittles,
  subTitle,
  subTittles,
  suppliesList,
  medicKitSelectedId,
  onSelect,
    onDeleteMedicKit,
    onDeleteSupply,
}) {
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
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
