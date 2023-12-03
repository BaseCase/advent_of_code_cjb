import { argv } from 'node:process'
import { addIndex, compose, lensIndex, map, match, split, trim, zip } from 'ramda'


export function log(thing) {
  const filepath = argv[1].split('/')
  const filename = filepath[filepath.length-1]
  // if (filename !== 'index.js')
    console.log(thing)
  return thing
}

export const as_lines = compose(split('\n'), trim)

export const second_lens = lensIndex(1)

export const map_indexed = addIndex(map)

export const match_with_indices = (regexp, str) => {
  const matches = str.matchAll(regexp)
  return Array.from(matches).map(m => [m[0], m.index])
}
