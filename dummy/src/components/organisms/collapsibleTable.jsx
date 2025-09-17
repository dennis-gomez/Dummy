import * as React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Row from "./Row";

export default function CollapsibleTable({
  list,
  tittles,       // ahora es el arreglo unificado de fields
  subTitle,
  subfields,     // ahora contiene la info combinada de suplementos
  suppliesList,
  medicKitSelectedId,
  onSelect,
  onDeleteMedicKit,
  onDeleteSupply,
  onEditMedicKit,
  onEditSupply,
  changeStateSupply
}) {
  const [openRowId, setOpenRowId] = React.useState(null);

  const handleExpand = (id) => {
    const closing = openRowId === id;
    setOpenRowId(closing ? null : id);

    if (!closing && typeof onSelect === "function") {
      onSelect(id);
    }
    if (closing) {
      changeStateSupply(false);
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
              subfields={subfields} // usamos solo el combinado
              onExpand={handleExpand}
              isOpen={item[tittles[0].key] === openRowId}
              suppliesList={item[tittles[0].key] === medicKitSelectedId ? suppliesList : []}
              onDeleteMedicKit={onDeleteMedicKit}
              onDeleteSupply={onDeleteSupply}
              onEditMedicKit={onEditMedicKit}
              onEditSupply={onEditSupply}
              changeStateSupply={changeStateSupply}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
