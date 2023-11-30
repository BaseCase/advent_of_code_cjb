/*:
 # Day 01 - The Tyranny of the Rocket Equation

 ## Part 1

 At the first Go / No Go poll, every Elf is Go until the Fuel Counter-Upper. They haven't determined the amount of fuel required yet.

 Fuel required to launch a given module is based on its mass. Specifically, to find the fuel required for a module, take its mass, divide by three, round down, and subtract 2.
*/
func required_fuel(for mass: Int) -> Int {
    mass / 3 - 2
}
/*:
 For example: For a mass of 12, divide by 3 and round down to get 4, then subtract 2 to get 2.
*/
assert(required_fuel(for: 12) == 2)
/*:
 For a mass of 14, dividing by 3 and rounding down still yields 4, so the fuel required is also 2.
 For a mass of 1969, the fuel required is 654.
 For a mass of 100756, the fuel required is 33583.
*/
assert(required_fuel(for: 14) == 2)
assert(required_fuel(for: 1969) == 654)
assert(required_fuel(for: 100756) == 33583)
/*:
 The Fuel Counter-Upper needs to know the total fuel requirement. To find it, individually calculate the fuel needed for the mass of each module (your puzzle input), then add together all the fuel values.
*/
func sum_of_all_fuel_requirements(masses: [Int], calc: (Int) -> Int) -> Int {
    masses.reduce(0, { sum, cur in
        sum + calc(cur)
    })
}
/*:
 ### What is the sum of the fuel requirements for all of the modules on your spacecraft?
*/
import Foundation
let data = try! String(contentsOfFile: "input01")
let masses = data.split(separator: "\n").map({ Int($0)! })

let part1_result = sum_of_all_fuel_requirements(masses: masses, calc: required_fuel(for:))
print("Part 1 result: \(part1_result)")
/*:
 ## Part 2
 During the second Go / No Go poll, the Elf in charge of the Rocket Equation Double-Checker stops the launch sequence. Apparently, you forgot to include additional fuel for the fuel you just added.

 Fuel itself requires fuel just like a module - take its mass, divide by three, round down, and subtract 2. However, that fuel also requires fuel, and that fuel requires fuel, and so on. Any mass that would require negative fuel should instead be treated as if it requires zero fuel; the remaining mass, if any, is instead handled by wishing really hard, which has no mass and is outside the scope of this calculation.
*/
func total_fuel_cost(for mass: Int) -> Int {
    var sum = 0
    var remaining = mass
    while true {
        remaining = required_fuel(for: remaining)
        if remaining <= 0 {
            break
        }
        sum += remaining
    }
    return sum
}
/*:
 So, for each module mass, calculate its fuel and add it to the total. Then, treat the fuel amount you just calculated as the input mass and repeat the process, continuing until a fuel requirement is zero or negative. For example:

 A module of mass 14 requires 2 fuel. This fuel requires no further fuel (2 divided by 3 and rounded down is 0, which would call for a negative fuel), so the total fuel required is still just 2.
*/
assert(total_fuel_cost(for: 14) == 2)
/*:
 At first, a module of mass 1969 requires 654 fuel. Then, this fuel requires 216 more fuel (654 / 3 - 2). 216 then requires 70 more fuel, which requires 21 fuel, which requires 5 fuel, which requires no further fuel. So, the total fuel required for a module of mass 1969 is 654 + 216 + 70 + 21 + 5 = 966.

 The fuel required by a module of mass 100756 and its fuel is: 33583 + 11192 + 3728 + 1240 + 411 + 135 + 43 + 12 + 2 = 50346.
*/
assert(total_fuel_cost(for: 1969) == 966)
assert(total_fuel_cost(for: 100756) == 50346)
/*:
 ### What is the sum of the fuel requirements for all of the modules on your spacecraft when also taking into account the mass of the added fuel?
*/
let part2_result = sum_of_all_fuel_requirements(masses: masses, calc: total_fuel_cost(for:))
print("Part 2 result: \(part2_result)")
