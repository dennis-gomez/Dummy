import Button from "../atoms/button";
import { Divider, Typography, Grid } from "@mui/material";
import ProfilePage from "../pages/profilePage";

function PersonalFormation({ person, handleCloseFormation }) {
    return (
        <div style={{ padding: 24 }}>
            <div style={{ position: "relative", marginBottom: 16 }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", color: "#1f2937", textAlign: "center" }}
                >
                    Información de {person.personal_first_name} {person.personal_last_name_1}{" "}
                    {person.personal_last_name_2 || ""}
                </Typography>
                <div style={{ position: "absolute", right: 0, top: 0 }}>
                    <Button onClick={handleCloseFormation} text="Volver" />
                </div>
            </div>
            <Divider sx={{ mb: 2 }} />
            <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ textAlign: "center" }}
            >
                <Grid item xs={12} md="auto">
                    <Typography variant="body2">
                        <strong>Identificación:</strong> {person.personal_identification}
                    </Typography>
                </Grid>

                <Grid item xs={12} md="auto">
                    <Typography variant="body2">
                        <strong>Teléfono:</strong> {person.personal_phone_number}
                    </Typography>
                </Grid>

                <Grid item xs={12} md="auto">
                    <Typography variant="body2">
                        <strong>País de residencia:</strong> {person.personal_country_of_residence}
                    </Typography>
                </Grid>

                <Grid item xs={12} md="auto">
                    <Typography variant="body2">
                        <strong>Fecha de nacimiento:</strong>{" "}
                        {new Date(person.personal_birth_date).toLocaleDateString("es-CR")}
                    </Typography>
                </Grid>

                <Grid item xs={12} md="auto">
                    <Typography variant="body2">
                        <strong>Firma digital:</strong>{" "}
                        {person.personal_has_digital_signature ? "Sí" : "No"}
                    </Typography>
                </Grid>
            </Grid>

            <ProfilePage
                personCod={person.personal_cod}

            />


            {/*  Aqui ingresa los perfiles y componentes de idiomas y etc pa  */}
        </div>
    );
}

export default PersonalFormation;
