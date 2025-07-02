import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { parkingAPI, vehicleTypesAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import ParkingModal from './ParkingModal';
import VehicleAssignmentModal from './VehicleAssignmentModal';
import './Parking.css';

const Parking = () => {
  const [showModal, setShowModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingParking, setEditingParking] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  // Fetch parking data
  const { data: response, isLoading, error } = useQuery('parking', parkingAPI.getAll, {
    onSuccess: (response) => {
      console.log('Parking data received:', response?.data);
    },
    onError: (err) => {
      console.error('Error fetching parking:', err);
    }
  });

  // Fetch vehicle types data
  const { data: vehicleTypesResponse } = useQuery('vehicleTypes', vehicleTypesAPI.getAll, {
    onSuccess: (response) => {
      console.log('Vehicle types received:', response);
    },
    onError: (err) => {
      console.error('Error fetching vehicle types:', err);
    }
  });

  // Ensure parking is always an array
  const parkingList = Array.isArray(response?.data) ? response.data : [];
  const vehicleTypes = Array.isArray(vehicleTypesResponse) ? vehicleTypesResponse : [];

  // Mutations
  const createMutation = useMutation(parkingAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('parking');
      toast.success('Estacionamiento creado exitosamente');
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Create Parking Error:', error);
      toast.error(error.response?.data?.message || 'Error al crear estacionamiento');
    }
  });

  const updateMutation = useMutation(
    ({ id, data }) => parkingAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('parking');
        toast.success('Estacionamiento actualizado exitosamente');
        setShowModal(false);
        setEditingParking(null);
      },
      onError: (error) => {
        console.error('Update Parking Error:', error);
        toast.error(error.response?.data?.message || 'Error al actualizar estacionamiento');
      }
    }
  );

  const assignVehicleMutation = useMutation(
    ({ parkingId, vehicleId }) => parkingAPI.assignVehicle(parkingId, vehicleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('parking');
        toast.success('Vehículo asignado exitosamente');
        setShowVehicleModal(false);
        setSelectedParking(null);
      },
      onError: (error) => {
        console.error('Assign Vehicle Error:', error);
        toast.error(error.response?.data?.message || 'Error al asignar vehículo');
      }
    }
  );

  const deleteMutation = useMutation(parkingAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('parking');
      toast.success('Estacionamiento eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Delete Parking Error:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar estacionamiento');
    }
  });

  // Filter parking based on search term and status
  const filteredParking = parkingList.filter(parking => {
    const matchesSearch = 
      parking.parking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parking.vehicle_plate?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || parking.status_id?.toString() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setEditingParking(null);
    setShowModal(true);
  };

  const handleEdit = (parking) => {
    setEditingParking(parking);
    setShowModal(true);
  };

  const handleDelete = (parking) => {
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
        deleteMutation.mutate(parking.id);
      }
    });
  };

  const handleAssignVehicle = (parking) => {
    setSelectedParking(parking);
    setShowVehicleModal(true);
  };

  const handleSubmit = (data) => {
    if (editingParking) {
      updateMutation.mutate({ id: editingParking.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleAssignVehicleSubmit = (vehicleId) => {
    if (selectedParking && vehicleId) {
      assignVehicleMutation.mutate({
        parkingId: selectedParking.id,
        vehicleId
      });
    }
  };

  const getStatusBadge = (statusId) => {
    const statusConfig = {
      '1': { class: 'bg-success', text: 'Disponible' },
      '2': { class: 'bg-danger', text: 'Ocupado' },
      '3': { class: 'bg-warning', text: 'Reservado' },
      '4': { class: 'bg-secondary', text: 'Mantenimiento' }
    };
    
    const config = statusConfig[statusId?.toString()] || { class: 'bg-secondary', text: 'Desconocido' };
    
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getVehicleTypeName = (typeId) => {
    const vehicleType = vehicleTypes.find(type => type.id === typeId);
    return vehicleType ? vehicleType.name : 'Desconocido';
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar los estacionamientos: {error.message}
      </div>
    );
  }

  return (
    <div className="parking-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Gestión de Estacionamientos</h1>
          <p className="text-muted">Administre los espacios de estacionamiento y vehículos</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleCreate}
          disabled={isLoading}
        >
          <i className="bi bi-plus-lg"></i> Nuevo Estacionamiento
        </button>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="row">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por número, propietario o placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="1">Disponible</option>
              <option value="2">Ocupado</option>
              <option value="3">Reservado</option>
              <option value="4">Mantenimiento</option>
            </select>
          </div>
        </div>
      </div>

      {/* Parking Table */}
      <div className="table-container">
        <div className="table-header">
          <h3>Lista de Estacionamientos</h3>
          <span className="badge bg-primary">{filteredParking.length} Espacios</span>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando estacionamientos...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Estado</th>
                  <th>Tipo de Vehículo</th>
                  <th>Propietario</th>
                  <th>Vehículo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredParking.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      {searchTerm || statusFilter !== 'all'
                        ? 'No se encontraron estacionamientos con ese criterio' 
                        : 'No hay estacionamientos registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredParking.map((parking) => (
                    <tr key={parking.id}>
                      <td>{parking.parking_number}</td>
                      <td>{getStatusBadge(parking.status_id)}</td>
                      <td>{getVehicleTypeName(parking.vehicle_type_id)}</td>
                      <td>{parking.user_name || 'No asignado'}</td>
                      <td>
                        {parking.vehicle_plate ? (
                          <span className="badge bg-info">
                            <i className="bi bi-car-front me-1"></i>
                            {parking.vehicle_plate}
                          </span>
                        ) : (
                          <span className="text-muted">No asignado</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleAssignVehicle(parking)}
                            title="Asignar Vehículo"
                            disabled={parking.status_id === 2} // Disabled if occupied
                          >
                            <i className="bi bi-car-front"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleEdit(parking)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(parking)}
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

      {/* Parking Modal and Vehicle Assignment Modal */}
      <ParkingModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingParking(null);
        }}
        onSubmit={handleSubmit}
        parking={editingParking}
        vehicleTypes={vehicleTypes}
        isLoading={createMutation.isLoading || updateMutation.isLoading}
      />
      
      <VehicleAssignmentModal
        show={showVehicleModal}
        onHide={() => {
          setShowVehicleModal(false);
          setSelectedParking(null);
        }}
        onSubmit={handleAssignVehicleSubmit}
        parking={selectedParking}
        isLoading={assignVehicleMutation.isLoading}
      />
    </div>
  );
};

export default Parking; 