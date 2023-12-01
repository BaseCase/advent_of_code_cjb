import { __, filter, head, join, last, map, pipe, reduce, sum, test, zip } from 'ramda'
import { as_lines } from './utils.js'


const words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const w_d_pairs = zip(words, digits)

const words_to_digits = reduce(
  (s, [word, digit]) => s.replaceAll(word, `${word}${digit}${word}`),
  __,
  w_d_pairs
)

const outermost_digits_as_number = pipe(
  filter(test(/\d/)),
  xs => [head(xs), last(xs)],
  join(''),
  Number.parseInt,
)

const part01 = pipe(
  as_lines,
  map(outermost_digits_as_number),
  sum,
)

const part02 = pipe(
  as_lines,
  map(pipe(
    words_to_digits,
    outermost_digits_as_number,
  )),
  sum,
)

export const day01 = input => [part01(input), part02(input)]
