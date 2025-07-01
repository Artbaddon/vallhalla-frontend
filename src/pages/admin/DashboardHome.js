import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ownersAPI, paymentsAPI, pqrsAPI, reservationsAPI } from '../../services/api';
import './DashboardHome.css';

const DashboardHome = () => {
  // Fetch dashboard statistics
  const { data: ownersData, isLoading: ownersLoading } = useQuery('owners', ownersAPI.getAll);
  const { data: paymentsData, isLoading: paymentsLoading } = useQuery('payments', paymentsAPI.getAll);
  const { data: pqrsData, isLoading: pqrsLoading } = useQuery('pqrs', pqrsAPI.getAll);
  const { data: reservationsData, isLoading: reservationsLoading } = useQuery('reservations', reservationsAPI.getAll);

  const stats = [
    {
      title: 'Propietarios',
      number: ownersData?.length || 0,
      icon: 'bi-people-fill',
      color: 'owners',
      link: '/admin/owners'
    },
    {
      title: 'Pagos Pendientes',
      number: paymentsData?.filter(p => p.status === 'pending')?.length || 0,
      icon: 'bi-credit-card-fill',
      color: 'payments',
      link: '/admin/payments'
    },
    {
      title: 'PQRS Activas',
      number: pqrsData?.filter(p => p.status === 'active')?.length || 0,
      icon: 'bi-question-circle-fill',
      color: 'pqrs',
      link: '/admin/pqrs'
    },
    {
      title: 'Reservas Hoy',
      number: reservationsData?.filter(r => {
        const today = new Date().toISOString().split('T')[0];
        return r.date === today;
      })?.length || 0,
      icon: 'bi-calendar-check-fill',
      color: 'reservations',
      link: '/admin/reservations'
    }
  ];

  const quickActions = [
    {
      title: 'Nuevo Propietario',
      icon: 'bi-person-plus',
      link: '/admin/owners',
      color: '#28a745'
    },
    {
      title: 'Registrar Pago',
      icon: 'bi-cash-coin',
      link: '/admin/payments',
      color: '#17a2b8'
    },
    {
      title: 'Nueva PQRS',
      icon: 'bi-chat-dots',
      link: '/admin/pqrs',
      color: '#dc3545'
    },
    {
      title: 'Crear Encuesta',
      icon: 'bi-clipboard-plus',
      link: '/admin/surveys',
      color: '#ffc107'
    }
  ];

  const recentActivity = [
    {
      type: 'payment',
      title: 'Pago registrado por Juan Pérez',
      time: 'Hace 5 minutos',
      icon: 'bi-credit-card'
    },
    {
      type: 'pqrs',
      title: 'Nueva PQRS creada',
      time: 'Hace 15 minutos',
      icon: 'bi-question-circle'
    },
    {
      type: 'reservation',
      title: 'Reserva confirmada para sala común',
      time: 'Hace 1 hora',
      icon: 'bi-calendar-check'
    },
    {
      type: 'notification',
      title: 'Notificación enviada a propietarios',
      time: 'Hace 2 horas',
      icon: 'bi-bell'
    }
  ];

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Panel de Control</h1>
        <p className="text-muted">Bienvenido al sistema de administración de VALHALLA</p>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-stats">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">
              <i className={stat.icon}></i>
            </div>
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.title}</div>
            <Link to={stat.link} className="stat-link">
              Ver detalles <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h3>Acciones Rápidas</h3>
        <div className="quick-actions">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="quick-action-btn">
              <i className={action.icon} style={{ color: action.color }}></i>
              <span>{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  <i className={activity.icon}></i>
                </div>
                <div className="activity-content">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-card">
          <h3>Resumen del Mes</h3>
          <div className="card-icon">
            <i className="bi bi-graph-up"></i>
          </div>
          <div className="quick-stats">
            <div className="quick-stat">
              <span className="stat-label">Ingresos</span>
              <span className="stat-value">$2,450,000</span>
            </div>
            <div className="quick-stat">
              <span className="stat-label">Gastos</span>
              <span className="stat-value">$1,890,000</span>
            </div>
            <div className="quick-stat">
              <span className="stat-label">Balance</span>
              <span className="stat-value positive">$560,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="dashboard-section">
        <h3>Estado del Sistema</h3>
        <div className="system-status">
          <div className="status-item">
            <div className="status-indicator online"></div>
            <span>Servidor Principal</span>
          </div>
          <div className="status-item">
            <div className="status-indicator online"></div>
            <span>Base de Datos</span>
          </div>
          <div className="status-item">
            <div className="status-indicator online"></div>
            <span>API Backend</span>
          </div>
          <div className="status-item">
            <div className="status-indicator online"></div>
            <span>Notificaciones</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 