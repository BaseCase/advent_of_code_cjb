import * as r from 'ramda'
import { as_lines, log, point_to_key } from './utils.js'


const parse = r.pipe(
  as_lines,
  r.map(r.pipe(
    r.split('~'),
    r.map(r.pipe(r.split(','), r.map(Number.parseInt))),
    ([start, end]) => {
      // NOTE: we can break the points up like this because we know two of the three dimensions of every brick are 1
      let x1 = r.min(start[0], end[0])
      let x2 = r.max(start[0], end[0])
      let y1 = r.min(start[1], end[1])
      let y2 = r.max(start[1], end[1])
      let z1 = r.min(start[2], end[2])
      let z2 = r.max(start[2], end[2])
      return {
        x1: start[0],
        y1: start[1],
        z1: start[2],
        x2: end[0],
        y2: end[1],
        z2: end[2],
        settled: false,
      }
    }
  ))
)

// sus
const overlapping = (b1, b2) => !(
  (b1.x1 < b2.x1 && b1.x2 < b2.x1)
  || (b2.x1 < b1.x1 && b2.x2 < b1.x1)
  || (b1.y1 < b2.y1 && b1.y2 < b2.y1)
  || (b2.y1 < b1.y1 && b2.y2 < b1.y1)
)


export const day22 = input => {
  let bricks = parse(input)

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

  let part01 = 0
  for (let i=0; i<bricks.length; ++i) {
    let deletable = true
    let brick = bricks[i]
    let resting_on_me = bricks.filter(b => b.z1 === brick.z2+1 && overlapping(brick, b))

    resting_on_me.forEach(b => {
      if (!deletable) return
      let supports_b = bricks.filter(b2 => b2.z2 === brick.z2 && overlapping(b2, b))
      if (supports_b.length === 1) {
        deletable = false
        return
      }
    })

    if (deletable) ++part01
  }

  return part01
}


const example = `
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`

console.log(day22(example))
