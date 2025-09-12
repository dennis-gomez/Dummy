import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { ValidateValues } from "../../utils/validateValues"; // 👈 importas tu validador

function InputValidated({
  name,
  type,
  value,
  onChange,
  placeholder,
  validations = [],
  onError,
  required = true, // 👈 por defecto obligatorio
}) {
  const [error, setError] = useState("");

  const runValidation = (val) => {
    const err = ValidateValues({ type, value: val, required, validations });
    setError(err);
    if (onError) onError(name, err);
    return err;
  };

  const handleChange = (e) => {
    const val = e.target.value;
    runValidation(val);
    if (onChange) onChange(e);
  };

  // 🔹 Validación inicial y cada vez que cambie el `value` desde fuera
  useEffect(() => {
    runValidation(value);
  }, [value]);

  return (
    <TextField
      fullWidth
      id={name + "-outlined-basic"}
      label={type?.toLowerCase().includes("date") ? placeholder || "Fecha" : placeholder}
      variant="outlined"
      type={type === "DateCanBefore" ? "date" : type || "text"}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={!!error}
      helperText={error}
      InputLabelProps={type?.toLowerCase().includes("date") ? { shrink: true } : {}}
      inputProps={type === "number" ? { min: 1 } : {}}
    />
  );
}

export default InputValidated;
