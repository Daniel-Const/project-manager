function ToolbarButton({
  text,
  handleClick,
}: {
  text: string;
  handleClick: () => void;
}) {
  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
    >
      {text}
    </button>
  );
}

export default function Toolbar({
  onCreateCard,
  onSave,
}: {
  onCreateCard: () => void;
  onSave: () => void;
}) {
  return (
    <>
      <div className="flex flex-col absolute top-48 left-8 bg-gray-800 h-48 p-2">
        <ToolbarButton handleClick={onCreateCard} text="Add note" />
        <ToolbarButton handleClick={onSave} text="Save" />
      </div>
    </>
  );
}
