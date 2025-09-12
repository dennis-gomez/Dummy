import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

function ModalElimination({ message, onClick }) {
    const handleDelete = async () => {
        const result = await Swal.fire({
            title: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            onClick();
        }
    };

    return (
        <>
            <Button color="error" onClick={handleDelete} >
                <DeleteIcon />
            </Button>
        </>
    );
}

export default ModalElimination;