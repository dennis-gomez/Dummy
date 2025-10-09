import React, { useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import Button from "../atoms/button";

/**
 * Componente DoubleSeeker estilizado para mantener coherencia visual con Seeker
 */
function DoubleSeeker({
  primaryOptions = [],
  secondaryFields = [],
  dynamicOptions = [],
  primaryLabel = "Filtro 1",
  secondaryLabel = "Filtro 2",
  dynamicLabel = "Buscar...",
  primaryValue,
  setPrimaryValue,
  secondaryValue,
  setSecondaryValue,
  dynamicValue,
  setDynamicValue,
  onSearch,
}) {
  // 1️⃣ Asegurar que el valor inicial del área sea "Todos" (0)
  useEffect(() => {
    if (primaryValue === undefined || primaryValue === null) {
      setPrimaryValue(0);
    }
  }, [primaryValue, setPrimaryValue]);

  // 2️⃣ Cada vez que cambia el campo secundario, limpiar el campo dinámico
  useEffect(() => {
    setDynamicValue("");
  }, [secondaryValue]);

  // Determinar el tipo de campo dinámico y sus opciones
  const selectedField = secondaryFields.find(f => f.name === secondaryValue);
  const dynamicType = selectedField?.type || "text";
  const options = selectedField?.options || dynamicOptions;

  return (
    <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">

      {/* Select principal */}
      <div className="flex-1 min-w-[150px]">
        <FormControl fullWidth>
          <InputLabel
            className="!bg-white px-1 text-gray-600"
            sx={{ "&.Mui-focused": { color: "gray" } }}
          >
            {primaryLabel}
          </InputLabel>
          <Select
            value={primaryValue ?? 0}
            onChange={(e) => setPrimaryValue(e.target.value)}
            className="rounded-2xl bg-white"
          >
            <MenuItem value={0} className="hover:bg-blue-50 transition-colors">
              Todos
            </MenuItem>
            {primaryOptions.map((opt) => (
              <MenuItem
                key={opt.value}
                value={opt.value}
                className="hover:bg-blue-50 transition-colors"
              >
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Segundo Select */}
      <div className="flex-1 min-w-[180px]">
        <FormControl fullWidth>
          <InputLabel
            className="!bg-white px-1 text-gray-600"
            sx={{ "&.Mui-focused": { color: "gray" } }}
          >
            {secondaryLabel}
          </InputLabel>
          <Select
            value={secondaryValue}
            onChange={(e) => setSecondaryValue(e.target.value)}
            className="rounded-2xl bg-white"
          >
            {secondaryFields.map((field) => (
              <MenuItem
                key={field.name}
                value={field.name}
                className="hover:bg-blue-50 transition-colors"
              >
                {field.placeholder}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Campo dinámico */}
      <div className="flex-1 min-w-[180px]">
        {dynamicType === "select" ? (
          <FormControl fullWidth>
            <InputLabel
              className="!bg-white px-1 text-gray-600"
              sx={{ "&.Mui-focused": { color: "gray" } }}
            >
              {dynamicLabel}
            </InputLabel>
            <Select
              value={dynamicValue}
              onChange={(e) => setDynamicValue(e.target.value)}
              className="rounded-2xl bg-white"
            >
              {options.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  className="hover:bg-blue-50 transition-colors"
                >
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            label={dynamicLabel}
            type={dynamicType}
            value={dynamicValue}
            onChange={(e) => setDynamicValue(e.target.value)}
            name="dynamic-input"
            fullWidth
            InputLabelProps={{
              ...(dynamicType === "date" ? { shrink: true } : {}),
              sx: { backgroundColor: "white", px: 1 },
            }}
            className="rounded-2xl bg-white"
          />
        )}
      </div>

      {/* Botón de búsqueda */}
      <div>
        <Button
          text="Buscar"
          onClick={onSearch}
          className="h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        />
      </div>
    </div>
  );
}

export default DoubleSeeker;
