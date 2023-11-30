import * as r from 'ramda'
import { log } from './utils.js'


const majority_in_column = (col, count, tiebreaker) => r.pipe(
  r.map(r.pipe(
    r.nth(col),
    Number.parseInt)),
  r.sum,
  x => x > (count/2) ? 1 : x === (count/2) ? tiebreaker : 0
)

const minority_in_column = (col, count, tiebreaker) => r.pipe(
  r.map(r.pipe(
    r.nth(col),
    Number.parseInt)),
  r.sum,
  x => x < (count/2) ? 1 : x === (count/2) ? tiebreaker : 0
)

const inverse = r.map(x => x === 1 ? 0 : 1)
const bitlist_to_int = bits => Number.parseInt(bits.join(''), 2)

function day03(input) {
  const data = r.pipe(r.trim, r.split('\n'), r.map(r.split('')))(input)

  const gamma = r.times(col => (
    majority_in_column(col, data.length, 1)(data)
  ), data[0].length)
  const epsilon = inverse(gamma)
  const part01 = bitlist_to_int(gamma) * bitlist_to_int(epsilon)

  let readings = [...data]
  let col = 0
  while (readings.length > 1) {
    readings = readings.filter(r =>
      Number.parseInt(r[col]) === majority_in_column(col, readings.length, 1)(readings)
    )
    col++
  }
  const oxygen_reading = bitlist_to_int(readings[0])

  readings = [...data]
  col = 0
  while (readings.length > 1) {
    readings = readings.filter(r =>
      Number.parseInt(r[col]) === minority_in_column(col, readings.length, 0)(readings)
    )
    col++
  }
  const co2_reading = bitlist_to_int(readings[0])
  const part02 = co2_reading * oxygen_reading

  return [part01, part02]
}


// const example_data = `
// 00100
// 11110
// 10110
// 10111
// 10101
// 01111
// 00111
// 11100
// 10000
// 11001
// 00010
// 01010
// `

// console.log(day03(example_data))   // should be [198, 230]


export { day03 }
