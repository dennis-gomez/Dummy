import { useState } from "react";
import Row from "./Row";

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
  changeStateSupply
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
    }
  };

  return (
    <div className="p-6 mt-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gestión de Kits Médicos</h2>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
              <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tl-xl">
                Expandir
              </th>
              {tittles.map((col) => (
                <th
                  key={col.key}
                  className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="py-4 px-6 text-center font-semibold text-sm uppercase tracking-wider rounded-tr-xl">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <Row
                key={item[tittles[0].key]}
                item={item}
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
    </div>
  );
}
