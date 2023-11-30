import { readFileSync } from 'node:fs'
import { day01 } from './day01.js'


const days = [
  'day01',
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
