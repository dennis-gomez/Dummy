import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { ValidateValues } from "../../utils/validateValues";

function InputValidatedDate({
    name,
    value,
    onChange,
    placeholder,
    required = true,
    validations = [],
    onError,
    restriction = "",
    formValues = {},
    className,
    sx
}) {
    const [error, setError] = useState("");

const runValidation = (val) => {
  const normalizedVal = val || "";
  const err = ValidateValues({
    type: "date",
    value: normalizedVal,
    required,
    validations,
    restriction,
    allValues: formValues,
  });

  // Solo actualiza si cambió
  setError((prev) => {
    if (prev === err) return prev;
    return err;
  });

  if (onError) {
    // Solo llama si cambió
    if (error !== err) onError(name, err);
  }

  return err;
};


    const handleChange = (e) => {
        const val = e.target.value;
        runValidation(val);
        if (onChange) onChange(e);
    };

useEffect(() => {
  runValidation(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [value]);


    // Calcular minDate y maxDate según la restricción
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let minDate, maxDate;

    if (restriction === "cantAfterToday") {
        maxDate = today;
    } else if (restriction === "cantBeforeToday") {
        minDate = today;
    } else if (restriction === "betweenManufactureAndToday") {
        const manufactureDate = formValues["extinguisher_manufacturing_date"];
        minDate = manufactureDate ? manufactureDate.split("T")[0] : undefined;
        maxDate = today;
    }

    return (
        <TextField
            fullWidth
            id={name + "-outlined-date"}
            label={placeholder || "Fecha"}
            variant="outlined"
            type="date"
            name={name}
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder || "Fecha"}
            error={!!error}
            helperText={error || " "}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minDate, max: maxDate }}
            className={className}
            restriction={restriction}
            sx={{
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

                    // Hover cuando hay error
                    "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "darkblue",
                    },

                    // Focus cuando hay error
                    "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "darkblue",
                    },
                },

                // Label cuando hay error
                "& .MuiFormLabel-root.Mui-error": {
                    color: "blue",
                },

                // Label normal (sin error)
                "& .MuiInputLabel-root": {
                    color: "#2563eb",
                    opacity: 1,
                },

                // HelperText cuando hay error
                "& .MuiFormHelperText-root.Mui-error": {
                    color: "blue",
                },

                ...sx,
            }}
            required={required}
        />
    );
}

export default InputValidatedDate;
