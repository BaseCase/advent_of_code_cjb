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
import { day13 } from './day13.js'
import { day14 } from './day14.js'
import { day15 } from './day15.js'
import { day16 } from './day16.js'
import { day17 } from './day17.js'
import { day18 } from './day18.js'
import { day19 } from './day19.js'
import { day20 } from './day20.js'


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
  // 'day12',        // [7460, 6720660274964]
  // 'day13',        // [35232, 37982]
  // 'day14',        // [103333, 97241]
  // 'day15',        // [514639, 279470]
  // 'day16',        // [8034, 8225]
  // 'day17',        // [967, 1101]
  // 'day18',        // [46359, 59574883048274]
  // 'day19',        // [383682, 117954800808317]
  'day20',        // [
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
