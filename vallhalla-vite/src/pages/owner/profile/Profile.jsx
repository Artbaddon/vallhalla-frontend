import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { profileAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import ChangePassword from '../../../components/common/ChangePassword';
import toast from 'react-hot-toast';

const OwnerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { user, updateUser } = useAuth();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await profileAPI.getMyProfile();
        reset(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      const response = await profileAPI.update(data.profile_id, data);
      toast.success('Perfil actualizado con éxito');
      
      // Update user context if name changed
      if (data.first_name !== user.firstName || data.last_name !== user.lastName) {
        updateUser({
          firstName: data.first_name,
          lastName: data.last_name
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="card">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando información del perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Mi Perfil</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="first_name" className="form-label">Nombre</label>
                <input
                  type="text"
                  className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                  id="first_name"
                  {...register('first_name', { required: 'El nombre es requerido' })}
                />
                {errors.first_name && <div className="invalid-feedback">{errors.first_name.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="last_name" className="form-label">Apellido</label>
                <input
                  type="text"
                  className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                  id="last_name"
                  {...register('last_name', { required: 'El apellido es requerido' })}
                />
                {errors.last_name && <div className="invalid-feedback">{errors.last_name.message}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="document_type" className="form-label">Tipo de Documento</label>
                <select
                  className={`form-select ${errors.document_type ? 'is-invalid' : ''}`}
                  id="document_type"
                  {...register('document_type', { required: 'El tipo de documento es requerido' })}
                >
                  <option value="">Seleccione...</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PP">Pasaporte</option>
                </select>
                {errors.document_type && <div className="invalid-feedback">{errors.document_type.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="document_number" className="form-label">Número de Documento</label>
                <input
                  type="text"
                  className={`form-control ${errors.document_number ? 'is-invalid' : ''}`}
                  id="document_number"
                  {...register('document_number', { required: 'El número de documento es requerido' })}
                />
                {errors.document_number && <div className="invalid-feedback">{errors.document_number.message}</div>}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  {...register('phone', { required: 'El teléfono es requerido' })}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
              </div>
              <div className="col-md-6">
                <label htmlFor="birth_date" className="form-label">Fecha de Nacimiento</label>
                <input
                  type="date"
                  className={`form-control ${errors.birth_date ? 'is-invalid' : ''}`}
                  id="birth_date"
                  {...register('birth_date')}
                />
                {errors.birth_date && <div className="invalid-feedback">{errors.birth_date.message}</div>}
              </div>
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="is_tenant"
                {...register('is_tenant')}
              />
              <label className="form-check-label" htmlFor="is_tenant">
                Soy inquilino de este apartamento
              </label>
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Cambiar Contraseña</h4>
        </div>
        <div className="card-body">
          <p className="text-muted">
            Para cambiar su contraseña, haga clic en el botón a continuación.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button className="btn btn-outline-primary" onClick={openPasswordModal}>
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>

      <ChangePassword 
        isOpen={isPasswordModalOpen} 
        onRequestClose={closePasswordModal} 
      />
    </div>
  );
};

export default OwnerProfile; 