type Color = "red" | "green" | "blue";

const max = {
  red: 12,
  green: 13,
  blue: 14,
};

const file = await Deno.readTextFile("input");

const lines = file.trim().split("\n");

const res = lines.map((line) => parseLine(line))
  .reduce((acc, parsedLine) => acc + parsedLine);

console.log(res);

function parseLine(line: string): number {
  const [game, sets] = line.split(": ");

  const id = parseInt(game.match(/^Game (\d+)/)![1]);

  return sets.split("; ").every((set) => isSetInBounds(set)) ? id : 0;
}

function isSetInBounds(set: string): boolean {
  return set.split(", ").every((color) => isColorInBounds(color));
}

function isColorInBounds(color: string): boolean {
  const [numStr, name] = color.split(" ") as [string, Color]
  const num = parseInt(numStr)
  
  return num <= max[name]
}

// --- Part 2 ---

const res2 = lines.map((line) => parseLine2(line))
  .reduce((acc, parsedLine) => acc + parsedLine);

console.log(res2);

function parseLine2(line: string): number {
  const [_, sets] = line.split(": ");

  const required = sets
    .split("; ")
    .map((set) => getSetsRequired(set))
    .reduce((acc, required) => {
      acc.red = Math.max(acc.red, required.red);
      acc.blue = Math.max(acc.blue, required.blue);
      acc.green = Math.max(acc.green, required.green);

      return acc;
    });

  return required.red * required.green * required.blue;
}

function getSetsRequired(
  set: string,
): { red: number; green: number; blue: number } {
  const required = set.split(", ")
    .reduce((acc, color) => {
      const [numStr, name] = color.split(" ") as [string, Color];
      const num = parseInt(numStr);

      acc[name] = Math.max(acc[name], num);

      return acc;
    }, { red: 0, green: 0, blue: 0 });

  return required;
}
