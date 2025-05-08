import React, { useState, useContext } from 'react';
import * as style from './CreateProject.module.css'; // Importa los estilos desestructurados
import { useDataStore } from '../../store/data_store';
import { ModalContext } from '../providers/ModalContext';
import { useProjectService } from '../../services/projectService';

const {
  formCreateContainer,
  formContainer,
  inputTittle,
  inputDescription,
  colorSelectorContainer,
  colorCircle,
  selectedColorCircle,
  actionsContainer,
  cancelButton,
  createButton,
} = style;

function CreateProject() {
    const { closeModal } = useContext(ModalContext)
    const {createProject} = useProjectService()
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState({});
  const availableColors = useDataStore((state) => state.colors); // Accede a los colores desde el contexto

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleCreate = () => {

    createProject({
      item_name: projectName,
      description: description,
      color_id: selectedColor.id,
      myColor: selectedColor,
    });
    closeModal();
  };

  return (

      <div className={formContainer}>
        <h2>Crear Nuevo Proyecto</h2>
        <input
          type="text"
          className={inputTittle}
          placeholder="Nombre del Proyecto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className={inputDescription}
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className={colorSelectorContainer}>
          <label>Color:</label>
          <div>
            {availableColors &&
              availableColors.map((elem) => (
                <button
                  key={elem.color}
                  type="button"
                  className={`${colorCircle} ${
                    selectedColor.id === elem.id ? selectedColorCircle : ''
                  }`}
                  style={{ backgroundColor:  `rgba(${elem.color},0.5)`}}
                  onClick={() => handleColorSelect(elem)}
                ></button>
              ))}
          </div>
        </div>
        <div className={actionsContainer}>
          <button type="button" className={cancelButton} onClick={closeModal}>
            Cancelar
          </button>
          <button
            type="button"
            className={createButton}
            onClick={handleCreate}
            disabled={!projectName}
          >
            Crear
          </button>
        </div>
      </div>

  );
}

export { CreateProject };
