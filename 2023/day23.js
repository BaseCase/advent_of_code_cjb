import * as r from 'ramda'
import { as_lines, grid_map, point_to_key, log } from './utils.js'


const parse = r.pipe(
  as_lines,
  grid_map((cell, x, y) => [point_to_key([x,y]), cell]),
  r.fromPairs
)

const slopes = {
  '^': [0, -1],
  '>': [1, 0],
  'v': [0, 1],
  '<': [-1, 0]
}
const slopekeys = r.keys(slopes)


export const day23 = input => {
  const grid = parse(input)
  const start = [1,0]
  const goal = [139,140]

  const longest_path = starting_point => {
    let steps = 1
    let [prevX, prevY] = starting_point
    let [atX, atY] = starting_point

    // follow path ,adding up steps, until we hit a fork
    //    at the fork, find the max of the two alternatives and add that
    //    if we hit the goal, just return our count
    //     could memoize on key(starting_point) but the input looks manageable, so maybe not necessary?

    while (true) {
      if (atX === goal[0] && atY === goal[1]) {
        return steps - 1
      }

      let at = grid[point_to_key([atX, atY])]

      if (r.includes(at, slopekeys)) {
        ++steps
        prevX = atX
        prevY = atY
        atX = atX + slopes[at][0]
        atY = atY + slopes[at][1]
      } else {
        let possible_moves = [
          [atX, atY-1], [atX+1, atY], [atX, atY+1], [atX-1, atY]
        ].filter(([x, y]) => {
          if (x === prevX && y === prevY) return false
          let point = grid[point_to_key([x, y])]
          if (point === undefined || point === '#') return false
          return !((point === '>' && x < atX)
            || (point === '<' && x > atX)
            || (point === 'v' && y < atY)
            || (point === '^' && y > atY))
        })

        if (possible_moves.length === 0 || possible_moves.length > 2) {
          throw new Error("that shouldn't happen!!")
        }

        if (possible_moves.length === 1) {
          ++steps
          prevX = atX
          prevY = atY
          atX = possible_moves[0][0]
          atY = possible_moves[0][1]
        } else {
          return steps + r.max(longest_path(possible_moves[0]), longest_path(possible_moves[1]))
        }
      }
    }
  }

  const part01 = longest_path(start)

  return part01
}


const example = `
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`
// console.log(day23(example))
