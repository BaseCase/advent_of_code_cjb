import { argv } from 'node:process'
import { compose, lensIndex, split, trim } from 'ramda'


export function log(thing) {
  const filepath = argv[1].split('/')
  const filename = filepath[filepath.length-1]
  if (filename !== 'index.js')
    console.log(thing)
  return thing
}

export const as_lines = compose(split('\n'), trim)

export const second_lens = lensIndex(1)
