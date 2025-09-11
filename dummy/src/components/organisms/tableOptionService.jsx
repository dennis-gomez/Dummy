const styles = `
  .tabla {
    border-collapse: collapse;
    width: 100%;
    margin: 0;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .tabla th, .tabla td {
    border: 1px solid #e0e0e0;
    padding: 10px 14px;
    text-align: left;
    color: #000;
  }
  .tabla thead th {
    background: #1976d2;
    color: #fff;
    font-weight: 600;
  }
  .fila { cursor: pointer; }
  .fila:hover { background: #e3f2fd; }
  .selected {
    outline: 2px solid #1976d2;
    outline-offset: -2px;
    background: #e3f2fd;
  }
  .toolbar {
    margin: 0 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btn {
    background: #1976d2;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
  }
  .btn:hover { background: #1565c0; }
`;

function TableOptionServices({ categoria, onClose, onSelectSub, selectedService, selectedCatCod }) {
  if (!categoria) return null;

console.log("Selected Service in TableOptionServices:", selectedCatCod);


  return (
    <>
      <style>{styles}</style>
      <div className="toolbar">
        <button className="btn" onClick={onClose}>Cerrar</button>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th style={{ width: 110 }}>codigo servicio</th>
            <th style={{ width: 110 }}>codigo categoria</th>
            <th>categorias</th>
          </tr>
        </thead>
        <tbody>
          {categoria.length === 0 ? (
            <tr><td colSpan={3}>Sin subcategorías</td></tr>
          ) : (
            categoria.map((sub) => (
              <tr
                key={sub.cod_category}
                className={`fila${selectedCatCod === sub.cod_category ? " selected" : ""}`.trim()}
                onClick={() => onSelectSub(sub.cod_category, selectedService)}
                style={{ cursor: "pointer" }}
                 aria-selected={selectedCatCod === sub.cod_category}
              >
                <td>{sub.cod_service}</td>
                <td>{sub.cod_category}</td>
                <td>{sub.category_name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
export default TableOptionServices;
