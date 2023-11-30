func int_to_digits_array(_ number: Int) -> [Int] {
    String(number).map { Int(String($0))! }
}
let input = (367479...893698).map { int_to_digits_array($0) }


func part1_is_valid_password(_ candidate: [Int]) -> Bool {
    var found_double = false
    var found_decrease = false
    for pair in [(0,1), (1,2), (2,3), (3,4), (4,5)] {
        if candidate[pair.0] == candidate[pair.1] {
            found_double = true
        }
        if candidate[pair.1] < candidate[pair.0] {
            found_decrease = true
        }
    }

    return found_double && !found_decrease
}

let part1_valids = input.filter { part1_is_valid_password($0) }
print("Part 1 results: \(part1_valids.count)")

func part2_is_valid_password(_ candidate: [Int]) -> Bool {
    var found_exactly_double = false
    var found_decrease = false

    for pair in [(0,1), (1,2), (2,3), (3,4), (4,5)] {
        if candidate[pair.0] == candidate[pair.1] {
            var got_one = true

            let before = pair.0 - 1
            let after = pair.1 + 1

            if before >= 0 && candidate[before] == candidate[pair.0] {
                got_one = false
            }

            if after < candidate.count && candidate[after] == candidate[pair.1] {
                got_one = false
            }

            if got_one {
                found_exactly_double = true
            }
        }
        if candidate[pair.1] < candidate[pair.0] {
            found_decrease = true
        }
    }

    return found_exactly_double && !found_decrease
}

let part2_valids = input.filter { part2_is_valid_password($0) }
print("Part 2 results: \(part2_valids.count)")
