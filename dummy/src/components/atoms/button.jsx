import { Button } from "@mui/material";

function ButtonP ({text, onClick, color, colorText, colorMouseOver}) {
    return (
        <Button
            onClick={onClick}
            sx={{
                backgroundColor: color, //color del fondo
                color: colorText, //color del texto
            }}
        >
            {text}
        </Button>
    );
}
export default ButtonP;