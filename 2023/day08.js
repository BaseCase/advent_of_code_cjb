import * as r from 'ramda'
import { as_lines, infinite_sequence } from './utils.js'


const get_directions = r.pipe(as_lines, r.head, infinite_sequence)
const get_map = r.pipe(
  as_lines, r.drop(2),
  r.map(r.pipe(
    r.match(/([A-Z1-9]{3})/g),
    ([x, y, z]) => [x, [y, z]],
  )), r.fromPairs
)

const next_step_from_seq = (seq) => seq.next().value === 'L' ? 0 : 1
const gcd = (a, b) => b ? gcd(b, a % b) : a
const lcm = (a, b) => a * b / gcd(a, b)

const walk_path = (node_map, dirs_seq, start_node, end_pred) => r.until(
  ([node, _]) => end_pred(node),
  ([node, count]) => [node_map[node][next_step_from_seq(dirs_seq)], count + 1],
  [start_node, 0])

export const day08 = input => {
  const node_map = get_map(input)

  const part01 = walk_path(
    node_map,
    get_directions(input),
    'AAA',
    node => node === 'ZZZ'
  )[1]

  const part02 = r.pipe(
    r.keys, r.filter(s => s[2] === 'A'),
    r.map(start => walk_path(
      node_map,
      get_directions(input),
      start,
      node => node[2] === 'Z')),
    r.pluck(1),
    r.reduce(lcm, 1),
  )(node_map)

  return [part01, part02]
}
