import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import './PaymentModal.css';

const PaymentModal = ({ show, onHide, onSubmit, payment, isLoading }) => {
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
    if (show && payment) {
      // Populate form for editing
      setValue('ownerId', payment.ownerId || '');
      setValue('description', payment.description || '');
      setValue('amount', payment.amount || '');
      setValue('status', payment.status || 'pending');
      setValue('date', payment.date || '');
      setValue('paymentMethod', payment.paymentMethod || '');
      setValue('referenceNumber', payment.referenceNumber || '');
    } else if (show) {
      // Reset form for creating
      reset();
      setValue('date', new Date().toISOString().split('T')[0]);
      setValue('status', 'pending');
    }
  }, [show, payment, setValue, reset]);

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
      className="payment-modal"
      overlayClassName="modal-overlay"
      contentLabel={payment ? "Editar Pago" : "Nuevo Pago"}
    >
      <div className="modal-header">
        <h5 className="modal-title">
          {payment ? 'Editar Pago' : 'Registrar Pago'}
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
                <label htmlFor="ownerId" className="form-label">
                  Propietario <span className="text-danger">*</span>
                </label>
                <select
                  id="ownerId"
                  className={`form-select ${errors.ownerId ? 'is-invalid' : ''}`}
                  {...register('ownerId', {
                    required: 'El propietario es requerido'
                  })}
                >
                  <option value="">Seleccionar propietario...</option>
                  <option value="1">Juan Pérez</option>
                  <option value="2">María García</option>
                  <option value="3">Carlos López</option>
                </select>
                {errors.ownerId && (
                  <div className="invalid-feedback">
                    {errors.ownerId.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Monto <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  {...register('amount', {
                    required: 'El monto es requerido',
                    min: {
                      value: 0.01,
                      message: 'El monto debe ser mayor a 0'
                    }
                  })}
                />
                {errors.amount && (
                  <div className="invalid-feedback">
                    {errors.amount.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Descripción <span className="text-danger">*</span>
                </label>
                <textarea
                  id="description"
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  rows="3"
                  placeholder="Descripción del pago..."
                  {...register('description', {
                    required: 'La descripción es requerida',
                    minLength: {
                      value: 10,
                      message: 'La descripción debe tener al menos 10 caracteres'
                    }
                  })}
                />
                {errors.description && (
                  <div className="invalid-feedback">
                    {errors.description.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Fecha <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  {...register('date', {
                    required: 'La fecha es requerida'
                  })}
                />
                {errors.date && (
                  <div className="invalid-feedback">
                    {errors.date.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="paymentMethod" className="form-label">
                  Método de Pago <span className="text-danger">*</span>
                </label>
                <select
                  id="paymentMethod"
                  className={`form-select ${errors.paymentMethod ? 'is-invalid' : ''}`}
                  {...register('paymentMethod', {
                    required: 'El método de pago es requerido'
                  })}
                >
                  <option value="">Seleccionar...</option>
                  <option value="cash">Efectivo</option>
                  <option value="transfer">Transferencia</option>
                  <option value="card">Tarjeta</option>
                  <option value="check">Cheque</option>
                </select>
                {errors.paymentMethod && (
                  <div className="invalid-feedback">
                    {errors.paymentMethod.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Estado <span className="text-danger">*</span>
                </label>
                <select
                  id="status"
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                  {...register('status', {
                    required: 'El estado es requerido'
                  })}
                >
                  <option value="pending">Pendiente</option>
                  <option value="completed">Completado</option>
                  <option value="failed">Fallido</option>
                  <option value="cancelled">Cancelado</option>
                </select>
                {errors.status && (
                  <div className="invalid-feedback">
                    {errors.status.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="referenceNumber" className="form-label">
                  Número de Referencia
                </label>
                <input
                  type="text"
                  id="referenceNumber"
                  className={`form-control ${errors.referenceNumber ? 'is-invalid' : ''}`}
                  placeholder="Número de referencia (opcional)"
                  {...register('referenceNumber')}
                />
                {errors.referenceNumber && (
                  <div className="invalid-feedback">
                    {errors.referenceNumber.message}
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
              payment ? 'Actualizar' : 'Registrar'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentModal; 