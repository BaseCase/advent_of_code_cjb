import { all, apply, compose, count, drop, equals, find, juxt, map, partition, pipe, range, reverse, sum, take, transpose, zip } from 'ramda'
import { group_by_blank_lines, not_equals } from './utils.js'


const count_non_reflective = pivot => pipe(
  juxt([compose(reverse, take(pivot)), drop(pivot)]),
  apply(zip),
  count(apply(not_equals)))

const all_rows_reflect_at = pivot => all(compose(equals(0), count_non_reflective(pivot)))

const all_rows_but_one_reflect_at = pivot => pipe(
  map(count_non_reflective(pivot)),
  partition(equals(1)),
  ([ones, others]) => ones.length === 1 && all(equals(0), others))

const find_in_range = fn => rows => find(
  i => fn(i)(rows),
  range(1, rows[0].length))

const calculate = criteria => pipe(
  group_by_blank_lines,
  map(pipe(
    xs => [xs, transpose(xs)],
    map(find_in_range(criteria)),
    ([col_pivot, row_pivot]) => col_pivot ? col_pivot : (100 * row_pivot)
  )),
  sum)

const part01 = calculate(all_rows_reflect_at)
const part02 = calculate(all_rows_but_one_reflect_at)

export const day13 = juxt([part01, part02])
