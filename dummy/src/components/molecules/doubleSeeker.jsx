import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import Button from "../atoms/button"; // Tu componente de botón personalizado

/**
 * Componente DoubleSeeker genérico
 *
 * Props:
 * - primaryOptions: opciones para el primer select [{ value, label }]
 * - secondaryFields: campos del segundo select [{ name, placeholder, type, options? }]
 * - dynamicOptions: opciones dinámicas para el campo dinámico (solo si tipo 'select')
 * - primaryLabel, secondaryLabel, dynamicLabel: etiquetas de los campos
 * - primaryValue, setPrimaryValue
 * - secondaryValue, setSecondaryValue
 * - dynamicValue, setDynamicValue
 * - onSearch: callback al hacer clic en "Buscar"
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
  const searchInputClass = "min-w-[180px] sm:min-w-[200px]";

  // Determinar el tipo de campo dinámico y sus opciones
  const selectedField = secondaryFields.find(f => f.name === secondaryValue);
  const dynamicType = selectedField?.type || "text";
  const options = selectedField?.options || dynamicOptions;

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
      <Box className="flex flex-wrap gap-3 bg-white shadow-md rounded-xl p-4 flex-1">
        {/* Primer select */}
        <FormControl className={searchInputClass} sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel sx={{ backgroundColor: "white", px: 1 }}>{primaryLabel}</InputLabel>
          <Select
            value={primaryValue}
            onChange={(e) => setPrimaryValue(e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            {primaryOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Segundo select */}
        <FormControl className={searchInputClass}>
          <InputLabel sx={{ backgroundColor: "white", px: 1 }}>{secondaryLabel}</InputLabel>
          <Select
            value={secondaryValue}
            onChange={(e) => setSecondaryValue(e.target.value)}
          >
            {secondaryFields.map((field) => (
              <MenuItem key={field.name} value={field.name}>
                {field.placeholder}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Campo dinámico */}
        {dynamicType === "select" ? (
          <FormControl className={searchInputClass}>
            <InputLabel sx={{ backgroundColor: "white", px: 1 }}>{dynamicLabel}</InputLabel>
            <Select
              value={dynamicValue}
              onChange={(e) => setDynamicValue(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            label={dynamicLabel}
            type={dynamicType}
            value={dynamicValue}
            onChange={(e) => setDynamicValue(e.target.value)}
            className={searchInputClass}
            InputLabelProps={{
              ...(dynamicType === "date" ? { shrink: true } : {}),
              sx: { backgroundColor: "white", px: 1 },
            }}
          />
        )}

        {/* Botón de búsqueda */}
        <div className="flex items-center justify-center lg:ml-9 w-full sm:w-auto">
          <Button
            text="Buscar"
            onClick={onSearch}
            className="h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          />
        </div>
      </Box>
    </div>
  );
}

export default DoubleSeeker;
