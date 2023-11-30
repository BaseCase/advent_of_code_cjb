import * as r from 'ramda'
import { log } from './utils.js'


const point_to_str = r.join(',')
const describes_straight_line = ([x1, y1, x2, y2]) => x1 === x2 || y1 === y2

const range_from_endpoints = ([a, b]) => {
  if (a < b) return r.range(a, b + 1)
  else return r.reverse(r.range(b, a + 1))
}

const update_map_with_line = (map, line) => {
  const x_range = range_from_endpoints([line[0], line[2]])
  const y_range = range_from_endpoints([line[1], line[3]])
  const all_points = x_range.length === y_range.length ? r.zip(x_range, y_range) : r.xprod(x_range, y_range)

  return r.reduce(
    (m, p) => {
      const key = point_to_str(p)
      const overlaps = r.propOr(0, key, m)
      m[key] = overlaps + 1   // mutate here instead of r.assoc for performance
      return m
    },
    map,
    all_points
  )
}


function day05(input) {
  const lines = r.pipe(            // list of line endpoints, [x1, y1, x2, y2]
    r.trim,
    r.split('\n'),
    r.map(r.pipe(
      r.split('->'),
      r.map(r.split(',')),
      r.flatten,
      r.map(Number.parseInt),
    ))
  )(input)

  const count_overlaps_bigger_than_1 = (the_map) => r.pipe(   // passing in the reducer acc here to avoid aliasing, since we mutate it for perf
    r.reduce(update_map_with_line, the_map),
    r.values,
    r.filter(r.gt(r.__, 1)),
    r.length,
  )

  const part01 = count_overlaps_bigger_than_1({})(r.filter(describes_straight_line, lines))
  const part02 = count_overlaps_bigger_than_1({})(lines)

  return [part01, part02]
}


// const example_data = `
// 0,9 -> 5,9
// 8,0 -> 0,8
// 9,4 -> 3,4
// 2,2 -> 2,1
// 7,0 -> 7,4
// 6,4 -> 2,0
// 0,9 -> 2,9
// 3,4 -> 1,4
// 0,0 -> 8,8
// 5,5 -> 8,2
// `

// console.log(day05(example_data))   // [5, 12]

export { day05 }
