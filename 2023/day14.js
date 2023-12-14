import * as r from 'ramda'
import { log, grid_map, key_to_point, point_to_key, as_lines, map_indexed } from './utils.js'


// const parse_map = r.compose(
//   r.fromPairs,
//   grid_map((cell, x, y) => [point_to_key([x, y]), cell]),
//   as_lines)
//

const roll_north = a_map => {
  for (let y=1; y<a_map.length; ++y) {
    for (let x=0; x<a_map[y].length; ++x) {
      switch (a_map[y][x]) {
        case '.':
          continue
        case '#':
          continue
        case 'O':
          let y1 = y
          while (a_map[y1-1]?.[x] === '.') {
            a_map[y1][x] = '.'
            a_map[y1-1][x] = 'O'
            --y1
          }
      }
    }
  }
}

const roll_south = a_map => {
  for (let y=a_map.length-2; y>=0; --y) {
    for (let x=0; x<a_map[y].length; ++x) {
      switch (a_map[y][x]) {
        case '.':
          continue
        case '#':
          continue
        case 'O':
          let y1 = y
          while (a_map[y1+1]?.[x] === '.') {
            a_map[y1][x] = '.'
            a_map[y1+1][x] = 'O'
            ++y1
          }
      }
    }
  }
}

const roll_west = a_map => {
  for (let x=1; x<a_map[0].length; ++x) {
    for (let y=0; y<a_map.length; ++y) {
      switch (a_map[y][x]) {
        case '.':
          continue
        case '#':
          continue
        case 'O':
          let x1 = x
          while (a_map[y][x1-1] === '.') {
            a_map[y][x1] = '.'
            a_map[y][x1-1] = 'O'
            --x1
          }
      }
    }
  }
}

const roll_east = a_map => {
  for (let x=a_map[0].length-2; x>=0; --x) {
    for (let y=0; y<a_map.length; ++y) {
      switch (a_map[y][x]) {
        case '.':
          continue
        case '#':
          continue
        case 'O':
          let x1 = x
          while (a_map[y][x1+1] === '.') {
            a_map[y][x1] = '.'
            a_map[y][x1+1] = 'O'
            ++x1
          }
      }
    }
  }
}

const score_rows = a_map => map_indexed((row, y) =>
  r.count(r.equals('O'), row) * (a_map.length - y),
  a_map
)

const hash_the_map = r.pipe(
  r.map(r.join('')), r.join('')
)

export const day14 = input => {
  const the_map = r.pipe(as_lines, r.map(r.split('')))(input)
  roll_north(the_map)

  const part01 = r.pipe(
    score_rows,
    r.sum
  )(the_map)

  const the_map2 = r.pipe(as_lines, r.map(r.split('')))(input)
  let already_seen = new Set()
  let the_settled_cycle = new Set()

  // just need to find the period when we start repeating,
  // which I think is *as soon as* we see 1 repeat.
  // we can use a hashmap here instead of a Set
  let counter = 0
  while (true) {
    roll_north(the_map2)
    roll_west(the_map2)
    roll_south(the_map2)
    roll_east(the_map2)
    let hash = hash_the_map(the_map2)
    counter++
    if (already_seen.has(hash)) {
      if (the_settled_cycle.size === 0) log("found our first dupe!")
      if (the_settled_cycle.has(hash)) {
        break;
      } else {
        the_settled_cycle.add(hash)
      }
    } else {
      already_seen.add(hash)
    }
  }

  // log(20 % 9)

  log("until we saw a cycle")
  log(already_seen.size)
  log("the size of the cycle")
  log(the_settled_cycle.size)
  const cycles_needed_to_settle = already_seen.size
  const total = ((1000000000-cycles_needed_to_settle) % the_settled_cycle.size) + cycles_needed_to_settle
  const the_map3 = r.pipe(as_lines, r.map(r.split('')))(input)

  for (let i=0; i<total; ++i) {
    roll_north(the_map3)
    roll_west(the_map3)
    roll_south(the_map3)
    roll_east(the_map3)
  }

  // 95160 is wrong
  const part02 = r.pipe(
    score_rows,
    r.sum
  )(the_map3)

  return [part01, part02]
}

const example_data = `
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`

console.log(day14(example_data))
