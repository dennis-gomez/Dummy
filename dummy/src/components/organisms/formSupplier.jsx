import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidatedSupplier";
import ModalAlert from "../molecules/modalAlert";

function SupplierForm({ onAddSupplier, onCancel }) {
  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_date: "",
    supplier_phone: "",
    supplier_email: "",
    supplier_is_active: 1,
  });

  const [errors, setErrors] = useState({
    supplier_name: "El nombre es obligatorio",
    supplier_date: "La fecha es obligatoria",
    supplier_phone: "El teléfono es obligatorio",
    supplier_email: "El correo es obligatorio",
  });

  // Función para validar un solo campo
  const validateField = (name, value) => {
    switch (name) {
      case "supplier_name":
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 3) return "Debe tener al menos 3 caracteres";
        return "";
      case "supplier_date":
        if (!value) return "La fecha es obligatoria";
        const todayStr = new Date().toISOString().split("T")[0];
        if (value < todayStr) return "La fecha no puede ser anterior a hoy";
        return "";
      case "supplier_phone":
        if (!value.trim()) return "El teléfono es obligatorio";
        const phoneRegex = /^[0-9\-+()]{8,15}$/; 
        if (!phoneRegex.test(value)) return "Formato de teléfono inválido";
        return "";
      case "supplier_email":
        if (!value.trim()) return "El correo es obligatorio";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Correo inválido";
        return "";
      default:
        return "";
    }
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validación en tiempo real
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Validar todo el formulario
  const validateForm = () => {
    const tempErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) tempErrors[key] = error;
    });
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Manejar envío
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

      try {
        onAddSupplier(processedData);
        ModalAlert("Éxito", "Proveedor agregado correctamente", "success", 2000);

        // Solo limpiar si la acción fue exitosa
        setFormData({
          supplier_name: "",
          supplier_date: "",
          supplier_phone: "",
          supplier_email: "",
          supplier_is_active: 1,
        });
        setErrors({
          supplier_name: "El nombre es obligatorio",
          supplier_date: "La fecha es obligatoria",
          supplier_phone: "El teléfono es obligatorio",
          supplier_email: "El correo es obligatorio",
        });
      } catch (err) {
        ModalAlert("Error", err.message || "No se pudo agregar el proveedor", "error", 3000);
        // No limpiar formData ni errors
      }
    }
  };

  // Determinar si el botón de guardar debe estar deshabilitado
  const isSaveDisabled = Object.values(errors).some((err) => err) || 
                         !formData.supplier_name || 
                         !formData.supplier_date || 
                         !formData.supplier_phone || 
                         !formData.supplier_email;

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
        <Grid justifyContent="center" container spacing={2}>
          {/* Columna 1 */}
          <Grid item xs={12} sm={6}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <InputValidated
                  name="supplier_name"
                  value={formData.supplier_name}
                  onChange={handleChange}
                  placeholder="Nombre del Proveedor"
                  label="Nombre del Proveedor"
                  error={errors.supplier_name}
                />
              </Grid>
              <Grid item>
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
            </Grid>
          </Grid>

          {/* Columna 2 */}
          <Grid item xs={12} sm={6}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <InputValidated
                  name="supplier_email"
                  value={formData.supplier_email}
                  onChange={handleChange}
                  placeholder="Correo Electrónico"
                  label="Correo Electrónico"
                  type="email"
                  error={errors.supplier_email}
                />
              </Grid>
              <Grid item>
                <InputValidated
                  name="supplier_date"
                  value={formData.supplier_date}
                  onChange={handleChange}
                  label="Fecha de Registro"
                  type="date"
                  error={errors.supplier_date}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Botones */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
          {onCancel && (
            <Button type="button" text="Cancelar" color="error" onClick={onCancel} />
          )}
          <Button type="submit" text="Guardar Proveedor" color="primary" disabled={isSaveDisabled} />
        </Box>
      </form>
    </Box>
  );
}

export default SupplierForm;
