import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import './OwnerModal.css';

// Set modal app element for accessibility
Modal.setAppElement('#root');

const OwnerModal = ({ show, onHide, onSubmit, owner, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    setIsOpen(show);
    if (show && owner) {
      // Populate form for editing
      setValue('firstName', owner.firstName || '');
      setValue('lastName', owner.lastName || '');
      setValue('email', owner.email || '');
      setValue('phone', owner.phone || '');
      setValue('idType', owner.idType || 'CC');
      setValue('idNumber', owner.idNumber || '');
      setValue('birthDate', owner.birthDate || '');
      setValue('tower', owner.tower || '');
      setValue('apartment', owner.apartment || '');
    } else if (show) {
      // Reset form for creating
      reset();
    }
  }, [show, owner, setValue, reset]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
    onHide();
  };

  const onSubmitForm = (data) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="owner-modal"
      overlayClassName="modal-overlay"
      contentLabel={owner ? "Editar Propietario" : "Nuevo Propietario"}
    >
      <div className="modal-header">
        <h5 className="modal-title">
          {owner ? 'Editar Propietario' : 'Nuevo Propietario'}
        </h5>
        <button
          type="button"
          className="btn-close"
          onClick={handleClose}
          aria-label="Close"
        ></button>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="modal-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  Nombre <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  {...register('firstName', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 2,
                      message: 'El nombre debe tener al menos 2 caracteres'
                    }
                  })}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">
                    {errors.firstName.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Apellido <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  {...register('lastName', {
                    required: 'El apellido es requerido',
                    minLength: {
                      value: 2,
                      message: 'El apellido debe tener al menos 2 caracteres'
                    }
                  })}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">
                    {errors.lastName.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  {...register('email', {
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Teléfono <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  {...register('phone', {
                    required: 'El teléfono es requerido',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'El teléfono debe tener 10 dígitos'
                    }
                  })}
                />
                {errors.phone && (
                  <div className="invalid-feedback">
                    {errors.phone.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="idType" className="form-label">
                  Tipo de Documento <span className="text-danger">*</span>
                </label>
                <select
                  id="idType"
                  className={`form-select ${errors.idType ? 'is-invalid' : ''}`}
                  {...register('idType', {
                    required: 'El tipo de documento es requerido'
                  })}
                >
                  <option value="">Seleccionar...</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PP">Pasaporte</option>
                </select>
                {errors.idType && (
                  <div className="invalid-feedback">
                    {errors.idType.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-8">
              <div className="form-group">
                <label htmlFor="idNumber" className="form-label">
                  Número de Documento <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="idNumber"
                  className={`form-control ${errors.idNumber ? 'is-invalid' : ''}`}
                  {...register('idNumber', {
                    required: 'El número de documento es requerido',
                    minLength: {
                      value: 8,
                      message: 'El número de documento debe tener al menos 8 caracteres'
                    }
                  })}
                />
                {errors.idNumber && (
                  <div className="invalid-feedback">
                    {errors.idNumber.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="birthDate" className="form-label">
                  Fecha de Nacimiento <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  id="birthDate"
                  className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                  {...register('birthDate', {
                    required: 'La fecha de nacimiento es requerida'
                  })}
                />
                {errors.birthDate && (
                  <div className="invalid-feedback">
                    {errors.birthDate.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="tower" className="form-label">
                  Torre <span className="text-danger">*</span>
                </label>
                <select
                  id="tower"
                  className={`form-select ${errors.tower ? 'is-invalid' : ''}`}
                  {...register('tower', {
                    required: 'La torre es requerida'
                  })}
                >
                  <option value="">Seleccionar...</option>
                  <option value="1">Torre 1</option>
                  <option value="2">Torre 2</option>
                  <option value="3">Torre 3</option>
                  <option value="4">Torre 4</option>
                </select>
                {errors.tower && (
                  <div className="invalid-feedback">
                    {errors.tower.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="apartment" className="form-label">
                  Apartamento <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="apartment"
                  className={`form-control ${errors.apartment ? 'is-invalid' : ''}`}
                  placeholder="Ej: 101"
                  {...register('apartment', {
                    required: 'El apartamento es requerido',
                    pattern: {
                      value: /^[0-9]{3}$/,
                      message: 'El apartamento debe ser un número de 3 dígitos'
                    }
                  })}
                />
                {errors.apartment && (
                  <div className="invalid-feedback">
                    {errors.apartment.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
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
                Guardando...
              </>
            ) : (
              owner ? 'Actualizar' : 'Crear'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default OwnerModal; 