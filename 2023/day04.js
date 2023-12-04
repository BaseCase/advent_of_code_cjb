import { apply, intersection, last, length, map, match, pipe, split, sum } from 'ramda'
import { as_lines } from './utils.js'

const numbers = /(\d+)/g

const matching_number_counts = map(pipe(
  split(':'), last, split('|'),
  map(match(numbers)),
  apply(intersection),
  length
))

function tally_cards(starting_stack) {
  let count = 0
  let stack = starting_stack.map((n, idx) => [idx+1, n, 1])   // [card id, card score, number of dupes]
  while (stack.length !== 0) {
    let [card, score, value] = stack.shift()
    count += value
    if (score === 0) continue

    for (let i=0; i<value; ++i) {
      for (let j=card+1; j < card+1+score; ++j) {
        let to_dupe = stack.find(([id]) => id === j)
        if (to_dupe === undefined) continue
        to_dupe[2] += 1
      }
    }
  }
  return count
}

const part01 = pipe(
  as_lines,
  matching_number_counts,
  map(x => x === 0 ? 0 : 2**(x-1)),
  sum
)

const part02 = pipe(
  as_lines,
  matching_number_counts,
  tally_cards
)

export const day04 = input => [part01(input), part02(input)]
