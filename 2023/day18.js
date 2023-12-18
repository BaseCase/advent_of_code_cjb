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
  let pos = [0,0]
  instructions.forEach(([dir, amt, color]) => {
    let [vecx, vecy] = vectors[dir]
    pos = [vecx*amt + pos[0], vecy*amt + pos[1]]
    vertices.push([...pos])
  })

  // shoelace algorithm to find polygon area
  let sum1 = BigInt(0)
  let sum2 = BigInt(0)
  for (let [p1, p2] of r.aperture(2, vertices)) {
    sum1 += BigInt(p1[0] * p2[1])
    sum2 += BigInt(p1[1] * p2[0])
  }
  const area = (sum1 - sum2) / BigInt(2)

  // add the perimeter to the area for total squares dug
  const perim = r.pipe(
    r.pluck(1),
    r.sum
  )(instructions)

  const interior = area - BigInt(perim/2) + BigInt(1)

  return BigInt(perim) + interior
}

export const day18 = input => {
  const part01 = calculate(parse_part01(input))
  const part02 = calculate(parse_part02(input))

  return [part01, part02]
}
