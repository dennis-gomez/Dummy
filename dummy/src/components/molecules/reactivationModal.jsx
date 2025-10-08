import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import RestoreIcon from "@mui/icons-material/Restore";


function reactivationModal({ message, onClick, }) {
    const handleReactivated = async () => {
        const result = await Swal.fire({
            title: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#35dc54ff",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Reactivar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            onClick();
        }
    };

    return (
        <>
            <button
                onClick={handleReactivated}
                aria-label="reactivar "
           className="text-green-500 hover:text-green-700 transition p-2 rounded-full hover:bg-green-50">
                <RestoreIcon />
            </button>
        </>
    );
}

export default reactivationModal;