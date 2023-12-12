import { readFileSync } from 'node:fs'
import { day01 } from './day01.js'
import { day02 } from './day02.js'
import { day03 } from './day03.js'
import { day04 } from './day04.js'
import { day05 } from './day05.js'
import { day06 } from './day06.js'
import { day07 } from './day07.js'
import { day08 } from './day08.js'
import { day09 } from './day09.js'
import { day10 } from './day10.js'
import { day11 } from './day11.js'
import { day12 } from './day12.js'


const days = [
  // 'day01',        // [55488, 55614]
  // 'day02',        // [2283, 78669]
  // 'day03',        // [553825, 93994191]
  // 'day04',        // [25010, 9924412]
  // 'day05',        // [324724204, 104070862]    NOTE: slow solution, takes a few minutes to run.
  // 'day06',        // [211904, 43364472]
  // 'day07',        // [254024898, 254115617]
  // 'day08',        // [19241, 9606140307013]
  // 'day09',        // [1930746032, 1154]
  // 'day10',        // [7097, 355]
  // 'day11',        // [10422930, 699909023130]
  'day12',        // [???, ???]
]


function main() {
  days.forEach(d => {
    const fn = eval(d)
    const input = readFileSync(`./inputs/${d}`, {encoding: 'utf-8'})
    console.log(`${d}:\t${fn(input)}`)
  })
}

main()

export { main }
