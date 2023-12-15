import * as r from 'ramda'


const hash = r.reduce(
  (acc, cur) => {
    let x = acc + cur.charCodeAt(0)
    x = x * 17
    x = x % 256
    return x
  }, 0)

const part01 = r.pipe(
  r.trim,
  r.split(','),
  r.map(hash),
  r.sum
)

const instructions_re = /([a-z]+)([=-])(\d+)?/g
const matchAll = re => s => [...s.matchAll(re)][0]

const part02 = input => {
  const instructions = r.pipe(
    r.trim,
    r.split(','),
    r.map(matchAll(instructions_re))
  )(input)

  const boxes = new Array(256).fill(0)
  // avoid aliasing every element to the *same* box. agh
  for (let i=0; i<256; ++i) boxes[i] = []

  instructions.forEach(([_, label, cmd, count]) => {
    let box = boxes[hash(label)]
    let idx = box.findIndex(([l, _]) => l === label)
    if (cmd === '=') {
      if (idx > -1) {
        box[idx] = [label, count]
      } else {
        box.push([label, count])
      }
    } else if (cmd === '-') {
      if (idx > -1) box.splice(idx, 1)
    }
  })

  const powers = boxes.map((box, box_idx) => box.map(([label, count], slot_idx) => (1 + box_idx) * (1 + slot_idx) * count))
  return r.pipe(
    r.flatten,
    r.sum
  )(powers)
}

export const day15 = input => [part01(input), part02(input)]
