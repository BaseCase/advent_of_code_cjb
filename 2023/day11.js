import { all, count, equals, isNil, map, median, pipe, range, reduce, reject, split, sum, transpose, xprod } from 'ramda'
import { as_lines, chain_indexed, map_indexed } from './utils.js'


const all_empty = all(equals('.'))

const empty_idxs = rows => reduce(
  (empties, idx) => all_empty(rows[idx]) ? [...empties, idx] : empties,
  [],
  range(0, rows[0].length))

const find_empty_space = pipe(
  as_lines, map(split('')),
  the_map => [empty_idxs(the_map), empty_idxs(transpose(the_map))])

const find_galaxies = pipe(
  as_lines,
  chain_indexed((row, y) =>
    map_indexed((col, x) => col === '#' ? [x, y] : null, row)
  ), reject(isNil))

export const day11 = input => {
  const [empty_rows, empty_cols] = find_empty_space(input)
  const galaxy_coords = find_galaxies(input)
  const point_pairs = xprod(galaxy_coords, galaxy_coords)

  const calculate_scaled_distance = ([x1, y1], [x2, y2], scale) => {
    const empty_rows_between = count(y => y === median([y1, y2, y]), empty_rows)
    const empty_cols_between = count(x => x === median([x1, x2, x]), empty_cols)
    const x_dist = (Math.abs(x1 - x2) - empty_cols_between) + (empty_cols_between * scale)
    const y_dist = (Math.abs(y1 - y2) - empty_rows_between) + (empty_rows_between * scale)
    return x_dist + y_dist
  }

  const part01 = sum(point_pairs.map(([p1, p2]) => calculate_scaled_distance(p1, p2, 2))) / 2
  const part02 = sum(point_pairs.map(([p1, p2]) => calculate_scaled_distance(p1, p2, 1000000))) / 2

  return [part01, part02]
}
