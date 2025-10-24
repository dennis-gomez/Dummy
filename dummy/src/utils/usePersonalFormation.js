import { useState } from "react";

export const usePersonalFormation = () => {
    const [showFormation, setShowFormation] = useState(false); //variable para manejo de estados de fromaciones
    const [person, setPerson] = useState([]); //persona seleccionada

    /*
    * Ejecucion cuando quiera abrir componente de formaciones
    */
    const handleOpenFormation = async (p) => {
        setShowFormation(true);
        setPerson(p);
    }

    /*
    * Ejecucion cuando quiere cerrar componente de formaciones
    */
    const handleCloseFormation = async () => {
        setShowFormation(false);
        setPerson(null);
    }

    return {
        person, //persona para mostar infromacion
        showFormation, //estado para mostrar o no la infromacion del personal
        handleOpenFormation, 
        handleCloseFormation,
    }
}