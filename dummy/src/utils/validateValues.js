
export function ValidateValues({ type, value, required = true, validations = [], restriction }) {
  let err = "";

  // 🔹 Requerido
  if (required && (value === "" || value === null || value === undefined)) {
    err = "Este campo es obligatorio";
  }

  // 🔹 Validaciones base
  if (type === "number") {

    if (value !== "" && isNaN(Number(value))) {
      err = "Debe ser un número";
    } else if (Number(value) < 1 && !restriction) {
      err = "No se permiten valores negativos o cero";
    }

    //Validacion del año (Vehiculos)
    if(restriction === "vehicle_year_restrictions" && value !== ""){
      const currentYear = new Date().getFullYear();
      if (Number(value) > currentYear) { 
        err = "El año del vehículo no puede ser mayor al actual.";
      }
      if (Number(value) < 1900) {
        err = "El año del vehículo es inválido debe ser de 1900 o posterior.";
      }
    }

    //Validacion del valores minimos (Vehiculos)
    if((restriction === "vehicle_initial_km_restrictions" || restriction === "vehicle_last_km_maintenance_restrictions") 
      && Number(value) < 0) { 
      err = "No se permiten valores negativos";
    }

  } else if (type === "date") {

    if (value !== "" && isNaN(Date.parse(value))) {
      err = "Fecha inválida";
    } else if (type === "date" && value !== "") {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        err = "Solo se permiten fechas futuras";
      }
    }

    if(restriction === "cantAfterToday" && value !== ""){
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (inputDate > today) {
        err = "No se permiten fechas futuras";
      }
    }
  }

  // 🔹 Validaciones personalizadas
  if (!err && validations.length > 0) {
    for (const validate of validations) {
      const vErr = validate(value);
      if (vErr) {
        err = vErr;
        console.log(err)
        break;
      }
    }
  }

  return err;
}
