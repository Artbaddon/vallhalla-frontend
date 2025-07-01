import React from 'react';

const Pets = () => {
  return (
    <div className="pets-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Mascotas</h1>
          <p className="text-muted">Administre las mascotas del conjunto residencial</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Añadir Mascota
        </button>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-content">
          <i className="bi bi-heart display-1 text-primary"></i>
          <h2>Próximamente</h2>
          <p>La gestión de mascotas estará disponible en la próxima actualización.</p>
        </div>
      </div>
    </div>
  );
};

export default Pets; 