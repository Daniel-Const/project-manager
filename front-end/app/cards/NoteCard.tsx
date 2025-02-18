import { useState } from "react";
import { Draggable } from "~/canvas/Draggable";

export function NoteCard({
  data,
  handleChange,
}: {
  data: Card;
  handleChange: (title: string, text: string, position: Position) => void;
}) {
  const [title, setTitle] = useState(data.title);
  const [text, setText] = useState(data.text);
  const [position, setPosition] = useState(data.position);

  return (
    <Draggable
      onPositionUpdate={(position: Position) => {
        setPosition(position);
        handleChange(title, text, position);
      }}
      position={position}
    >
      <div className="bg-blue-500 w-full h-4"></div>

      <div className="flex flex-col border p-4" draggable={false}>
        <input
          className="w-full bg-transparent border-0 text-2xl pb-4"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleChange(e.target.value, text, position);
          }}
        ></input>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleChange(title, e.target.value, position);
          }}
          className="min-h-4 p-2"
        ></textarea>
      </div>
    </Draggable>
  );
}
