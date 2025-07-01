import React from 'react';
import './Apartments.css';

const Apartments = () => {
  return (
    <div className="apartments-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Apartamentos</h1>
          <p className="text-muted">Administre los apartamentos del conjunto residencial</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Añadir Apartamento
        </button>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-content">
          <i className="bi bi-house-door display-1 text-primary"></i>
          <h2>Próximamente</h2>
          <p>La gestión de apartamentos estará disponible en la próxima actualización.</p>
        </div>
      </div>
    </div>
  );
};

export default Apartments; 