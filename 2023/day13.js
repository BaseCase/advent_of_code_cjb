import * as r from 'ramda'
import { as_lines, group_by_blank_lines, log, not_equals } from './utils.js'


const row_reflects_at = pivot => r.pipe(
  r.juxt([r.compose(r.reverse, r.take(pivot)), r.drop(pivot)]),
  r.apply(r.zip),
  r.all(r.apply(r.equals))
)

const all_rows_reflect_at = pivot => r.all(row_reflects_at(pivot))

const count_non_reflective = pivot => r.pipe(
  r.juxt([r.compose(r.reverse, r.take(pivot)), r.drop(pivot)]),
  r.apply(r.zip),
  r.count(r.apply(not_equals)),
)

const find_reflection = rows => {
  for (let i=1; i<rows[0].length; ++i) {
    if (all_rows_reflect_at(i)(rows)) {
      return i
    }
  }
  return null
}

const hopefully_theres_just_one_smudge = rows => {
  for (let i=1; i<rows[0].length; ++i) {
    const non_reflective_counts = r.map(count_non_reflective(i), rows)
    const [ones, others] = r.partition(r.equals(1), non_reflective_counts)
    if (ones.length === 1 && r.all(r.equals(0), others))
      return i
  }
  return null
}

const part01 = r.pipe(
  group_by_blank_lines,
  r.map(r.pipe(
    xs => [xs, r.transpose(xs)],
    r.map(find_reflection),
    ([col_pivot, row_pivot]) => col_pivot ? col_pivot : (100 * row_pivot)
  )),
  r.sum
)

const part02 = r.pipe(
  group_by_blank_lines,
  r.map(r.pipe(
    xs => [xs, r.transpose(xs)],
    r.map(hopefully_theres_just_one_smudge),
    ([col_pivot, row_pivot]) => col_pivot ? col_pivot : (100 * row_pivot)
  )),
  r.sum
)

export const day13 = r.juxt([part01, part02])


const example_data = `
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`

console.log(day13(example_data))
