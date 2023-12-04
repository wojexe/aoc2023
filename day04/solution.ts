const input = await Deno.readTextFile("input");

const lines = input.trim().split("\n");

// Part 1

const part1 = lines.reduce(
  (acc, line) => {
    const [_id, winning, rolled] = parseLine(line);

    const winningSet = new Set(winning);

    const cardResult = rolled.reduce(
      (acc, number) => winningSet.has(number) ? plusOne(acc) : acc,
      0,
    );

    return acc + cardResult;
  },
  0,
);

function plusOne(num: number): number {
  if (num === 0) return 1;
  else return num * 2;
}

function parseLine(line: string): [number, Array<number>, Array<number>] {
  const [game, numbers] = line.split(": ");

  const [winning, rolled] = numbers
    .split(" | ")
    .map((part) =>
      part.replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .map(Number)
    );

  const gameID = parseInt(game.slice(4).trim());

  return [gameID, winning, rolled];
}

console.log(part1);

// Part 2

const cardCopies: Array<number> = new Array(lines.length + 1).fill(1);

const part2 = lines.reduce(
  (acc, line) => {
    const [id, winning, rolled] = parseLine(line);

    const numberOfCopies = cardCopies[id];

    const winningSet = new Set(winning);

    const cardResult = rolled.reduce(
      (acc, number) => winningSet.has(number) ? acc + 1 : acc,
      0,
    );

    for (let i = 1; i <= cardResult; i++) {
      cardCopies[id + i] += numberOfCopies;
    }

    return acc + numberOfCopies;
  },
  0,
);

console.log(part2);

