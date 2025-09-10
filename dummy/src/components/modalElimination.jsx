import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Button from "./atoms/buttons";

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
            Swal.fire("Eliminado", "El elemento ha sido eliminado.", "success");
        }
    };

    return (
        <>
            <Button text="Eliminar" onClick={handleDelete} color="primary" />
        </>
    );
}

export default ModalElimination;