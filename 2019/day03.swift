import Foundation

func main() {
    let data = try! String(contentsOfFile: "input03")

    let inputs = data.split(separator: "\n")
    let input1 = inputs[0].split(separator: ",").map { String($0) }
    let input2 = inputs[1].split(separator: ",").map { String($0) }

    let (wire1, wire2) = inputs_to_wires(input1, input2)

    let grid1 = Set(wire1.keys)
    let grid2 = Set(wire2.keys)
    var wire_crosses = grid1.intersection(grid2)
    wire_crosses.remove(Point(x: 0, y: 0))
    let distances_from_origin = wire_crosses.map { manhattan_distance_from_origin($0) }

    print("Part 1 result: \(distances_from_origin.min()!)")

    let total_costs_to_intersections = wire_crosses.map { point in
        wire1[point]! + wire2[point]!
    }

    print("Part 2 result: \(total_costs_to_intersections.min()!)")
}


typealias Wire = [Point: Int]
func inputs_to_wires(_ input1: [String], _ input2: [String]) -> (Wire, Wire) {
    let moves1 = input1.map { Move(move_string: $0) }
    let moves2 = input2.map { Move(move_string: $0) }
    var grid1_with_costs = [Point: Int]()
    var grid2_with_costs = [Point: Int]()

    var prev_point = Point(x: 0, y: 0)
    var cost_so_far = 0
    for move in moves1 {
        let visited = move.visits_points(starting_at: prev_point)
        for point in visited {
            cost_so_far += 1
            if grid1_with_costs[point] == nil {
                grid1_with_costs[point] = cost_so_far
            }
        }
        prev_point = visited.last!
    }

    // NOTE: hand-unrolling this loop for MASSIVE PERFORMANCE BOOST
    prev_point = Point(x: 0, y: 0)
    cost_so_far = 0
    for move in moves2 {
        let visited = move.visits_points(starting_at: prev_point)
        for point in visited {
            cost_so_far += 1
            if grid2_with_costs[point] == nil {
                grid2_with_costs[point] = cost_so_far
            }
        }
        prev_point = visited.last!
    }

    return (grid1_with_costs, grid2_with_costs)
}


struct Move {
    let direction: Direction
    let distance: Int

    init(move_string: String) {
        let start_idx = move_string.startIndex
        direction = Direction(rawValue: move_string[start_idx])!
        let numbers = move_string[move_string.index(after: start_idx)..<move_string.endIndex]
        distance = Int(numbers)!
    }

    enum Direction: Character {
        case right = "R"
        case left = "L"
        case up = "U"
        case down = "D"
    }

    func visits_points(starting_at start: Point) -> [Point] {
        var visited = [Point]()

        switch direction {
        case .right:
            for x in stride(from: start.x + 1, to: start.x + distance + 1, by: +1) {
                visited.append(Point(x: x, y: start.y))
            }
        case .left:
            for x in stride(from: start.x - 1, to: start.x - distance - 1, by: -1) {
                visited.append(Point(x: x, y: start.y))
            }
        case .up:
            for y in stride(from: start.y + 1, to: start.y + distance + 1, by: +1) {
                visited.append(Point(x: start.x, y: y))
            }
        case .down:
            for y in stride(from: start.y - 1, to: start.y - distance - 1, by: -1) {
                visited.append(Point(x: start.x, y: y))
            }
        }

        return visited
    }
}

struct Point: Hashable {
    let x: Int
    let y: Int
}

func manhattan_distance_from_origin(_ p: Point) -> Int {
    return abs(p.x) + abs(p.y)
}


main()
