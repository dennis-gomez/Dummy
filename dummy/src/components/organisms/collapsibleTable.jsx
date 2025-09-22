import { useState } from "react";
import Row from "./Row";
import Button from "../atoms/button";
import Seeker from "../molecules/seeker";

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
  onAddClick,
  searchFields,
  handleSearch,
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

  // Función que decide el nombre del botón
  const getButtonName = () => {
    if (isCreatingMedicKit ) return "Cancelar";
    if (isCreatingSupply) return "Cancelar";
    return "Agregar Botiquín";
  };

  // Estados y funciones para el seeker
  const [searchText, setSearchText] = useState("");
const [searchFeature, setSearchFeature] = useState(() => searchFields?.[0]?.name || "");


  return (
    <div className="p-6 mt-6 bg-white rounded-2xl shadow-lg">
     <div className="flex justify-between items-center mb-6 gap-4">
  {/* Título */}
  <h2 className="text-2xl font-bold text-gray-800">
    Lista de Botiquines
  </h2>

  {/* Seeker */}
  <div className="flex-1 mx-4">
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
  </div>

  {/* Botón */}
  <Button text={getButtonName()} onClick={onAddClick} />
</div>


      {list.length === 0 ? (
        // ✅ Mismo mensaje que VehicleTable cuando no hay datos
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay botiquines registrados
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full"> {/* Cambié a min-w-full como VehicleTable */}
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