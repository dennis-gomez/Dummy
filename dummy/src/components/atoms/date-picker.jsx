import { TextField } from "@mui/material";

function CustomDatePicker({ label, value, onChange, name }) {
  return (
    <TextField
      fullWidth
      type="date"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      InputLabelProps={{
        shrink: true, // hace que el label no se superponga
      }}
      className="rounded-2xl bg-white"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "1rem",
        },
        "& label.Mui-focused": {
          color: "gray", // igual que en tu CustomSelect
        },
      }}
    />
  );
}

export default CustomDatePicker;
