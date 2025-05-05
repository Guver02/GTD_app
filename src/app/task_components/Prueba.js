import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: 8,
    margin: 4,
    border: "1px solid #ccc",
    background: "#fff",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {id}
    </div>
  );
}

function Container({ id, items }) {
  return (
    <div
      style={{
        padding: 8,
        width: 200,
        minHeight: 100,
        background: "#eee",
        marginRight: 16,
      }}
    >
      <SortableContext
        items={items.length > 0 ? items : ["placeholder"]}
        strategy={verticalListSortingStrategy}
      >
        {items.length > 0 ? (
          items.map((item) => <SortableItem key={item} id={item} />)
        ) : (
          <div style={{ padding: 8, color: "#999" }}>[Vacío]</div>
        )}
      </SortableContext>
    </div>
  );
}

export default function App() {
  const [containers, setContainers] = useState({
    A: ["Item 1", "Item 2"],
    B: ["Item 3", "Item 4"],
  });

  const [activeId, setActiveId] = useState(null);
  const [overContainer, setOverContainer] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const findContainer = (id) => {
    return Object.keys(containers).find((key) =>
      containers[key].includes(id)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainerId = findContainer(over.id);

    if (
      !activeContainer ||
      !overContainerId ||
      activeContainer === overContainerId
    )
      return;

    setContainers((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainerId]];

      const itemIndex = activeItems.indexOf(active.id);
      if (itemIndex === -1) return prev;

      const newActiveItems = [...activeItems];
      newActiveItems.splice(itemIndex, 1);

      const newOverItems = [...overItems];
      // Insert at end
      newOverItems.push(active.id);

      return {
        ...prev,
        [activeContainer]: newActiveItems,
        [overContainerId]: newOverItems,
      };
    });

    setOverContainer(overContainerId);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    setOverContainer(null);
  };

  const activeItem = activeId
    ? containers[findContainer(activeId)]?.find((item) => item === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: "flex" }}>
        {Object.entries(containers).map(([id, items]) => (
          <Container key={id} id={id} items={items} />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div
            style={{
              padding: 8,
              margin: 4,
              border: "1px solid #ccc",
              background: "#fff",
            }}
          >
            {activeItem}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export {App}
