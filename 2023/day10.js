import { append, compose, difference, fromPairs, head, invertObj, last, map, pipe, prop, range, reduce, split, until, xprod, zipObj } from 'ramda'
import { as_lines, chain_indexed, map_indexed, point_to_key } from './utils.js'


const valid_connections = {
  '|': ['n', 's'],
  '-': ['e', 'w'],
  'L': ['n', 'e'],
  'J': ['n', 'w'],
  '7': ['s', 'w'],
  'F': ['s', 'e'],
  '.': [],
}
const opposite_of = { 'n':'s', 's':'n', 'e':'w', 'w':'e' }

const parse_map = pipe(
  as_lines,
  chain_indexed((row, y) =>
    map_indexed((cell, x) => [point_to_key([x, y]), cell], row)),
  fromPairs)

const neighbor_keys = pipe(
  split(','), map(Number.parseInt),
  ([x, y]) => [[x, y-1], [x+1, y], [x, y+1], [x-1, y]],
  map(point_to_key),
  zipObj(['n', 'e', 's', 'w']))

const obj_key_for_value = val => compose(prop(val), invertObj)

const describe_loop = (pipe_map, start) => until(
  ([path, prev_move]) => (last(path) === head(path)) && path.length > 1,
  ([path, prev_move]) => {
    let cur_point = last(path)
    let next_move = difference(valid_connections[pipe_map[cur_point]], [opposite_of[prev_move]])[0]
    let next_point = neighbor_keys(cur_point)[next_move]
    return [append(next_point, path), next_move]
  },
  [[start], valid_connections[pipe_map[start]][0]]
)

const thresholds = new Set(['-', 'F', 'L'])

const count_inside = (loop, pipe_map) => reduce(
  ([count, inside], point) => {
    let key = point_to_key(point)
    return loop.has(key)
      ? [count, inside !== thresholds.has(pipe_map[key])]
      : [inside ? count+1 : count, inside]
  },
  [0, false],  // [count inside loop, inside loop flag]
  xprod(range(0, 140), range(0, 140))
)

export const day10 = input => {
  const the_map = parse_map(input)
  const start_at = obj_key_for_value('S')(the_map)
  // cheat for given starting position lol
  the_map[start_at] = 'F'
  const loop = describe_loop(the_map, start_at)[0]
  const part01 = Math.floor(loop.length / 2)
  const part02 = count_inside(new Set(loop), the_map)[0]

  return [part01, part02]
}
