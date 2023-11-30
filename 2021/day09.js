import * as r from 'ramda'
import { log } from './utils.js'


const neighbor_coords = ([x, y]) => [
  [x, y-1],
  [x-1, y],
  [x+1, y],
  [x, y+1],
]


function find_low_points(a) {
  let low_points = []

  for (let y=0; y<a.length; ++y) {
    for (let x=0; x<a[0].length; ++x) {
      let this_value = a[y][x]
      let neighbor_values = r.pipe(
        neighbor_coords,
        r.map(([x, y]) => a[y]?.[x]),
        r.reject(r.isNil),
      )([x, y])
      if (r.all(v => this_value < v, neighbor_values)) {
        low_points.push([x, y])
      }
    }
  }

  return low_points
}

const point_to_str = r.join(',')

function find_basin_around(point, map) {
  let to_check = [point]
  let checked = new Set()

  while (to_check.length) {
    let p = to_check.pop()
    let neighbors = neighbor_coords(p)
    neighbors.forEach(n => {
      if (checked.has(point_to_str(n))) return

      let [x, y] = n
      let value = map[y]?.[x]
      if (value !== undefined && value !== 9)
        to_check.push(n)
    })
    checked.add(point_to_str(p))
  }

  return checked
}


function day09(input) {
  const data = r.pipe(
    r.trim,
    r.split('\n'),
    r.map(r.pipe(
      r.split(''),
      r.map(Number.parseInt))))(input)

  const part01 = r.pipe(
    find_low_points,
    r.map(([x, y]) => data[y][x]),
    r.map(r.inc),
    r.sum,
  )(data)

  const low_points = find_low_points(data)
  const basins = r.map(p => find_basin_around(p, data), low_points)

  const part02 = r.pipe(
    r.map(s => s.size),
    r.sort(r.subtract),
    r.takeLast(3),
    r.reduce(r.multiply, 1),
  )(basins)

  return [part01, part02]
}


// const example_data = `
// 2199943210
// 3987894921
// 9856789892
// 8767896789
// 9899965678
// `
// console.log(day09(example_data))    // [15, 1134]


export { day09 }
