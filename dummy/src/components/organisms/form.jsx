import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputValidated from "../atoms/inputValidated";
import InputValidatedDate from "../atoms/inputValidatedDate";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { esES } from '@mui/x-date-pickers/locales';

function Form({ fields, onSubmit, titleBtn, onCancel }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const [errors, setErrors] = useState({}); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleError = (name, errorMessage) => {
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // solo enviar si no hay errores
    if (Object.values(errors).every(err => !err)) {
      onSubmit(formData);
    }
  };

  const hasError = Object.values(errors).some(err => !!err);

  return (
    <Box sx={{ p: 3, margin: "0 auto", maxWidth: 800, mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs} localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}>
          <Grid container spacing={2}>
            {fields.map((field) => {
              const xs = field.grid || (field.type === "textarea" ? 12 : 4);

              return (
                <Grid item xs={xs} key={field.name}>
                  {field.type === "date" ? (
                    
                    <InputValidatedDate
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setFormData({ ...formData, [name]: value });
                      }}
                      restriction={field.restriction || ""}
                      validations={field.validations}
                      sx={field.width ? { width: field.width } : {}}
                    />
                  ) : (
                    <InputValidated
                      name={field.name}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      onError={handleError}
                      multiline={field.type === "textarea"}
                      rows={field.type === "textarea" ? 4 : undefined}
                      sx={field.width ? { width: field.width } : {}}
                      required={field.required ?? true}
                      restriction={field.restriction || ""}
                      validations={field.validations}
                    />
                  )}

                </Grid>
              );
            })}
          </Grid>
        </LocalizationProvider>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          {onCancel && (
            <Button onClick={onCancel} sx={{ mr: 2 }}>
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={hasError}
          >
            {titleBtn}
          </Button>
        </Box>
      </form>
    </Box>
  );
}


export default Form;
