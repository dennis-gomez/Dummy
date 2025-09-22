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
  options = []
}) {
  const [error, setError] = useState("");

  const runValidation = (val) => {
    const err = ValidateValues({
      type,
      value: val,
      required,
      validations,
      restriction,
      allValues: formValues,
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
      helperText={error || " "}
      InputLabelProps={
        type?.toLowerCase().includes("date") ? { shrink: true } : {}
      }
      inputProps={type === "number" ? { min: 0 } : {}}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 4 : undefined}
      sx={{
        // Fondo blanco solo para el input
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#ffffff",

          // Borde normal
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cccccc",
          },

          // Borde cuando hay error
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "blue",
          },

          // Borde cuando hay error y está en hover
          "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "darkblue",
          },

          // Borde cuando hay error y está en focus
          "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "darkblue",
          },
        },

        // Color del label cuando hay error
        "& .MuiFormLabel-root.Mui-error": {
          color: "blue",
        },

        //color del label cuando no hay error
        "& .MuiInputLabel-root": {
  color: "#2563eb",
  opacity: 1, // fuerza que no sea transparente
},

        // Color del helperText cuando hay error
        "& .MuiFormHelperText-root.Mui-error": {
          color: "blue",
        },

        ...sx,
      }}
      required={false}
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
