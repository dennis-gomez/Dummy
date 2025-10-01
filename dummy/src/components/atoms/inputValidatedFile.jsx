import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import { ValidateValues } from "../../utils/validateValues";

function InputValidatedFile({
  name,
  value,
  onChange,
  placeholder,
  accept,
  required,
  validations = [],
  onError,
  restriction = "",
  formValues = {},
  sx = {},
}) {
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const runValidation = (file) => {
    const err = ValidateValues({
      type: "file",
      value: file,
      required,
      validations,
      restriction,
      allValues: formValues,
    });
    setError(err);
    if (onError) onError(name, err);
    return err;
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFileName(file ? file.name : "");
    runValidation(file);
    if (onChange) onChange(e);
  };

  useEffect(() => {
    if (value && value.name) setFileName(value.name);
    runValidation(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, formValues]);

  const inputId = `${name}-file-input`;

  return (
    <>
      <TextField
        fullWidth
        id={name + "-outlined-file"}
        variant="outlined"
        name={name}
        value={fileName || ""}
        placeholder={placeholder}
        error={!!error}
        helperText={error || " "}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end" sx={{ mr: -1 }}>
              <label htmlFor={inputId} style={{ display: "inline-block", margin: 0 }}>
                <Button
                  variant="contained"
                  component="span"
                  size="small"
                  sx={{ 
                    textTransform: "none",
                    backgroundColor: "#2563eb",
                    "&:hover": {
                      backgroundColor: "#1d4ed8",
                    },
                    "&:focus": {
                      outline: "2px solid #93c5fd",
                      ring: "4px",
                      ringColor: "#dbeafe"
                    },
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    minWidth: "auto",
                    lineHeight: "1.5",
                    letterSpacing: "normal",
                    // Estilo IDÉNTICO al botón "Agregar"
                    color: "white",
                    fontFamily: "inherit",
                    "&:disabled": {
                      backgroundColor: "#2563eb",
                      opacity: 0.5,
                      cursor: "not-allowed"
                    }
                  }}
                >
                  Seleccionar
                </Button>
              </label>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            width: '100%',
            maxWidth: '100%',

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#cccccc",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2563eb",
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2563eb",
            },

            "&.Mui-error .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d32f2f",
            },

            "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d32f2f",
            },

            "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d32f2f",
            },
          },

          "& .MuiFormLabel-root": {
            color: "#2563eb",
            opacity: 1,
            "&.Mui-focused": {
              color: "#2563eb",
            },
            "&.Mui-error": {
              color: "#d32f2f",
            },
          },

          "& .MuiFormHelperText-root": {
            "&.Mui-error": {
              color: "#d32f2f",
            },
          },

          width: "100%",
          maxWidth: "100%",
          ...sx,
        }}
        required={required}
        onClick={() => {
          /* lectura segura */
        }}
      />

      {/* input tipo file oculto */}
      <input
        id={inputId}
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </>
  );
}

export default InputValidatedFile;