import { useState, type ReactNode } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "~/constants";

interface Resize {
  active: boolean;
  startX: number;
  startY: number;
}

export function BaseCard({
  pos,
  dim,
  onPositionUpdate,
  onSizeUpdate,
  onDelete,
  children,
}: {
  pos: Position;
  dim: Dimensions;
  onPositionUpdate: (position: Position) => void;
  onSizeUpdate: (size: Dimensions) => void;
  onDelete: () => void;
  children: ReactNode;
}) {
  const [position, setPosition] = useState<Position>(pos);
  const [dimensions, setDimensions] = useState<Dimensions>(dim);
  const [resize, setResize] = useState<Resize>({
    active: false,
    startX: 0,
    startY: 0,
  });

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
    }),
    []
  );

  const style = {
    position: "absolute",
    top: `${position.y}px`,
    left: `${position.x}px`,
    opacity: `${opacity}`,
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
  };

  const startResizing = (e: MouseEvent) => {
    const startX = e.pageX;
    const startY = e.pageY;

    let newWidth = dimensions.width;
    let newHeight = dimensions.height;

    const stopResizing = (e: MouseEvent) => {
      setResize({ ...resize, active: false });
      document.body.removeEventListener("mousemove", resizeCard);
      onSizeUpdate({ width: newWidth, height: newHeight });
    };

    const resizeCard = (e: MouseEvent) => {
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;
      newWidth = dimensions.width + diffX;
      newHeight = dimensions.height + diffY;

      setResize({ ...resize, startX: e.clientX, startY: e.clientY });
      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    };

    setResize({ active: true, startX: e.clientX, startY: e.clientY });

    document.body.addEventListener("mousemove", resizeCard);
    document.body.addEventListener("mouseup", stopResizing, { once: true });
  };

  return (
    <>
      <div style={style}>
        <div ref={dragRef} className="bg-blue-500 h-8">
          <button
            onClick={() => onDelete()}
            className="text-center float-right text-xl mr-2 hover:text-red-400"
          >
            x
          </button>
        </div>
        {children}
        {/* Bottom bar: Resizing */}
        <div
          className="bg-white border opacity-10 hover:bg-amber-100 w-full h-4"
          onMouseDown={startResizing}
        />
      </div>
    </>
  );
}
