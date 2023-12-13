import * as r from 'ramda'
import { as_lines, parse_numbers } from './utils.js'

const parse = r.compose(r.map(r.split(' ')), as_lines)

const memoized_counter = r.memoizeWith((a, b) => `${a.join('')}+${b.join('')}`, count_valid)

function count_valid(remaining_cells, remaining_counts) {
  if (remaining_counts.length === 0) {
    if (r.all(c => c === '.' || c === '?', remaining_cells)) {
      return 1
    } else {
      return 0
    }
  }

  if (remaining_cells.length === 0) {
    return 0
  }

  if ((r.sum(remaining_counts) + remaining_counts.length-1) > remaining_cells.length) {
    return 0
  }

  switch(remaining_cells[0]) {
    case '.':
      return memoized_counter(r.tail(remaining_cells), remaining_counts)

    case '#':
      const goal_size = remaining_counts[0]
      const next_chunk = r.take(goal_size, remaining_cells)
      if (next_chunk.length < goal_size) return 0     // this group can't be large enough b/c there's no more list
      if (r.any(r.equals('.'), next_chunk)) return 0  // this group can't be large enough b/c there's a '.' coming up

      const after_this_chunk = r.drop(goal_size, remaining_cells)
      if (after_this_chunk[0] === '#') return 0       // there must be a gap after each group
      // force wildcard to be '.' after a completed group
      return memoized_counter(['.', ...r.tail(after_this_chunk)], r.tail(remaining_counts))

    case '?':
      return memoized_counter(['.', ...r.tail(remaining_cells)], remaining_counts)
        + memoized_counter(['#', ...r.tail(remaining_cells)], remaining_counts)
  }
}

const sum_valid_arrangements = r.pipe(r.map(
  ([row, description]) => memoized_counter(r.split('', row), parse_numbers(description))
  ), r.sum)

export const day12 = input => {
  let stuff = parse(input)
  let big_stuff = parse(input)

  // don't @ me
  for (let i=0; i<big_stuff.length; ++i) {
    let [left, right] = big_stuff[i]
    big_stuff[i][0] = [left, left, left, left, left].join('?')
    big_stuff[i][1] = [right, right, right, right, right].join(',')
  }

  return [sum_valid_arrangements(stuff), sum_valid_arrangements(big_stuff)]
}
