import { useDrop } from "react-dnd";
import { ItemTypes } from "~/constants";
import type { ReactNode } from "react";

export default function Canvas({ children }: { children: ReactNode }) {
  const [_, drop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      drop(_item: unknown, monitor): unknown {
        const didDrop = monitor.didDrop();
        if (didDrop) {
          return;
        }
        return { position: monitor.getClientOffset() };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    []
  );

  return (
    <>
      <main
        ref={drop}
        className="flex items-center justify-center pt-16 pb-4 w-screen h-screen"
      ></main>
      {children}
    </>
  );
}
