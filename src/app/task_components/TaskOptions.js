import React from "react";
import * as style from "./TaskOptions.module.css";
import { useTaskService } from "../../controllers/taskController";
import { Edit, Sun, Trash2 } from 'lucide-react';
import { useLanguage } from "../custom_hooks/useLanguage";

const {
  sectionOptionsContainer,
  sectionOptionsList
} = style;

function TaskOptions({ id, onClose, onEdit, onNextAction }) {
  const { deleteTask } = useTaskService();
  const {translation} = useLanguage()

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
            <span>{translation.edit}</span>
          </button>
        </li>
        <li>
          <button onClick={handleNextAction}>
            <Sun />
            <span>{translation.nextAction}</span>
          </button>
        </li>
        <li>
          <button onClick={handleDelete}>
            <Trash2 />
            <span>{translation.delete}</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export { TaskOptions };
