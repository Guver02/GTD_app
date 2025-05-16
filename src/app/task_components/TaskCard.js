import React from "react";
import { useDataStore } from "../../store/data_store";
import * as styles from "./TaskCard.module.css";

const { cardContainer, cardContent } = styles;

function TaskCard({ itemId }) {
  const item = useDataStore((state) => state.tasks[itemId]);

    const heightClasses = ["randomHeightSmall", "randomHeightMedium", "randomHeightLarge"];
    const randomClass = heightClasses[Math.floor(Math.random() * heightClasses.length)];

  if (!item) return null;

  return (
    <div className={`${cardContainer} ${styles[randomClass]}`}>
      <div className={cardContent}>
        <h3>{item.item_name}</h3>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

export { TaskCard };
