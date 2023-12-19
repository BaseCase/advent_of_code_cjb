import * as r from 'ramda'
import { group_by_blank_lines, parse_numbers } from './utils.js'


const parse_rule = str => {
  let components = str.split(',')
  return components.map(s => {
    if (s.indexOf(':') !== -1) {
      let [_, key, op, value, dest] = r.match(/([xmas])([<>])(\d+):(.+)/, s)
      return { kind: 'check', key, op, dest, value: Number.parseInt(value) }
    } else {
      return { kind: 'goto', dest: s }
    }
  })
}

const parse_ruleset = r.pipe(
  r.match(/([a-z]+)\{(.*)}/),
  r.props([1, 2]),
  r.adjust(1, parse_rule),
)

const parse_item = r.pipe(parse_numbers, r.zip('xmas'), r.fromPairs)

const op2fn = {
  '<': r.lt,
  '>': r.gt,
}

const score_item = r.compose(r.sum, r.values)

const run_rules = (rules, item) => {
  let workflow = [...rules['in']]
  while (true) {
    let rule = workflow.shift()
    if (rule.kind === 'goto') {
      if (rule.dest === 'A'){
        return score_item(item)
      } else if (rule.dest === 'R') {
        return 0
      } else {
        workflow = [...rules[rule.dest]]
      }
    } else {
      let { key, op, value, dest } = rule
      let fn = op2fn[op]
      if (fn(item[key], value)) {
        if (dest === 'A') {
          return score_item(item)
        } else if (dest === 'R') {
          return 0
        } else {
          workflow = [...rules[dest]]
        }
      }
    }
  }
}


const score_these_ranges = r.pipe(
  r.values,
  r.map(([x, y]) => y - x + 1),
  r.product
)

const score_for_ranges = (id, ranges, rules) => {
  if (id === 'R') return 0
  if (id === 'A') return score_these_ranges(ranges)

  const workflow = [...rules[id]]
  let divvied_up = {...ranges}

  let score = 0

  workflow.forEach(rule => {
    if (rule.kind === 'check') {
      let unsplit_range = divvied_up[rule.key]
      let left_range, right_range

      if (rule.op === '<') {
        left_range = [unsplit_range[0], rule.value-1]
        right_range = [rule.value, unsplit_range[1]]
      } else if (rule.op === '>') {
        left_range = [rule.value+1, unsplit_range[1]]
        right_range = [unsplit_range[0], rule.value]
      }

      score += score_for_ranges(rule.dest, {...divvied_up, [rule.key]: left_range}, rules)
      divvied_up[rule.key] = right_range
    }

    if (rule.kind === 'goto') {
      score += score_for_ranges(rule.dest, {...divvied_up}, rules)
    }
  })

  return score
}

export const day19 = input => {
  const [raw_rules, raw_items] = group_by_blank_lines(input)
  const rules = r.compose(r.fromPairs, r.map(parse_ruleset))(raw_rules)
  const items = r.map(parse_item, raw_items)

  const part01 = items.reduce((sum, item) => run_rules(rules, item) + sum, 0)

  const starting_ranges = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  }

  const part02 = score_for_ranges('in', starting_ranges, rules)

  return [part01, part02]
}
