import * as r from 'ramda'
import { as_lines, log, point_to_key } from './utils.js'


const parse = r.pipe(
  as_lines,
  r.map(r.pipe(
    r.split('~'),
    r.map(r.pipe(r.split(','), r.map(Number.parseInt))),
    ([start, end]) => ({
      x1: start[0],
      y1: start[1],
      z1: start[2],
      x2: end[0],
      y2: end[1],
      z2: end[2],
      settled: false,
    })
  ))
)


export const day22 = input => {
  // I think we want two data structures:
  //   1. a list of cube line definitions, that also tracks if it's settled or not
  //   2. a height-map that, given x,y coords, shows what the current highest z space is there
  // Then, we look at all unsettled, find the one with the lowest z, and drop it until it settles.
  // Continue that until we have a list of settled cube lines and a height map.
  //
  // To find what's deletable, look at each brick:
  //     - if every one of its x,y's is at or above the height map's z for that x,y, then this brick is deletable

  // WRONG!!!! the height map doesn't work because bricks can be supported in more than one place
  //   Instead, let's keep the full 3D grid, with point keys and values that are pointers to the bricks array
  //   Then to check each brick:
  //       1. check each space in the grid 1 above all x,y's
  //       2. for everything you hit that way,
  //           1. check 1 *down*
  //           2. if those rays

  let bricks = parse(input)
  const maxX = Math.max(...r.pipe(r.chain(r.props(['x1', 'x2'])))(bricks))
  const maxY = Math.max(...r.pipe(r.chain(r.props(['y1', 'y2'])))(bricks))

  let height_map = {}
  for (let y of r.range(0, maxY+1)) {
    for (let x of r.range(0, maxX+1)) {
      height_map[point_to_key([x,y])] = 0
    }
  }

  let unsettled = bricks.filter(b => !b.settled)
  while (unsettled.length > 0) {
    // find lowest unsettled brick and settle it
    let lowest = unsettled[0]
    for (let u of unsettled) {
      if (r.min(u.z1, u.z2) < r.min(lowest.z1, lowest.z2)) lowest = u
    }

    // find highest point in height_map that is under this brick
    //   (it's OK to break the points apart like this because they're always only 1 wide)
    let startx = r.min(lowest.x1, lowest.x2)
    let endx = r.max(lowest.x1, lowest.x2)
    let starty = r.min(lowest.y1, lowest.y2)
    let endy = r.max(lowest.y1, lowest.y2)

    let highest_z_underneath = 0
    for (let y=starty; y<=endy; ++y) {
      for (let x=startx; x<=endx; ++x) {
        let key = point_to_key([x, y])
        if (height_map[key] > highest_z_underneath) highest_z_underneath = height_map[key]
      }
    }

    // settled this brick
    // let's assume z1 is always <= z2 in the input; not sure that's a good assumption...
    lowest.z2 = (lowest.z2 - lowest.z1) + highest_z_underneath + 1
    lowest.z1 = highest_z_underneath + 1
    lowest.settled = true

    // update the height map
    for (let y=starty; y<=endy; ++y) {
      for (let x=startx; x<=endx; ++x) {
        let key = point_to_key([x, y])
        height_map[key] = highest_z_underneath + 1
      }
    }

    unsettled = bricks.filter(b => !b.settled)
  }

  // now make a 3D grid with each point pointing to a member of bricks
  let grid = {}
  for (let brick of bricks) {
    let startx = r.min(brick.x1, brick.x2)
    let endx = r.max(brick.x1, brick.x2)
    let starty = r.min(brick.y1, brick.y2)
    let endy = r.max(brick.y1, brick.y2)
    let startz = r.min(brick.z1, brick.z2)
    let endz = r.max(brick.z1, brick.z2)

    for (let y=starty; y<=endy; ++y) {
      for (let x=startx; x<=endx; ++x) {
        for (let z=startz; z<=endz; ++z) {
          let key = point_to_key([x, y, z])
          grid[key] = brick
        }
      }
    }
  }

  // log(grid)

  // now check each for deletability.
  //   Then to check each brick:
  //       1. check each space in the grid 1 above all x,y's
  //       2. for everything you hit that way,
  //           1. check 1 *down*
  //           2. if there's only one brick there, that's the brick we're considering deleting, and we can't delete it
  let part01 = 0
  log(bricks.length)
  for (let brick of bricks) {
    let startx = r.min(brick.x1, brick.x2)
    let endx = r.max(brick.x1, brick.x2)
    let starty = r.min(brick.y1, brick.y2)
    let endy = r.max(brick.y1, brick.y2)
    let topz = r.max(brick.z1, brick.z2)
    let deletable = true

    let bricks_one_above = new Set()
    for (let y=starty; y<=endy; ++y) {
      for (let x=startx; x<=endx; ++x) {
        let key = point_to_key([x, y, topz+1])
        let maybe_brick = grid[key]
        if (maybe_brick !== undefined) {
          bricks_one_above.add(maybe_brick)
        }
      }
    }

    for (let over of bricks_one_above) {
      if (over.x1 === over.x2 && over.y1 === over.y2) {
        deletable = false
        continue
      }

      let supporting = new Set()
      let startx = r.min(over.x1, over.x2)
      let endx = r.max(over.x1, over.x2)
      let starty = r.min(over.y1, over.y2)
      let endy = r.max(over.y1, over.y2)

      for (let y=starty; y<=endy; ++y) {
        for (let x=startx; x<=endx; ++x) {
          let key = point_to_key([x, y, topz])
          let maybe_brick = grid[key]
          if (maybe_brick !== undefined) {
            supporting.add(maybe_brick)
          }
        }
      }

      if (supporting.size === 1) {
        deletable = false
      }
    }

    if (deletable) ++part01

  }

  // 418 is too high
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
