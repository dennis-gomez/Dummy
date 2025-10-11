import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const InputValidated = React.forwardRef(({
  name,
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  required = false,
  error = "",
  validationRules = {},
  sx = {},
  ...props
}, ref) => {
  
  const handleChange = (e) => {
    const { value } = e.target;
    
    // Aplicar reglas de validación específicas
    let filteredValue = value;
    
    if (validationRules.noNumbers && /\d/.test(value)) {
      return; // No permitir números
    }
    
    if (validationRules.onlyNumbers) {
      filteredValue = value.replace(/[^0-9]/g, '');
    }
    
    if (validationRules.maxLength && value.length > validationRules.maxLength) {
      filteredValue = value.slice(0, validationRules.maxLength);
    }
    
    // Llamar onChange con el valor filtrado
    if (filteredValue !== value) {
      e.target.value = filteredValue;
    }
    
    onChange(e);
  };

  const defaultStyle = {
    width: '100%',
    maxWidth: '100%',
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      width: '100%',
      maxWidth: '100%',
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: error ? "blue" : "#cccccc",
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
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#1976d2",
        boxShadow: "0 0 4px rgba(25, 118, 210, 0.4)",
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
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
    }
  };

  const combinedSx = { ...defaultStyle, ...sx };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField
        ref={ref}
        fullWidth
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        label={label}
        type={type}
        required={required}
        error={!!error}
        helperText={error || " "}
        sx={combinedSx}
        InputLabelProps={type === "date" ? { shrink: true } : {}}
        inputProps={type === "number" ? { min: 0 } : {}}
        {...props}
      />
    </Box>
  );
});

InputValidated.displayName = "InputValidated";

export default InputValidated;