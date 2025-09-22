import React from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";

function CustomSelect({ selectLabel, fields = [], value, onChange }) {
    return (
        <FormControl fullWidth>
            <InputLabel className="text-gray-600">{selectLabel}</InputLabel>
            <Select
                value={value}
                onChange={onChange}
                label={selectLabel}
                className="rounded-2xl"
            >
                {fields.map((option, idx) => (
                    <MenuItem 
                        key={idx} 
                        value={option.name}
                        className="hover:bg-blue-50 transition-colors"
                    >
                        {option.placeholder}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default CustomSelect;
