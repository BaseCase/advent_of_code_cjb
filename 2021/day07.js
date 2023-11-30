import * as r from 'ramda'
import { log } from './utils.js'


const max_value = r.reduce(r.max, 0)
const min_value = r.reduce(r.min, Infinity)
const isEven = n => n % 2 === 0

const total_cost_of_moving_to = starts => goal => r.pipe(
  r.map(s => Math.abs(s - goal)),
  r.sum,
)(starts)

const total_cost_of_moving_to_fancy_version = starts => goal => {
  const costs = starts.map(s => {
    const dist = Math.abs(s - goal)
    return isEven(dist)
      ? dist * dist/2 + dist/2
      : dist * Math.ceil(dist/2)
  })
  return r.sum(costs)
}


function day07(input) {
  const start_positions = r.pipe(r.trim, r.split(','), r.map(Number.parseInt))(input)
  const upper_bound = max_value(start_positions)

  const part01 = r.pipe(
    r.map(total_cost_of_moving_to(start_positions)),
    min_value,
  )

  const part02 = r.pipe(
    r.map(total_cost_of_moving_to_fancy_version(start_positions)),
    min_value,
  )

  return [
    part01(r.range(0, upper_bound + 1)),
    part02(r.range(0, upper_bound + 1)),
  ]
}


// const example_data = `
// 16,1,2,0,4,2,7,1,2,14
// `
// console.log(day07(example_data))     // [37, 168


export { day07 }
