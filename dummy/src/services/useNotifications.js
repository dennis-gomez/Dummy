import { getNotifiedGuarantees, updateGuarantee, getExpiredGuarantees } from "./guaranteeService";

// Array general de notificaciones
export const notifications = [];

// 🔹 Fetcher de garantías próximas a vencer
export const fetchGuaranteeNotifications = async () => {
  try {
    const guarantees = await getNotifiedGuarantees();
    return guarantees.map(g => ({
      id: g.cod_guarantee,
      titulo: `Garantía próxima a vencer: ${g.guarantee_number}`,
      isNotified: g.guarantee_is_notified,
      descripcion: `La garantía ${g.guarantee_number} vence el ${new Date(
        g.guarantee_expiration_date
      ).toLocaleDateString('es-CR')}`,
      type: "upcoming",
      updateFn: async () => {
        // Marcar como vista
        await updateGuarantee(g.cod_guarantee, { guarantee_is_notified: 2 }); // 2 = vista
        // Eliminar del array de notificaciones
        const index = notifications.findIndex(n => n.id === g.cod_guarantee);
        if (index !== -1) notifications.splice(index, 1);
      },
    }));
  } catch (err) {
    console.error("Error trayendo notificaciones de garantías próximas a vencer:", err);
    return [];
  }
};

// 🔹 Fetcher de garantías vencidas
export const fetchExpiredGuaranteeNotifications = async () => {
  try {
    const expired = await getExpiredGuarantees();
    return expired.map(g => ({
      id: g.cod_guarantee,
      titulo: `Garantía vencida: ${g.guarantee_number}`,
      isNotified: g.guarantee_is_notified,
      descripcion: `La garantía ${g.guarantee_number} venció el ${new Date(
        
        g.guarantee_expiration_date
      ).toLocaleDateString('es-CR')}`,
      type: "expired",
      updateFn: async () => {
        // Marcar como vista
        await updateGuarantee(g.cod_guarantee, { guarantee_is_notified: 2 }); // 3 = vencida vista
        // Eliminar del array de notificaciones
        const index = notifications.findIndex(n => n.id === g.cod_guarantee);
        if (index !== -1) notifications.splice(index, 1);
      },
    }));
  } catch (err) {
    console.error("Error trayendo notificaciones de garantías vencidas:", err);
    return [];
  }
};

// 🔹 Función que llama a todos los fetchers y devuelve un array combinado
export const fetchAllNotifications = async () => {
  try {
    const upcoming = await fetchGuaranteeNotifications();
    const expired = await fetchExpiredGuaranteeNotifications();
    // Sobrescribir array global
    notifications.splice(0, notifications.length, ...upcoming, ...expired);
    return [...notifications];
  } catch (err) {
    console.error("Error fetching all notifications:", err);
    return [];
  }
};

// 🔹 Marcar todas como leídas
export const markAllAsRead = async () => {
  const promises = notifications.map(n => n.updateFn?.());
  await Promise.all(promises);
  // Limpiar array de notificaciones
  notifications.splice(0, notifications.length);
};

// 🔹 Obtener el array ya llenado (opcional)
export const getAllNotifications = () => [...notifications];
