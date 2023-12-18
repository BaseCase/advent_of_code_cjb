import * as r from 'ramda'
import { as_lines, key_to_point, log, point_to_key } from './utils.js'


const parse_part01 = r.pipe(
  as_lines,
  r.map(r.pipe(
    r.split(' '),
    r.adjust(1, Number.parseInt)
  ))
)

const vectors = {
  'U': [0, -1],
  'R': [1, 0],
  'D': [0, 1],
  'L': [-1, 0],
}

const mapping = {
  '0': 'R',
  '1': 'D',
  '2': 'L',
  '3': 'U',
}

const color2int_and_dir = r.pipe(
  r.match(/([0-9a-f]{6})/),
  x => {
    let a = x[0]
    let b = x[1]
    if (a !== b) { log("OH")}
    return x
  },
  r.head,
  r.juxt([r.take(5), r.drop(5)]),
  r.adjust(0, s => Number.parseInt(`0x${s}`, 16)),
  r.adjust(1, k => mapping[k]),
)

const parse_part02 = r.pipe(
  as_lines,
  r.map(r.pipe(
    r.split(' '),
    r.last,
    color2int_and_dir,
    stuff => [stuff[1], stuff[0], 'unused']
  ))
)

const calculate = instructions => {
  let vertices = []

  // find perimeter
  let pos = [0,0]
  instructions.forEach(([dir, amt, color]) => {
    let [vecx, vecy] = vectors[dir]
    pos = [vecx*amt + pos[0], vecy*amt + pos[1]]
    vertices.push([...pos])
  })

  // shoelace algorithm to find polygon area
  let sum1 = 0
  let sum2 = 0
  for (let [p1, p2] of r.aperture(2, vertices)) {
    sum1 += (p1[0] * p2[1])
    sum2 += (p1[1] * p2[0])
  }
  // sum1 += r.last(vertices)[0] * vertices[0][1]
  // sum2 += vertices[0][0] * r.last(vertices)[1]
  const area = Math.abs(sum1 - sum2) / 2

  // add the perimeter to the area for total squares dug
  const perim = r.pipe(
    r.pluck(1),
    r.sum
  )(instructions)

  const interior = area - perim/2 + 1

  return perim + interior
}

export const day18 = input => {
  const part01 = calculate(parse_part01(input))

  // log(parse_part02(input))

  const insts = parse_part02(input)
  const lines = as_lines(input)

  // 59574883048261  is too low
  // 59575039439293  is too high
  const part02 = calculate(parse_part02(input))

  return [part01, part02]
}


const example_data = `
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`
console.log(day18(example_data))
