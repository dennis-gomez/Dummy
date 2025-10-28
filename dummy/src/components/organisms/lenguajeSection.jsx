import { React, useState } from "react";
import Button from "../atoms/button";
import { Box } from "@mui/material";
import { ValidateValues } from "../../utils/validateValues";
import EditIcon from "@mui/icons-material/Edit";
import ModalElimination from "../molecules/modalElimination";
import Form from "../organisms/form";
import { useLanguage } from "../../utils/useLenguajes";
import { useEffect } from "react";
import InputValidated from "../atoms/inputValidated";


const lenguajeSection = ({ personCod }) => {

  const {
    optionsLanguages,
    languages,
    fields,
    isAddingLanguage,
    setIsAddingLanguage,
    addLanguage,
    editLanguage,
    deleteLanguage,
    fetchLanguageOptions,
    fetchLanguages,
    fetchAvailableLanguages,
    loading,
  } = useLanguage();

  useEffect(() => {
    fetchLanguageOptions();
    fetchLanguages(personCod);
    fetchAvailableLanguages(personCod);
  }, [personCod]);

  console.log("languages in LenguajeSection:", languages);
  console.log("optionsLanguages in LenguajeSection:", optionsLanguages);

  const add = (data) => {
    addLanguage(data, personCod);
    setIsAddingLanguage(false);
  }

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const whiteInputStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#ffffff",
      overflow: "auto",
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: "blue",
      },
    },
    "& .MuiFormHelperText-root.Mui-error": {
      color: "blue",
    },
    "& .MuiInputLabel-root.Mui-error": {
      color: "inherit",
    },
  };

  const saveEdit = () => {
    editLanguage(editingId, editData, personCod);
    setEditingId(null);
    setEditData({});
    setEditErrors({});
  }


  const getRoleLabel = (leng) => {
    const role = optionsLanguages.find(
      (opt) => opt.cod_item === leng.language_item_cod
    );

    return role ? `${role.item_name}` : "Lenguaje desconocido";
  };

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center", // centra todo el bloque
          alignItems: "center",
          gap: "12px", // espacio entre el texto y el botón
          marginBottom: "16px",

        }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-0">lenguajes</h1>

      </div>
      {!languages || languages.length === 0 ? (
        <div className="flex justify-center items-center h-32">
          <h1 className="text-2xl font-bold text-gray-800 mb-0">
            No hay perfiles disponibles.
          </h1>
        </div>
      ) : (
        loading ? (

          <div className="flex justify-center items-center h-32">
            <h1 className="text-2xl font-bold text-gray-800 mb-0">
              Cargando...
            </h1>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-7xl mx-auto mt-6">
            {languages.map((leng) => {
              const isEditing = editingId === leng[fields[0].name];

              return (
                <div
                  key={leng.language_cod}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
                >
                  {/* ----------- MODO VISUAL ----------- */}
                  {!isEditing ? (

                    <>
                      <div className="text-lg font-medium text-gray-800">
                        {getRoleLabel(leng)}:{" "}
                        <span className="font-normal">{leng.language_level}</span>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setEditingId(leng.language_cod);
                            setEditData({ ...leng }); // copiar los datos actuales
                            setEditErrors({});
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          <EditIcon />
                        </button>

                        <ModalElimination
                          message={`¿Estás seguro de que deseas eliminar el lenguaje: ${getRoleLabel(
                            leng
                          )}?`}
                          onClick={() => deleteLanguage(leng.language_cod, personCod)}
                        />
                      </div>
                    </>


                  ) : (
                    /* ----------- MODO EDICIÓN ----------- */
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                        <div className="text-lg font-medium text-gray-800 flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                          <span>{getRoleLabel(leng)}:</span>

                          <InputValidated
                            name="language_level"
                            type="select"
                            value={editData.language_level || leng.language_level || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              setEditData({ ...editData, language_level: value });
                              setEditErrors((prev) => ({
                                ...prev,
                                language_level: !value ? "Seleccione un nivel" : "",
                              }));
                            }}
                            options={fields[2].options} // niveles de dominio
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                backgroundColor: "#fff",
                                width: "100%", // ✅ se adapta al ancho disponible
                                minHeight: "2.5rem",
                              },
                            }}
                          />
                        </div>
                      </div>

                      {editErrors.language_level && (
                        <span className="text-sm text-red-600 mt-1">
                          {editErrors.language_level}
                        </span>
                      )}
                    </div>

                  )}

                </div>
              );
            })}

          </div >
        )
      )}

      {editingId ? (

        <div className="flex justify-center space-x-4 mt-4">
          <Button
            text="Guardar"
            type="button"
            onClick={() => {
              saveEdit();
            }}
          />

          <Button
            text="Cancelar"
            type="button"
            onClick={() => {
              setEditingId(null);
              setEditData({});
              setEditErrors({});
            }}
          />
        </div>
      ) : (
        <>

          <div
            style={{
              display: "flex",
              justifyContent: "center", // centra todo el bloque
              alignItems: "center",
              gap: "12px", // espacio entre el texto y el botón
              marginBottom: "16px",
              marginLeft: "0px",

            }}
          >
            {isAddingLanguage && (
              <Box
                sx={{
                  maxWidth: 800,
                  margin: "20px auto",
                  p: 3,
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: "#d9d9d9",
                }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Agregar Nuevo Lenguage
                </h3>

                {fields[1].options.length === 0 ? (
                  <>
                    <div className="flex flex-col items-center justify-center text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        No hay lenguajes disponibles para asignar.
                      </h3>

                      <Button
                        text={isAddingLanguage ? "Cancelar" : "Agregar Lenguage"}
                        onClick={() => setIsAddingLanguage(!isAddingLanguage)}
                        type="button"

                      />
                    </div>

                  </>
                ) : (
                  <Form
                    titleBtn="Agregar"
                    fields={fields.slice(1)} // Excluir el campo de código
                    onCancel={() => setIsAddingLanguage(false)}
                    onSubmit={add}
                  />
                )}
              </Box>
            )}

          </div>
          {!isAddingLanguage &&
            <div className="flex justify-center space-x-4 mt-4">

              <Button
                text={"Agregar lenguaje"}
                onClick={() => setIsAddingLanguage(!isAddingLanguage)}

                type={"button"}
              />

            </div>
          }
        </>
      )

      }
    </div>
  );
};

export default lenguajeSection;
