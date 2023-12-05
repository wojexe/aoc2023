const file = Bun.file("input")

const parts: Array<Array<string>> = await file.text()
  .then(text => text.trim().split("\n\n"))
  .then(parts => parts.map(part => part.split("\n")))

const seeds: Array<number> = parts[0][0]
  .split(": ")[1]
  .split(" ")
  .map(Number)

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

console.log("seeds", seeds)
console.log("steps", steps)

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

console.log("locations", locations)

console.log("result", Math.min(...locations))
