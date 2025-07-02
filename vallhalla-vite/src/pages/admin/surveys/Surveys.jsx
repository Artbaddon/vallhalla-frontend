import React from 'react';

const Surveys = () => {
  return (
    <div className="surveys-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Encuestas</h1>
          <p className="text-muted">Administre las encuestas del conjunto residencial</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Crear Encuesta
        </button>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-content">
          <i className="bi bi-clipboard-data display-1 text-primary"></i>
          <h2>Próximamente</h2>
          <p>La gestión de encuestas estará disponible en la próxima actualización.</p>
        </div>
      </div>
    </div>
  );
};

export default Surveys; 