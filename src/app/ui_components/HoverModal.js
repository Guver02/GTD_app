import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import * as styles from "./HoverModal.module.css";

function HoverModal({
  ParentComponent,
  bubbleComponent,
  position = "bottom",
  alignment = "start", // "start" | "center" | "end"
  gap = 10
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const bubbleRef = useRef(null);

  const { optionContainer } = styles;

  const closeModal = () => setShowOptions(false);

  const calculatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    const bubble = bubbleRef.current;

    if (!rect || !bubble) return;

    const bubbleRect = bubble.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = rect.top + scrollY - bubbleRect.height - gap;
        left =
          alignment === "end"
            ? rect.right + scrollX - bubbleRect.width
            : alignment === "center"
            ? rect.left + scrollX + rect.width / 2 - bubbleRect.width / 2
            : rect.left + scrollX;
        break;

      case "bottom":
        top = rect.bottom + scrollY + gap;
        left =
          alignment === "end"
            ? rect.right + scrollX - bubbleRect.width
            : alignment === "center"
            ? rect.left + scrollX + rect.width / 2 - bubbleRect.width / 2
            : rect.left + scrollX;
        break;

      case "left":
        top =
          alignment === "end"
            ? rect.bottom + scrollY - bubbleRect.height
            : alignment === "center"
            ? rect.top + scrollY + rect.height / 2 - bubbleRect.height / 2
            : rect.top + scrollY;
        left = rect.left + scrollX - bubbleRect.width - gap;
        break;

      case "right":
        top =
          alignment === "end"
            ? rect.bottom + scrollY - bubbleRect.height
            : alignment === "center"
            ? rect.top + scrollY + rect.height / 2 - bubbleRect.height / 2
            : rect.top + scrollY;
        left = rect.right + scrollX + gap;
        break;

      default:
        break;
    }

    setBubblePosition({ top, left });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        triggerRef.current?.contains(e.target) ||
        bubbleRef.current?.contains(e.target)
      ) {
        return;
      }
      closeModal();
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  useEffect(() => {
    if (showOptions) {
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }
  }, [showOptions, alignment, position]);

  return (
    <div
      className={optionContainer}
      onClick={() => setShowOptions(true)}
      ref={triggerRef}
    >
      {ParentComponent}

      {showOptions &&
        ReactDOM.createPortal(
          <div
            ref={bubbleRef}
            className={styles.optionsBubble}
            style={{
              position: "absolute",
              top: `${bubblePosition.top}px`,
              left: `${bubblePosition.left}px`,
              zIndex: 1000
            }}
            onMouseEnter={() => setShowOptions(true)}
            onMouseLeave={() => setShowOptions(false)}
          >
            {bubbleComponent(closeModal)}
          </div>,
          document.body
        )}
    </div>
  );
}

export { HoverModal };
