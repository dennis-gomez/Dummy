// InputValidated.jsx
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { ValidateValues } from "../../utils/validateValues";

function InputValidated({
  name,
  type,
  value,
  onChange,
  placeholder,
  validations = [],
  onError,
  required = true,
}) {
  const [error, setError] = useState("");

  const runValidation = (val) => {
    const err = ValidateValues({ type, value: val, required, validations });
    setError(err);
    if (onError) onError(name, err);
    return err;
  };

  const handleChange = (e) => {
    let val = e.target.value;

    // 🔹 Si es fecha, la formateamos a YYYY-MM-DD
    if (type?.toLowerCase().includes("date") && val) {
      val = new Date(val).toISOString().split("T")[0];
    }

    runValidation(val);
    if (onChange) onChange({ target: { name, value: val } });
  };

  useEffect(() => {
    runValidation(value);
  }, [value]);

  // Fecha mínima: hoy
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <TextField
      fullWidth
      id={name + "-outlined-basic"}
      label={type?.toLowerCase().includes("date") ? placeholder || "Fecha" : placeholder}
      variant="outlined"
      type={type?.toLowerCase().includes("date") ? "date" : type || "text"}
      name={name}
      value={value || ""}
      onChange={handleChange}
      placeholder={placeholder}
      error={!!error}
      helperText={error}
      InputLabelProps={type?.toLowerCase().includes("date") ? { shrink: true } : {}}
      inputProps={{
        ...(type?.toLowerCase().includes("date") && { min: minDate }),
        ...(type === "number" ? { min: 1 } : {}),
      }}
    />
  );
}

export default InputValidated;
