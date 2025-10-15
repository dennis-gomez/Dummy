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
  options = [],
  className,
  uniqueValues = [],
  currentId = null,
  setIsUnique,
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
      uniqueValues,
      currentId,
      setIsUnique,
    });

    setError((prev) => (prev === err ? prev : err));

    if (onError) {
      onError(name, err);
    }

    return err;
  };

  const handleChange = (e) => {
    const val = e.target.value;
    runValidation(val);
    if (onChange) onChange(e);
  };

  // 🚫 Bloquear entrada de notación científica o signos
  const handleKeyDown = (e) => {
    if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Validar al cambiar el valor externo
  useEffect(() => {
    runValidation(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <TextField
      fullWidth
      select={type === "select"}
      id={name + "-outlined-basic"}
      label={
        type?.toLowerCase().includes("date") ? placeholder || "Fecha" : placeholder
      }
      variant="outlined"
      type={type === "DateCanBefore" ? "date" : type || "text"}
      name={name}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      error={!!error}
      helperText={error || " "}
      InputLabelProps={
        type?.toLowerCase().includes("date") ? { shrink: true } : {}
      }
      inputProps={type === "number" ? { min: 0 } : {}}
      multiline={type === "textarea"}
      rows={type === "textarea" ? 4 : undefined}
      className={className}
      uniqueValues={uniqueValues}
      currentId={currentId}
      sx={{
        width: "100%",
        maxWidth: "100%",
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "100%",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cccccc",
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "blue",
          },
          "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "darkblue",
          },
          "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "darkblue",
          },
        },
        "& .MuiFormLabel-root.Mui-error": {
          color: "blue",
        },
        "& .MuiInputLabel-root": {
          color: "#2563eb",
          opacity: 1,
        },
        "& .MuiFormHelperText-root.Mui-error": {
          color: "blue",
        },
        ...sx,
      }}
      required={false}
    >
      {type === "select" &&
        options.map((opt) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled || false}
          >
            {opt.label}
          </MenuItem>
        ))}
    </TextField>
  );
}

export default InputValidated;
