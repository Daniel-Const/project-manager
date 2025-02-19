function SaveIcon({
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

export default function Toolbar({}: {}) {
  return (
    <>
      <div className="absolute top-48 right-8 bg-gray-800 h-36 p-2">
        <p className="text-2xl">Saving...</p>
      </div>
    </>
  );
}
