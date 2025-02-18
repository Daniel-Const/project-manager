import { useState, type ReactNode } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "~/constants";

export function Draggable({
  position,
  onPositionUpdate,
  children,
}: {
  position: Position;
  onPositionUpdate: (position: Position) => void;
  children: ReactNode;
}) {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      collect: (monitor) => {
        return { opacity: monitor.isDragging() ? 0.5 : 1 };
      },
      end: (_item, monitor) => {
        if (monitor.didDrop()) {
          const result = monitor.getDropResult() as DropResult;
          onPositionUpdate(result.position);
        }
      },
    }),
    []
  );

  const style = {
    position: "absolute",
    top: `${position.y}px`,
    left: `${position.x}px`,
    opacity: `${opacity}`,
  };

  return (
    <div ref={dragRef} style={style}>
      {children}
    </div>
  );
}
