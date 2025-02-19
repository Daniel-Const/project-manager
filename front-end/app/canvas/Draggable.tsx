import { useState, type ReactNode } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "~/constants";

export function Draggable({
  pos,
  onPositionUpdate,
  onDelete,
  children,
}: {
  pos: Position;
  onPositionUpdate: (position: Position) => void;
  onDelete: () => void;
  children: ReactNode;
}) {
  const [position, setPosition] = useState<Position>(pos);

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      collect: (monitor) => {
        return { opacity: monitor.isDragging() ? 0.5 : 1 };
      },
      end: (_item, monitor) => {
        if (monitor.didDrop()) {
          const result = monitor.getDropResult() as DropResult;
          setPosition(result.position);
          onPositionUpdate(result.position);
        }
      },
      canDrag: true,
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
    <div style={style}>
      <div ref={dragRef} className="flex bg-blue-500 w-full h-8">
        <button
          onClick={() => onDelete()}
          className="text-center relative ml-100 text-xl mr-2 hover:text-red-400"
        >
          x
        </button>
      </div>
      {children}
    </div>
  );
}
