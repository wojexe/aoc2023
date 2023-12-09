// satisfy TS without installing deps
declare const Bun: { file: (input: string) => { text: () => Promise<string> } };

const file = Bun.file(
  "input",
);

const lines = await file.text().then((text) => text.trim().split("\n"));

// Part 1

const cardOrder = "AKQJT98765432J".split("");

const handOrder = (hand: string) => {
  if (fiveOfAKind(hand)) return 1;
  else if (fourOfAKind(hand)) return 2;
  else if (fullHouse(hand)) return 3;
  else if (threeOfAKind(hand)) return 4;
  else if (twoPair(hand)) return 5;
  else if (onePair(hand)) return 6;
  else if (highCard(hand)) return 7;
  else return 8;
};

function fiveOfAKind(hand: string) {
  return hand.split("").every((char) => char === hand[0]);
}

function fourOfAKind(hand: string) {
  const map = new Map();
  hand.split("").forEach((char) => map.set(char, (map.get(char) ?? 0) + 1));
  return map.get(hand[0]) === 4 || map.get(hand[1]) === 4;
}

function fullHouse(hand: string) {
  const map = new Map();
  hand.split("").forEach((char) => map.set(char, (map.get(char) ?? 0) + 1));

  const test = (arr: Array<number>) =>
    arr.length === 2 && (arr[0] === 2 || arr[0] === 3);

  return test([...map.values()]);
}

function threeOfAKind(hand: string) {
  const map = new Map();
  hand.split("").forEach((char) => map.set(char, (map.get(char) ?? 0) + 1));

  const test = (arr: Array<number>) => arr.includes(1) && arr.includes(3);

  return test([...map.values()]);
}

function twoPair(hand: string) {
  const firstR = hand.split("").filter((char) => char !== hand[0]);
  const secondR = firstR.filter((char) => char !== firstR[0]);
  const thirdR = secondR.filter((char) => char !== secondR[0]);

  return (
    (firstR.length === 4 && secondR.length === 2 && thirdR.length === 0) ||
    (firstR.length === 3 && secondR.length === 2 && thirdR.length === 0) ||
    (firstR.length === 3 && secondR.length === 1 && thirdR.length === 0)
  );
}

function onePair(hand: string) {
  const map = new Map();
  hand.split("").forEach((char) => map.set(char, (map.get(char) ?? 0) + 1));
  return [...map.values()].filter((a) => a === 1).length === 3;
}

function highCard(hand: string) {
  const map = new Map();
  hand.split("").forEach((char) => map.set(char, (map.get(char) ?? 0) + 1));
  return [...map.values()].filter((a) => a === 1).length === 5;
}

const parsedInput: Array<[string, number]> = lines
  .map((line) => line.split(" "))
  .map(([hand, bid]) => [hand, parseInt(bid)]);

type OrderedCard = [string, number, number];

const orderedInput: Array<OrderedCard> = parsedInput
  .map(([hand, bid]) => [hand, handOrder(hand), bid]);

const finalOrder = Array
  .from({ length: 8 }, (_, id) => id)
  .flatMap((currentOrder) =>
    orderedInput
      .filter(([_hand, order, _bid]) => order === currentOrder)
  )
  .sort(cardComparator);

function cardComparator(
  a: OrderedCard,
  b: OrderedCard,
): number {
  const [aHand, aOrd, _aBid] = a;
  const [bHand, bOrd, _bBid] = b;

  if (aOrd !== bOrd) return bOrd - aOrd;

  let i = -1;
  let comparison = -1;

  do {
    i += 1;

    comparison = cardOrder.indexOf(bHand[i]) - cardOrder.indexOf(aHand[i]);
  } while (comparison === 0);

  return comparison;
}

const result = finalOrder
  .reduce(
    (acc, [_hand, _ord, bid], i) => acc + bid * (i + 1),
    0,
  );

console.log(result);

function getName(num: number) {
  switch (num) {
    case 1:
      return "Five of a kind";
    case 2:
      return "Four of a kind";
    case 3:
      return "Full house";
    case 4:
      return "Three of a kind";
    case 5:
      return "Two pair";
    case 6:
      return "One pair";
    case 7:
      return "High card";
    case 8:
      return "DEFAULT";
  }
}
