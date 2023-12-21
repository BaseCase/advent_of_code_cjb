import * as r from 'ramda'
import { as_lines, grid_map, key_to_point, log, point_to_key } from './utils.js'


const parse = r.pipe(
  as_lines,
  grid_map((cell, x, y) => [point_to_key([x,y]), cell]),
  r.fromPairs
)

const find_start = r.pipe(r.invertObj, r.prop('S'))

const neighbor_keys = r.pipe(
  key_to_point,
  ([x, y]) => [[x, y-1], [x+1, y], [x, y+1], [x-1, y]],
  r.map(point_to_key)
)

const normalize_key = (width, height) => r.pipe(
  key_to_point,
  ([x, y]) => [
    x < 0 ? (x % width + width) : (x % width),
    y < 0 ? (y % height + height) : (y % height)
  ],
  point_to_key
)


// IDEA:
//    - Given a starting position and a number of steps, memoize the following:
//          1. how many places you could reach within one grid
//          2. *where* you step onto a new grid and how many steps remained at that point
//    - If we memoize on (starting_key, steps), and recurse,
//      I think we can sum it up easily


const infinite_grid_count = (grid, start, steps) => {
  // TODO: calculate grid bounds instead of hard-coding
  let width = 11
  let height = 11

  let normalizer = normalize_key(width, height)

  const reachable_count_and_new_spawns = r.memoizeWith(
    (starting_key, steps) => `${starting_key}@${steps}`,
    (starting_key, steps) => {
      let currently_at = new Set([starting_key])
      let reachable = new Set()
      let count = 0

      for (let step=steps; step>=0; --step) {
        // log(`on step ${step}`)
        reachable = new Set()
        let new_spawns = []

        for (let key of currently_at) {
          // log(`looking at point ${key}`)
          for (let p of neighbor_keys(key)) {
            // log(`neigborino? ${p}`)
            if (grid[p] === undefined) {
              // log(`that's off the grid`)
              new_spawns.push(normalizer(p))
            }
            if (grid[p] === '.' || grid[p] === 'S') {
              reachable.add(p)
            }
          }
        }

        count = reachable.size
        // log(`we can reach ${count} within our borders`)
        // log(`we kicked off ${new_spawns} recursively`)
        for (let p of new_spawns) {
          count += reachable_count_and_new_spawns(p, step-1)
        }

        currently_at = reachable
      }

      return count
    })

  return reachable_count_and_new_spawns(start, steps)
}






const spaces_reachable_after_steps = (grid, start, steps) => {
  let currently_at = new Set([start])
  let reachable = new Set()

  r.times(() => {
    reachable = new Set()

    for (let key of currently_at) {
      for (let p of neighbor_keys(key)) {
        if (grid[p] === '.' || grid[p] === 'S') {
          reachable.add(p)
        }
      }
    }

    currently_at = reachable
  }, steps)

  return reachable.size
}


export const day21 = input => {
  const grid = parse(input)
  const start = find_start(grid)
  const part01 = spaces_reachable_after_steps(grid, start, 6)

  const part02 = infinite_grid_count(grid, start, 5000)

  return [part01, part02]
}


const example = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`

console.log(day21(example))
