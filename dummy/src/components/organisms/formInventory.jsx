import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidated";
import InputValidatedDate from "../atoms/inputValidatedDate";
import InputValidatedFile from "../atoms/inputValidatedFile";
import { useState } from "react";

function FormInventory({ fields, onSubmit, titleBtn, onCancel, values, }) {
  
  
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const [errors, setErrors] = useState({});
  const [isUnique, setIsUnique] = useState(true);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (e.target.type === "file") {
      setFormData({ ...formData, [name]: files[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
                    onError={handleError}
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
                    restriction={field.restriction || ""}
                    onError={handleError}
                    options={field.options}
                    sx={{
                      "& .MuiInputBase-input": { backgroundColor: "#fff !important" },
                      ...(field.width ? { width: field.width } : {}),
                    }}
                    required={field.required ?? true}
                  />
                ) : field.type === "file" ? (
                  <InputValidatedFile
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onError={handleError}
                    accept={field.accept}
                    required={field.required ?? true}
                    validations={field.validations}
                    restriction={field.restriction || ""}
                    formValues={formData}
                    sx={{
                      ...(field.width ? { width: field.width } : {}),
                    }}
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
                    rows={field.type === "textarea" ? 3 : undefined}
                    sx={{
                      "& .MuiInputBase-root": { backgroundColor: "#fff !important" },
                      ...(field.width ? { width: field.width } : {}),
                    }}
                    required={field.required ?? true}
                    restriction={field.restriction || ""}
                    validations={field.validations}
                    setIsUnique={setIsUnique}
                    uniqueValues={values || []}
                    currentId={field.currentId || null}
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
            disabled={hasError || !isUnique}
            type="submit"
          />
        </Box>
      </form>
    </Box>
  );
}

export default FormInventory;
