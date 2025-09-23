import { Box, Paper, Grid } from "@mui/material";
import InputValidated from "../atoms/inputValidated";
import { useState } from "react";
import DetailsTable from "./detailTable";
import Button from "../atoms/button";

function FormWithDetails({ fields, subfields, title, onSubmit, titleBtn, subTittle }) {
  const visibleFields = fields?.filter(f => f.key !== "cod_medic_kit") || [];
  const visibleSubfields = subfields?.filter(f => f.key !== "cod_medic_kit" && f.key !== "cod_supply") || [];

  const initialFormData = visibleFields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});
  const [formData, setFormData] = useState(initialFormData);

  const emptySubform = visibleSubfields.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});
  const [newItem, setNewItem] = useState(emptySubform);
  const [subformData, setSubformData] = useState([]);

  const [inputErrors, setInputErrors] = useState({});
  const [subInputErrors, setSubInputErrors] = useState({});

  const whiteInputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "blue",
      },
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "blue",
    },
  };

  const textAreaStyle2 = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      width: "210%",
      resize: "horizontal",
      minHeight: "8.8rem",
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "blue",
      },
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "blue",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputError = (key, error, isSubform = false) => {
    if (isSubform) setSubInputErrors((prev) => ({ ...prev, [key]: error }));
    else setInputErrors((prev) => ({ ...prev, [key]: error }));
  };

  const handleAddItem = () => {
    setSubformData((prev) => [...prev, newItem]);
    setNewItem(emptySubform);
    setSubInputErrors({});
  };

  const handleDeleteItem = (idx) => {
    setSubformData((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEditItem = (idx, updatedItem) => {
    setSubformData((prev) => prev.map((item, i) => (i === idx ? updatedItem : item)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, supplements: subformData });
  };

  // Calcular estados disabled
  const isAddButtonDisabled =
    Object.values(subInputErrors).some(Boolean) ||
    Object.values(newItem).some((val, idx) => {
      const f = visibleSubfields[idx];
      return (f.required ?? true) && (!val || String(val).trim() === "");
    });

  const isSubmitButtonDisabled =
    Object.values(inputErrors).some(Boolean) ||
    (visibleFields.length === 0 && subformData.length === 0);

  return (
    <Paper sx={{ maxWidth: 700, margin: "20px auto", p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: "#d9d9d9" }}>
      <form onSubmit={handleSubmit}>
        {/* Campos principales */}
        {visibleFields.length > 0 && (
          <Grid>
            {title && (
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                {title}
              </h2>
            )}
            {visibleFields.map((f) => (
              <Grid item xs={f.type === "textarea" ? 12 : 2} key={f.key} sx={{ mr: 2 }}>
                <InputValidated
                  name={f.key}
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  value={formData[f.key]}
                  onChange={handleChange}
                  validations={f.validations || []}
                  onError={(key, error) => handleInputError(key, error)}
                  required={f.required ?? true}
                  sx={whiteInputStyle}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {subTittle && (
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            {subTittle}
          </h3>
        )}

        {/* Subformulario */}
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Grid container spacing={1} direction="column">
              {visibleSubfields
                .filter(f => f.key === "supply_expiration_date" || f.key === "supply_quantity")
                .map(f => (
                  <Grid item key={f.key}>
                    <InputValidated
                      name={f.key}
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      value={newItem[f.key]}
                      onChange={handleNewItemChange}
                      validations={f.validations || []}
                      onError={(key, error) => handleInputError(key, error, true)}
                      required={f.required ?? true}
                      sx={whiteInputStyle}
                    />
                  </Grid>
                ))}
            </Grid>
          </Grid>

          <Grid item xs={8}>
            {visibleSubfields
              .filter(f => f.key === "supply_description")
              .map(f => (
                <InputValidated
                  key={f.key}
                  name={f.key}
                  type={f.type || "text"}
                  placeholder={f.placeholder}
                  value={newItem[f.key]}
                  onChange={handleNewItemChange}
                  validations={f.validations || []}
                  onError={(key, error) => handleInputError(key, error, true)}
                  required={f.required ?? true}
                  sx={textAreaStyle2}
                />
              ))}
          </Grid>
        </Grid>

        {/* Botones */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }} mt={2}>
          {visibleSubfields.length > 0 && (
            // Boton Añadir suplemento
            <Button
              text={subTittle}
              onClick={handleAddItem}
              disabled={isAddButtonDisabled}
            />
          )}

          {/* Boton Añadir Botiquín */}
          <Button
            text={titleBtn}
            onClick={handleSubmit}
            disabled={isSubmitButtonDisabled}
            type="submit"
          />
        </Box>

        {/* Tabla de subitems */}
        {subformData.length > 0 && (
          <DetailsTable
            fields={visibleSubfields}
            items={subformData}
            onDelete={handleDeleteItem}
            onEdit={handleEditItem}
          />
        )}
      </form>
    </Paper>
  );
}

export default FormWithDetails;