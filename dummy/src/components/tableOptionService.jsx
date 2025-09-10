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

function TableOptionServices({ categoria, subcategorias, onClose, onSelectSub }) {
  if (!categoria) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="toolbar">
        <div><strong>Subcategorías de:</strong> {categoria.nom_abue}</div>
        <button className="btn" onClick={onClose}>Cerrar</button>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            <th style={{ width: 110 }}>codigo</th>
            <th>papas</th>
          </tr>
        </thead>
        <tbody>
          {subcategorias.length === 0 ? (
            <tr><td colSpan={2}>Sin subcategorías</td></tr>
          ) : (
            subcategorias.map((sub) => (
              <tr key={sub.cod_sub} onClick={() => onSelectSub(sub.cod_sub)} style={{ cursor: "pointer" }}>
                <td>{sub.cod_sub}</td>
                <td>{sub.nom_sub}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default TableOptionServices;
