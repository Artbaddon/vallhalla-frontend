import React, { useState, useEffect } from 'react';

const PQRSModal = ({ show, onHide, onSubmit, pqrs, categories, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    owner_id: '',
    status: 'pending'
  });

  // Reset form when modal opens/closes or when editing a different PQRS
  useEffect(() => {
    if (show) {
      if (pqrs) {
        // Editing existing PQRS
        setFormData({
          title: pqrs.title || '',
          description: pqrs.description || '',
          category_id: pqrs.category_id?.toString() || '',
          owner_id: pqrs.owner_id?.toString() || '',
          status: pqrs.status || 'pending'
        });
      } else {
        // Creating new PQRS
        setFormData({
          title: '',
          description: '',
          category_id: categories.length > 0 ? categories[0].id.toString() : '',
          owner_id: '',
          status: 'pending'
        });
      }
    }
  }, [show, pqrs, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string IDs to numbers
    const submissionData = {
      ...formData,
      category_id: formData.category_id ? parseInt(formData.category_id) : null,
      owner_id: formData.owner_id ? parseInt(formData.owner_id) : null
    };

    onSubmit(pqrs ? { id: pqrs.id, data: submissionData } : submissionData);
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
        maxWidth: '600px',
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
          <h5 className="modal-title">{pqrs ? 'Editar PQRS' : 'Crear Nuevo PQRS'}</h5>
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
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Título <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ingrese un título descriptivo"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="category_id" className="form-label">
                Categoría <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Descripción <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describa detalladamente el asunto"
                required
              />
            </div>

            {pqrs && (
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Estado</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Proceso</option>
                  <option value="resolved">Resuelto</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="active">Activo</option>
                </select>
              </div>
            )}
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
                  {pqrs ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                pqrs ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PQRSModal; 