// satisfy TS without installing deps
declare const Bun: { file: (input: string) => { text: () => Promise<string> } };

const file = Bun.file(
  "input",
);

const input = await file.text().then((text) => text.trim());

class Position {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  north(): Position {
    return new Position(this.row - 1, this.col);
  }

  south(): Position {
    return new Position(this.row + 1, this.col);
  }

  east(): Position {
    return new Position(this.row, this.col + 1);
  }

  west(): Position {
    return new Position(this.row, this.col - 1);
  }

  eq(b: Position) {
    return this.row === b.row && this.col === b.col;
  }

  stringify() {
    return `${this.row}+${this.col}`;
  }

  static fromString(str: string): Position {
    const [row, col] = str.split("+").map(Number);

    return new Position(row, col);
  }
}

const PipeConnection = {
  NS: "|",
  EW: "-",
  NE: "L",
  NW: "J",
  SW: "7",
  SE: "F",
  GROUND: ".",
  STARTING: "S",
} as const;

type ObjectValues<T> = T[keyof T];
type PipeCharacters = ObjectValues<typeof PipeConnection>;

class PipeMap {
  map: Array<Array<PipeCharacters>>;
  startingPos: Position;

  constructor(input: string) {
    const lines = input.split("\n");

    this.map = lines.map((line) => line.split("") as Array<PipeCharacters>);

    this.startingPos = lines.reduce(
      (acc, line, row) =>
        acc ??
          (line.includes("S") ? new Position(row, line.indexOf("S")) : null),
      null as Position | null,
    )!;

    console.log(this.startingPos.stringify());
  }

  getDistances() {
    const distances = this.BFS();

    return distances;
  }

  private BFS(): Map<string, number> {
    let distance = 0;
    const queue = [this.startingPositions()];
    const visited: Map<string, number> = new Map();

    visited.set(this.startingPos.stringify(), distance++);

    while (queue.length !== 0) {
      const positions = queue.shift()!;
      const next: Array<Position> = [];

      for (const pos of positions) {
        visited.set(pos.stringify(), distance);

        const availableUnvisitedNeighbours = this
          .getAvailableNeighbours(pos)
          .filter((neighbour) => !this.wasVisited(neighbour, visited));

        next.push(...availableUnvisitedNeighbours);
      }

      distance += 1;

      if (next.length !== 0) queue.push(next);
    }

    return visited;
  }

  private getAvailableNeighbours(pos: Position): Array<Position> {
    const curr = this.map[pos.row][pos.col];

    const potentialPositions = [];

    switch (curr) {
      case "|":
        potentialPositions.push(pos.north(), pos.south());

        break;
      case "-":
        potentialPositions.push(pos.east(), pos.west());

        break;
      case "L":
        potentialPositions.push(pos.north(), pos.east());

        break;
      case "J":
        potentialPositions.push(pos.north(), pos.west());

        break;
      case "7":
        potentialPositions.push(pos.south(), pos.west());

        break;
      case "F":
        potentialPositions.push(pos.south(), pos.east());

        break;
      case ".":
      case "S":
    }

    return potentialPositions.filter((pos) => this.validPosition(pos));
  }

  private startingPositions() {
    const pos = this.startingPos;

    const possibleNeighbours = [
      pos.north(),
      pos.south(),
      pos.east(),
      pos.west(),
    ];

    return (
      possibleNeighbours
        .filter(
          (pos) =>
            this.validPosition(pos) &&
            this
              .getAvailableNeighbours(pos)
              .map((el) => el.stringify())
              .includes(this.startingPos.stringify()),
        )
    );
  }

  private wasVisited(pos: Position, visited: Map<string, number>) {
    return visited.has(pos.stringify());
  }

  private validPosition(pos: Position) {
    return (
      pos.row >= 0 && pos.row < this.map.length &&
      pos.col >= 0 && pos.col < this.map[pos.row].length
    );
  }
}

const pipeMap = new PipeMap(input);

const distances = pipeMap.getDistances();

console.log(distances);
console.log(Math.max(...distances.values()));
