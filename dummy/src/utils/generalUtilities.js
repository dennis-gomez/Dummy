export const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

//valor de fecha real
export const  parseDateWithoutTimezone = (dateString) => {
  if (!dateString) return null;

  let year, month, day;

  if (dateString.includes("-")) {
    [year, month, day] = dateString.split("-").map(Number);
  } else if (dateString.includes("/")) {
    [day, month, year] = dateString.split("/").map(Number);
  } else {
    return null;
  }

  return new Date(year, month - 1, day);
}
