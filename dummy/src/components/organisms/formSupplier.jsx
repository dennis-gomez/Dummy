import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidatedSupplier";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

function SupplierForm({ onAddSupplier, onCancel }) {
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_date: "",
    supplier_phone: "",
    supplier_email: "",
    supplier_is_active: 1,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};

    if (!formData.supplier_name.trim()) {
      tempErrors.supplier_name = "El nombre es obligatorio";
    } else if (formData.supplier_name.trim().length < 3) {
      tempErrors.supplier_name = "Debe tener al menos 3 caracteres";
    }

    if (!formData.supplier_date) {
      tempErrors.supplier_date = "La fecha es obligatoria";
    } else if (new Date(formData.supplier_date) > new Date()) {
      tempErrors.supplier_date = "No puede ser una fecha futura";
    }

    if (formData.supplier_phone) {
      const phoneRegex = /^[0-9\-+() ]{8,15}$/;
      if (!phoneRegex.test(formData.supplier_phone)) {
        tempErrors.supplier_phone = "Formato de teléfono inválido";
      }
    }

    if (!formData.supplier_email) {
      tempErrors.supplier_email = "El correo es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.supplier_email)) {
        tempErrors.supplier_email = "Correo inválido";
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const processedData = {
        ...formData,
        supplier_name: formData.supplier_name.trim(),
        supplier_email: formData.supplier_email.trim().toLowerCase(),
        supplier_phone: formData.supplier_phone.trim(),
        supplier_is_active: Number(formData.supplier_is_active),
      };
      onAddSupplier(processedData);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        mt: 4,
        borderRadius: "16px",
        backgroundColor: "#d9d9d9",
        boxShadow: 3,
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Agregar Proveedor
      </h3>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Nombre */}
          <Grid item xs={12} sm={6}>
            <InputValidated
              name="supplier_name"
              value={formData.supplier_name}
              onChange={handleChange}
              placeholder="Nombre del Proveedor"
              label="Nombre del Proveedor"
              required
              error={errors.supplier_name}
              validationRules={{ noNumbers: true }}
            />
          </Grid>
{/* Fecha */}
<Grid item xs={12} sm={6}>
  <InputValidated
    name="supplier_date"
    value={formData.supplier_date}
    onChange={handleChange}
    label="Fecha de Registro"
    type="date"
    required
    error={errors.supplier_date}
    sx={{
      "& .MuiOutlinedInput-root": {
        height: '56px',
        "& .MuiOutlinedInput-input": {
          height: '56px',
          padding: '16.5px 14px',
        },
      },
    }}
  />
</Grid>

          {/* Teléfono */}
          <Grid item xs={12} sm={6}>
            <InputValidated
              name="supplier_phone"
              value={formData.supplier_phone}
              onChange={handleChange}
              placeholder="Teléfono"
              label="Teléfono"
              error={errors.supplier_phone}
              validationRules={{ maxLength: 15 }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <InputValidated
              name="supplier_email"
              value={formData.supplier_email}
              onChange={handleChange}
              placeholder="Correo Electrónico"
              label="Correo Electrónico"
              type="email"
              required
              error={errors.supplier_email}
            />
          </Grid>

          {/* Estado (Radio buttons) */}
          <Grid item xs={12} sm={6}>
            <FormControl>
              <RadioGroup
                row
                name="supplier_is_active"
                value={formData.supplier_is_active}
                onChange={handleChange}
              >
                <FormControlLabel value={1} control={<Radio />} label="Activo" />
                <FormControlLabel value={0} control={<Radio />} label="Inactivo" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        {/* Botones */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
          {onCancel && (
            <Button type="button" text="Cancelar" color="error" onClick={onCancel} />
          )}
          <Button
            type="submit"
            text="Guardar Proveedor"
            color="primary"
          />
        </Box>
      </form>
    </Box>
  );
}

export default SupplierForm;