import React, { useState } from "react";
import * as styles from "./HoverModal.module.css";

function HoverModal ({
  ParentComponent,
  bubbleComponent,
  position = "bottom",
  gap = 10
}){
  const [showOptions, setShowOptions] = useState(false);

  const { optionContainer, optionsBubble, ...positions } = styles;

  const closeModal = () => {
    setShowOptions(false)
  }

  const bubbleStyles = {
    bottom: { top: `calc(80% + ${gap}px)`, left: "-200%", transform: "translateX(-50%)" },
    top: { bottom: `calc(80% + ${gap}px)`, left: "20%", transform: "translateX(-50%)" },
    left: { right: `calc(80% + ${gap}px)`, top: "360%", transform: "translateY(-50%)" },
    right: { left: `calc(80% + ${gap}px)`, top: "20%", transform: "translateY(-50%)" }
  };

  return (
    <div
      className={optionContainer}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      {ParentComponent}

      {showOptions && (
        <div
          className={`${optionsBubble} ${positions[position] || positions.bottom}`}
          style={bubbleStyles[position] || bubbleStyles.bottom}
        >

          {bubbleComponent(closeModal)}
        </div>
      )}
    </div>
  );
};

export {HoverModal};
