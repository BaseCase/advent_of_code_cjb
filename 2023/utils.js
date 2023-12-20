import { argv } from 'node:process'
import { addIndex, chain, complement, compose, curry, equals, fromPairs, head, isEmpty, join, lensIndex, map, match, mergeAll, pipe, split, splitWhenever, trim } from 'ramda'


export function log(thing) {
  const filepath = argv[1].split('/')
  const filename = filepath[filepath.length-1]
  // if (filename !== 'index.js')
    console.log(thing)
  return thing
}

export const as_lines = compose(split('\n'), trim)
export const group_by_blank_lines = pipe(as_lines, splitWhenever(compose(isEmpty, head)))
export const head_lens = lensIndex(0)
export const second_lens = lensIndex(1)
export const map_indexed = addIndex(map)
export const chain_indexed = addIndex(chain)
export const point_to_key = join(',')
export const key_to_point = pipe(split(','), map(Number.parseInt))
export const parse_numbers = compose(map(Number.parseInt), match(/(-?\d+)/g))
export const not_equals = complement(equals)

export const gcd = (a, b) => b ? gcd(b, a % b) : a
export const lcm = (a, b) => a * b / gcd(a, b)

// given a 2D array, map over each element, returning a flat array. callback fn takes args (element, x, y)
export const grid_map = curry((fn, grid) =>
  chain_indexed((row, y) =>
    map_indexed((el, x) => fn(el, x, y), row), grid))

export const matches_with_indices = (regexp, str) => {
  const matches = str.matchAll(regexp)
  return Array.from(matches).map(m => [m[0], m.index])
}

export const matches_with_coords = regex => pipe(
  map_indexed((line, y) => map(
    ([thing, x]) => [point_to_key([x, y]), thing],
    matches_with_indices(regex, line))),
  map(fromPairs),
  mergeAll
)

export function* lazy_series(start, end) {
  for (let i = start; i < end; ++i) {
    yield i
  }
}

export function* infinite_sequence(seed) {
  let i = 0
  while (true) {
    let el = seed[i++]
    yield el
    if (i === seed.length) i = 0
  }
}
