import React from 'react';

const Guards = () => {
  return (
    <div className="guards-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Vigilantes</h1>
          <p className="text-muted">Administre el personal de seguridad del conjunto</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Añadir Vigilante
        </button>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-content">
          <i className="bi bi-shield display-1 text-primary"></i>
          <h2>Próximamente</h2>
          <p>La gestión de vigilantes estará disponible en la próxima actualización.</p>
        </div>
      </div>
    </div>
  );
};

export default Guards; 