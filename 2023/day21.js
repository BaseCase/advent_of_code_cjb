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

const normalize_point = (width, height) => (x, y) => [
    x < 0 ? (x % width + width) : (x % width),
    y < 0 ? (y % height + height) : (y % height)
  ]

const normalize_key = (width, height) => r.pipe(
  key_to_point,
  ([x, y]) => [
    x < 0 ? (x % width + width) : (x % width),
    y < 0 ? (y % height + height) : (y % height)
  ],
  point_to_key
)


const draw_grid = (grid, reachable) => {
  const points = r.map(key_to_point, [...reachable]).concat(r.map(key_to_point, Object.keys(grid)))

  const minX = Math.min(...points.map(p => p[0]))
  const minY = Math.min(...points.map(p => p[1]))
  const maxX = Math.max(...points.map(p => p[0]))
  const maxY = Math.max(...points.map(p => p[1]))

  let normalizer = normalize_point(131, 131)

  for (let y=minY; y<=maxY; ++y) {
    for (let x=minX; x<=maxX; ++x) {
      let key = point_to_key(normalizer(x, y))
      let char = grid[key]
      if (reachable.has(point_to_key([x,y]))) {
        char = 'O'
      }
      process.stdout.write(char)
    }
    process.stdout.write('\n')
  }
}



const infinite_grid_count = (grid, start, steps) => {
  // TODO: calculate grid bounds instead of hard-coding
  let width = 131
  let height = 131

  let normalizer = normalize_key(width, height)

  let currently_at = new Set([start])
  let reachable = new Set()

  for (let step=steps; step>=0; --step) {
    reachable = new Set()

    for (let key of currently_at) {
      for (let p of neighbor_keys(key)) {
        let normalized = normalizer(p)
        if (grid[normalized] === '.' || grid[normalized] === 'S') {
          reachable.add(p)
        }
      }
    }

    currently_at = reachable
  }

  // draw_grid(grid, reachable)

  return reachable.size
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

  // draw_grid(grid)


  /*
  from visual inspection:
  - our grid is: blocks: 2089, open: 15072, total: 17161
     - it takes 64 steps to go from start to a diamond that exactly reaches all 4 edges of the starting box
        - at that point, 3797 spaces are reachable. that's 299 less than 64^2
     - at 128 steps, we've covered hit the middle of the next grid portions, which makes sense, since we started in the middle.
        - at that point, 14838 spaces are reachable
     - at 192, 32971 are reachable.
     - I think the answer is:
           1. figure out how many triangles you've occupied.
           2. how many reachables are there in those triangles?
           3. and then figure out how to calculate the in-between? maybe enumerate how much you can each step in between a run of 64?
   */

  const part02 = infinite_grid_count(grid, start, 512)
  // const part02 = 'hi'

  // for (let i=128; i<=192; ++i) {
  //   let count = infinite_grid_count(grid, start, i)
  //   log(`${i}\t${count}`)
  // }

  // const blocks = r.count(r.equals('#'), r.values(grid))
  // const opens = r.count(r.equals('.'), r.values(grid))
  // log(`blocks: ${blocks}, open: ${opens + 1}, total: ${blocks + opens + 1}`)

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

// console.log(day21(example))
