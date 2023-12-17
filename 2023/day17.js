import * as r from 'ramda'
import { as_lines } from './utils.js'


const hash = r.join(',')
// keys are [direction, steps_in_that_direction, x, y]
const expand = h => h.split(',').map(n => Number.parseInt(n, 10))


const vectors = {
  0: [1, 0],   // right
  1: [0, 1],   // down
  2: [-1, 0],  // left
  3: [0, -1],  // up
}

const opposites = {
  0: 2,
  1: 3,
  2: 0,
  3: 1
}


const edsger = (grid, min_straight, max_straight) => {
  let start = [
    [0, 0, 0, 0],
    [1, 0, 0, 0],
  ].map(hash)

  let to_visit = new Set(start)
  let distances = {}
  for (let n of to_visit) distances[n] = 0

  while (to_visit.size) {
    // find shortest unvisited node, slow but short version lol
    let min_node = null
    for (let n of to_visit) {
      if (min_node === null) {
        min_node = n
      } else if (distances[n] < distances[min_node]) {
        min_node = n
      }
    }

    // check neighbors, update paths if shorter from here. neighbors account for distance traveled in straight line
    let [dir, dist, x, y] = expand(min_node)

    let possible_neighbors = []
    for (let [n_dir_str, vec] of Object.entries(vectors)) {
      let n_dir = Number.parseInt(n_dir_str)
      if ((x + vec[0] < 0) || (x + vec[0] > grid[0].length) || (y + vec[1] < 0) || (y + vec[1] >= grid.length)) {
        // off the grid
        continue
      }

      if (n_dir === dir) {
        // continuing in straight line. allowed if we're under the max_straight limit
        if (dist === max_straight) {
          continue
        } else {
          let neigh = hash([dir, dist + 1, x + vec[0], y + vec[1]])
          possible_neighbors.push(neigh)
        }
      } else if (n_dir === opposites[dir]) {
        // reverse 180. not allowed
        continue
      } else {
        // 90 degree turn. Very cool and legal IF we're past the min straight line distance.
        if (dist < min_straight) continue
        possible_neighbors.push(hash([n_dir, 1, x + vec[0], y + vec[1]]))
      }
    }

    for (let neighbor of possible_neighbors) {
      if (distances[neighbor] === undefined) {
        distances[neighbor] = Infinity
        to_visit.add(neighbor)
      }

      let [_a, _b, n_x, n_y] = expand(neighbor)

      if (grid[n_y][n_x] + distances[min_node] < distances[neighbor]) {
        distances[neighbor] = grid[n_y][n_x] + distances[min_node]
      }
    }

    to_visit.delete(min_node)
  }

  return distances
}


export const day17 = input => {
  const grid = r.pipe(
    as_lines,
    r.map(
      r.pipe(
        r.split(''),
        r.map(Number.parseInt)
      )
    )
  )(input)

  const distances1 = edsger(grid, 0, 3)
  const to_endpoint1 = Object.entries(distances1).filter(([k, dist]) => {
    const [_steps, _dir, x, y] = expand(k)
    return (x === grid[0].length-1 && y === grid.length-1)
  })
  const part01 = Math.min(...to_endpoint1.map(([_, d]) => d))

  const distances2 = edsger(grid, 4, 10)
  const to_endpoint2 = Object.entries(distances2).filter(([k, dist]) => {
    const [_steps, _dir, x, y] = expand(k)
    return (x === grid[0].length-1 && y === grid.length-1)
  })
  const part02 = Math.min(...to_endpoint2.map(([_, d]) => d))

  return [part01, part02]
}
