import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ownersAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import OwnerModal from './OwnerModal';
import './Owners.css';

const Owners = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch owners data
  const { data: response, isLoading, error } = useQuery('owners', ownersAPI.getAll, {
    onSuccess: (response) => {
      console.log('Owners data received:', response?.data);
    },
    onError: (err) => {
      console.error('Error fetching owners:', err);
    }
  });

  // Ensure owners is always an array
  const owners = Array.isArray(response?.data) ? response.data : [];

  // Mutations
  const createMutation = useMutation(ownersAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('owners');
      toast.success('Propietario creado exitosamente');
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Create Owner Error:', error);
      toast.error(error.response?.data?.message || 'Error al crear propietario');
    }
  });

  const updateMutation = useMutation(
    ({ id, data }) => ownersAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('owners');
        toast.success('Propietario actualizado exitosamente');
        setShowModal(false);
        setEditingOwner(null);
      },
      onError: (error) => {
        console.error('Update Owner Error:', error);
        toast.error(error.response?.data?.message || 'Error al actualizar propietario');
      }
    }
  );

  const deleteMutation = useMutation(ownersAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('owners');
      toast.success('Propietario eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Delete Owner Error:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar propietario');
    }
  });

  // Map owner fields to match UI expectations
  const mapOwnerFields = (owner) => {
    return {
      id: owner.Owner_id,
      User_FK_ID: owner.User_FK_ID,
      Owner_is_tenant: owner.Owner_is_tenant,
      Owner_birth_date: owner.Owner_birth_date,
      Owner_first_name: owner.Owner_first_name || owner.Owner_name,
      Owner_last_name: owner.Owner_last_name,
      Owner_document_type: owner.Owner_document_type,
      Owner_document_number: owner.Owner_document_number,
      Owner_phone: owner.Owner_phone,
      Owner_email: owner.Owner_email,
      first_name: owner.Owner_first_name || owner.Owner_name,
      last_name: owner.Owner_last_name,
      email: owner.Owner_email,
      phone: owner.Owner_phone,
      tower: owner.tower || '',
      apartment: owner.apartment || '',
    };
  };

  // Filter owners based on search term
  const filteredOwners = owners.filter(owner => {
    const ownerName = owner.Owner_first_name || owner.Owner_name || '';
    const ownerLastName = owner.Owner_last_name || '';
    const ownerEmail = owner.Owner_email || '';
    const ownerDocNumber = owner.Owner_document_number || '';
    
    return ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerDocNumber.includes(searchTerm);
  });

  const handleCreate = () => {
    setEditingOwner(null);
    setShowModal(true);
  };

  const handleEdit = (owner) => {
    setEditingOwner(mapOwnerFields(owner));
    setShowModal(true);
  };

  const handleDelete = (owner) => {
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
        deleteMutation.mutate(owner.Owner_id);
      }
    });
  };

  const handleView = (owner) => {
    Swal.fire({
      title: 'Detalles del Propietario',
      html: `
        <div class="text-start">
          <p><strong>Nombre:</strong> ${owner.Owner_first_name || owner.Owner_name || ''} ${owner.Owner_last_name || ''}</p>
          <p><strong>Documento:</strong> ${owner.Owner_document_type || ''} ${owner.Owner_document_number || ''}</p>
          <p><strong>Fecha de Nacimiento:</strong> ${owner.Owner_birth_date ? new Date(owner.Owner_birth_date).toLocaleDateString() : ''}</p>
          <p><strong>Email:</strong> ${owner.Owner_email || ''}</p>
          <p><strong>Teléfono:</strong> ${owner.Owner_phone || ''}</p>
          <p><strong>Es inquilino:</strong> ${owner.Owner_is_tenant ? 'Sí' : 'No'}</p>
        </div>
      `,
      confirmButtonText: 'Cerrar'
    });
  };

  const handleSubmit = (formData) => {
    console.log('Form data submitted:', formData);
    
    if (editingOwner) {
      updateMutation.mutate({ id: editingOwner.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar los propietarios: {error.message}
      </div>
    );
  }

  return (
    <div className="owners-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Propietarios</h1>
          <p className="text-muted">Administre la información de los propietarios del conjunto</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleCreate}
          disabled={isLoading}
        >
          <i className="bi bi-plus-lg"></i> Añadir Propietario
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar propietarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Owners Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>Lista de Propietarios</h3>
          <span className="badge bg-primary">{filteredOwners.length} propietarios</span>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando propietarios...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Documento</th>
                  <th>Teléfono</th>
                  <th>Inquilino</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOwners.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      {searchTerm ? 'No se encontraron propietarios con ese criterio' : 'No hay propietarios registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredOwners.map((owner) => (
                    <tr key={owner.Owner_id}>
                      <td>{owner.Owner_first_name || owner.Owner_name || ''}</td>
                      <td>{owner.Owner_last_name || ''}</td>
                      <td>{owner.Owner_email || ''}</td>
                      <td>{owner.Owner_document_type || ''} {owner.Owner_document_number || ''}</td>
                      <td>{owner.Owner_phone || ''}</td>
                      <td>
                        <span className={`badge ${owner.Owner_is_tenant ? 'bg-success' : 'bg-secondary'}`}>
                          {owner.Owner_is_tenant ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleView(owner)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleEdit(owner)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(owner)}
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

      {/* Owner Modal */}
      <OwnerModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingOwner(null);
        }}
        onSubmit={handleSubmit}
        owner={editingOwner}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
    </div>
  );
};

export default Owners; 