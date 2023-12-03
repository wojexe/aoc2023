const input = await Deno.readTextFile("input");

const lines = input.split("\n").filter((el) => el.length !== 0);

const res = lines.map((line) =>
  line.split("")
    .map((char) => parseInt(char))
    .filter((el) => !isNaN(el))
)
  .map((line) => line.at(0)! * 10 + line.at(-1)!)
  .reduce((acc, elem) => acc + elem);

console.log(res);

// Part 2

function part2(lines: Array<string>): Array<number> {
  const digits = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  const parseDigits = (str: string): number => {
    let front = -1;
    let back = -1;

    // Digit recognition
    const search = (str: string): number => {
      if (!isNaN(parseInt(str.at(0)!))) {
        return parseInt(str.at(0)!);
      }

      for (const digit of digits) {
        if (str.startsWith(digit)) {
          return digits.indexOf(digit) + 1;
        }
      }

      return -1;
    };

    // Get the first digit from the left
    for (let i = 0; i < str.length; i++) {
      const searchResult = search(str.slice(i));

      if (searchResult != -1) {
        front = searchResult;
        break;
      }
    }

    // Get the first digit from the right
    for (let i = str.length - 1; i >= 0; i--) {
      const searchResult = search(str.slice(i));

      if (searchResult != -1) {
        back = searchResult;
        break;
      }
    }

    return front * 10 + back;
  };

  return lines.map((line) => parseDigits(line));
}

const res2 = part2(lines).reduce((acc, num) => acc + num);

console.log(res2)
