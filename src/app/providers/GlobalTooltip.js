import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import * as style from './GlobalTooltip.module.css';

const {
  tooltipContainer,
  tooltipContent,
  tooltipTextStyle,
  tooltipButton,
  show
} = style;

// Creamos el contexto
const TooltipContext = createContext(null);

function GlobalTooltipProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [onButtonClick, setOnButtonClick] = useState(() => () => {});
  const timerRef = useRef(null);

  const showTooltip = useCallback(({ tooltipText, buttonText, onButtonClick, duration }) => {
    setTooltipText(tooltipText);
    setButtonText(buttonText);
    setOnButtonClick(() => onButtonClick);
    setVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    if (duration) {
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
  }, []);

  const hideTooltip = useCallback(() => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const value = { showTooltip, hideTooltip };

  return (
    <TooltipContext.Provider value={value}>
      {children}
      {ReactDOM.createPortal(
        visible && (
          <div className={`${tooltipContainer} ${show}`}>
            <div className={tooltipContent}>
              <span className={tooltipTextStyle}>{tooltipText}</span>
              {buttonText && (
                <button className={tooltipButton} onClick={onButtonClick}>
                  {buttonText}
                </button>
              )}
            </div>
          </div>
        ),
        document.body
      )}
    </TooltipContext.Provider>
  );
}

// Custom hook para usar el tooltip en cualquier lugar
function useGlobalTooltip() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useGlobalTooltip must be used within GlobalTooltipProvider');
  }
  return context;
}

export { GlobalTooltipProvider, useGlobalTooltip };
