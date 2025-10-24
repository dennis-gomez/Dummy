import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

const InputMovement = React.forwardRef(
  (
    {
      name,
      label,
      value,
      onChange,
      type = "text",
      placeholder = "",
      required = false,
      options = [],
      multiline = false,
      rows = 1,
      validationRules = {},
      sx = {},
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [error, setError] = useState("");

  
    const validate = (val) => {
      const strVal = val != null ? String(val) : "";
      if (required && strVal.trim() === "") return "Este campo es obligatorio";
      return "";
    };

    const handleChange = (e) => {
      let val = e.target.value;

      if (validationRules.noNumbers && /\d/.test(val)) return;
      if (validationRules.onlyNumbers) val = val.replace(/[^0-9]/g, "");
      if (validationRules.maxLength && val.length > validationRules.maxLength)
        val = val.slice(0, validationRules.maxLength);

      e.target.value = val;
      if (onChange) onChange(e);
      setError(validate(val));
    };

    useEffect(() => {
      setError(validate(value));
    }, [value]);

    
    const defaultStyle = {
      width: "100%",
      "& .MuiOutlinedInput-root": {
        backgroundColor: "#ffffff",
        borderRadius: "7px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: error ? "blue" : "#cccccc",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1976d2" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1976d2",
          boxShadow: "0 0 6px rgba(25, 118, 210, 0.4)",
        },
        ...(multiline ? { padding: "8px" } : {}),
      },
      "& .MuiInputLabel-root": { color: "#2563eb" },
      "& .MuiFormHelperText-root.Mui-error": { color: "blue" },

      
      "& .MuiSelect-select": {
        padding: "5px 10px",
        minHeight: "48px",
        display: "flex",
        alignItems: "center",
      },

      ...sx,
    };

    return (
      <Box sx={{ display: "flex", flexDirection: "column", ...sx }}>
        <TextField
          ref={ref}
          fullWidth
          select={type === "select"}
          name={name}
          label={label}
          placeholder={placeholder}
          value={value != null ? value : ""}
          onChange={handleChange}
          type={type === "DateCanBefore" ? "date" : type}
          error={!!error}
          helperText={error || " "}
          InputLabelProps={
            type?.toLowerCase().includes("date") ? { shrink: true } : {}
          }
          inputProps={type === "number" ? { min: 0 } : {}}
          disabled={disabled}
          multiline={multiline || type === "textarea"}
          rows={multiline || type === "textarea" ? rows : 1}
          sx={defaultStyle}
          {...props}
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
      </Box>
    );
  }
);

InputMovement.displayName = "InputMovement";
export default InputMovement;
