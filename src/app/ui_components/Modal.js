import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ModalContext } from "../providers/ModalContext";
import * as style from './Modal.module.css';

const {
  modalOverlay,
  modalContainer,
  showModal,
  hideModal
} = style;

function Modal() {
  const { isOpen, closeModal, modalContent } = useContext(ModalContext);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutID

    if (isOpen) {
      setShouldRender(true)

    } else {
      setIsVisible(false)
      timeoutID = setTimeout(() => setShouldRender(false), 300)
    }

    return () => {clearTimeout(timeoutID)}
  }, [isOpen]);

  useEffect(() => {
    if(shouldRender){
        requestAnimationFrame(() => {
      setIsVisible(true);
    });
    }
  },[shouldRender])

  if (!shouldRender) return null;

  return createPortal(
    <div className={modalOverlay} onClick={closeModal}>
      <div
        className={`${modalContainer} ${isVisible ? showModal : hideModal}`}
        onClick={(e) => e.stopPropagation()}
      >
        {modalContent}
      </div>
    </div>,
    document.body
  );
}

export { Modal };
