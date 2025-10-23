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

  const validateField = (name, value) => {
    switch (name) {
      case "supplier_name":
        if (!value.trim()) return "El nombre es obligatorio";
        if (value.trim().length < 3) return "Debe tener al menos 3 caracteres";
        return "";
      case "supplier_date":
        if (!value) return "La fecha es obligatoria";
        return "";
      case "supplier_phone":
        if (!value.trim()) return "El teléfono es obligatorio";
        const phoneRegex = /^[0-9\-+()]{8,15}$/;
        if (!phoneRegex.test(value)) return "Entre 8 y 15 dígitos ó + - ()";
        return "";
      case "supplier_email":
        if (!value.trim()) return "El correo es obligatorio";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Correo inválido falta @ o dominio";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const tempErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) tempErrors[key] = error;
    });
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

      try {
        onAddSupplier(processedData);
        ModalAlert("Éxito", "Proveedor agregado correctamente", "success", 2000);

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
        ModalAlert(
          "Error",
          err.message || "No se pudo agregar el proveedor",
          "error",
          3000
        );
      }
    }
  };

  const isSaveDisabled =
    Object.values(errors).some((err) => err) ||
    !formData.supplier_name ||
    !formData.supplier_date ||
    !formData.supplier_phone ||
    !formData.supplier_email;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        px: 2,
      }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: "20px",
          backgroundColor: "#d9d9d9",
          boxShadow: 4,
          width: "auto", // ✅ Mantienes tu preferencia
          maxWidth: { xs: "100%", sm: "600px", md: "800px", lg: "1200px" }, // ✅ Limita el tamaño según pantalla
          mx: "auto", // Centrado horizontal
        }}
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Agregar Proveedor
        </h3>

        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{
              flexWrap: { xs: "wrap", sm: "nowrap" },
            }}
          >
            <Grid item>
              <InputValidated
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
                placeholder="Nombre del Proveedor"
                label="Nombre "
                error={errors.supplier_name}
                sx={{
                  width: { xs: "100%", sm: "300px", md: "350px" },
                  maxWidth: "100%",
                }}
              />
            </Grid>

            <Grid item>
              <InputValidated
                name="supplier_email"
                value={formData.supplier_email}
                onChange={handleChange}
                placeholder="Correo Electrónico"
                label="Correo"
                type="email"
                error={errors.supplier_email}
                sx={{
                  width: { xs: "100%", sm: "300px", md: "350px" },
                  maxWidth: "100%",
                }}
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
                sx={{
                  width: { xs: "100%", sm: "300px", md: "350px" },
                  maxWidth: "100%",
                }}
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
                sx={{
                  width: "350px",
                  maxWidth: "100%",
                }}
              />
            </Grid>
          </Grid>

          {/* Botones */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
            }}
          >
            {onCancel && (
              <Button
                type="button"
                text="Cancelar"
                color="error"
                onClick={onCancel}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              />
            )}
            <Button
              type="submit"
              text="Guardar Proveedor"
              color="primary"
              disabled={isSaveDisabled}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default SupplierForm;
