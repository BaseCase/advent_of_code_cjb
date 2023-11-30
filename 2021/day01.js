import * as r from 'ramda'
import { log } from './utils.js'


const neighbors = xs => r.zip(xs, r.tail(xs))
const increasing_pair = r.apply(r.lt)
const trios = xs =>
      r.zip(
        neighbors(xs),
        r.tail(r.tail(xs)))

function day01(input) {
  const parsed = r.pipe(r.trim, r.split('\n'), r.map(Number.parseInt))(input)

  const part1 = r.pipe(
    neighbors,
    r.count(increasing_pair),
  )

  const part2 = r.pipe(
    trios,
    r.map(r.compose(r.sum, r.flatten)),
    neighbors,
    r.count(increasing_pair),
  )

  return [part1(parsed), part2(parsed)]
}



// const example_data = `
// 199
// 200
// 208
// 210
// 200
// 207
// 240
// 269
// 260
// 263
// `
// console.log(day01(example_data))   // should be [7, 5]


export { day01 }
