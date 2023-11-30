import * as r from 'ramda'
import { log } from './utils.js'


function mark_move_destructively(boards, move) {
  boards.forEach(board => {
    board.forEach(row => {
      row.forEach(space => {
        if (space[0] === move) space[1] = true
      })
    })
  })
}

const find_winner = r.pipe(
  r.findIndex(
    r.pipe(
      b => r.concat(b, r.transpose(b)),
      r.any(
        r.all(([space, marked]) => marked)))))

const flattenOnce = xs => xs.flat(1)

const score_winning_board = r.pipe(
  flattenOnce,
  r.reject(([space, marked]) => marked),
  r.map(Number.parseInt),
  r.sum,
)

function day04(input) {
  const data = r.compose(r.split('\n'), r.trim)(input)
  const movelist = r.split(',', data[0])

  let boards = r.pipe(
    r.tail,
    r.reject(r.equals('')),
    r.splitEvery(5),
    r.map(
      r.map(r.pipe(
        r.split(' '),
        r.reject(r.equals('')),
        r.map(c => [c, false])  // tuples of [number, marked?]
      ))),
  )(data)

  let winners = []
  let move
  movelist.forEach(move => {
    mark_move_destructively(boards, move)
    let winner_idx = -1
    do {
      winner_idx = find_winner(boards)
      if (winner_idx > -1) {
        winners.push([Number.parseInt(move), r.clone(boards[winner_idx])])
        boards = r.remove(winner_idx, 1, boards)
      }
    } while (winner_idx > -1)
  })

  const part01 = () => score_winning_board(winners[0][1]) * winners[0][0]
  const part02 = () => score_winning_board(r.last(winners)[1]) * r.last(winners)[0]

  return [part01(), part02()]
}


// const example_data = `
// 7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

// 22 13 17 11  0
//  8  2 23  4 24
// 21  9 14 16  7
//  6 10  3 18  5
//  1 12 20 15 19

//  3 15  0  2 22
//  9 18 13 17  5
// 19  8  7 25 23
// 20 11 10 24  4
// 14 21 16 12  6

// 14 21 17 24  4
// 10 16 15  9 19
// 18  8 23 26 20
// 22 11 13  6  5
//  2  0 12  3  7
// `

// console.dir(day04(example_data), { depth: null})   // [4512, 1924] for example

export { day04 }
