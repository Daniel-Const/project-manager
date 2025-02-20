interface Position {
  x: number;
  y: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface DropResult {
  dropEffect: string;
  position: Position;
}

interface Card {
  id: string;
  title: string;
  text: string;
  position: Position;
  size: Dimensions;
}
