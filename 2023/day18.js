import * as r from 'ramda'
import { as_lines } from './utils.js'


const vectors = {
  'R': [1, 0],
  'D': [0, 1],
  'L': [-1, 0],
  'U': [0, -1],
}

const parse_part01 = r.pipe(
  as_lines, r.map(r.pipe(
    r.split(' '), r.adjust(1, Number.parseInt))))

const parse_part02 = r.pipe(
  parse_part01, r.pluck(2),
  r.map(r.pipe(
    r.match(/([0-9a-f]{5})([0-9a-f])/),
    r.props([1, 2]),
    r.adjust(0, s => Number.parseInt(s, 16)),
    r.adjust(1, k => "RDLU"[k]),
    r.reverse)))

const calculate = instructions => {
  let vertices = []
  let pos = [0,0]
  instructions.forEach(([dir, amt]) => {
    let [vecx, vecy] = vectors[dir]
    pos = [vecx*amt + pos[0], vecy*amt + pos[1]]
    vertices.push([BigInt(pos[0]), BigInt(pos[1])])
  })

  // shoelace algorithm to find polygon area
  let sum1 = 0n
  let sum2 = 0n
  for (let [p1, p2] of r.aperture(2, vertices)) {
    sum1 += p1[0] * p2[1]
    sum2 += p1[1] * p2[0]
  }
  const area = (sum1 - sum2) / 2n

  // add the perimeter to the area for total squares dug
  const perim = r.pipe(
    r.pluck(1),
    r.sum,
    BigInt
  )(instructions)

  const interior = area - perim / 2n + 1n

  return perim + interior
}

export const day18 = input => {
  const part01 = calculate(parse_part01(input))
  const part02 = calculate(parse_part02(input))

  return [part01, part02]
}
