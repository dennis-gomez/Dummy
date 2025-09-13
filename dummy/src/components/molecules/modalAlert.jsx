import Swal from "sweetalert2"

const allowIcons = ['success', 'error', 'warning', 'info', 'question'];

function ModalAlert( title, text, icon, timeout = 4000) {
    const safeIcon = allowIcons.includes(icon) ? icon : 'info';
    Swal.fire({
        title: title,
        text: text,
        icon: safeIcon,
        showConfirmButton: false,
        timer: timeout,
        timerProgressBar: true,
    });
}

export default ModalAlert;