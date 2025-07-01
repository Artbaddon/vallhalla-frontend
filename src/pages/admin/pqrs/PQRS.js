import React from 'react';

const PQRS = () => {
  return (
    <div className="pqrs-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de PQRS</h1>
          <p className="text-muted">Administre las peticiones, quejas, reclamos y sugerencias</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Nueva PQRS
        </button>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-content">
          <i className="bi bi-question-circle display-1 text-primary"></i>
          <h2>Próximamente</h2>
          <p>La gestión de PQRS estará disponible en la próxima actualización.</p>
        </div>
      </div>
    </div>
  );
};

export default PQRS; 