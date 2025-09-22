import { Box, Button, Paper, Grid, minor } from "@mui/material";
import InputValidated from "../atoms/inputValidated";
import { useState } from "react";
import DetailsTable from "./detailTable";

function FormWithDetails({ fields, subfields, title, onSubmit, titleBtn, subTittle }) {
  const visibleFields = fields?.filter(f => f.key !== "cod_medic_kit") || [];
  const visibleSubfields = subfields?.filter(f => f.key !== "cod_medic_kit" && f.key !== "cod_supply") || [];

console.log("los campos son", fields);

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
      borderColor: "blue", // borde azul en error
    },
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "blue", // texto de error azul
  },
  
};

const textAreaStyle2 = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    width: "210%", // sigue siendo ancho extendido
    resize: "horizontal",
    minHeight: "8.8rem", // altura mínima
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "blue", // borde azul en error
    },
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "blue", // texto de error azul
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

  return (
    <Paper sx={{ maxWidth: 700, margin: "20px auto", p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: "#d9d9d9" }}>
      <form onSubmit={handleSubmit}>
        {/* Campos principales */}
        {visibleFields.length > 0 && (
          <Grid >
            {title && <h2 style={{ paddingBottom: "10px", textAlign:"center" }}>{title}</h2>}
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


{subTittle && <h2 style={{ paddingBottom: "10px", textAlign:"center" }}>{subTittle}</h2>}
        {/* Subformulario */}
       <Grid container spacing={2}>
  {/* Columna izquierda: Fecha y Cantidad apiladas */}

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

  {/* Columna derecha: Descripción */}
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
        <Box sx={{ display: "flex", justifyContent: "flex-end"}} mt={2}>
          {visibleSubfields.length > 0 && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddItem}
              disabled={
                Object.values(subInputErrors).some(Boolean) ||
                Object.values(newItem).some((val, idx) => {
                  const f = visibleSubfields[idx];
                  return (f.required ?? true) && (!val || String(val).trim() === "");
                })
              }
              sx={{ mr: 1 }}
            >
              {subTittle}
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={Object.values(inputErrors).some(Boolean) || (visibleFields.length === 0 && subformData.length === 0)}
          >
            {titleBtn}
          </Button>
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
