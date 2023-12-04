import { any, apply, filter, has, last, map, multiply, pipe, range, reduce, reject, sum, toPairs, values, xprod } from 'ramda'
import { as_lines, key_to_point, matches_with_coords, point_to_key } from './utils.js'


const find_symbols = matches_with_coords(/[^\d.]/g)
const find_numbers = matches_with_coords(/\d+/g)

const perimeter_of = (point_str, length) => {
  const [x, y] = key_to_point(point_str)
  return [
    ...xprod(range(x-1, x+length+1), [y-1, y+1]),
    [x - 1, y], [x + length, y],
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
  )

  const part02 = pipe(
    toPairs,
    reduce((gears, [p, n]) => {
      perimeter_of(p, n.length).forEach(perim_p => {
        if (symbols_at[perim_p] === '*') {
          gears[perim_p] = [...(gears[perim_p] ?? []), n]
        }
      })
      return gears
    }, {}),
    values,
    reject(xs => xs.length !== 2),
    map(pipe(map(Number.parseInt), apply(multiply))),
    sum
  )

  return [part01(numbers_at), part02(numbers_at)]
}
