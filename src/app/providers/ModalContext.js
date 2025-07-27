import React from "react";
import { createContext, useContext, useState } from "react";
import { Modal } from "../ui_components/Modal";

const ModalContext = createContext();

function ModalProvider ({ children }) {
  const [modalContent, setModalContent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setModalContent(null), 300);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen, modalContent }}>
      {children}
      <Modal/>
    </ModalContext.Provider>
  );
};

export {ModalContext, ModalProvider}
