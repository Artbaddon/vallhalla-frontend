import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { paymentsAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import PaymentModal from './PaymentModal';
import './Payments.css';

const Payments = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  // Fetch payments data
  const { data: payments = [], isLoading, error } = useQuery('payments', paymentsAPI.getAll);

  // Mutations
  const createMutation = useMutation(paymentsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('payments');
      toast.success('Pago registrado exitosamente');
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al registrar pago');
    }
  });

  const updateMutation = useMutation(
    ({ id, data }) => paymentsAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('payments');
        toast.success('Pago actualizado exitosamente');
        setShowModal(false);
        setEditingPayment(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Error al actualizar pago');
      }
    }
  );

  const deleteMutation = useMutation(paymentsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('payments');
      toast.success('Pago eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar pago');
    }
  });

  // Filter payments based on search term and status
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.referenceNumber?.includes(searchTerm) ||
      payment.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingPayment(null);
    setShowModal(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setShowModal(true);
  };

  const handleDelete = (payment) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(payment.id);
      }
    });
  };

  const handleView = (payment) => {
    Swal.fire({
      title: 'Detalles del Pago',
      html: `
        <div class="text-start">
          <p><strong>Propietario:</strong> ${payment.ownerName}</p>
          <p><strong>Descripción:</strong> ${payment.description}</p>
          <p><strong>Monto:</strong> $${payment.amount?.toLocaleString()}</p>
          <p><strong>Estado:</strong> ${payment.status}</p>
          <p><strong>Fecha:</strong> ${payment.date}</p>
          <p><strong>Método:</strong> ${payment.paymentMethod}</p>
          <p><strong>Referencia:</strong> ${payment.referenceNumber}</p>
        </div>
      `,
      confirmButtonText: 'Cerrar'
    });
  };

  const handleSubmit = (formData) => {
    if (editingPayment) {
      updateMutation.mutate({ id: editingPayment.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'Pendiente' },
      completed: { class: 'bg-success', text: 'Completado' },
      failed: { class: 'bg-danger', text: 'Fallido' },
      cancelled: { class: 'bg-secondary', text: 'Cancelado' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar los pagos: {error.message}
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Pagos</h1>
          <p className="text-muted">Administre los pagos y transacciones del conjunto</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleCreate}
          disabled={isLoading}
        >
          <i className="bi bi-plus-lg"></i> Registrar Pago
        </button>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="row">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar pagos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="completed">Completado</option>
              <option value="failed">Fallido</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          <div className="col-md-3">
            <div className="stats-summary">
              <div className="stat-item">
                <span className="stat-label">Total:</span>
                <span className="stat-value">
                  ${payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>Lista de Pagos</h3>
          <span className="badge bg-primary">{filteredPayments.length} pagos</span>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando pagos...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Propietario</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Método</th>
                  <th>Referencia</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted py-4">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'No se encontraron pagos con ese criterio' 
                        : 'No hay pagos registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.ownerName}</td>
                      <td>{payment.description}</td>
                      <td>${payment.amount?.toLocaleString()}</td>
                      <td>{getStatusBadge(payment.status)}</td>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td>{payment.paymentMethod}</td>
                      <td>{payment.referenceNumber}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleView(payment)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleEdit(payment)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(payment)}
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingPayment(null);
        }}
        onSubmit={handleSubmit}
        payment={editingPayment}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </div>
  );
};

export default Payments; 