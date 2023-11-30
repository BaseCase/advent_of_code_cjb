import * as r from 'ramda'
import { log } from './utils.js'


const moves_part1 = {
  'forward': ([x, z], n) => [x + n, z],
  'up': ([x, z], n) => [x, z - n],
  'down': ([x, z], n) => [x, z + n],
}

const moves_part2 = {
  'forward': ([x, z, aim], n) => [(x + n), (z + aim * n), (aim)],
  'up': ([x, z, aim], n) => [x, z, aim - n],
  'down': ([x, z, aim], n) => [x, z, aim + n],
}

const parseMove = r.compose(
  ([dir, amt]) => [dir, Number.parseInt(amt)],
  r.split(' '))

const followMoves = moveset => r.reduce(
  (pos, [dir, amt]) => moveset[dir](pos, amt),
  [0, 0, 0])

function day02(input) {
  const parsed = r.pipe(r.trim, r.split('\n'), r.map(parseMove))(input)
  const part01 = r.pipe(
    followMoves(moves_part1),
    r.apply(r.multiply),
  )
  const part02 = r.pipe(
    followMoves(moves_part2),
    r.take(2),
    r.apply(r.multiply),
  )

  return [part01(parsed), part02(parsed)]
}

// const example_data = `
// forward 5
// down 5
// forward 8
// up 3
// down 8
// forward 2
// `
// console.log(day02(example_data))   // should be [150, 900]

export { day02 }
