import { argv } from 'node:process'
import * as r from 'ramda'
import { addIndex, compose, fromPairs, join, lensIndex, map, mergeAll, pipe, split, trim } from 'ramda'


export function log(thing) {
  const filepath = argv[1].split('/')
  const filename = filepath[filepath.length-1]
  // if (filename !== 'index.js')
    console.log(thing)
  return thing
}

export const as_lines = compose(split('\n'), trim)
export const head_lens = lensIndex(0)
export const second_lens = lensIndex(1)
export const map_indexed = addIndex(map)
export const point_to_key = join(',')
export const key_to_point = pipe(split(','), map(Number.parseInt))
export const parse_numbers = r.compose(r.map(Number.parseInt), r.match(/(\d+)/g))

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
