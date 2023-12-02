import { all, filter, fromPairs, head, last, map, max, multiply, over, pipe, reduce, reverse, split, sum, trim, values } from 'ramda'
import { as_lines, second_lens } from './utils.js'


const empty_game_round = {
  red: 0,
  green: 0,
  blue: 0,
}

const list_to_game_round = pipe(
  map(pipe(
    trim,
    split(' '),
    reverse,
    over(second_lens, Number.parseInt),
  )),
  fromPairs,
  x => ({ ...empty_game_round, ...x })
)

const parse_game_input = pipe(
  as_lines,
  map(pipe(
    split(':'),
    over(second_lens, pipe(
      split(';'),
      map(pipe(
        split(','),
        list_to_game_round
      ))
    ))
  ))
)

const game_is_possible_given_cubes = cubes => all(
  g => (g.red <= cubes.red) && (g.green <= cubes.green) && (g.blue <= cubes.blue))

const most_cubes_by_color = (a, b) => ({
  red: max(a.red, b.red),
  green: max(a.green, b.green),
  blue: max(a.blue, b.blue),
})

const part01 = pipe(
  parse_game_input,
  filter(([id, game]) => game_is_possible_given_cubes({ red: 12, green: 13, blue: 14 })(game)),
  map(pipe(
    head,
    split(' '),
    last,
    Number.parseInt,
  )),
  sum
)

const part02 = pipe(
  parse_game_input,
  map(pipe(
    last,
    reduce(most_cubes_by_color, empty_game_round),
    values,
    reduce(multiply, 1)
  )),
  sum
)

export const day02 = input => [part01(input), part02(input)]
