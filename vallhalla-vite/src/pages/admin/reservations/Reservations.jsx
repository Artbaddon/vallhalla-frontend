import React from 'react';

const Reservations = () => {
  return (
    <div className="reservations-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Reservas</h1>
          <p className="text-muted">Administre las reservas de zonas comunes</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Nueva Reserva
        </button>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-content">
          <i className="bi bi-calendar-check display-1 text-primary"></i>
          <h2>Próximamente</h2>
          <p>La gestión de reservas estará disponible en la próxima actualización.</p>
        </div>
      </div>
    </div>
  );
};

export default Reservations; 