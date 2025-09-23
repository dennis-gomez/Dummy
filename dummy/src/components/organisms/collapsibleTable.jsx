import { useState } from "react";
import Row from "./Row";
import Seeker from "../molecules/seeker";
import { CircularProgress } from "@mui/material";
import Button from "../atoms/button";

export default function CollapsibleTable({
  list,
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

  const [searchText, setSearchText] = useState("");
  const [searchFeature, setSearchFeature] = useState(() => searchFields?.[0]?.name || "");

  const getButtonName = () => {
    if (isCreatingMedicKit ) return "Cancelar";
    if (isCreatingSupply) return "Cancelar";
    return "Agregar Botiquín";
  };



  return (
    <div className="p-6 mt-6 bg-white rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lista de Botiquines</h2>
      
      {/* Contenedor del buscador y botón */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 mx-4">
          {isLoading ? (
            <div className="flex flex-wrap items-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-3xl mx-auto">
              <p className="text-gray-700 font-medium mb-2">Cargando botiquines...</p>
              <CircularProgress />
            </div>
          ) : (
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
          )}
        </div>
      
  <Button text={getButtonName()} onClick={onAddClick} />

      </div>

      {/* ✅ AQUÍ ESTÁ EL MENSAJE CON EL CONTENEDOR GRIS */}
      {list.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay botiquines registrados
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tl-xl">#</th>
                {tittles.map((col) => (
                  <th
                    key={col.key}
                    className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tr-xl">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <Row
                  key={item[tittles[0].key]}
                  item={item}
                  index={index}
                  tittles={tittles}
                  subTitle={subTitle}
                  subfields={subfields}
                  onExpand={handleExpand}
                  isOpen={item[tittles[0].key] === openRowId}
                  suppliesList={item[tittles[0].key] === medicKitSelectedId ? suppliesList : []}
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