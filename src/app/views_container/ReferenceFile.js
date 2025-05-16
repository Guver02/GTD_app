import React from "react";
import * as styles from "./ReferenceFile.module.css";
import { TaskCard } from "../task_components/TaskCard";
import { useDataStore } from "../../store/data_store";

const {
  masonryContainer,
  masonryTitle,
  masonryGrid,
  scrollContainer
} = styles;

function ReferenceFile ({specialReferenceFileID}) {
    const tasks = useDataStore((state) => state.tasks);
    const unsectionsByProject = useDataStore((state) => state.unsectionsByProject);
    const rFileProject = useDataStore(state => state.specialProjectsBySpecialId[specialReferenceFileID])

    const filteredRFile = () => {
        return Object.values(tasks)
        .filter((task) =>
            (task.parent_id === unsectionsByProject[rFileProject.id].id))
        .sort((a, b) => a.order - b.order)
    }

    const tasksRFile = filteredRFile()

  return (
    <div className={masonryContainer}>
      <h2 className={masonryTitle}>Reference File</h2>
      <div className={scrollContainer}>
        <div className={masonryGrid}>
        {tasksRFile.map(item => (
          <TaskCard key={item.id} itemId={item.id} />
        ))}
        </div>
      </div>
    </div>
  );
}

export {ReferenceFile}
