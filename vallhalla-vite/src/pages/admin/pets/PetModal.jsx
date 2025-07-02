import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ownersAPI } from '../../../services/api';

const PetModal = ({ show, onHide, onSubmit, pet, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    owner_id: '',
    vaccination_card: '',
    photos: ''
  });

  // Fetch owners for dropdown
  const { data: ownersResponse } = useQuery('owners', ownersAPI.getAll, {
    enabled: show,
    onError: (err) => {
      console.error('Error fetching owners:', err);
    }
  });

  const owners = ownersResponse?.data || [];

  // Reset form when modal opens/closes or when editing a different pet
  useEffect(() => {
    if (show) {
      if (pet) {
        // Editing existing pet
        setFormData({
          name: pet.name || '',
          species: pet.species || '',
          breed: pet.breed || '',
          owner_id: pet.owner_id?.toString() || '',
          vaccination_card: pet.vaccination_card || '',
          photos: pet.photos || ''
        });
      } else {
        // Creating new pet
        setFormData({
          name: '',
          species: '',
          breed: '',
          owner_id: owners.length > 0 ? owners[0].id.toString() : '',
          vaccination_card: '',
          photos: ''
        });
      }
    }
  }, [show, pet, owners]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string IDs to numbers
    const submissionData = {
      ...formData,
      owner_id: formData.owner_id ? parseInt(formData.owner_id) : null
    };

    onSubmit(pet ? { id: pet.id, data: submissionData } : submissionData);
  };

  // File upload handlers (these would connect to your file upload service)
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // In a real implementation, you would upload the file to your server/cloud storage
    // and get back a URL to store in the form
    console.log(`File selected for ${field}:`, file);
    
    // For now, we'll just simulate storing the file name
    setFormData(prev => ({ ...prev, [field]: file.name }));
    
    // You would typically do something like:
    // const formData = new FormData();
    // formData.append('file', file);
    // axios.post('/api/upload', formData)
    //   .then(response => {
    //     setFormData(prev => ({ ...prev, [field]: response.data.url }));
    //   });
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white',
        borderRadius: '5px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #dee2e6'
        }}>
          <h5 className="modal-title">{pet ? 'Editar Mascota' : 'Registrar Nueva Mascota'}</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onHide}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 0,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '1rem' }}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nombre de la mascota"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="owner_id" className="form-label">
                    Propietario <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="owner_id"
                    name="owner_id"
                    value={formData.owner_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un propietario</option>
                    {owners.map(owner => (
                      <option key={owner.id} value={owner.id.toString()}>
                        {owner.first_name} {owner.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="species" className="form-label">
                    Especie <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="species"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    placeholder="Ej: Perro, Gato, Ave"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="breed" className="form-label">Raza</label>
                  <input
                    type="text"
                    className="form-control"
                    id="breed"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="Raza de la mascota"
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="vaccination_card" className="form-label">Tarjeta de vacunación</label>
              <input
                type="file"
                className="form-control"
                id="vaccination_card"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'vaccination_card')}
              />
              {formData.vaccination_card && (
                <div className="mt-2">
                  <small className="text-muted">Archivo seleccionado: {formData.vaccination_card}</small>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="photos" className="form-label">Fotos</label>
              <input
                type="file"
                className="form-control"
                id="photos"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, 'photos')}
              />
              {formData.photos && (
                <div className="mt-2">
                  <small className="text-muted">
                    {Array.isArray(formData.photos) 
                      ? `${formData.photos.length} archivos seleccionados` 
                      : `Archivo seleccionado: ${formData.photos}`}
                  </small>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '1rem',
            borderTop: '1px solid #dee2e6'
          }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onHide} 
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {pet ? 'Actualizando...' : 'Registrando...'}
                </>
              ) : (
                pet ? 'Actualizar' : 'Registrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetModal; 