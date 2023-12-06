import { apply, compose, filter, join, juxt, length, map, multiply, pipe, range, reduce, zip } from 'ramda'
import { as_lines, parse_numbers } from './utils.js'


const find_steep_enough_lines = ([goal_x, goal_y]) => filter(
  b => (b * (goal_x-b)) > goal_y,
  range(0, goal_x))

const part01 = pipe(
  as_lines, map(parse_numbers), apply(zip),
  map(compose(length, find_steep_enough_lines)),
  reduce(multiply, 1),
)

const part02 = pipe(
  as_lines, map(compose(Number.parseInt, join(''), parse_numbers)),
  find_steep_enough_lines,
  length,
)

export const day06 = juxt([part01, part02])
