import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { ValidateValues } from "../../utils/validateValues";
import dayjs from "dayjs";

function InputValidatedDate({
    name,
    value,
    onChange,
    placeholder,
    required = true,
    validations = [],
    onError,
    restriction = "",
    sx
}) {
    const [error, setError] = useState("");

    const runValidation = (val) => {

        const normalizedVal = val ? val.toISOString() : "";
        const err = ValidateValues({
            type: "date",
            value: normalizedVal, required, validations, restriction
        });
        setError(err);
        if (onError) onError(name, err);
        return err;
    };

    const handleChange = (newValue) => {
        runValidation(newValue);
        if (onChange) {
            onChange({ target: { name, value: newValue } });
        }
    };

    useEffect(() => {
        runValidation(value);
    }, [value]);

    return (
<DatePicker
  label={placeholder || "Fecha"}
  value={value || null}
  onChange={handleChange}
  format="DD/MM/YYYY"
  minDate={restriction === "cantBeforeToday" ? dayjs() : undefined}
  maxDate={restriction === "cantAfterToday" ? dayjs() : undefined}
  slotProps={{
    textField: {
      fullWidth: true,
      error: !!error,
      helperText: error,
      required,
      sx: {
        "& .MuiOutlinedInput-root": {backgroundColor: "#ffffff", borderRadius: "8px"},
        "& .MuiInputBase-input": {backgroundColor: "#ffffff"},
        "& fieldset": { backgroundColor: "#ffffff" },
      },
    },
    actionBar: { actions: ["today", "clear"] },
  }}
/>


    );
}

export default InputValidatedDate;
