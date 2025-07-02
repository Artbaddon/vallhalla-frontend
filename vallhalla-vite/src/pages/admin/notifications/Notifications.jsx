import React from 'react';

const Notifications = () => {
  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Notificaciones</h1>
          <p className="text-muted">Administre las notificaciones del conjunto residencial</p>
        </div>
        <button className="btn btn-primary">
          <i className="bi bi-plus-lg"></i> Nueva Notificación
        </button>
      </div>

      <div className="coming-soon">
        <div className="coming-soon-content">
          <i className="bi bi-bell display-1 text-primary"></i>
          <h2>Próximamente</h2>
          <p>La gestión de notificaciones estará disponible en la próxima actualización.</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 