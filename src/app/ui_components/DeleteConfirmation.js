import React from 'react';
import * as styles from './DeleteConfirmation.module.css';

const {
  confirmationContainer,
  confirmationText,
  buttonContainer,
  confirmButton,
  cancelButton,
} = styles;

function DeleteConfirmation ({ itemName, onConfirm, onCancel }) {
  return (
    <div className={confirmationContainer}>
      <p className={confirmationText}>
        ¿Estás seguro de que deseas eliminar el proyecto "{itemName}"?
      </p>
      <div className={buttonContainer}>
        <button className={confirmButton} onClick={onConfirm}>
          Eliminar
        </button>
        <button className={cancelButton} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export {DeleteConfirmation};
