import { useState, useEffect } from "react";
import { getAreas, addArea } from "../services/areaService";
import { getCategorys, addCategory } from "../services/categoryService";
import {getServices} from "../services/Service_service"

function TableOptionServices() {
  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    loadAreas();
    console.log(getServices());
  }, []);

  const loadAreas = async () => {
    try {
      const data = await getAreas();
      setAreas(data);
    } catch (err) {
      console.error("Error cargando áreas:", err);
    }
  };

  const loadCategories = async (areaId) => {
    try {
      const data = await getCategorys(areaId);
      setCategories(data);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    loadCategories(area.id_area);
  };

  const handleAdd = async () => {
    try {
      if (!selectedArea) {
        // Agregar nueva Área
        const newArea = await addArea({ area_name: newItemName });
        setAreas([...areas, newArea]);
      } else {
        // Agregar nueva Categoría
        const newCategory = await addCategory({
          id_area: selectedArea.id_area,
          category_name: newItemName,
        });
        setCategories([...categories, newCategory]);
      }
      setNewItemName("");
    } catch (err) {
      console.error("Error agregando item:", err);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <style>{`
        .custom-table {
          border-collapse: collapse;
          width: 70%;
          margin: 30px auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }
        .custom-table th, .custom-table td {
          border: 1px solid #e0e0e0;
          padding: 12px 18px;
          text-align: center;
          vertical-align: top;
        }
        .custom-table th {
          background: #1976d2;
          color: #fff;
          font-weight: 600;
        }
        .custom-table tr:nth-child(even) {
          background: #f5f5f5;
        }
        .custom-table tr:hover {
          background: #e3f2fd;
        }
        .custom-btn {
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          margin: 3px;
        }
        .custom-btn:hover {
          background: #1565c0;
        }
        input {
          padding: 6px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
      `}</style>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Áreas</th>
            <th>{selectedArea ? `Categorías de ${selectedArea.area_name}` : "Categorías"}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(areas.length, categories.length) }).map((_, index) => (
            <tr key={index}>
              <td>
                {areas[index] && (
                  <button
                    className="custom-btn"
                    onClick={() => handleAreaSelect(areas[index])}
                  >
                    {areas[index].area_name}
                  </button>
                )}
              </td>
              <td>
                {categories[index] && (
                  <button className="custom-btn">{categories[index].category_name}</button>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              {!selectedArea && (
                <>
                  <input
                    type="text"
                    placeholder="Nueva área"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    style={{ marginRight: "5px" }}
                  />
                  <button className="custom-btn" onClick={handleAdd}>
                    Agregar
                  </button>
                </>
              )}
            </td>
            <td>
              {selectedArea && (
                <>
                  <input
                    type="text"
                    placeholder="Nueva categoría"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    style={{ marginRight: "5px" }}
                  />
                  <button className="custom-btn" onClick={handleAdd}>
                    Agregar
                  </button>
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TableOptionServices;
