import TextField from "@mui/material/TextField"

function Input ({name, vale, onChange, placeholder}) {
  return (
    <TextField 
      fullWidth 
        id="outlined-basic" 
        label={placeholder} 
        variant="outlined" 
        name={name}
        value={vale}
        onChange={onChange}
        placeholder={placeholder}
    />
  )
}
export default Input