import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidated";
import InputValidatedDate from "../atoms/inputValidatedDate";
import { useState } from "react";

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
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).every((err) => !err)) {
      onSubmit(formData);
    }
  };

  const hasError = Object.values(errors).some((err) => !!err);

  return (
    <Box sx={{ p: 3, margin: "0 auto", maxWidth: 850, mt: 3 }}>
      <form onSubmit={handleSubmit}>
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
                    sx={{
                      "& .MuiInputBase-root": { backgroundColor: "#fff !important" },
                      ...(field.width ? { width: field.width } : {}),
                    }}
                  />
                ) : field.type === "select" ? (
                  <InputValidated
                    name={field.name}
                    type="select"
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onError={handleError}
                    options={field.options}
                    sx={{
                      "& .MuiInputBase-input": { backgroundColor: "#fff !important" },
                      ...(field.width ? { width: field.width } : {}),
                    }}
                    required={field.required ?? true}
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
                    sx={{
                      "& .MuiInputBase-root": { backgroundColor: "#fff !important" },
                      ...(field.width ? { width: field.width } : {}),
                    }}
                    required={field.required ?? true}
                    restriction={field.restriction || ""}
                    validations={field.validations}
                    formValues={formData}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>

       <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel} 
              className="px-5 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition border border-gray-300"
            >
              Cancelar
            </button>
          )}
          <Button 
            text={titleBtn} 
            onClick={handleSubmit}
            disabled={hasError}
            type="submit"
          />
        </Box>
      </form>
    </Box>
  );
}

export default Form;