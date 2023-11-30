import * as r from 'ramda'
import { log } from './utils.js'


const inc_at_idx = (xs, idx) => r.update(idx, xs[idx] + 1, xs)
const advance_state = current => {
  const next = [...current]
  next[0] = current[1]
  next[1] = current[2]
  next[2] = current[3]
  next[3] = current[4]
  next[4] = current[5]
  next[5] = current[6]
  next[6] = current[7] + current[0]
  next[7] = current[8]
  next[8] = current[0]

  return next
}


function day06(input) {
  const start = r.pipe(r.trim, r.split(','), r.map(Number.parseInt))(input)

  const simulate = turns => r.pipe(
    r.reduce(
      inc_at_idx,
      [0, 0, 0, 0, 0, 0, 0, 0, 0,]
    ),
    (buckets) => {
      let state = [...buckets]
      for (let i=0; i<turns; ++i) {
        state = advance_state(state)
      }
      return state
    },
    r.sum
  )

  const part01 = simulate(80)(start)
  const part02 = simulate(256)(start)

  return [part01, part02]
}


// const example_data = `
// 3,4,3,1,2
// `
// console.log(day06(example_data))   // [5934, 26984457539]


export { day06 }
