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
    // reenviamos el evento original para que Form lo procese igual que con los demas inputs
    if (onChange) onChange(e);
  };

  useEffect(() => {
    // si value viene con un File desde el form, sincronizamos el nombre
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
        label={placeholder || "Archivo"}
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
                  sx={{ textTransform: "none" }}
                >
                  Seleccionar archivo
                </Button>
              </label>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
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
        required={required}
        onClick={() => {
          /* lectura segura: TextField es readonly, el click lo hacemos en el botón/label */
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
