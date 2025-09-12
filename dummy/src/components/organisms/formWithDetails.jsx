import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputValidated from "../atoms/inputValidated";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function formWithDetails({ fields, subfields, title, onSubmit, titleBtn,subTittle }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const emptySubform = subfields
    ? subfields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
    : {};

  const [subformData, setSubformData] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [editItem, setEditItem] = useState(emptySubform);

  const [inputErrors, setInputErrors] = useState({});
  const [subInputErrors, setSubInputErrors] = useState({});

  // ------------------ Handlers ------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditItemChange = (e) => {
    const { name, value } = e.target;
    setEditItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputError = (name, error, isSubform = false) => {
    if (isSubform) {
      setSubInputErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setInputErrors((prev) => ({ ...prev, [name]: error }));
    }
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

  // ------------------ Render ------------------
  return (
    <Box sx={{ p: 3, margin: "0 auto", maxWidth: 800, mt: 3 }}>
      <form onSubmit={handleSubmit}>
        {/* Formulario principal */}
        <Grid container spacing={2}>
          {fields.map((field, index) => {
            const isLastSingle =
              fields.length % 2 !== 0 && index === fields.length - 1;
            return (
              <Grid item xs={12} sm={isLastSingle ? 12 : 6} key={field.name}>
                <InputValidated
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  validations={field.validations || []}
                  onError={(name, error) =>
                    handleInputError(name, error, false)
                  }
                  required={field.required ?? true}
                />
              </Grid>
            );
          })}
        </Grid>

        {/* Subformulario */}
        {title && <h2>{title}</h2>}
        {subfields && (
          <Box sx={{ border: "1px solid #eee", p: 2, mb: 2, borderRadius: 2 }}>
            <Grid container spacing={2}>
              {subfields.map((field, index) => {
                const isLastSingle =
                  subfields.length % 2 !== 0 && index === subfields.length - 1;
                return (
                  <Grid item xs={12} sm={isLastSingle ? 12 : 6} key={field.name}>
                    <InputValidated
                      name={field.name}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={editItem[field.name]}
                      onChange={handleEditItemChange}
                      validations={field.validations || []}
                      onError={(name, error) =>
                        handleInputError(name, error, true)
                      }
                      required={field.required ?? true}
                    />
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              {editIdx !== null ? (
                <>
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
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddItem}
                  disabled={Object.values(subInputErrors).some(Boolean)}
                >
                  {subTittle}
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Tabla de subitems */}
        {subfields && subformData.length > 0 && (
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lista de items
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    {subfields.map((f) => (
                      <TableCell key={f.name}>{f.placeholder}</TableCell>
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
                          {subfields.map((f) => (
                            <TableCell key={f.name}>
                              <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <InputValidated
                                  name={f.name}
                                  type={f.type || "text"}
                                  placeholder={f.placeholder}
                                  value={editItem[f.name]}
                                  onChange={(e) =>
                                    setEditItem({
                                      ...editItem,
                                      [f.name]: e.target.value,
                                    })
                                  }
                                  validations={f.validations || []}
                                  onError={(name, error) =>
                                    handleInputError(name, error, true)
                                  }
                                  required={f.required ?? true}
                                />
                                <Box sx={{ minHeight: "1.5em" }} /> {/* espacio para error */}
                              </Box>
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
                          {subfields.map((f) => (
                            <TableCell key={f.name}>{item[f.name] || "-"}</TableCell>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={Object.values(inputErrors).some(Boolean)}
          >
            {titleBtn}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default formWithDetails;
