import TextField from "@mui/material/TextField"

function Input ({name, value, onChange, placeholder}) {
  return (
    <TextField 
      fullWidth 
        id="outlined-basic" 
        label={placeholder} 
        variant="outlined" 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
    />
  )
}
export default Input