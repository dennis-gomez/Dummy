import Swal from "sweetalert2"

const allowIcons = ['success', 'error', 'warning', 'info', 'question'];

function ModalAlert( title, text, icon ) {
    const safeIcon = allowIcons.includes(icon) ? icon : 'info';

    Swal.fire({
        title: {title},
        text: {text},
        icon: {safeIcon},
        confirmButtonText: 'Aceptar'
    });
}

export default ModalAlert;