import React from 'react';

const Parking = () => {
  return (
    <div className="parking-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Parqueaderos</h1>
          <p className="text-muted">Administre los parqueaderos del conjunto residencial</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Añadir Parqueadero
        </button>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-content">
          <i className="bi bi-p-square display-1 text-primary"></i>
          <h2>Próximamente</h2>
          <p>La gestión de parqueaderos estará disponible en la próxima actualización.</p>
        </div>
      </div>
    </div>
  );
};

export default Parking; 