import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import DeleteIcon from "@mui/icons-material/Delete";

function ModalElimination({ message, onClick, confirmText="Eliminar", disabled = false }) {
    const handleDelete = async () => {
        if (disabled) return; // bloqueamos si está deshabilitado

        const result = await Swal.fire({
            title: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#3085d6",
            confirmButtonText: confirmText,
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            onClick();
        }
    };

    return (
        <button
            onClick={handleDelete}
            aria-label="Eliminar boton"
            disabled={disabled} // deshabilita interacciones nativas
            className={`text-red-500 transition p-2 rounded-full hover:bg-red-50 flex items-center justify-center 
                        ${disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-red-500' : 'hover:text-red-700'}`}
        >
            <DeleteIcon />
        </button>
    );
}


export default ModalElimination;