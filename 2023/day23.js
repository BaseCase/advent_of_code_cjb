import * as r from 'ramda'
import { as_lines, grid_map, point_to_key, log, key_to_point } from './utils.js'


// NOTE: part 1 is in git history; I deleted it en route to solving part 2

const parse = r.pipe(
  as_lines,
  grid_map((cell, x, y) => [point_to_key([x,y]), cell]),
  r.fromPairs
)

const slopes = {
  '^': [0, -1],
  '>': [1, 0],
  'v': [0, 1],
  '<': [-1, 0]
}
const slopekeys = r.keys(slopes)

export const day23 = input => {
  const grid = parse(input)
  const start = [1,0]

  const goal = [139, 140]
  // const goal = [21, 22]



  // find all nodes, then find costs and destinations of segments coming out of each node
  // duplicating work here is OK since the nodes themselves will be the outer loop and we won't dynamically update the queue
  let nodes = new Set()
  for (let p of r.keys(grid)) {
    if (grid[p] !== '.') continue

    let [x, y] = key_to_point(p)
    if (r.all(
      ([x1, y1]) => {
        let key = point_to_key([x1, y1])
        let point = grid[key]
        return point === undefined || point === '#' || slopekeys.includes(point)
      },
      [[x, y-1], [x+1, y], [x, y+1], [x-1, y]]
    )) {
      nodes.add(point_to_key([x, y]))
    }
  }

  let graph = {}
  let starting_node = {}
  let goal_node = {}

  for (let node_id of nodes) {
    let node = {
      id: node_id,
      connections: []
    }
    graph[node_id] = node

    let [nodex, nodey] = key_to_point(node_id)

    let outbound = [[nodex, nodey-1], [nodex+1, nodey], [nodex, nodey+1], [nodex-1, nodey]].filter(
      ([x, y]) => slopekeys.includes(grid[point_to_key([x, y])]))

    outbound.forEach(([x, y]) => {
      let steps = 1
      let [atX, atY] = [x, y]
      let visited = new Set([node_id])

      while (true) {
        if (nodes.has(point_to_key([atX, atY]))) {
          node.connections.push({
            node: point_to_key([atX, atY]),
            cost: steps
          })
          break
        }
        if (atX === start[0] && atY === start[1]) {
          node.connections.push({
            node: point_to_key([atX, atY]),
            cost: steps
          })
          starting_node = {
            id: point_to_key(start),
            connections: [{ node: node.id, cost: steps}]
          }
          break
        }
        if (atX === goal[0] && atY === goal[1]) {
          node.connections.push({
            node: point_to_key([atX, atY]),
            cost: steps
          })
          goal_node = {
            id: point_to_key(goal),
            connections: [{ node: node.id, cost: steps}]
          }
          break
        }

        visited.add(point_to_key([atX, atY]))

        let next_steps = [[atX, atY-1], [atX+1, atY], [atX, atY+1], [atX-1, atY]]
          .filter(([x, y]) => {
            let key = point_to_key([x, y])
            if (visited.has(key)) return false
            let point = grid[key]
            if (point === undefined || point === '#') return false
            return true
          })

        if (next_steps.length > 1) {
          throw new Error("This shouldn't have happened?")
        }

        if ((atX === start[0] && atY === start[1]) || (atX === goal[0] && atY === goal[1])) {
          throw new Error("This shouldn't have happened?")
        }

        ++steps
        atX = next_steps[0][0]
        atY = next_steps[0][1]
      }
    })
  }
  graph[starting_node.id] = starting_node
  graph[goal_node.id] = goal_node

  // console.dir(graph, { depth: 3 })

  const longest_path = (starting_point, seen) => {
    let node = graph[starting_point]
    let cost = 0

    seen.add(starting_point)

    let conn_costs = []

    for (let conn of node.connections) {
      if (conn.node === point_to_key(goal)) {
        return conn.cost
      }
      if (seen.has(conn.node)) continue
      conn_costs.push(conn.cost + longest_path(conn.node, new Set(seen)))
    }

    return Math.max(...conn_costs)
  }

  return longest_path(point_to_key(start), new Set([point_to_key(start)]))
}
