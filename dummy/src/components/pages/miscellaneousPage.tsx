import React, { useMemo, useState, useEffect } from "react";
import TableMiscellaneousPage from "../TableMiscellaneousPage";
import TableOptionServices from "../tableOptionService";
import TableSubcategorie from "../tableSubCategorie";

// ------------------ Tipos ------------------
interface Categoria {
  cod_abue: number;
  nom_abue: string;
}

interface Subcategoria {
  cod_sub: string;
  nom_sub: string;
}

interface Detalle {
  cod_det: string;
  nom_det: string;
}

// ------------------ Componente principal ------------------
function MiscellaneousPage() {
  // --- Categorías (tabla 1)
  const categorias: Categoria[] = useMemo(
    () => [
      { cod_abue: 1, nom_abue: "vehiculo" },
      { cod_abue: 2, nom_abue: "Libros" },
      { cod_abue: 3, nom_abue: "Mantenimiento Vehiculo" },
      { cod_abue: 4, nom_abue: "Mantenimiento Edificio" },
      { cod_abue: 5, nom_abue: "Suministros comida" },
      { cod_abue: 6, nom_abue: "sumin oficina" },
      { cod_abue: 7, nom_abue: "Sumin TI" },
    ],
    []
  );

  // --- Subcategorías por categoría (tabla 2)
  const subcategoriasPorCat: Record<number, Subcategoria[]> = useMemo(
    () => ({
      1: [
        { cod_sub: "1.1", nom_sub: "Combustible" },
        { cod_sub: "1.2", nom_sub: "Llantas" },
        { cod_sub: "1.3", nom_sub: "Seguros" },
      ],
      2: [
        { cod_sub: "2.1", nom_sub: "Técnicos" },
        { cod_sub: "2.2", nom_sub: "Novela" },
        { cod_sub: "2.3", nom_sub: "Educativos" },
      ],
      3: [
        { cod_sub: "3.1", nom_sub: "Aceite" },
        { cod_sub: "3.2", nom_sub: "Frenos" },
      ],
      4: [
        { cod_sub: "4.1", nom_sub: "Pintura" },
        { cod_sub: "4.2", nom_sub: "Electricidad" },
        { cod_sub: "4.3", nom_sub: "Plomería" },
      ],
      5: [
        { cod_sub: "5.1", nom_sub: "Café" },
        { cod_sub: "5.2", nom_sub: "Snacks" },
      ],
      6: [
        { cod_sub: "6.1", nom_sub: "Papelería" },
        { cod_sub: "6.2", nom_sub: "Mobiliario" },
      ],
      7: [
        { cod_sub: "7.1", nom_sub: "Licencias" },
        { cod_sub: "7.2", nom_sub: "Soporte" },
        { cod_sub: "7.3", nom_sub: "Nube" },
      ],
    }),
    []
  );

  // --- Detalles por subcategoría (tabla 3)
  const detallesPorSubcat: Record<string, Detalle[]> = useMemo(
    () => ({
      "1.1": [
        { cod_det: "1.1.1", nom_det: "Gasolina Regular 91" },
        { cod_det: "1.1.2", nom_det: "Gasolina Súper 95" },
        { cod_det: "1.1.3", nom_det: "Diésel Bajo Azufre" },
      ],
      "1.2": [
        { cod_det: "1.2.1", nom_det: "Cambio de llanta" },
        { cod_det: "1.2.2", nom_det: "Alineación" },
        { cod_det: "1.2.3", nom_det: "Balanceo" },
      ],
      "3.1": [
        { cod_det: "3.1.1", nom_det: "Aceite Mineral 20W-50" },
        { cod_det: "3.1.2", nom_det: "Aceite Semi-Sintético 10W-40" },
        { cod_det: "3.1.3", nom_det: "Aceite Sintético 5W-30" },
      ],
      "3.2": [
        { cod_det: "3.2.1", nom_det: "Pastillas delanteras" },
        { cod_det: "3.2.2", nom_det: "Pastillas traseras" },
        { cod_det: "3.2.3", nom_det: "Líquido de frenos DOT4" },
      ],
      "4.1": [
        { cod_det: "4.1.1", nom_det: "Pintura látex interior" },
        { cod_det: "4.1.2", nom_det: "Esmalte al agua" },
      ],
      "4.2": [
        { cod_det: "4.2.1", nom_det: "Cable THHN" },
        { cod_det: "4.2.2", nom_det: "Interruptor termomagnético" },
      ],
      "4.3": [
        { cod_det: "4.3.1", nom_det: "Tubos PVC" },
        { cod_det: "4.3.2", nom_det: "Llaves de paso" },
      ],
    }),
    []
  );

  // --- Estados de selección
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [selectedSubCod, setSelectedSubCod] = useState<string | null>(null);

  // Reset subcategoría al cambiar categoría
  useEffect(() => {
    setSelectedSubCod(null);
  }, [selectedCatId]);

  // Derivados
  const selectedCategoria: Categoria | null =
    categorias.find((c) => c.cod_abue === selectedCatId) || null;

  const subcategorias: Subcategoria[] = selectedCatId
    ? subcategoriasPorCat[selectedCatId] || []
    : [];

  const selectedSub: Subcategoria | null =
    selectedSubCod && subcategorias.length
      ? subcategorias.find((s) => s.cod_sub === selectedSubCod) || null
      : null;

  const detalles: Detalle[] =
    selectedSubCod && detallesPorSubcat[selectedSubCod]
      ? detallesPorSubcat[selectedSubCod]
      : [];

  return (
    <div style={{ padding: 24 }}>
      <style>{`
        .tables-flex {
          display: flex;
          gap: 24px;
          align-items: flex-start;
          overflow-x: auto;
        }
        .panel {
          flex: 1;
          min-width: 340px;
        }
      `}</style>

      <div className="tables-flex">
        {/* Panel 1: Categorías */}
        <div className="panel">
          <TableMiscellaneousPage
            categorias={categorias}
            selectedId={selectedCatId}
            onSelect={setSelectedCatId}
          />
        </div>

        {/* Panel 2: Subcategorías */}
        {selectedCatId && (
          <div className="panel">
            <TableOptionServices
              categoria={selectedCategoria}
              subcategorias={subcategorias}
              onClose={() => setSelectedCatId(null)}
              onSelectSub={setSelectedSubCod}
            />
          </div>
        )}

        {/* Panel 3: Detalles */}
        {selectedSub && (
          <div className="panel">
            <TableSubcategorie
              subcategoria={selectedSub}
              detalles={detalles}
              onClose={() => setSelectedSubCod(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default MiscellaneousPage;
