import { useState } from "react";

export function NoteCard({
  data,
  handleChange,
}: {
  data: Card;
  handleChange: (title: string, text: string) => void;
}) {
  const [title, setTitle] = useState(data.title);
  const [text, setText] = useState(data.text);

  return (
    <div className="flex flex-col border p-4 h-full">
      <input
        className="w-full bg-transparent border-0 text-2xl pb-4"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          handleChange(e.target.value, text);
        }}
      ></input>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          handleChange(title, e.target.value);
        }}
        className="min-h-4 p-2 h-full"
      ></textarea>
    </div>
  );
}
