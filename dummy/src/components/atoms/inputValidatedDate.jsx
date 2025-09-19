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
    }, [value, formValues]);

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
            helperText={error}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: minDate, max: maxDate }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                },
                ...sx,
            }}
            required={required}
        />
    );
}

export default InputValidatedDate;
