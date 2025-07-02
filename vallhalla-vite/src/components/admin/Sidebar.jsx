import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle, currentPath }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin',
      icon: 'bi-house',
      label: 'INICIO',
      exact: true
    },
    {
      path: '/admin/owners',
      icon: 'bi-people',
      label: 'PROPIETARIOS'
    },
    {
      path: '/admin/tenants',
      icon: 'bi-person-check',
      label: 'ARRENDATARIOS'
    },
    {
      path: '/admin/guards',
      icon: 'bi-shield',
      label: 'VIGILANTES'
    },
    {
      path: '/admin/apartments',
      icon: 'bi-house-door',
      label: 'APARTAMENTOS'
    },
    {
      path: '/admin/payments',
      icon: 'bi-credit-card',
      label: 'PAGOS'
    },
    {
      path: '/admin/surveys',
      icon: 'bi-clipboard-data',
      label: 'ENCUESTAS'
    },
    {
      path: '/admin/reservations',
      icon: 'bi-calendar-check',
      label: 'RESERVAS'
    },
    {
      path: '/admin/pqrs',
      icon: 'bi-question-circle',
      label: 'PQRS'
    },
    {
      path: '/admin/notifications',
      icon: 'bi-bell',
      label: 'NOTIFICACIONES'
    },
    {
      path: '/admin/parking',
      icon: 'bi-p-square',
      label: 'PARQUEADERO'
    },
    {
      path: '/admin/pets',
      icon: 'bi-heart',
      label: 'MASCOTAS'
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onToggle}></div>
      )}
      
      <nav className={`sidebar ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="sidebar-brand">
            <span className="brand-text">VALHALLA</span>
          </Link>
        </div>

        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${isActive(item) ? 'active' : ''}`}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth <= 768) {
                    onToggle();
                  }
                }}
              >
                <i className={item.icon}></i>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <Link to="/admin/profile" className="nav-link">
            <i className="bi bi-person"></i>
            <span className="nav-label">MI PERFIL</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Sidebar; 