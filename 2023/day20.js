import * as r from 'ramda'
import { as_lines, log } from './utils.js'
import { all } from 'ramda'


const parse = r.pipe(
  as_lines,
  r.map(l => {
    let [label, conns] = r.split('->', l)
    conns = r.pipe(r.split(','), r.map(r.trim))(conns)
    label = l[0] === 'b' ? 'broadcaster' : r.compose(r.trim, r.tail)(label)
    return [label, {
      type: l[0],
      inbox: [],
      conns: conns,
      state: 0,   // only used for %
      mem: {},    // only used for &
    }]
  }),
  r.fromPairs
)


const push_button = machine => {
  const q = [{ src: 'input', dest: 'broadcaster', signal: 0 }]
  let low_pulse_count = 0
  let high_pulse_count = 0

  while (q.length) {
    let pulse = q.shift()
    // log(pulse)

    if (pulse.signal === 0) {
      ++low_pulse_count
    } else {
      ++high_pulse_count
    }

    let module = machine[pulse.dest]
    if (module === undefined) continue   // output?

    if (pulse.dest === 'rx' && pulse.signal === 0) {
      return "YEAH!"
    }

    switch (module.type) {
      case 'b':
        for (let dest of module.conns) {
          q.push({ src: pulse.dest, dest: dest, signal: pulse.signal })
        }
        break;
      case '%':
        if (pulse.signal === 1) {
          // ignore
        } else {
          // flip-flop then broadcast new state
          module.state = module.state === 1 ? 0 : 1
          for (let dest of module.conns) {
            q.push({ src: pulse.dest, dest: dest, signal: module.state })
          }
        }
        break;
      case '&':
        module.mem[pulse.src] = pulse.signal
        if (r.all(r.equals(1), r.values(module.mem))) {
          // all on, so send low pulse to everything
          for (let dest of module.conns) {
            q.push({ src: pulse.dest, dest: dest, signal: 0 })
          }
        } else {
          // some off, so send high pulse to everything
          for (let dest of module.conns) {
            q.push({ src: pulse.dest, dest: dest, signal: 1 })
          }
        }
        break;
    }
  }

  return [low_pulse_count, high_pulse_count]
}



export const day20 = input => {
  let machine = parse(input)

  // TODO: put this in the parser somehow
  //   1. find all &'s, then find every other module with that &'s id in their conns list, to populate the mem {} for that &
  let all_ands = Object.keys(machine).filter(k => machine[k].type === '&')
  for (let id of all_ands) {
    let all_pointing_to = Object.keys(machine).filter(k => machine[k].conns.indexOf(id) !== -1)
    for (let p of all_pointing_to) {
      machine[id].mem[p] = 0
    }
  }

  // log(machine)

  let low = 0
  let high = 0
  for (let i=0; i<1000; ++i) {
    let [l, h] = push_button(machine)
    low += l
    high += h
  }

  const part01 = low * high


  machine = parse(input)

  // TODO: put this in the parser somehow
  //   1. find all &'s, then find every other module with that &'s id in their conns list, to populate the mem {} for that &
  all_ands = Object.keys(machine).filter(k => machine[k].type === '&')
  for (let id of all_ands) {
    let all_pointing_to = Object.keys(machine).filter(k => machine[k].conns.indexOf(id) !== -1)
    for (let p of all_pointing_to) {
      machine[id].mem[p] = 0
    }
  }

  let presses = 0
  while (true) {
    ++presses
    const result = push_button(machine)
    if (result === "YEAH!") break;
  }

  const part02 = presses


  return [part01, part02]
}


const example = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`

// console.log(day20(example))
