import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
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
  sx,
  restriction = "", 
  formValues,
  options = [] // 👈 soporte para select
}) {
  const [error, setError] = useState("");

  const runValidation = (val) => {
    const err = ValidateValues({ 
      type, 
      value: val, 
      required, 
      validations, 
      restriction, 
      allValues: formValues
    });
    setError(err);
    if (onError) onError(name, err);
    return err;
  };

  const handleChange = (e) => {
    const val = e.target.value;
    runValidation(val);
    if (onChange) onChange(e);
  };

  useEffect(() => {
    runValidation(value);
  }, [value]);

  return (
    <TextField
      fullWidth
      select={type === "select"} 
      id={name + "-outlined-basic"}
      label={
        type?.toLowerCase().includes("date")
          ? placeholder || "Fecha"
          : placeholder
      }
      variant="outlined"
      type={type === "DateCanBefore" ? "date" : type || "text"}
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      error={!!error}
      helperText={error}
      InputLabelProps={
        type?.toLowerCase().includes("date") ? { shrink: true } : {}
      }
      inputProps={type === "number" ? { min: 0 } : {}}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 4 : undefined}
      sx={sx}
      required={required}
    >
      {type === "select" &&
        options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
    </TextField>
  );
}

export default InputValidated;
