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


const memoized_counter = r.memoizeWith((a, b) => `${a.join('')}+${b.join('')}`, count_valid)

function count_valid(remaining_cells, remaining_counts) {
  // log("\n\nbegin!!")
  // log(`considering: ${JSON.stringify(remaining_cells)}`)
  // log(`expecting: ${JSON.stringify(remaining_counts)}`)
  // log(remaining_counts)
  if (remaining_counts.length === 0) {
    if (r.all(c => c === '.' || c === '?', remaining_cells)) {
      // log("success!!")
      return 1
    } else {
      // log("end of the line")
      return 0
    }
  }

  if (remaining_cells.length === 0) {
    // I think we have to handle the case that we end exactly even?
    // log("end of the line part 2")
    return 0
  }

  if ((r.sum(remaining_counts) + remaining_counts.length-1) > remaining_cells.length) {
    // can't fulfill order regardless of wildcards
    return 0
  }

  switch(remaining_cells[0]) {
    case '.':
      // log("a dot, just continue")
      return memoized_counter(r.tail(remaining_cells), remaining_counts)

    case '#':
      // log("a hash, this is the hard one")
      const goal_size = remaining_counts[0]
      // log(`hope to see ${goal_size}`)
      const next_chunk = r.take(goal_size, remaining_cells)
      // log(`inspecting ${JSON.stringify(next_chunk)}`)
      if (next_chunk.length < goal_size) return 0     // this group can't be large enough b/c there's no more list
      if (r.any(r.equals('.'), next_chunk)) return 0  // this group can't be large enough b/c there's a '.' coming up
      // log("so far so good....")
      const after_this_chunk = r.drop(goal_size, remaining_cells)
      // log(`What's next? ${JSON.stringify(after_this_chunk)}`)
      if (after_this_chunk[0] === '#') {
        // log("that's no good, we needed a space")
        return 0       // there must be a gap after each group
      }

      // log("all good! on to the next count")
      // very awkward way of forcing a wildcard to be '.' after a group
      return memoized_counter(['.', ...r.tail(after_this_chunk)], r.tail(remaining_counts))

    case '?':
      // log("a ?, so split")
      return memoized_counter(['.', ...r.tail(remaining_cells)], remaining_counts)
        + memoized_counter(['#', ...r.tail(remaining_cells)], remaining_counts)
  }
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

      const cells = r.split('', row)
      const start_counts = parse_numbers(description)

      let valid_count = memoized_counter(cells, start_counts)
      // log(`stack grew to max of ${max_stack}`)

      log(`found ${valid_count}`)
      return valid_count

    },
    // [stuff[0]]
    stuff
  )
  return r.sum(how_many_work)
}

export const day12 = r.juxt([part01, part02])
const honk = `
????.????. 1,1
`

const example_data = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`
console.log(day12(example_data))
// console.log(day12(honk))
