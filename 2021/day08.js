import * as r from 'ramda'
import { log } from './utils.js'


const alpha_sort = (s1, s2) => s1.localeCompare(s2)
const s_to_a = s => s.split('')


function infer_key([input_signals, output_signals]) {
  const signals = r.map(r.pipe(
    r.split(''),
    r.sort(alpha_sort),
    r.join(''),
  ))(input_signals)

  // freebies based on segment count
  const one = signals.find(s => s.length === 2)
  const four = signals.find(s => s.length === 4)
  const seven = signals.find(s => s.length === 3)

  // three numbers are missing one of the two segments that 1 has. we can deduce these
  let trio = signals.filter(s => r.difference(one, s).length === 1)
  const six = trio.find(s => s.length === 6)
  trio = r.without([six], trio)
  const same_segment = r.difference(one, six)
  const five = trio.find(s => r.difference(same_segment, s).length === 1)
  const two = r.without([five], trio)[0]

  // there's one remaining number with five segments: 3
  const three = r.difference(signals.filter(s => s.length === 5), [two, five])

  // two remaining numbers, 0 and 9, which each have 6 segments. the one missing its lower left
  // segment is 9.
  const duo = signals.filter(s => s.length === 6 && s !== six)
  const lower_left = r.difference(
    'abcdefg',
    r.union(five, one),
  )[0]
  const nine = duo.find(s => r.difference(lower_left, s).length === 1)
  const zero = r.without([nine], duo)[0]

  const key = {
    [zero]: '0',
    [one]: '1',
    [two]: '2',
    [three]: '3',
    [four]: '4',
    [five]: '5',
    [six]: '6',
    [seven]: '7',
    'abcdefg': '8',
    [nine]: '9',
  }

  return [key, output_signals]
}

const decode_output = ([key, signals]) => r.pipe(
  r.map(r.pipe(
    r.split(''),
    r.sort(alpha_sort),
    r.join(''),
    r.prop(r.__, key)
  )),
  r.join(''),
  Number.parseInt,
)(signals)


function day08(input) {
  const data = r.pipe(
    r.trim,
    r.split('\n'),
    r.map(r.pipe(
      r.split('|'),
      r.map(r.pipe(
        r.split(' '),
        r.reject(r.isEmpty))))))

  const part01 = r.pipe(
    data,
    r.map(r.last),
    r.map(r.pipe(
      r.filter(xs =>
        xs.length === 2
          || xs.length === 4
          || xs.length === 3
          || xs.length === 7),
      r.length)),
    r.sum)

  const part02 = r.pipe(
    data,
    r.map(r.pipe(infer_key, decode_output)),
    r.sum,
  )

  return [part01(input), part02(input)]
}


// const example_data = `
// be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
// edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
// fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
// fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
// aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
// fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
// dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
// bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
// egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
// gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
// `
// console.log(day08(example_data))  // [26, 61229]

export { day08 }
