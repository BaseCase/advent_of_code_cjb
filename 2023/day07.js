import { apply, ascend, collectBy, identity, juxt, length, map, partition, pipe, prop, reduce, sort, sortWith, split, sum, zip } from 'ramda'
import { as_lines, map_indexed } from './utils.js'


const card_ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
const card_ranks_part2 = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']

const hand_type = (h, allow_jokers) => {
  let sets = collectBy(identity, h)
  let num_jokers = 0

  if (allow_jokers) {
    const [jokers, normies] = partition(s => s[0] === 'J', sets)
    num_jokers = jokers[0]?.length ?? 0
    if (num_jokers === 5) return 7
    sets = normies
  }

  const set_sizes = pipe(map(length), sort((a, b) => b - a))(sets)
  set_sizes[0] += num_jokers

  return set_sizes[0] === 5 ? 7
    : set_sizes[0] === 4 ? 6
      : set_sizes[0] === 3 && set_sizes[1] === 2 ? 5
        : set_sizes[0] === 3 ? 4
          : set_sizes[0] === 2 && set_sizes[1] === 2 ? 3
            : set_sizes[0] === 2 ? 2
              : 1
}

const score_hand = ([h, b], allow_jokers) => ({
  hand: h,
  type_score: hand_type(h, allow_jokers),
  card_scores: map(c => (allow_jokers ? card_ranks_part2 : card_ranks).indexOf(c), h),
  bid: Number.parseInt(b),
})

const pairwise_compare = pipe(
  apply(zip),
  reduce(
    (comp, [a, b]) => comp !== 0 ? comp : a - b,
    0))

const calculate_score = allow_jokers => pipe(
  as_lines, map(split(' ')),
  map(h => score_hand(h, allow_jokers)),
  sortWith([
    ascend(prop('type_score')),
    (a, b) => pairwise_compare([a.card_scores, b.card_scores]),
  ]),
  map_indexed((hand, rank) => hand.bid * (rank+1)),
  sum
)

const part01 = calculate_score(false)
const part02 = calculate_score(true)

export const day07 = juxt([part01, part02])
