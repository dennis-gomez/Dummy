import React from "react";

const ResumeTable = ({ fields, data, tableName }) => {
  // Totales globales al final
  const globalTotals = {
    activas: 0,
    vencidas: 0,
    proximas_a_vencer: 0,
    dinero_activo: 0,
    dinero_por_vencer: 0,
    dinero_activo_usd: 0,
    dinero_por_vencer_usd: 0,
  };

  // Función para formatear números con separador de miles (puntos)
  const formatNumber = (num) => {
    if (num == null || isNaN(num)) return "-";
    return num
      .toLocaleString("de-DE", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
  };

  return (
    <div className="resume-table-container p-6 mt-6 bg-white rounded-2xl">
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg">
          No hay {tableName} registrados
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl w-12">
                  #
                </th>

                {fields.map((f) => (
                  <th
                    key={f.name}
                    className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider"
                    style={{ minWidth: "150px" }}
                  >
                    {f.label}
                  </th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                  Garantías Totales
                </th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                  Total USD
                </th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                  Total ₡
                </th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl"></th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => {
                // Totales por fila
                const totalGarantias = (row.activas ?? 0) + (row.vencidas ?? 0);
                const totalUSD = row.dinero_activo_usd ?? 0;
                const totalColones = row.dinero_activo ?? 0;

                // Acumular para totales globales
                globalTotals.activas += row.activas ?? 0;
                globalTotals.vencidas += row.vencidas ?? 0;
                globalTotals.proximas_a_vencer += row.proximas_a_vencer ?? 0;
                globalTotals.dinero_activo += row.dinero_activo ?? 0;
                globalTotals.dinero_por_vencer += row.dinero_por_vencer ?? 0;
                globalTotals.dinero_activo_usd += row.dinero_activo_usd ?? 0;
                globalTotals.dinero_por_vencer_usd +=
                  row.dinero_por_vencer_usd ?? 0;

                return (
                  <tr
                    key={row[fields[0].name] || index}
                    className={`hover:bg-blue-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-4 px-6 text-center">{index + 1}</td>
                    {fields.map((f) => (
                      <td key={f.name} className="py-4 px-6 text-center text-gray-700">
                        {typeof row[f.name] === "number"
                          ? formatNumber(row[f.name])
                          : row[f.name] ?? "-"}
                      </td>
                    ))}
                    <td className="py-4 px-6 text-center font-semibold">
                      {formatNumber(totalGarantias)}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold">
                      {formatNumber(totalUSD)}
                    </td>
                    <td className="py-4 px-6 text-center font-semibold">
                      {formatNumber(totalColones)}
                    </td>
                    <td></td>
                  </tr>
                );
              })}

              {/* Totales globales al final */}
              <tr className="bg-gray-200 font-semibold">
                <td className="py-4 px-6 text-center">Totales</td>
                {fields.map((f) => {
                  let val = "-";
                  if (f.name === "activas") val = globalTotals.activas;
                  if (f.name === "vencidas") val = globalTotals.vencidas;
                  if (f.name === "proximas_a_vencer")
                    val = globalTotals.proximas_a_vencer;
                  if (f.name === "dinero_activo") val = globalTotals.dinero_activo;
                  if (f.name === "dinero_por_vencer")
                    val = globalTotals.dinero_por_vencer;
                  if (f.name === "dinero_activo_usd")
                    val = globalTotals.dinero_activo_usd;
                  if (f.name === "dinero_por_vencer_usd")
                    val = globalTotals.dinero_por_vencer_usd;
                  return (
                    <td key={f.name} className="py-4 px-6 text-center">
                      {typeof val === "number" ? formatNumber(val) : val}
                    </td>
                  );
                })}
                <td className="py-4 px-6 text-center font-semibold">
                  {formatNumber(globalTotals.activas + globalTotals.vencidas)}
                </td>
                <td className="py-4 px-6 text-center font-semibold">
                  {formatNumber(globalTotals.dinero_activo_usd)}
                </td>
                <td className="py-4 px-6 text-center font-semibold">
                  {formatNumber(globalTotals.dinero_activo)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResumeTable;
