import * as r from 'ramda'
import { grid_map, as_lines, point_to_key } from './utils.js'


// NOTE: I manually sub 'b' for '\' and 'f' for '/' in the input because I don't know how to make node do the escaping I want


const input_to_map = r.pipe(
  as_lines,
  grid_map((cell, x, y) => [point_to_key([x, y]), cell]),
  r.fromPairs,
)

export const day16 = input => {
  let the_map = input_to_map(input)

  const top_edge_starting_positions = r.xprod(r.range(0, 110), [0]).map(([x, y]) => ({
    pos: [x,y], vec: [0,1], done: false, path: []
  }))
  const left_edge_starting_positions = r.xprod([0], r.range(0, 110)).map(([x, y]) => ({
    pos: [x,y], vec: [1,0], done: false, path: []
  }))

  const all_counts = (left_edge_starting_positions.concat(top_edge_starting_positions)).map(starter => {
    let lit_splits = new Set()

    const lit_beams = r.until(
      r.all(r.prop('done')),
      beams => {
        let split_beams = []

        beams.forEach(beam => {
          if (beam.done) return

          let [x, y] = beam.pos
          let [vecx, vecy] = beam.vec
          let gridkey = point_to_key(beam.pos)

          switch (the_map[gridkey]) {
            case undefined: // went off the edge
              beam.done = true
              return;
            case '.':
              break;
            case '-':
              if (vecy !== 0) {
                if (lit_splits.has(gridkey)) {
                  beam.done = true
                } else {
                  lit_splits.add(gridkey)
                  let new_beam = {
                    pos: [x-1, y],
                    vec: [-1, 0],
                    done: false,
                    path: [[x,y]]
                  }
                  split_beams.push(new_beam)
                  beam.vec = [1, 0]
                }
              }
              break;
            case '|':
              if (vecx !== 0) {
                if (lit_splits.has(gridkey)) {
                  beam.done = true
                } else {
                  lit_splits.add(gridkey)
                  let new_beam = {
                    pos: [x, y-1],
                    vec: [0, -1],
                    done: false,
                    path: [[x,y]]
                  }
                  split_beams.push(new_beam)
                  beam.vec = [0, 1]
                }
              }
              break;
            case 'f':
              beam.vec = [-1 * vecy, -1 * vecx]
              break;
            case 'b':
              beam.vec = [vecy, vecx]
              break;
          }

          let [vecx2, vecy2] = beam.vec
          beam.path.push(beam.pos)
          beam.pos = [x + vecx2, y + vecy2]
        })

        return r.concat(beams, split_beams)
      },
      [starter],
    )

    const lit_spaces = lit_beams.flatMap(b => b.path.map(point_to_key))
    return new Set(lit_spaces).size
  })

  return [all_counts[0], Math.max(...all_counts)]
}
