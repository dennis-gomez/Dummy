import * as React from "react";
import {
   Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper } from "@mui/material";
import Row from "./Row"

export default function CollapsibleTable({
  list, tittles, subTitle, subTittles, suppliesList,
  medicKitSelectedId, onSelect, onDeleteMedicKit, onDeleteSupply,
  onEditMedicKit, onEditSupply, changeStateSupply }) {
  const [openRowId, setOpenRowId] = React.useState(null);

  //controla la fila abierta
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
    //crea la tabla
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
            // cada fila
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
  onRowClose={() => {}} 
/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
