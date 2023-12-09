// satisfy TS without installing deps
declare const Bun: { file: (input: string) => { text: () => Promise<string> } };

const file = Bun.file(
  "input_example",
);

const lines = await file.text().then((text) => text.trim().split("\n"));

// Shared

type History = Array<number>;

const histories: Array<History> = lines
  .map((line) => line.split(" ").map(Number));

console.log(process(histories, predictFromHistory1));
console.log(process(histories, predictFromHistory2));

function process(
  histories: Array<History>,
  predict: (_: History) => number,
): number {
  const predictions = histories.map((history) => predict(history));

  return predictions.reduce((acc, prediction) => acc + prediction, 0);
}

// Part 1

function predictFromHistory1(history: History): number {
  const lowerArray = Array(history.length - 1);

  for (let i = 1; i < history.length; i++) {
    lowerArray[i - 1] = history[i] - history[i - 1];
  }

  let pred;

  if (lowerArray.every((el) => el === 0)) pred = 0;
  else pred = predictFromHistory1(lowerArray);

  return history.at(-1)! + pred;
}

// Part 2

function predictFromHistory2(history: History): number {
  const lowerArray = Array(history.length - 1);

  for (let i = history.length - 1; i >= 0; i--) {
    lowerArray[i - 1] = history[i] - history[i - 1];
  }

  let pred;

  if (lowerArray.every((el) => el === 0)) pred = 0;
  else pred = predictFromHistory2(lowerArray);

  return history[0] - pred;
}
