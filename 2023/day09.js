import { all, aperture, compose, equals, head, juxt, last, map, pipe, reduceRight, sum, until } from 'ramda'
import { as_lines, parse_numbers } from './utils.js'


const pairwise_differences = compose(map(([a, b]) => b - a), aperture(2))
const predict_right_side = (cur, acc) => acc + (last(cur) ?? 0)
const predict_left_side = (cur, acc) => (head(cur) ?? 0) - acc

const predict = reducer => pipe(
  as_lines, map(parse_numbers),
  map(pipe(
    start => [start],
    until(
      pipe(last, all(equals(0))),
      rows => [...rows, pairwise_differences(last(rows))]
    ),
    reduceRight(reducer, 0)
  )),
  sum)

const part01 = predict(predict_right_side)
const part02 = predict(predict_left_side)

export const day09 = juxt([part01, part02])
