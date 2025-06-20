import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as style from './GlobalTooltip.module.css';

const {
  tooltipContainer,
  tooltipContent,
  tooltipTextStyle,
  tooltipButton,
  show,
  hide
} = style;

const TooltipContext = createContext(null);

function GlobalTooltipProvider({ children }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [onButtonClick, setOnButtonClick] = useState(() => () => {});
  const timerRef = useRef(null);

  const ANIMATION_DURATION = 300;

  const showTooltip = useCallback(({ tooltipText, buttonText, onButtonClick, duration }) => {
    setTooltipText(tooltipText);
    setButtonText(buttonText);
    setOnButtonClick(() => onButtonClick);
    setShouldRender(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (duration) {
      timerRef.current = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
      }, duration);
    }
  }, []);

  const hideTooltip = useCallback(() => {
    setIsVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeout(() => setShouldRender(false), ANIMATION_DURATION);
  }, []);

  useEffect(() => {
    if (shouldRender) {
      setIsVisible(true);
    }
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      setIsVisible(false);
    }
  }, [shouldRender]);

  const value = { showTooltip, hideTooltip };

  return (
    <TooltipContext.Provider value={value}>
      {children}
      {ReactDOM.createPortal(
        shouldRender && (
          <div className={`${tooltipContainer} ${isVisible ? show : hide}`}>
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

function useGlobalTooltip() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('useGlobalTooltip must be used within GlobalTooltipProvider');
  }
  return context;
}

export { GlobalTooltipProvider, useGlobalTooltip };
