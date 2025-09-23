// src/utils/generaUtilities.js

export const formatDateDDMMYYYY = (dateStr) => {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};
