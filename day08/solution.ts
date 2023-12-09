// satisfy TS without installing deps
declare const Bun: { file: (input: string) => { text: () => Promise<string> } };

const file = Bun.file(
  "input",
);

const [directionsString, instructionsString] = await file.text().then((text) =>
  text.trim().split("\n\n")
);

type Direction = "R" | "L";

const directions: Array<Direction> = directionsString
  .split("") as Array<Direction>;

function* nextDirectionGenerator() {
  let index = 0;

  while (true) {
    yield directions[index++ % directions.length];
  }
}

const instructions: Map<string, { left: string; right: string }> =
  instructionsString
    .split("\n")
    .map(
      (line) => line.split(" = "),
    )
    .map(
      ([source, directions]) => {
        const [left, right] = directions.match(/([a-zA-Z0-9]{3})/g)!;
        return { source: source, left: left, right: right };
      },
    )
    .reduce(
      (acc, { source, left, right }) => {
        acc.set(source, { left: left, right: right });
        return acc;
      },
      new Map(),
    );

console.log(directions);
console.log(instructions);

// Part 1

function partOne() {
  let position = "AAA";
  let steps = 0;
  const direction = nextDirectionGenerator();

  while (position !== "ZZZ") {
    const { left, right } = instructions.get(position)!;

    switch (direction.next().value) {
      case "L":
        position = left;
        break;
      case "R":
        position = right;
        break;
      default:
        throw "No more directions?!";
    }

    steps += 1;
  }

  console.log(steps);
}

// Part 2

  const positions = [...instructions.keys()].filter((key) => key.endsWith("Z"));
console.log(positions)

function partTwo() {
  const positions = [...instructions.keys()].filter((key) => key.endsWith("A"));
  let steps = 0;
  const direction = nextDirectionGenerator();

  while (!positions.every((position) => position.endsWith("Z"))) {
    const currentDirection = direction.next().value;

    // console.log(steps, currentDirection);

    for (let i = 0; i < positions.length; i++) {
      const { left, right } = instructions.get(positions[i])!;

      // const prevPos = positions[i];

      switch (currentDirection) {
        case "L":
          positions[i] = left;
          break;
        case "R":
          positions[i] = right;
          break;
        default:
          throw "No more directions?!";
      }

      // console.log(`${prevPos} -> ${positions[i]}`);
    }

    steps += 1;
  }

  console.log(steps);
}

// partTwo();
