// satisfy TS without installing deps
declare const Bun: { file: (input: string) => { text: () => Promise<string> } };

const file = Bun.file(
  "input",
);

// inner array is [number, number] pair
let numbers: Array<Array<number>>;

// Part 1

numbers = await file.text()
  .then(
    (text) =>
      text.trim().split("\n").map((line) =>
        line.replace(/\s+/g, " ").split(": ")[1].split(" ").map(Number)
      )
        .reduce((acc, arr) => {
          arr.forEach((el, i) =>
            acc.at(i) == null ? acc.push([el]) : acc[i].push(el)
          );

          return acc;
        }, [] as number[][]),
  );

// Part 2

numbers = [
  await file.text()
    .then((text) =>
      text.trim().split("\n").map((line) =>
        Number(line.replace(/\s+/g, " ").split(": ")[1].split(" ").join(""))
      )
    ),
];

console.log(numbers);

console.log(
  numbers.reduce((acc, [time, distance]) => {
    let race = 0;
    for (let i = 1; i < time; i++) {
      const timeLeft = time - i;
      const speed = i;

      if (timeLeft * speed > distance) race += 1;
    }

    return acc * race;
  }, 1),
);
