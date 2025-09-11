import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function Select({ value, onChange, label }) {
  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={value}
      label={label}
      onChange={onChange}
    >
      <MenuItem value={10}>Item 1</MenuItem>
      <MenuItem value={20}>Item 2</MenuItem>
      <MenuItem value={30}>Item 3</MenuItem>
    </Select>
  );
}

export default Select;