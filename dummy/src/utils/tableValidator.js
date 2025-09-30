export const tableValidator = ({
  value,
  list = [],         // Lista local (servicios, categorías o items)
  parentList = [],    // Lista del padre 
  grandParentList = [] // Lista del abuelo 
}) => {
  if (!value?.trim()) {
    return "El campo no puede estar vacío";
  }

  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
   
  //  Validación de duplicados en la lista actual
  if (list.some((item) => item.toLowerCase() === lower)) {
    return "El valor ya existe en esta tabla";
  }

  //  Validación contra lista del padre
  if (parentList.some((item) => item.toLowerCase() === lower)) {
    return "El valor no puede ser igual al de la categoría padre";
  }

  //  Validación contra lista del abuelo
  if (grandParentList.some((item) => item.toLowerCase() === lower)) {
    return "El valor no puede ser igual al del servicio padre";
  }

  //  Longitud mínima
  if (trimmed.length < 3) {
    return "Debe tener al menos 3 caracteres";
  }

  // Longitud máxima
  if (trimmed.length > 50) {
    return "Debe tener máximo 50 caracteres";
  }

  return ""; //valido
};
