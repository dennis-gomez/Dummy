import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputValidated from "../atoms/inputValidated";
import { useState } from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";


function formWithDetails({ fields, subfields, title, onSubmit, titleBtn, subTittle }) {
  // Filtramos los campos visibles (sin códigos)
  const visibleFields = fields?.filter(f => f.key !== "cod_medic_kit") || [];
  const visibleSubfields = subfields?.filter(f => f.key !== "cod_medic_kit" && f.key !== "cod_supply") || [];

  // Inicializamos formData y subformData
  const initialFormData = visibleFields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});
  const [formData, setFormData] = useState(initialFormData);

  const emptySubform = visibleSubfields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});
  const [subformData, setSubformData] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [editItem, setEditItem] = useState(emptySubform);
  const [inputErrors, setInputErrors] = useState({});
  const [subInputErrors, setSubInputErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditItemChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputError = (key, error, isSubform = false) => {
    if (isSubform) setSubInputErrors((prev) => ({ ...prev, [key]: error }));
    else setInputErrors((prev) => ({ ...prev, [key]: error }));
  };

  const handleAddItem = () => {
    setSubformData((prev) => [...prev, editItem]);
    setEditItem(emptySubform);
    setSubInputErrors({});
  };

  const handleRemoveItem = (idx) => {
    setSubformData((prev) => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) {
      setEditIdx(null);
      setEditItem(emptySubform);
      setSubInputErrors({});
    }
  };

  const handleEditItem = (idx) => {
    setEditIdx(idx);
    setEditItem(subformData[idx]);
  };

  const handleSaveEditItem = () => {
    setSubformData((prev) =>
      prev.map((item, idx) => (idx === editIdx ? editItem : item))
    );
    setEditIdx(null);
    setEditItem(emptySubform);
    setSubInputErrors({});
  };

  const handleCancelEditItem = () => {
    setEditIdx(null);
    setEditItem(emptySubform);
    setSubInputErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, supplements: subformData });
  };

  return (
    <Box sx={{ border: "1px solid #eee", mb: 2, borderRadius: 2, p: 3, margin: "0 auto", maxWidth: 800, mt: 3 }}>
      <form onSubmit={handleSubmit}>
        {/* Formulario principal */}
        {visibleFields.length > 0 && (
          <Grid container spacing={2}>
            {visibleFields.map((f, idx) => {
              // Si es textarea, lo ponemos al final y largo
              if (f.type === "textarea") {
                return (
                  <Grid item xs={12} key={f.key} sx={{ mt: 3 }}>
                    <InputValidated
                      name={f.key}
                      type="text"
                      placeholder={f.placeholder}
                      value={formData[f.key]}
                      onChange={handleChange}
                      validations={f.validations || []}
                      onError={(key, error) => handleInputError(key, error)}
                      required={f.required ?? true}
                      multiline
                      rows={5} // más largo
                      fullWidth
                    />
                  </Grid>
                );
              }

              const isLastSingle = visibleFields.length % 2 !== 0 && idx === visibleFields.length - 1;
              return (
                <Grid item xs={12} sm={isLastSingle ? 12 : 6} key={f.key}>
                  <InputValidated name={f.key} type={f.type || "text"}
                    placeholder={f.placeholder} value={formData[f.key]}
                    onChange={handleChange}validations={f.validations || []}
                    onError={(key, error) => handleInputError(key, error)}
                    required={f.required ?? true}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Subformulario */}
        {visibleSubfields.length > 0 && (
          <Box sx={{ border: "1px solid #eee", p: 2, mb: 2, borderRadius: 2, marginTop: "30px" }}>
            {title && <h2 style={{ paddingBottom: "30px" }}>{title}</h2>}

            <Grid container spacing={2}>
              {visibleSubfields.map((f, idx) => {
                const isLastSingle = visibleSubfields.length % 2 !== 0 && idx === visibleSubfields.length - 1;
                return (
                  <Grid item xs={12} sm={isLastSingle ? 12 : 6} key={f.key}>
                    <InputValidated
                      name={f.key}
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      value={editItem[f.key]}
                      onChange={handleEditItemChange}
                      validations={f.validations || []}
                      onError={(key, error) => handleInputError(key, error, true)}
                      required={f.required ?? true}
                    />
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              {editIdx !== null ? (
                <>
                  <Button variant="contained" color="primary"
                    onClick={handleSaveEditItem} sx={{ mr: 1 }}
                    disabled={Object.values(subInputErrors).some(Boolean)}
                  >
                    Guardar
                  </Button>
                  <Button variant="outlined" color="secondary"
                    onClick={handleCancelEditItem}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button variant="outlined" color="primary"
                  onClick={handleAddItem} disabled={Object.values(subInputErrors).some(Boolean)}
                >
                  {subTittle}
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Tabla de subitems */}
        {visibleSubfields.length > 0 && subformData.length > 0 && (
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lista de items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    {visibleSubfields.map((f) => (
                      <TableCell key={f.key}>{f.placeholder}</TableCell>
                    ))}
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {subformData.map((item, idx) => (
    <TableRow key={idx}>
      <TableCell>{idx + 1}</TableCell>
      {editIdx === idx ? (
        <>
          {visibleSubfields.map((f) => (
            <TableCell key={f.key}>
              <InputValidated
                name={f.key}
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={editItem[f.key]}
                onChange={handleEditItemChange}
                validations={f.validations || []}
                onError={(key, error) => handleInputError(key, error, true)}
                required={f.required ?? true}
              />
            </TableCell>
          ))}
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveEditItem}
              sx={{ mr: 1 }}
              disabled={Object.values(subInputErrors).some(Boolean)}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelEditItem}
            >
              Cancelar
            </Button>
          </TableCell>
        </>
      ) : (
        <>
          {visibleSubfields.map((f) => (
            <TableCell key={f.key}>
              {f.type === "date"
                ? (item[f.key] && String(item[f.key]).trim() !== ""
                    ? formatDateDDMMYYYY(item[f.key])
                    : "-")
                : (item[f.key] || "-")}
            </TableCell>
          ))}
          <TableCell>
            <Button color="error" onClick={() => handleRemoveItem(idx)}>
              <DeleteIcon />
            </Button>
            <Button color="primary" onClick={() => handleEditItem(idx)}>
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
        )}

        {/* Submit */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button type="submit" variant="contained" color="primary"
            disabled={Object.values(inputErrors).some(Boolean) || (visibleFields.length === 0 && subformData.length === 0)}
          >
            {titleBtn}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default formWithDetails;