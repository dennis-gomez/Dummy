
export function ValidateValues({ type, value, required = true, validations = [], restriction }) {
  let err = "";

  // 🔹 Requerido
  if (required && (value === "" || value === null || value === undefined)) {
    return "Este campo es obligatorio";
  }

  // 🔹 Validaciones base
  if (type === "number") {

    console.log();
    if (value !== "" && isNaN(Number(value))) {
      err = "Debe ser un número";
    } else if (Number(value) < 1) {
      err = "No se permiten valores negativos o cero";
    }

if(restriction === "onlyPastAndCurrentYear" && value !== ""){
  const currentYear = new Date().getFullYear();
  if (Number(value) > currentYear) {
    err = "El año no puede ser en el futuro";
  }
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
        break;
      }
    }
  }

  return err;
}
