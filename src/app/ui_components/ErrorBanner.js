import React from 'react';
import * as styles from './ErrorBanner.module.css';

const {
  cardContainer, // Renombrada de modalContainer
  closeButton,
  iconContainer,
  errorIcon,
  title,
  message,
  buttonContainer,
  quitButton,
  tryAgainButton,
} = styles;

function ErrorBanner({
    principalMesssage,
    onClose,
    secondaryMessage = null,
    onQuit = null,
    onTryAgain = null
}) {
  return (
    <div className={cardContainer}> {/* Usamos cardContainer */}
      <button className={closeButton} onClick={onClose}>
        &times;
      </button>
      <div className={iconContainer}>
        <svg
          className={errorIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2 className={title}>{principalMesssage}</h2>
      {secondaryMessage &&
        <p className={message}>{secondaryMessage}</p>
      }
      <div className={buttonContainer}>

        {onQuit &&
            <button className={quitButton} onClick={onQuit}>
                Cancelar
            </button>
        }
        {onTryAgain &&
            <button className={tryAgainButton} onClick={onTryAgain}>
                Intentar de Nuevo
            </button>
        }
      </div>
    </div>
  );
}

export { ErrorBanner };
