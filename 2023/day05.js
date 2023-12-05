import { compose, head, isEmpty, map, min, pipe, reduce, splitEvery, splitWhenever, tail } from 'ramda'
import { as_lines, lazy_series, parse_numbers } from './utils.js'


const groups = pipe(
  as_lines,
  splitWhenever(compose(isEmpty, head))
)

const parse_seeds = pipe(groups, head, head, parse_numbers)

const parse_maps = pipe(
  groups,
  tail,
  map(pipe(
    tail,
    map(pipe(
      parse_numbers,
      xs => ({ src: xs[1], dst: xs[0], range: xs[2] })
    ))
  ))
)

const apply_map = (value, mapping) => {
  const custom = mapping.find(m => m.src <= value && (m.src+m.range-1) >= value)
  return custom ? (custom.dst - custom.src + value) : value
}

const chain_map = mappings => value => reduce(apply_map, value, mappings)

export function day05(input) {
  const seeds = parse_seeds(input)
  const maps = parse_maps(input)
  const map_all = chain_map(maps)

  const part01 = Math.min(...seeds.map(map_all))

  const seeds_pairs = splitEvery(2, seeds)
  const mins_per_pair = seeds_pairs.map(([start, len]) => reduce(
    (lowest, seed) => min(lowest, map_all(seed)),
    Infinity,
    lazy_series(start, start+len))
  )
  const part02 = Math.min(...mins_per_pair)

  return [part01, part02]
}
