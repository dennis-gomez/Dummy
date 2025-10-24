import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import SaveIcon from "@mui/icons-material/Save"; // Importamos el ícono

function ModalConfirmation({ 
  message, 
  onClick, 
  confirmText = "Guardar", 
  cancelText = "Cancelar",
  disabled = false,
  title = "Confirmar Guardado",
  icon = "question",
  confirmButtonColor = "#3085d6",
  buttonVariant = "success"
}) {
  const handleConfirm = async () => {
    if (disabled) return;

    const result = await Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmButtonColor,
      cancelButtonColor: "#6c757d",
      confirmButtonText: confirmText,
      cancelButtonText: cancelText
    });

    if (result.isConfirmed) {
      onClick();
    }
  };

  // Colores según la variante
  const buttonStyles = {
    primary: "bg-blue-600 hover:bg-blue-700",
    success: "bg-green-500 hover:bg-green-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    danger: "bg-red-500 hover:bg-red-600"
  };

  return (
    <button
      onClick={handleConfirm}
      aria-label="Confirmar acción"
      disabled={disabled}
      className={` className="bg-blue-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-300 ${
        buttonStyles[buttonVariant] || buttonStyles.primary
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <SaveIcon fontSize="small" />
      {confirmText}
    </button>
  );
}

export default ModalConfirmation;