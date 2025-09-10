import React, { useMemo, useState, useEffect } from "react";
import TableMiscellaneousPage from "../tableMiscellaneousPage";
import TableOptionServices from "../tableOptionService";
import TableSubcategorie from "../tableSubCategorie";
import { getServices } from "../../services/Service_service";
import { getCategorys } from "../../services/categoryService";
import { getItems } from "../../services/itemService";

// ------------------ Tipos ------------------
// (No interfaces, solo objetos JS)
function MiscellaneousPage() {
// ------------------ Componente principal ------------------
  // --- Categorías (tabla 1)
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])

  // --- Estados de selección
  const [selectedServCod, setSelectedServCod] = useState(null);
  const [selectedCatCod, setSelectedSubCod] = useState(null);

  // Reset subcategoría al cambiar categoría
  useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await getServices();
       
        setServices(services);
        
        console.log('services:', services);
    
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
      setSelectedSubCod(null);
    };
    fetchData();
  }, [selectedServCod]);

  // Derivados

const setSelectedServiceId = async (id) => {
  try{
setSelectedServCod(id);
 console.log('Selected service ID:', id);
const categories = await getCategorys(id);
setCategories(categories);
console.log('categories:', categories);

  }catch(error){
console.log('Error fetching categories:', error);
  }
}

const setSelectedCategoryId = async (id_category, id_service) => {
  try{
setSelectedSubCod(id_category);
  console.log('Selected Category ID:', id_category);
const items = await getItems(id_service, id_category);
setItems(items);
console.log('items:', items);
  }catch(error){
console.log('Error fetching categories:', error);
  }
}


  


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
            services={services}
            selectedId={selectedServCod}
            onSelect={setSelectedServiceId}
          />
        </div>

        {/* Panel 2: Subcategorías */}
        {selectedServCod && (
          <div className="panel">
          <TableOptionServices
  categoria={categories}
  onClose={() => setSelectedServCod(null)}
  onSelectSub={setSelectedCategoryId} // <-- aquí
  selectedService={selectedServCod}
  selectedCatCod={selectedCatCod}   // <-- pásale el id del servicio actual
/>
          </div>
        )}

        {/* Panel 3: Detalles */}
        {selectedCatCod && (
          <div className="panel">
            <TableSubcategorie
              items={items}
              onClose={() => setSelectedSubCod(null)}
            />
          </div>
        )}
          
      </div>
    </div>
  );
}

export default MiscellaneousPage;
