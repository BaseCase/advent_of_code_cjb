import * as r from 'ramda'
import { as_lines } from './utils.js'


const parse = r.pipe(
  as_lines,
  r.map(r.pipe(
    r.split('~'),
    r.map(r.pipe(r.split(','), r.map(Number.parseInt))),
    ([start, end]) => ({
      x1: start[0], y1: start[1], z1: start[2],
      x2: end[0], y2: end[1], z2: end[2],
      settled: false,
    })
  ))
)

const overlapping = (b1, b2) => !(
  (b1.x1 < b2.x1 && b1.x2 < b2.x1)
  || (b2.x1 < b1.x1 && b2.x2 < b1.x1)
  || (b1.y1 < b2.y1 && b1.y2 < b2.y1)
  || (b2.y1 < b1.y1 && b2.y2 < b1.y1)
)

export const day22 = input => {
  let bricks = parse(input)

  // settle bricks from starting snapshot
  bricks.sort((b1, b2) => b1.z1 - b2.z1)
  let [settled, unsettled] = r.partition(r.compose(r.equals(true), r.prop('settled')), bricks)
  while (unsettled.length > 0) {
    let lowest = unsettled[0]

    const directly_under = settled.filter(b => overlapping(lowest, b))
    let highest_under = Math.max(...directly_under.map(r.prop('z2')))
    if (highest_under === -Infinity) highest_under = 0
    lowest.z2 = (lowest.z2 - lowest.z1) + highest_under + 1
    lowest.z1 = highest_under + 1

    lowest.settled = true

    bricks.sort((b1, b2) => b1.z1 - b2.z1)
    let stuff = r.partition(r.compose(r.equals(true), r.prop('settled')), bricks)
    settled = stuff[0]
    unsettled = stuff[1]
  }

  // make it easy to see who is directly above and below each brick
  for (let brick of bricks) {
    brick.supported_by = new Set(bricks.filter(b => b.z2 === brick.z1 - 1 && overlapping(brick, b)))
    brick.directly_supports = new Set(bricks.filter(b => b.z1 === brick.z2 + 1 && overlapping(brick, b)))
  }

  // determine how many bricks would have to move if each one were deleted
  const count_chain_reaction = brick => {
    let would_move = new Set([brick])
    let q = [...brick.directly_supports]
    while (q.length) {
      let consider = q.shift()
      if (r.all(b => would_move.has(b), [...consider.supported_by])) {
        would_move.add(consider)
        q = [...q, ...consider.directly_supports]
      }
    }

    return would_move.size - 1
  }

  for (let brick of bricks) {
    brick.yowza = count_chain_reaction(brick)
  }

  let part01 = r.count(b => b.yowza === 0, bricks)
  let part02 = r.sum(r.pluck('yowza', bricks))

  return [part01, part02]
}
