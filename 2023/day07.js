import * as r from 'ramda'
import { log, as_lines, head_lens, map_indexed } from './utils.js'


const card_ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']

const hand_type = h => {
  const set_sizes = r.pipe(r.collectBy(r.identity), r.map(r.length))(h)
  return set_sizes.some(s => s === 5) ? 7
    : set_sizes.some(s => s === 4) ? 6
      : set_sizes.some(s => s === 3) && set_sizes.some(s => s === 2) ? 5
        : set_sizes.some(s => s === 3) ? 4
          : set_sizes.filter(s => s === 2).length === 2 ? 3
            : set_sizes.some(s => s === 2) ? 2
              : 1
}

const score_hand = ([h, b]) => ({
  hand: h,
  type_score: hand_type(h),
  card_scores: r.map(c => card_ranks.indexOf(c), h),
  bid: Number.parseInt(b),
})

const pairwise_compare = r.pipe(
  r.apply(r.zip),
  r.reduce(
    (comp, [a, b]) => comp !== 0 ? comp : a - b,
    0))

const part01 = r.pipe(
  as_lines, r.map(r.split(' ')),
  r.map(score_hand),
  r.sortWith([
    r.ascend(r.prop('type_score')),
    (a, b) => pairwise_compare([a.card_scores, b.card_scores]),
  ]),
  map_indexed((hand, rank) => hand.bid * (rank+1)),
  r.sum
)


export const day07 = input => part01(input)

const example_data = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`
console.dir(day07(example_data), { depth: null })
