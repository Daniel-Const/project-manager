import { useDrop } from "react-dnd";
import { ItemTypes } from "~/constants";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

export default function Canvas({ drawColor, children }: { drawColor: string, children: ReactNode }) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const canvasRef = useRef<RefObject<HTMLCanvasElement>>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>(null);


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

  // Initialise Canvas rendering context reference + canvas size
  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight })
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
      ctxRef.current = ctx;
    }
  }, []);

  const startDrawing = (e: { nativeEvent: { offsetX: number; offsetY: number; }; }) => {
    if (!ctxRef.current) return
    ctxRef.current.strokeStyle = drawColor;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  const endDrawing = () => {
    if (!ctxRef.current) return
    ctxRef.current.closePath();
    console.log('end drawing ', ctxRef.current)

    setIsDrawing(false);
  };

  const draw = (e: { nativeEvent: { offsetX: number; offsetY: number; }; }) => {
    if (!isDrawing || !ctxRef.current) {
      return;
    }

    ctxRef.current.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );

    ctxRef.current.stroke();
  };

  return (
    <>
      <div
        ref={drop}
        className="flex items-center justify-center bg-transparent"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          width={`${size.width}px`}
          height={`${size.height}px`}
        />
      </div>
      {children}
    </>
  );
}
