import { getNotifiedGuarantees, updateGuarantee, getExpiredGuarantees } from "./guaranteeService";
import { getNotifiedRevisions, updateRevision } from "./pmRevisionService";
import { getNotifiedExtinguishers, updateExtinguisher } from "./extinguisherService";
import { getMaintenanceNotifications, updateVehicleNotification } from "./vehicleService";
import { formatDateDDMMYYYY } from "../utils/generalUtilities";

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

export const fetchRevisionNotifications = async () => {
  try {
    const revisions = await getNotifiedRevisions();
    return revisions.map(r => {
      const areaCategoryName = r.areaCategory?.category_name || "N/A";
      const areaItemName = r.areaItem?.item_name || "N/A";

      return {
        id: `revision-${r.cod_revision}`, // prefijo para diferenciar IDs
        titulo: `Mantenimiento Preventivo: ${areaCategoryName}`,
        isNotified: r.revision_is_notified,
        descripcion: `La fecha de seguimiento propuesta para el mantenimento de "${areaItemName}", esta programada para el ${formatDateDDMMYYYY(r.revision_date_follow_up)}. Responsable: ${r.revision_responsible_name}`,
        type: "upcoming-revision",
        updateFn: async () => {
          // Marcar como vista
          await updateRevision(r.cod_revision, { revision_is_notified: 2 }); // 2 = vista
          // Eliminar del array de notificaciones
          const index = notifications.findIndex(n => n.id === `revision-${r.cod_revision}`);
          if (index !== -1) notifications.splice(index, 1);
        },
      };
    });
  } catch (err) {
    console.error("Error trayendo notificaciones de revisiones próximas:", err);
    return [];
  }
}

export const fetchExtinguisherNotifications = async () => {
  try {
    const extinguishers = await getNotifiedExtinguishers();
    return extinguishers.map(r => {

      return {
        id: `extinguisher-${r.cod_extinguisher}`, // prefijo para diferenciar IDs
        titulo: `Extintor: ${r.extinguisher_serial_number}`,
        isNotified: r.extinguisher_is_notified,
        descripcion: `El extintor marca "${r.extinguisher_brand}", tipo "${r.extinguisher_type}" caduca el ${formatDateDDMMYYYY(r.extinguisher_next_date_inspection)}.`,
        type: "upcoming-extinguisher",
        updateFn: async () => {
          // Marcar como vista
          await updateExtinguisher(r.cod_extinguisher, { extinguisher_is_notified: 2 }); // 2 = vista
          // Eliminar del array de notificaciones
          const index = notifications.findIndex(n => n.id === `extinguisher-${r.cod_extinguisher}`);
          if (index !== -1) notifications.splice(index, 1);
        },
      };
    });
  } catch (err) {
    console.error("Error trayendo notificaciones de extintores próximas:", err);
    return [];
  }
}

//notificaciones de mantenimientos de vehiculos
export const fetchVehicleMaintenancesNotifications = async () => {
  try{
    console.log("notificacion? ")
    const maintenances = await getMaintenanceNotifications();
    console.log(maintenances)
    return maintenances.map( m => {
      return {
        id: `vehicle-${m.cod_vehicle}`,
        titulo: `Mantenimiento para vehículo`,
        descripcion: `El vehículo ${m.vehicle_brand}, modelo ${m.vehicle_model} y placa ${m.vehicle_plate}, superó el kilometraje establacido para su revisión.`, 
        isNotified: m.vehicle_is_notified,
        updateFn: async () => {
            // Marcar como vista
            await updateVehicleNotification(m.cod_vehicle, { vehicle_is_notified: 2 }); // 2 = vista
            // Eliminar del array de notificaciones
            const index = notifications.findIndex(n => n.id ===  `vehicle-${m.cod_vehicle}`);
            if (index !== -1) notifications.splice(index, 1);
        },
      };
    });
  } catch (err) {
    console.error("Error trayendo notificaciones de revisiones próximas:", err);
    return [];
  }
};


// 🔹 Función que llama a todos los fetchers y devuelve un array combinado
export const fetchAllNotifications = async () => {
  try {
    const upcoming = await fetchGuaranteeNotifications();
    const expired = await fetchExpiredGuaranteeNotifications();
    const upcomingRevisions = await fetchRevisionNotifications();
    const upcomingExtinguishers = await fetchExtinguisherNotifications();
    const vehicleMaintenances = await fetchVehicleMaintenancesNotifications();
    // Sobrescribir array global
    notifications.splice(0, notifications.length, ...upcoming, ...expired, ...upcomingRevisions, ...upcomingExtinguishers, ...vehicleMaintenances);
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
