import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputValidated from "../atoms/inputValidated";
import { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { esES } from '@mui/x-date-pickers/locales';

function Form({ fields, onSubmit, titleBtn, onCancel }) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const [inputErrors, setInputErrors] = useState({});

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

  return (
    <Box sx={{ p: 3, margin: "0 auto", maxWidth: 800, mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            {fields.map((field) => {
              const xs = field.grid || (field.type === "textarea" ? 12 : 4);

              return (
                <Grid item xs={xs} key={field.name}>
                  {field.type === "date" ? (

                    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}>
                      <DatePicker
                        label="Fecha de Fabricación"
                        value={formData.fechaFabricacion || null}
                        onChange={(newValue) =>
                          setFormData({ ...formData, fechaFabricacion: newValue })
                        }
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: { fullWidth: true },
                          actionBar: { actions: ["today", "clear"] },
                        }}
                      />
                    </LocalizationProvider>

                  ) : (
                    <InputValidated
                      name={field.name}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      validations={field.validations || []}
                      onError={handleInputError}
                      required={field.required ?? true}
                      multiline={field.type === "textarea"}
                      rows={field.type === "textarea" ? 4 : undefined}
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
