import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "../atoms/button";
import InputValidated from "../atoms/inputValidated";
import InputValidatedDate from "../atoms/inputValidatedDate";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import InventaryTable from "./inventaryTable";
import ModalAlert from "../molecules/modalAlert";

function FormInventory({
  fields,
  onSubmit,
  values,
  checks,
  fetchAvaliableProducts,
  headers,
  useFullFields = [],
  tittle = "Agregar productos al inventario",
  warinig ="No hay productos disponibles para agregar al inventario.",
  addDetailToOrder = false,
  validations = true,
  havetoAdd=false,
}) {
  const [formData, setFormData] = useState(() => {
    const allFields = [...fields, ...useFullFields]; // combina ambos
    return allFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});
  });



  const [errors, setErrors] = useState({});
  const [isUnique, setIsUnique] = useState(true);
  const [tempSelectedProducts, setTempSelectedProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

const desactivateFinalButton = () =>{

 

if (selectedProducts.length === 0) {
  return true;
}

 if(!validations){

//validar que tanto la fecha como el proveedor esten llenos y no presenten errores.
if(!formData.order_date || !formData.order_supplier_code){
  return true;
}else{
   return false;
}
 }

}

  const handleEditList = (list) => {

    const updatedList = selectedProducts.map((item) =>
      item.cod_item === list.product_cod_item &&
        item.cod_category === list.product_cod_category
        ? {
          ...item,
          quantities: list.quantities,
          unit_prices: list.unit_prices,
        }
        : item
    );

    setSelectedProducts(updatedList);
  };


  const handleAdd = () => {
    for (const prod of selectedProducts) {

      if(havetoAdd){
//todo producto debe tener minimo 1 cantidad a guardar
      if (!prod.quantities.some(qty => qty > 0)) {
        ModalAlert("Error", "Cada producto debe tener al menos una cantidad mayor a cero.", "error");
        return;
      }
       
      }

      if (prod.unit_prices <= 0) {
        ModalAlert("Error", "Todos los precios unitarios deben ser mayores a cero.", "error");
        return;
      }
    }

    // ✅ Combinar formData con cada producto
    const updatedProducts = selectedProducts.map(prod => ({
      ...prod,
      ...formData, // agrega los datos del formulario a cada producto
    }));


    // Si tu onSubmit espera los productos actualizados:
    onSubmit(selectedProducts, formData);
  };


  const handleDelete = (cod_item, cod_product) => {
    const updatedList = selectedProducts.filter(
      (item) =>
        !(item.cod_item === cod_item && item.cod_category === cod_product)
    );
    setSelectedProducts(updatedList);
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e) => {

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if(addDetailToOrder){
    fetchAvaliableProducts(-1,value, "");
    }else{
    fetchAvaliableProducts(value, "");
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

  const handleCheckChange = (check, checked) => {
    const prod = {
      label: check.label,
      cod_item: check.value[0],
      cod_category: check.value[1],
      unit_prices: check.unit_price || 0,
    };

    if (checked) {
      setTempSelectedProducts((prev) => [...prev, prod]);
    } else {
      setTempSelectedProducts((prev) =>
        prev.filter(
          (p) =>
            !(p.cod_item === prod.cod_item && p.cod_category === prod.cod_category)
        )
      );
    }
  };
const handleSaveSelected = () => {
  const combined = [
    ...selectedProducts,
    ...tempSelectedProducts
      .filter(
        (temp) =>
          !selectedProducts.some(
            (saved) =>
              saved.cod_item === temp.cod_item &&
              saved.cod_category === temp.cod_category
          )
      )
      .map((temp) => ({
        ...temp,
        quantities: Array(headers.length).fill(0), // crea [0, 0, 0, ...] según headers
        unit_prices: temp.unit_prices ?? 0, // mantiene el precio si existe, o pone 0
      })),
  ];

  setSelectedProducts(combined);
  setTempSelectedProducts([]);
};



  return (
    <>
      {checks.length > 0 ? (
        <Box sx={{ p: 3, margin: "0 auto", maxWidth: 2000, mt: 3 }}>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* ========== CAMPOS DE FORMULARIO ========== */}
            <Grid container spacing={2}>
              {fields.map((field) => {
                const xs = field.grid || (field.type === "textarea" ? 12 : 2.4);
                return (
                  <Grid item xs={xs} key={field.name}>
                    {field.type === "date" ? (
                      <InputValidatedDate
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field.name]: e.target.value })
                        }
                        restriction={field.restriction || ""}
                        onError={handleError}
                        validations={field.validations}
                        sx={{
                          "& .MuiInputBase-root": {
                            backgroundColor: "#fff !important",
                          },
                          ...(field.width ? { width: field.width } : {}),
                        }}
                      />
                    ) : field.type === "select" ? (
                      <InputValidated
                        name={field.name}
                        type="select"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleSelectChange}
                        restriction={field.restriction || ""}
                        onError={handleError}
                        options={field.options}
                        sx={{
                          "& .MuiInputBase-input": {
                            backgroundColor: "#fff !important",

                          },
                          ...(field.width ? { width: field.width } : {}),
                        }}
                        required={field.required ?? false}
                      />
                    ) : field.type === "seeker" ? (
                      <Box sx={{ display: "flex", gap: 2, height: 20 }}>
                        <InputValidated
                          name={field.name}
                          type="text"
                          placeholder={field.placeHolder}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required={false}
                          sx={{
                            "& .MuiInputBase-root": {
                              backgroundColor: "#fff !important",

                            },
                            flex: 1,
                            ...(field.width ? { width: field.width } : {}),
                          }}
                        />
                        <Box sx={{height: 20 }}>
                          <Button
                            text="Buscar"
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, [field.name]: "" });
                              fetchAvaliableProducts(
                                formData.category || "0",
                                formData[field.name] || ""
                              )

                            }
                            }
                            sx={{ height: 20000, marginBottom:1000 }}
                          />
                        </Box>
                      </Box>
                    ) : (
                      <InputValidated
                        name={field.name}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onError={handleError}
                        multiline={field.type === "textarea"}
                        rows={field.type === "textarea" ? 3 : undefined}
                        sx={{
                          "& .MuiInputBase-root": {
                            backgroundColor: "#fff !important",
                          },
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
                    )}
                  </Grid>
                );
              })}
            </Grid>
{useFullFields.length > 0 && (
  <Box sx={{ mt: 3, mb: 2 }}>
    {useFullFields.map((field, index) =>
      field.type === "date" ? (
        <InputValidatedDate
          key={index}
          name={field.name}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChange={(e) =>
            setFormData({ ...formData, [field.name]: e.target.value })
          }
          restriction={field.restriction || ""}
          onError={handleError}
          validations={field.validations}
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "#fff !important",
            },
            ...(field.width ? { width: field.width } : {}),
            marginRight: 2,
            marginBottom: 2,
          }}
        />
      ) : (
        <InputValidated
          key={index}
          name={field.name}
          type={field.type || "text"}
          label={field.label}
          placeholder={field.placeholder}
          value={formData[field.name]}
          onChange={handleChange}
          onError={handleError}
          options={field.options}
          multiline={field.type === "textarea"}
          rows={field.type === "textarea" ? 3 : undefined}
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: "#fff !important",
            },
            ...(field.width ? { width: field.width } : {}),
            marginRight: 2,
            marginBottom: 2,
          }}
          required={field.required ?? true}
          restriction={field.restriction || ""}
          validations={field.validations}
          formValues={formData}
        />
      )
    )}
  </Box>
)}



            {/* ========== CHECKBOXES ========== */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 2,
                mt: 3,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                backgroundColor: "#fafafa",
              }}
            >
              {checks.map((check) => (
                <FormControlLabel
                  key={`${check.value[0]}-${check.value[1]}`}
                  control={
                    <Checkbox
                      checked={tempSelectedProducts.some(
                        (p) =>
                          p.cod_item === check.value[0] &&
                          p.cod_category === check.value[1]
                      )}
                      onChange={(e) =>
                        handleCheckChange(check, e.target.checked)
                      }
                      name={`${check.value[0]}-${check.value[1]}`}
                    />
                  }
                  label={check.label}
                />
              ))}
            </Box>

            {/* BOTÓN GUARDAR SELECCIONADOS */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                text="Guardar seleccionados"
                type="button"
                onClick={handleSaveSelected}
                disabled={tempSelectedProducts.length === 0}
                sx={{ minWidth: 220 }}
              />
            </Box>

            {/* ========== TABLA DE PRODUCTOS ========== */}
            {selectedProducts.length > 0 && (
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  backgroundColor: "#fdfdfd",
                }}
              >
                <InventaryTable
                  singularName="producto"
                  searchFields={[
                    { name: "product_name", placeholder: "Nombre" },
                    { name: "product_category", placeholder: "Categoría" },
                    { name: "product_code", placeholder: "Código" },
                  ]}
                  isCreatingInventory={false}
                  setIsCreatingInventory={() => { }}
                  isLoading={false}
                  data={selectedProducts.map((prod, idx) => ({
                    product_name: prod.label,
                    product_cod_item: prod.cod_item,
                    product_cod_category: prod.cod_category,
                    quantities: prod.quantities,   // 👈 importante
                    unit_prices: prod.unit_prices || 0, // 👈 importante
                    key: idx,
                  }))}

                  headers={headers}
                  onEdit={handleEditList}
                  deleteGuaranteOrReactivated={handleDelete}
                  seeSecker={false}
                />
              </Box>
            )}

            {/* BOTÓN FINAL */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                text={tittle}
                type="button"
                onClick={handleAdd}
                 disabled={desactivateFinalButton()}
                sx={{ minWidth: 220 }}
              />
            </Box>
          </form>
        </Box>
      ) : (
        <Box
          sx={{
            p: 3,
            margin: "0 auto",
            maxWidth: 850,
            mt: 3,
            textAlign: "center",
          }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            {warinig}
          </h3>
        </Box>
      )}
    </>
  );
}

export default FormInventory;