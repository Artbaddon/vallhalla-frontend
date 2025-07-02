import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import Modal from 'react-modal';

// Make sure to bind modal to your app element
if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const ChangePassword = ({ isOpen, onRequestClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword } = useAuth();
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm();

  const password = watch('newPassword', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      if (result.success) {
        toast.success('Contraseña actualizada con éxito');
        reset();
        onRequestClose();
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error al cambiar la contraseña. Verifique su contraseña actual.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Cambiar Contraseña"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">
        <h4 className="modal-title">Cambiar Contraseña</h4>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onRequestClose} 
          aria-label="Close"
        ></button>
      </div>
      
      <div className="modal-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
            <input
              type="password"
              id="currentPassword"
              className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
              {...register('currentPassword', {
                required: 'La contraseña actual es requerida'
              })}
            />
            {errors.currentPassword && (
              <div className="invalid-feedback">{errors.currentPassword.message}</div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
            <input
              type="password"
              id="newPassword"
              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
              {...register('newPassword', {
                required: 'La nueva contraseña es requerida',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
                }
              })}
            />
            {errors.newPassword && (
              <div className="invalid-feedback">{errors.newPassword.message}</div>
            )}
          </div>
          
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmar Nueva Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              {...register('confirmPassword', {
                required: 'Debe confirmar la nueva contraseña',
                validate: value => value === password || 'Las contraseñas no coinciden'
              })}
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">{errors.confirmPassword.message}</div>
            )}
          </div>
          
          <div className="d-flex justify-content-end">
            <button 
              type="button" 
              className="btn btn-secondary me-2" 
              onClick={onRequestClose}
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
                  Cambiando...
                </>
              ) : (
                'Cambiar Contraseña'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ChangePassword; 