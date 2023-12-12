import * as r from 'ramda'
import { as_lines, log, parse_numbers } from './utils.js'

function* expand_wildcards(str, expected_hashes) {
  const wilds_count = r.count(c => c === '?', str)
  for (let bitmask=0; bitmask<2**wilds_count; ++bitmask) {
    let s = str.split('')
    let bit = 0
    for (let i=0; i<s.length; ++i) {
      if (s[i] === '?') {
        s[i] = ((1 << bit++) & bitmask) ? '#' : '.'
      }
    }
    if (r.count(c => c === '#', s) !== expected_hashes) continue;
    yield s.join('')
  }
}

const parse = r.compose(r.map(r.split(' ')), as_lines)

const row_check_re = r.pipe(
  r.split(','),
  r.map(c => `#{${c}}`),
  r.join('\\.+'),
  s => new RegExp(s)
)

const is_valid = (row, description) => {
  const re = row_check_re(description)
  return r.test(re, row)
}

const part01 = input => {
  const stuff = parse(input)
  const how_many_work = r.map(
    ([row, description]) => {
      const re = row_check_re(description)
      const expected_hashes = r.sum(parse_numbers(description))
      return r.count(
        r.test(re),
        expand_wildcards(row, expected_hashes))
    },
    stuff
  )
  return r.sum(how_many_work)
}

const part02 = input => {
  let stuff = parse(input)
  for (let i=0; i<stuff.length; ++i) {
    let [left, right] = stuff[i]
    stuff[i][0] = [left, left, left, left, left].join('?')
    stuff[i][1] = [right, right, right, right, right].join(',')
  }

  const how_many_work = r.map(
    ([row, description]) => {
      const re = row_check_re(description)
      const expected_hashes = r.sum(parse_numbers(description))
      let count = 0
      for (let candidate of expand_wildcards(row, expected_hashes)) {
        if (r.test(re, candidate)) ++count
      }
      return count
    },
    stuff
  )
  return r.sum(how_many_work)
}

export const day12 = r.juxt([part01])


const example_data = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`
console.log(day12(example_data))
