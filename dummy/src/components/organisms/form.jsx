import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Input from "../atoms/input";
import { useState } from "react";

function Form({ fields, onSubmit, titleBtn }) {

  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box 
        sx={{ flexGrow: 1, p: 3, maxWidth: 800, margin: "0 auto" }}
        color={"red"}
    >
      <form onSubmit={handleSubmit}>
        <Grid 
            container spacing={2}
        >
            {fields.map((field, index) => {
                const isLastSingle = fields.length % 2 !== 0 && index === fields.length - 1;
                return (
                    <Grid 
                        item xs={12} 
                        sm={isLastSingle ? 12 : 6} 
                        key={field.name}
                    >
                        <Input
                            name={field.name}
                            type={field.type || "text"}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                        />
                    </Grid>
                );
            })}
            <Grid item xs={12}>
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                >
                    {titleBtn}
                </Button>
            </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Form;
