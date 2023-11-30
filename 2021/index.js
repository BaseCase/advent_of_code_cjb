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


const days = [
  'day01',      // [1121, 1065]
  'day02',      // [1670340, 1954293920]
  'day03',      // [2967914, 7041258]
  'day04',      // [74320, 17884]
  'day05',      // [8622, 22037]
  'day06',      // [386640, 1733403626279]
  'day07',      // [339321, 95476244]
  'day08',      // [294, 973292]
  'day09',      // [580, 856716]
  'day10',      // [???, ???]
]

function main() {
  days.forEach(day => {
    const contents = readFileSync(`./inputs/${day}`, { encoding: 'utf-8' })
    const fn = eval(`${day}`)
    console.log(`${day}:\t${fn(contents)}`)
  })
}

main()
