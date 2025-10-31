export function ValidateValues({
  type,
  value,
  required = true,
  validations = [],
  restriction,
  allValues,
  uniqueValues = [],
  currentId = null,
  setIsUnique,
}) {
  let err = "";

  // Requerido
  if (
    required &&
    (typeof value === "string"
      ? value.trim() === ""
      : value === null || value === undefined) &&
    type !== "file"
  ) {
    err = "Obligatorio*";
  }

  if (
    !required &&
    (value === "" ||
      value === null ||
      value === undefined ||
      value === "Sin fecha")
  ) {
    return null;
  }

  if (type === "email" && value !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      err = "Email inválido";
    }
  }

  if (restriction === "uniqueUID" && value !== "") {
    const trimmed = value.trim();

    // Validar solo números
    const isValidCedula1 = /^[0-9]+$/.test(trimmed);
    // Validar longitud (9 a 12)
    const isValidCedula2 = trimmed.length >= 9 && trimmed.length <= 12;

    if (!isValidCedula1) {
      err = "Solo números*";
      setIsUnique(false);
    } else if (!isValidCedula2) {
      err = "Longitud inválida*";
      setIsUnique(false);
    } else {
      // Validar unicidad
      const exists = uniqueValues.some(
        (item) => String(item.value).trim() === trimmed && item.id !== currentId
      );

      if (exists) {
        setIsUnique(false);
        err = "Ya existe*";
      } else {
        setIsUnique(true);
      }
    }
  }

  if (restriction === "unique" && value !== "") {
    const exists = uniqueValues.some(
      (item) =>
        String(item.value).trim() === String(value).trim() &&
        item.id !== currentId
    );
    if (exists) {
      setIsUnique(false);
      err = "Ya existe*";
    } else {
      setIsUnique(true);
    }
  }

  // Validaciones base
  if (type === "number") {
    if (value !== "" && isNaN(Number(value))) {
      err = "Debe ser un número";
    }
    // ❌ Bloquear notación científica (2e3, 1E5, etc.)
    else if (typeof value === "string" && /e/i.test(value)) {
      err = "No se permite notación científica (e)";
    } else if (Number(value) < 1 && !restriction) {
      err = "Solo valores mayores a 0";
    } else if (restriction === "allowZero" && Number(value) < 0) {
      err = "Solo valores mayores o iguales a 0";
    }

    // Validación del año (Vehículos)
    if (restriction === "vehicle_year_restrictions" && value !== "") {
      const currentYear = new Date().getFullYear();
      if (Number(value) > currentYear) {
        err = "El año del vehículo no puede ser mayor al actual.";
      }
      if (Number(value) < 2000) {
        err = "El año del vehículo debe ser 2000 o posterior.";
      }
    }

    // Validación de valores mínimos (Vehículos)
    if (
      (restriction === "vehicle_initial_km_restrictions" ||
        restriction === "vehicle_last_km_maintenance_restrictions") &&
      Number(value) < 0
    ) {
      err = "No se permiten valores negativos";
    }
  } else if (type === "date") {
    if (value !== "" && value !== "Sin fecha") {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Verificar si es una fecha válida
      if (isNaN(inputDate.getTime())) {
        err = "Fecha inválida";
      } else {
        // Restricción: no permitir fechas futuras
        if (restriction === "cantBeforeToday" && inputDate < today) {
          const fieldName = allValues?.fieldName;
          const originalValue = fieldName
            ? allValues?.originalData?.[fieldName]
            : null;
          const isEditing = allValues?.isEditing || false;

          console.log("nombre de campo", fieldName);
          console.log("allValuesdeOriginalData:", allValues);

          if (isEditing && originalValue === value) {
            err = ""; // No marcar error si está editando y la fecha no cambió
          } else {
            err = "No se permiten fechas pasadas";
          }
        } else if (restriction === "cantBeforeToday" && inputDate < today) {
          err = "No se permiten fechas pasadas";
        } else if (restriction === "betweenManufactureAndToday") {
          const manufactureDateStr =
            allValues["extinguisher_manufacturing_date"];
          if (manufactureDateStr) {
            const manufactureDate = new Date(manufactureDateStr);
            if (inputDate < manufactureDate || inputDate > today) {
              err = "La fecha debe estar entre la fecha de fabricación y hoy";
            }
          }
        }
        // ✅ Nueva validación: training_validity > training_end_date
        else if (
          allValues &&
          allValues["training_end_date"] &&
          allValues["training_validity"] === value
        ) {
          const endDate = new Date(allValues["training_end_date"]);
          if (inputDate <= endDate) {
            err = "La validez debe ser posterior a la fecha de finalización";
          }
        }
        // Restricción por defecto: solo permitir fechas futuras
        else if (!restriction && inputDate < today) {
          err = "Solo se permiten fechas futuras";
        }
      }
    }
  } else if (type === "file") {
    if (value && !restriction) {
      if (value instanceof File) {
        // Caso: es un objeto File del input
        if (value.type !== "application/pdf") {
          err = "Solo se permiten archivos PDF";
        }
      } else if (typeof value === "string") {
        // Caso: ya viene en base64
        if (!value.startsWith("JVBERi0xL")) {
          err = "El archivo no es un PDF válido";
        }
      }
    }
    if (value && restriction === "filePath") {
      if (Array.isArray(value)) {
        // Si es un arreglo, revisamos que todos los archivos sean PDF
        const invalidFile = value.find(
          (file) => !file.name.toLowerCase().endsWith(".pdf")
        );
        if (invalidFile) {
          err = `El archivo "${invalidFile.name}" no es un PDF.`;
        }
      } else if (value) {
        // Si es un solo archivo
        if (value instanceof File) {
          if (value.type !== "application/pdf") {
            err = "Solo se permiten archivos PDF.";
          }
        } else if (typeof value === "string") {
          if (!value.toLowerCase().endsWith(".pdf")) {
            err = "La ruta del archivo debe terminar en .pdf";
          }
        } else {
          err = "No se ha proporcionado un archivo válido.";
        }
      } else {
        err = "No se ha proporcionado un archivo válido.";
      }
    }
  }

  // Validaciones personalizadas
  if (!err && validations.length > 0) {
    for (const validate of validations) {
      const vErr = validate(value, allValues);
      if (vErr) {
        err = vErr;
        break;
      }
    }
  }

  return err;
}
