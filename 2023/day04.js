import {apply, intersection, last, length, map, match, pipe, pluck, range, split, sum} from 'ramda'
import {as_lines, map_indexed} from './utils.js'

const numbers = /(\d+)/g

const matching_number_counts = map(pipe(
  split(':'), last, split('|'),
  map(match(numbers)),
  apply(intersection),
  length
))

function tally_cards(given_cards) {
  const cards = map_indexed((n, idx) => [idx+1, n, 1], given_cards) // [[card ID, card score, # duplicates of this card]]
  for (let [card, score, duplicates] of cards) {
    for (let i of range(card+1, card+1+score)) {
      let to_dupe = cards.find(([id]) => id === i)
      to_dupe[2] += duplicates
    }
  }
  return cards
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
  tally_cards,
  pluck(2),
  sum
)

export const day04 = input => [part01(input), part02(input)]
