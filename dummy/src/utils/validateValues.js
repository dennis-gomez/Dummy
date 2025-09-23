
export function ValidateValues({ type, value, required = true, validations = [], restriction, allValues}) {
  let err = "";

  // Requerido
  if (required && (value === "" || value === null || value === undefined)) {
    err = "Este campo es obligatorio";
  }

 if (!required && (value === "" || value === null || value === undefined || value === "Sin fecha")) {
    return null;
  }

  // Validaciones base
  if (type === "number") {

    if (value !== "" && isNaN(Number(value))) {
      err = "Debe ser un número";
    } else if (Number(value) < 1 && !restriction) {
      err = "solo valores mayores a 0";
    }

    //Validacion del año (Vehiculos)
    if (restriction === "vehicle_year_restrictions" && value !== "") {
      const currentYear = new Date().getFullYear();
      if (Number(value) > currentYear) {
        err = "El año del vehículo no puede ser mayor al actual.";
      }
      if (Number(value) < 1900) {
        err = "El año del vehículo debe ser 1900 o posterior.";
      }
    }

    //Validacion del valores minimos (Vehiculos)
    if ((restriction === "vehicle_initial_km_restrictions" || restriction === "vehicle_last_km_maintenance_restrictions")
      && Number(value) < 0) {
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
      if (restriction === "cantAfterToday" && inputDate > today) {
        err = "No se permiten fechas futuras";
      }

      // Restricción por defecto: solo permitir fechas futuras
      else if (!restriction && inputDate < today) {
        err = "Solo se permiten fechas futuras";
      }
    }
  }
}


  // Validaciones personalizadas
  if (!err && validations.length > 0) {
    for (const validate of validations) {
      const vErr = validate(value, allValues);
      if (vErr) {
        err = vErr;
        console.log(err)
        break;
      }
    }
  }

  return err;
}
