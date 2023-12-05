import { readFileSync } from 'node:fs'
import { day01 } from './day01.js'
import { day02 } from './day02.js'
import { day03 } from './day03.js'
import { day04 } from './day04.js'
import { day05 } from './day05.js'


const days = [
  // 'day01',        // [55488, 55614]
  // 'day02',        // [2283, 78669]
  // 'day03',        // [553825, 93994191]
  // 'day04',        // [25010, 9924412]
  // 'day05',        // [324724204, 104070862]    NOTE: slow solution, takes a few minutes to run.
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
