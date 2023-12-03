import { any, dropRepeats, equals, filter, fromPairs, has, head, isNil, join, last, map, mergeAll, multiply, pipe, range, reduce, reject, split, sum, toPairs, xprod } from 'ramda'
import { as_lines, map_indexed, match_with_indices } from './utils.js'


const point_to_key = join(',')
const key_to_point = pipe(split(','), map(Number.parseInt))

const matches_at_coords = regex => pipe(
  map_indexed((line, y) => map(
    ([symbol, x]) => [point_to_key([x, y]), symbol],
    match_with_indices(regex, line))),
  map(fromPairs),
  mergeAll
)

const find_symbols = matches_at_coords(/[^\d.]/g)
const find_numbers = matches_at_coords(/\d+/g)

const perimeter_of = (point_str, length) => {
  const [x, y] = key_to_point(point_str)
  return [
    ...(xprod(range(x - 1, x + length + 1), [y - 1])),   // row above given
    ...([[x - 1, y], [x + length, y]]),                      // row of given
    ...(xprod(range(x - 1, x + length + 1), [y + 1]))    // row below given
  ].map(point_to_key)
}

export function day03(input) {
  const lines = as_lines(input)
  const symbols_at = find_symbols(lines)
  const numbers_at = find_numbers(lines)

  const part01 = pipe(
    toPairs,
    filter(([k, n]) => any(k => has(k, symbols_at), perimeter_of(k, n.length))),
    map(pipe(last, Number.parseInt)),
    sum
  )(numbers_at)

  const all_spaces_containing_number = pipe(
    toPairs,
    map(([k, n]) => {
      const [x, y] = key_to_point(k)
      return fromPairs(map(p => [point_to_key(p), n], xprod(range(x, x + n.length), [y])))
    }),
    mergeAll,
  )(numbers_at)

  const part02 = pipe(
    filter(equals('*')),
    toPairs,
    map(pipe(
      head,
      p => {
        const perimeter = perimeter_of(p, 1)
        const neighbors = pipe(
          map(a => all_spaces_containing_number[a]),
          reject(isNil),
          dropRepeats,
        )(perimeter)
        if (neighbors.length === 2) {
          return pipe(map(Number.parseInt), reduce(multiply, 1))(neighbors)
        } else {
          return 0
        }
      }
    )),
    sum
  )(symbols_at)

  return [part01, part02]
}
