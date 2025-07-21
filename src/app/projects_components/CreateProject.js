import React, { useState, useContext } from 'react';
import * as style from './CreateProject.module.css'; // Importa los estilos desestructurados
import { useDataStore } from '../../store/data_store';
import { ModalContext } from '../providers/ModalContext';
import { useProjectService } from '../../controllers/projectController';
import { useLanguage } from '../custom_hooks/useLanguage';

const {
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
    const {translation} = useLanguage()
    const {createProject} = useProjectService()
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  const availableColors = useDataStore((state) => state.colors); // Accede a los colores desde el contexto

  const [selectedColor, setSelectedColor] = useState(availableColors[0]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleCreate = () => {
    console.log('MAIN')
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
        <h2>{translation.newProject}</h2>
        <input
          type="text"
          className={inputTittle}
          placeholder={translation.projectName}
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className={inputDescription}
          placeholder={translation.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className={colorSelectorContainer}>
          <label>{`${translation.color}:`}</label>
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
            {translation.cancel}
          </button>
          <button
            type="button"
            className={createButton}
            onClick={handleCreate}
            disabled={!projectName}
          >
            {translation.save}
          </button>
        </div>
      </div>

  );
}

export { CreateProject };
