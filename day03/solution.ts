// God forgive me for this awful code

interface Coordinate {
  row: number;
  column: number;
}

const file = await Deno.readTextFile("input");

const lines = file.trim().split("\n");

// Part 1

const adjacent = gatherAdjacentNumbers(lines);

const sum = adjacent.reduce((acc, number) => acc + number, 0);

console.log(sum);

function gatherAdjacentNumbers(
  lines: Array<string>,
): Array<number> {
  return lines.reduce(
    (adjacent, line, row) => {
      for (let i = 0; i < line.length; i++) {
        if (isDigit(line[i])) {
          const digits = numberLength(line, i);
          let isAdjacent = false;

          for (let j = i; j < i + digits; j++) {
            isAdjacent ||= checkAround(lines, { row: row, column: j });
          }

          if (isAdjacent) {
            adjacent.push(Number.parseInt(line.slice(i, i + digits)));
          }

          i += digits - 1;
          continue;
        }
      }

      return adjacent;
    },
    [] as Array<number>,
  );
}

function numberLength(str: string, startingAt: number): number {
  let length = 0;

  while (
    isDigit(str[startingAt + length]) &&
    length < str.length
  ) length += 1;

  return length;
}

function checkAround(
  lines: Array<string>,
  coordinate: Coordinate,
): boolean {
  for (let i = coordinate.row - 1; i <= coordinate.row + 1; i++) {
    for (let j = coordinate.column - 1; j <= coordinate.column + 1; j++) {
      const char = lines.at(i)?.at(j);

      if (char && isSpecial(char)) return true;
    }
  }

  return false;
}

function isSpecial(char: string): boolean {
  return char !== "." && !isDigit(char);
}

function isDigit(char: string): boolean {
  return "1234567890".includes(char);
}

// Part 2

interface Neighbour {
  value: number;
  startCoordinates: Coordinate;
}

const gears: Map<string, Array<Neighbour>> = new Map();

saveToGears(lines);

gears.forEach((v, k) => console.log(`${k} - ${JSON.stringify(v)}`));

const sumOfProducts = [...gears.values()].reduce(
  (acc, gear) =>
    acc +
    (gear.length == 2
      ? gear.reduce((acc, neighbour) => acc * neighbour.value, 1)
      : 0),
  0,
);

console.log(sumOfProducts)

function serializeCoordinate(coordinate: Coordinate): string {
  return `${coordinate.row}+${coordinate.column}`;
}

function saveToGears(
  lines: Array<string>,
): void {
  lines.forEach(
    (line, row) => {
      for (let i = 0; i < line.length; i++) {
        if (isDigit(line[i])) {
          const digits = numberLength(line, i);
          const parsedNumber = Number.parseInt(line.slice(i, i + digits));
          const startCoordinates = { row: row, column: i };

          for (let j = i; j < i + digits; j++) {
            saveToAdjacentGears(
              lines,
              { row: row, column: j },
              parsedNumber,
              startCoordinates,
            );
          }

          i += digits - 1;
          continue;
        }
      }
    },
  );
}

function saveToAdjacentGears(
  lines: Array<string>,
  coordinate: Coordinate,
  number: number,
  startCoordinates: Coordinate,
): void {
  for (let i = coordinate.row - 1; i <= coordinate.row + 1; i++) {
    for (let j = coordinate.column - 1; j <= coordinate.column + 1; j++) {
      const char = lines.at(i)?.at(j);

      if (char && char === "*") {
        const coordinate = serializeCoordinate({ row: i, column: j });

        const gear = gears.get(coordinate) ?? [];

        const doesCoordinateAlreadyExist = gear.length !== 0
          ? gear.some((neighbour) =>
            sameCoordinates(startCoordinates, neighbour.startCoordinates)
          )
          : false;

        console.log(number, coordinate, doesCoordinateAlreadyExist);

        if (!doesCoordinateAlreadyExist) {
          gear.push({ value: number, startCoordinates: startCoordinates });
        }

        gears.set(coordinate, gear);
      }
    }
  }
}

function sameCoordinates(a: Coordinate, b: Coordinate): boolean {
  return (
    a.row === b.row &&
    a.column === b.column
  );
}
