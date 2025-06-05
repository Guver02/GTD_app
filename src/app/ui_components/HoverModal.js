import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import * as styles from "./HoverModal.module.css";

function HoverModal({
  ParentComponent,
  bubbleComponent,
  position = "bottom",
  gap = 10
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const { optionContainer } = styles;

  const closeModal = () => setShowOptions(false);

  const calculatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const positions = {
      bottom: {
        top: rect.bottom + gap + window.scrollY + 92,
        left: rect.left + rect.width / 2 + window.scrollX
      },
      top: {
        top: rect.top - gap + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX
      },
      left: {
        top: rect.top + rect.height / 2 + window.scrollY,
        left: rect.left - gap + window.scrollX - 92
      },
      right: {
        top: rect.top + rect.height / 2 + window.scrollY,
        left: rect.right + gap + window.scrollX + 92
      }
    };

    setBubblePosition(positions[position] || positions.bottom);
  };

  useEffect(() => {
    if (showOptions) {
      calculatePosition();
    }
  }, [showOptions]);

  return (
    <div
      className={optionContainer}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
      ref={triggerRef}
    >
      {ParentComponent}

      {showOptions &&
        ReactDOM.createPortal(
          <div
            className={styles.optionsBubble}
            style={{
              position: "fixed",
              top: bubblePosition.top,
              left: bubblePosition.left,
              transform: "translate(-50%, -50%)",
              zIndex: 1000
            }}
            onMouseEnter={() => setShowOptions(true)} // mantener abierto al pasar sobre el bubble
            onMouseLeave={() => setShowOptions(false)} // cerrar cuando el mouse sale
          >
            {bubbleComponent(closeModal)}
          </div>,
          document.body
        )}
    </div>
  );
}

export { HoverModal };
