import { useState } from "react";
import Row from "./row";
import Seeker from "../molecules/seeker";
import { CircularProgress, Box } from "@mui/material";
import Button from "../atoms/button";

export default function CollapsibleTable({
  list = [],
  tittles,
  subTitle,
  subfields,
  suppliesList,
  medicKitSelectedId,
  onSelect,
  onDeleteMedicKit,
  onDeleteSupply,
  onEditMedicKit,
  onEditSupply,
  changeStateSupply,
  setIsCreatingMedicKit,
  searchFields,
  handleSearch,
  isLoading = false,
  isCreatingMedicKit,
  isCreatingSupply,
  onAddClick,
}) {
  const [openRowId, setOpenRowId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState(
    () => searchFields?.[0]?.name || ""
  );

  const handleExpand = (id) => {
    const closing = openRowId === id;
    setOpenRowId(closing ? null : id);

    if (!closing && typeof onSelect === "function") {
      onSelect(id);
    }
    if (closing) {
      changeStateSupply(false);
      setIsCreatingMedicKit(false);
    }
  };

  const getButtonName = () => {
    if (isCreatingMedicKit || isCreatingSupply) return "Cancelar";
    return "Agregar Botiquín";
  };

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">
      {/* Contenedor buscador + botón */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-5xl mx-auto mb-4">
        {/* Columna 1: Buscador */}
        <Box className="flex flex-wrap gap-3 bg-white rounded-xl p-4 flex-1">
         
            <Seeker
              inputName="searchText"
              inputPlaceholder="Buscar botiquín o suplemento"
              btnName="Buscar"
              valueText={searchText}
              valueFeature={searchFeature}
              onChangeText={setSearchText}
              onChangeFeature={setSearchFeature}
              onClick={handleSearch}
              selectName="Filtrar por"
              fields={searchFields}
            />
        </Box>

        {/* Columna 2: Botón Agregar/Cancelar */}
        <div className="flex items-center justify-center lg:justify-start w-full sm:w-auto">
          <div className="p-4 h-fit">
            <Button
              text={getButtonName()}
              onClick={onAddClick}
              className="h-12 w-full sm:w-48 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Mensaje cuando no hay registros o loading */}
      {isLoading ? (
        <div className="flex flex-wrap items-center justify-center gap-3 bg-white shadow-md rounded-2xl px-4 py-6 w-full max-w-3xl mx-auto">
          <CircularProgress size={24} />
          <span>Cargando botiquines...</span>
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay botiquines registrados
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl">
                  #
                </th>
                {tittles.slice(1).map((col) => (
                  <th
                    key={col.key}
                    className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <Row
                  key={item.cod_medic_kit}
                  item={item}
                  index={index}
                  tittles={tittles.slice(1)}
                  id={item.cod_medic_kit}
                  subTitle={subTitle}
                  subfields={subfields}
                  onExpand={handleExpand}
                  isOpen={item.cod_medic_kit === openRowId}
                  suppliesList={
                    item.cod_medic_kit === medicKitSelectedId ? suppliesList : []
                  }
                  onDeleteMedicKit={onDeleteMedicKit}
                  onDeleteSupply={onDeleteSupply}
                  onEditMedicKit={onEditMedicKit}
                  onEditSupply={onEditSupply}
                  changeStateSupply={changeStateSupply}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
