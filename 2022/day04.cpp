#include <iostream>
#include <string>
#include <fstream>
#include <cstring>
#include <vector>
#include <tuple>


using namespace std;


int main() {
    fstream input;
    input.open("./inputs/day04.input");
    int part1_total = 0;
    int part2_total = 0;

    string line;
    while (getline(input, line)) {
        string buf;
        vector<int> bounds;

        for (char c: line) {
            if (c == '-' || c == ',') {
                bounds.push_back(stoi(buf));
                buf.erase();
            } else {
                buf.push_back(c);
            }
        }
        bounds.push_back(stoi(buf));

        // bounds[0] and [1] are first elf's left and right edge. [2] and [3] are second elf's.
        // for convenience, sort them by smaller left edge
        tuple<int, int> first, second;
        if (bounds[0] <= bounds[2]) {
            first = make_tuple(bounds[0], bounds[1]);
            second = make_tuple(bounds[2], bounds[3]);
        } else {
            first = make_tuple(bounds[2], bounds[3]);
            second = make_tuple(bounds[0], bounds[1]);
        }

        // we know from sorting that first is left of second (or even with it).
        // if its right edge is right of the second one's left, there is overlap
        if (get<1>(first) >= get<0>(second)) {
            ++part2_total;

            // if the right edge of our first one is *also* right of second's right, it contains it.
            // there's also the case where the left edges match, in which one contains the other
            // (it doesn't matter which contains which for our count).
            if (get<1>(first) >= get<1>(second) ||
                get<0>(first) == get<0>(second)) {
                ++part1_total;
            }
        }
    }

    cout << "(Part 1) Total wholly contained: " << part1_total << ".\n";
    cout << "(Part 2) Total with any overlap: " << part2_total << ".\n";
}
