import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidated";
import { useState, useEffect } from "react";

function FormTI({ fields, onSubmit, titleBtn, onCancel, values, funct }) {

    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
    );

    const [errors, setErrors] = useState({});
    const [isUnique, setIsUnique] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "it_inventory_asset_category_code" && funct) {
        funct(value);
        }
    };

    const handleError = (name, errorMessage) => {
        setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.values(errors).every((err) => !err)) {
        onSubmit(formData);
        }
    };

    const hasError = Object.values(errors).some((err) => !!err);

    const [showEquipmentFields, setShowEquipmentFields] = useState(false);

    const equipmentFields = [
        "it_inventory_so_item_code",
        "it_inventory_RAM",
        "it_inventory_disk_capacity",
        "it_inventory_processor",
    ];

    useEffect(() => {
        const category = formData.it_inventory_asset_category_code;
        setShowEquipmentFields(category === "1" || category === 1);
    }, [formData.it_inventory_asset_category_code]);

    return (
        <Box sx={{ p: 3, margin: "0 auto", maxWidth: 850, mt: 3 }}>
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            {fields.map((field) => {

                if (equipmentFields.includes(field.name) && !showEquipmentFields) return null;

                const xs = field.grid || (field.type === "textarea" ? 12 : 4);

                return (
                <Grid item xs={xs} key={field.name}>
                    <InputValidated
                    name={field.name}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onError={handleError}
                    options={field.options}
                    multiline={field.type === "textarea"}
                    rows={field.type === "textarea" ? 3 : undefined}
                    sx={{
                        "& .MuiInputBase-root": { backgroundColor: "#fff !important" },
                        ...(field.width ? { width: field.width } : {}),
                    }}
                    required={field.required ?? true}
                    restriction={field.restriction || ""}
                    validations={field.validations}
                    setIsUnique={setIsUnique}
                    uniqueValues={values || []}
                    currentId={field.currentId || null}
                    formValues={formData}
                    />
                </Grid>
                );
            })}
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}>
            {onCancel && (
                <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition border border-gray-300"
                >
                Cancelar
                </button>
            )}
            <Button
                text={titleBtn}
                onClick={handleSubmit}
                disabled={hasError || !isUnique}
                type="submit"
            />
            </Box>
        </form>
        </Box>
    );
}

export default FormTI;
