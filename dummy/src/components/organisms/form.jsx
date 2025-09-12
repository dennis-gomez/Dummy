import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputValidated from "../atoms/inputValidated";
import { useState } from "react";

function Form({ fields, onSubmit, titleBtn }) {
  // Estado para los valores del formulario
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  // Estado para los errores de validación
  const [inputErrors, setInputErrors] = useState({});

  // ------------------ Handlers ------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputError = (name, error) => {
    setInputErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // ------------------ Render ------------------
  return (
    <Box sx={{ p: 3, margin: "0 auto", maxWidth: 800, mt: 3 }}>
      <form onSubmit={handleSubmit}>
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
                  onError={handleInputError}
                  required={field.required ?? true}
                />
              </Grid>
            );
          })}
        </Grid>

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

export default Form;
