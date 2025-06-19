import React from "react";
import * as style from "./TaskOptions.module.css";
import { useTaskService } from "../../controllers/taskService";
import { Edit, Sun, Trash2 } from "react-feather";

const {
  sectionOptionsContainer,
  sectionOptionsList
} = style;

function TaskOptions({ id, onClose, onEdit, onNextAction }) {
  const { deleteTask } = useTaskService();

  const handleDelete = () => {
    deleteTask(id);
    onClose();
  };

  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleNextAction = () => {
    onNextAction();
    onClose();
  };


  return (
    <div className={sectionOptionsContainer}>
      <ul className={sectionOptionsList}>

        <li>
          <button onClick={handleEdit}>
            <Edit />
            <span>Editar</span>
          </button>
        </li>
        <li>
          <button onClick={handleNextAction}>
            <Sun />
            <span>Acción siguiente</span>
          </button>
        </li>
        <li>
          <button onClick={handleDelete}>
            <Trash2 />
            <span>Eliminar</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export { TaskOptions };
