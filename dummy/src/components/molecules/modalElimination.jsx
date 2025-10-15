import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import DeleteIcon from "@mui/icons-material/Delete";

function ModalElimination({ message, onClick, confirmText="Eliminar" }) {
    const handleDelete = async () => {
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
        <>
            <button
                onClick={handleDelete}
                aria-label="Eliminar vehículo"
                className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
            >
                <DeleteIcon />
            </button>
        </>
    );
}

export default ModalElimination;