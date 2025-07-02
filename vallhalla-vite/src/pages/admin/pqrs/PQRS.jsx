import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { pqrsAPI, pqrsCategoriesAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import PQRSModal from './PQRSModal';
import './PQRS.css';

const PQRS = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingPQRS, setEditingPQRS] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const queryClient = useQueryClient();

  // Fetch PQRS data
  const { data: response, isLoading, error } = useQuery('pqrs', pqrsAPI.getAll, {
    onSuccess: (response) => {
      console.log('PQRS data received:', response?.data);
    },
    onError: (err) => {
      console.error('Error fetching PQRS:', err);
    }
  });

  // Fetch PQRS categories
  const { data: categoriesResponse } = useQuery('pqrsCategories', pqrsCategoriesAPI.getAll, {
    onSuccess: (response) => {
      console.log('PQRS Categories received:', response);
    },
    onError: (err) => {
      console.error('Error fetching PQRS Categories:', err);
    }
  });

  // Ensure PQRS is always an array
  const pqrsList = Array.isArray(response?.data) ? response.data : [];
  const categories = Array.isArray(categoriesResponse) ? categoriesResponse : [];

  // Mutations
  const createMutation = useMutation(pqrsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('pqrs');
      toast.success('PQRS creado exitosamente');
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Create PQRS Error:', error);
      toast.error(error.response?.data?.message || 'Error al crear PQRS');
    }
  });

  const updateMutation = useMutation(
    ({ id, data }) => pqrsAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pqrs');
        toast.success('PQRS actualizado exitosamente');
        setShowModal(false);
        setEditingPQRS(null);
      },
      onError: (error) => {
        console.error('Update PQRS Error:', error);
        toast.error(error.response?.data?.message || 'Error al actualizar PQRS');
      }
    }
  );

  const updateStatusMutation = useMutation(
    ({ id, statusId }) => pqrsAPI.updateStatus(id, statusId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pqrs');
        toast.success('Estado de PQRS actualizado exitosamente');
      },
      onError: (error) => {
        console.error('Update PQRS Status Error:', error);
        toast.error(error.response?.data?.message || 'Error al actualizar estado de PQRS');
      }
    }
  );

  const deleteMutation = useMutation(pqrsAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('pqrs');
      toast.success('PQRS eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Delete PQRS Error:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar PQRS');
    }
  });

  // Filter PQRS based on search term, status, and category
  const filteredPQRS = pqrsList.filter(pqrs => {
    const matchesSearch = 
      pqrs.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pqrs.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pqrs.owner_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pqrs.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || pqrs.category_id?.toString() === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreate = () => {
    setEditingPQRS(null);
    setShowModal(true);
  };

  const handleEdit = (pqrs) => {
    setEditingPQRS(pqrs);
    setShowModal(true);
  };

  const handleDelete = (pqrs) => {
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
        deleteMutation.mutate(pqrs.id);
      }
    });
  };

  const handleChangeStatus = (pqrs, newStatus) => {
    updateStatusMutation.mutate({ id: pqrs.id, statusId: newStatus });
  };

  const handleView = (pqrs) => {
    const categoryName = categories.find(cat => cat.id === pqrs.category_id)?.name || 'No categoría';
    
    Swal.fire({
      title: pqrs.title,
      html: `
        <div class="text-start">
          <p><strong>Categoría:</strong> ${categoryName}</p>
          <p><strong>Estado:</strong> ${getStatusBadgeHTML(pqrs.status)}</p>
          <p><strong>Propietario:</strong> ${pqrs.owner_name || 'No asignado'}</p>
          <p><strong>Fecha:</strong> ${new Date(pqrs.created_at).toLocaleDateString()}</p>
          <p><strong>Descripción:</strong></p>
          <div class="p-3 bg-light rounded">${pqrs.description}</div>
        </div>
      `,
      confirmButtonText: 'Cerrar'
    });
  };

  const handleSubmit = (data) => {
    if (editingPQRS) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { class: 'bg-warning', text: 'Pendiente' },
      'in_progress': { class: 'bg-info', text: 'En Proceso' },
      'resolved': { class: 'bg-success', text: 'Resuelto' },
      'cancelled': { class: 'bg-secondary', text: 'Cancelado' },
      'active': { class: 'bg-primary', text: 'Activo' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusBadgeHTML = (status) => {
    const statusConfig = {
      'pending': { class: 'bg-warning', text: 'Pendiente' },
      'in_progress': { class: 'bg-info', text: 'En Proceso' },
      'resolved': { class: 'bg-success', text: 'Resuelto' },
      'cancelled': { class: 'bg-secondary', text: 'Cancelado' },
      'active': { class: 'bg-primary', text: 'Activo' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    
    return `<span class="badge ${config.class}">${config.text}</span>`;
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar los PQRS: {error.message}
      </div>
    );
  }

  return (
    <div className="pqrs-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de PQRS</h1>
          <p className="text-muted">Administre las peticiones, quejas, reclamos y sugerencias</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleCreate}
          disabled={isLoading}
        >
          <i className="bi bi-plus-lg"></i> Nueva PQRS
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
                placeholder="Buscar PQRS..."
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
              <option value="in_progress">En Proceso</option>
              <option value="resolved">Resuelto</option>
              <option value="cancelled">Cancelado</option>
              <option value="active">Activo</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* PQRS Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>Lista de PQRS</h3>
          <span className="badge bg-primary">{filteredPQRS.length} PQRS</span>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando PQRS...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Propietario</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPQRS.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                        ? 'No se encontraron PQRS con ese criterio' 
                        : 'No hay PQRS registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredPQRS.map((pqrs) => {
                    const categoryName = categories.find(cat => cat.id === pqrs.category_id)?.name || 'No categoría';
                    
                    return (
                      <tr key={pqrs.id}>
                        <td>{pqrs.title}</td>
                        <td>{categoryName}</td>
                        <td>{pqrs.owner_name || 'No asignado'}</td>
                        <td>{getStatusBadge(pqrs.status)}</td>
                        <td>{new Date(pqrs.created_at).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleView(pqrs)}
                              title="Ver detalles"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleEdit(pqrs)}
                              title="Editar"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(pqrs)}
                              title="Eliminar"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PQRS Modal */}
      <PQRSModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingPQRS(null);
        }}
        onSubmit={handleSubmit}
        pqrs={editingPQRS}
        categories={categories}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </div>
  );
};

export default PQRS; 