import { Fragment } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CircularProgress, Stack, Pagination, PaginationItem } from "@mui/material";
import { formatDateDDMMYYYY } from "../../utils/generalUtilities";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

const ResumeTableLicitationTable = ({
  fields,
  data,
  profileSummaries,

  isLoading,
  onExpand,
  expandedRows,
  selectedProfile,
  setSelectedProfile,
  onProfileSelect,

  // Paginación
  page,
  totalPages,
  onPageChange,
  openPDF,
}) => {


  const handleProfileSelect = (personCod, profileCod) => {
    setSelectedProfile((prev) => ({ ...prev, [personCod]: profileCod }));
    if (onProfileSelect) onProfileSelect(personCod, profileCod);
  };




  // 🔹 Componente reutilizable para mostrar cada tabla del resumen (luego lo saco de aca, por mientras aca esta)
  const SummaryTable = ({ title, items, columns }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-blue-600 mb-2">{title}</h3>
      {items && items.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm uppercase">
                {columns.map((col) => (
                  <th key={col.key} className="py-2 px-4 text-left">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 text-sm text-gray-800 transition"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-2 px-4">
                      {col.type === "date"
                        ? formatDateDDMMYYYY(row[col.key])
                        : col.type === "file" ? (
                          row.RutaPDF && (
                            <button
                              onClick={() => openPDF(row.RutaPDF)}
                              className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                              title="Ver PDF"
                            >
                              <LibraryBooksIcon />
                            </button>
                          )
                        ) :

                          row[col.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">No hay registros.</p>
      )}
    </div>
  );





  return (
    <div className="p-6 mt-6 bg-white rounded-2xl shadow-lg">
      {isLoading ? (
        <div className="flex items-center justify-center gap-3 bg-white shadow-md rounded-2xl px-4 py-3 w-full max-w-5xl mx-auto mb-4">
          <CircularProgress size={24} />
          <span className="text-gray-700 font-medium">Cargando personal...</span>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-lg w-full max-w-5xl mx-auto mb-4">
          No hay personal registrado.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg">
          <table className="min-w-full border-collapse">
            {/* Encabezado */}
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tl-xl">
                  #
                </th>
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider">
                  Expandir
                </th>
                {fields.map((f) => (
                  <th
                    key={f.name}
                    className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider"
                  >
                    {f.placeholder}
                  </th>
                ))}
                <th className="py-4 px-6 text-center font-semibold text-md capitalize tracking-wider rounded-tr-xl">
                  Perfiles
                </th>
              </tr>
            </thead>

            {/* Cuerpo */}
            <tbody>
              {data.map((person, index) => (
                <Fragment key={person.personal_cod}>
                  {/* Fila principal */}
                  <tr className="hover:bg-gray-100 transition-colors">
                    <td className="py-3 px-4 text-center font-medium">
                      {index + 1}
                    </td>

                    {/* Botón de expandir/colapsar */}
                    <td className="text-center">
                      <button
                        onClick={() => onExpand(person.personal_cod)}
                        className="p-2 rounded hover:bg-gray-200"
                      >
                        {expandedRows[person.personal_cod] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </button>
                    </td>

                    {/* Campos dinámicos */}
                    {fields.map((f) => (
                      <td
                        key={f.name}
                        className="py-3 px-4 text-center text-gray-700"
                      >
                        {f.type === "date"
                          ? formatDateDDMMYYYY(person[f.name])
                          : f.type === "select"
                            ? f.options?.find(
                              (opt) =>
                                String(opt.value) === String(person[f.name])
                            )?.label || ""
                            : person[f.name] || ""}
                      </td>
                    ))}

                    {/* Selector de perfiles */}
                    <td className="py-3 px-4 text-center">
                      <select
                        onChange={(e) =>
                          handleProfileSelect(person.personal_cod, e.target.value)
                        }
                        className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedProfile?.[person.personal_cod] || ""}
                      >
                        <option value="">Seleccionar Perfil</option>
                        {person.profiles?.map((profile) => (
                          <option
                            key={profile.profile_cod}
                            value={String(profile.profile_cod)}
                          >
                            {profile.Role.item_name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {/* Fila expandida */}
                  {expandedRows[person.personal_cod] && (
                    <tr className="bg-gray-50">
                      <td colSpan={fields.length + 3} className="p-6">
                        <div className="border border-gray-300 rounded-xl p-4 bg-white shadow-inner">
                          {!selectedProfile?.[person.personal_cod] ? (
                            <p className="text-gray-500 italic text-center">
                              Selecciona un perfil para ver el detalle.
                            </p>
                          ) : (
                            <>
                              {/* 🔹 Grado Académico */}
                              <SummaryTable
                                title="Grado Académico"
                                items={profileSummaries[person.personal_cod]?.academic || []}
                                columns={[
                                  { key: "NombreItem", label: "Grado" },
                                  { key: "Carrera", label: "Carrera" },
                                  { key: "Institucion", label: "Institución" },
                                  { key: "FechaInicio", label: "Inicio", type: "date" },
                                  { key: "FechaFin", label: "Fin", type: "date" },
                                  { key: "FechaObtencion", label: "Fecha Titulo", type: "date" },
                                  { key: "RutaPDF", label: "Título(PDF)", type: "file" },
                                ]}
                              />

                              {/* 🔹 Formación Especializada */}
                              <SummaryTable
                                title="Formación Especializada"
                                items={profileSummaries[person.personal_cod]?.training || []}
                                columns={[
                                  { key: "Numero" , label: "N°" },
                                  { key: "Nombre", label: "Curso" },
                                  { key: "Descripcion", label: "Descripción" },
                                  { key: "Institucion", label: "Institución" },
                                  { key: "HorasCurso", label: "Horas" },
                                  { key: "FechaInicio", label: "Inicio", type: "date" },
                                  { key: "FechaFin", label: "Fin", type: "date" },
                                  { key: "Vigencia", label: "Vigencia", type: "date" },
                                  { key: "RutaPDF", label: "Certificado(PDF)", type: "file" },
                                ]}
                              />

                              {/* 🔹 Proyectos Asociados */}
                              <SummaryTable
                                title="Proyectos Asociados"
                                items={profileSummaries[person.personal_cod]?.projects || []}
                                columns={[
                                  { key: "Empresa", label: "Empresa" },
                                  { key: "NombreItem", label: "Rol" },
                                  { key: "NombreProyecto", label: "Proyecto" },
                                  { key: "Cliente", label: "Cliente" },
                                  { key: "Sector", label: "Sector" },
                                  { key: "Descripcion", label: "Descripción" },
                                  { key: "Tecnologias", label: "Tecnologías" },
                                  { key: "FechaInicio", label: "Inicio", type: "date" },
                                  { key: "FechaFin", label: "Fin", type: "date" },
                                  { key: "Contacto", label: "Nombre del contacto" },
                                  { key: "ContactoCargo", label: "Cargo del contacto" },
                                  { key: "ContactoCorreo", label: "Correo del contacto" },
                                  { key: "ContactoTelefono", label: "Teléfono del contacto" }
                                ]}
                              />
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>

          <Stack spacing={2} alignItems="center" marginY={2}>
            <Pagination
              count={totalPages}
              page={page}
              color="primary"
              onChange={(e, value) => onPageChange(value)}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          </Stack>
        </div>
      )}
    </div>
  );
};

export default ResumeTableLicitationTable;
