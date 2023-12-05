const file = Bun.file("input")

const parts: Array<Array<string>> = await file.text()
  .then(text => text.trim().split("\n\n"))
  .then(parts => parts.map(part => part.split("\n")))

let seeds: Array<number> = parts[0][0]
  .split(": ")[1]
  .split(" ")
  .map(Number)

let size = 0
for (let i = 1; i < seeds.length; i += 2) {
  size += seeds[i]
}

let newSeeds: Array<number> = new Array(size)

let index = 0
for (let i = 0; i < seeds.length; i += 2) {
  const start = seeds[i]
  const range = seeds[i+1]

  for (let j = start; j < start + range; j++) {
    newSeeds[index++] = j
  }
}

seeds = newSeeds

type Step = Array<[number, number, number]>

const steps: Array<Step> = parts
  .slice(1)
  .map(
    step =>
      step
        .slice(1)
        .map(
          line =>
            line.split(" ").map(Number)
        ) as Step
  )

const locations = seeds
  .map(
    seed =>
      steps.reduce(
        (acc, step) => tryProcess(step, acc),
        seed
      )
  )

function tryProcess(step: Step, number: number): number {
  return step
    .reduce(
      (acc, [dst, src, range]) =>
        acc ||= inRange(number, src, range)
          ? dst + (number - src)
          : acc,
      null as number | null
    ) ?? number
}

function inRange(number: number, src: number, range: number): boolean {
  return number >= src && number < src + range
}

console.log("result", minFromArray(locations))

function minFromArray(arr: Array<number>): number {
  let min = arr[0]
  for(let i = 1; i < arr.length; i++) {
    min = arr[i] > min ? min : arr[i]
  }
  return min
}
