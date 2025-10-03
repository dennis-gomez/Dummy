import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function NotificationDrawer({ open, onClose, notifications, setNotifications }) {

  // Marcar una notificación como leída
  const handleMarkAsRead = async (notif) => {
    if (notif.updateFn) await notif.updateFn(); // actualizar backend
    setNotifications(prev => prev.filter(n => n.id !== notif.id)); // eliminar del estado
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    await Promise.all(notifications.map(n => n.updateFn?.()));
    setNotifications([]); // vaciar lista
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, display: "flex", flexDirection: "column", height: "100%" }}>
        { 
          notifications.length > 0 && (
            <Box sx={{ p: 2, borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">Notificaciones</Typography>
              <Button size="small" onClick={handleMarkAllAsRead}>Marcar todas</Button>
            </Box>
          )
        }
        <List sx={{ flexGrow: 1 }}>
          {notifications.length === 0 && (
            <Typography sx={{ p: 2, color: "text.secondary" }}>No hay notificaciones</Typography>
          )}

          {notifications.map((n) => (
            <React.Fragment key={n.id}>
              <ListItem disablePadding>
                <ListItemButton sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <ListItemText 
                    primary={n.titulo} 
                    secondary={n.descripcion} 
                    sx={{ opacity: n.isNotified === 2 ? 0.5 : 1 }} 
                  />
                  {(n.isNotified === 1 || n.isNotified === 3) && (
  <Button size="small" onClick={() => handleMarkAsRead(n)}>✔ Visto</Button>
)}
                </ListItemButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
