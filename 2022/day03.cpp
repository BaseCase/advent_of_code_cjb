#include <iostream>
#include <string>
#include <fstream>
#include <set>
#include <algorithm>
#include <cctype>


using namespace std;

int priority(char c) {
    if (islower(c)) {
        return c - 'a' + 1;
    } else {
        return c - 'A' + 27;
    }
}

int part1() {
    fstream input;
    input.open("./inputs/day03.input");
    int priorities_total = 0;

    string line;
    while (getline(input, line)) {
        int mid = line.size() / 2;
        auto left = set<char>(line.begin(), line.begin()+mid);
        auto right = set<char>(line.begin()+mid, line.end());
        set<char> overlap;
        set_intersection(left.begin(), left.end(),
                         right.begin(), right.end(),
                         inserter(overlap, overlap.begin()));
        for (auto c: overlap) {
            priorities_total += priority(c);
        }
    }
    input.close();

    return priorities_total;
}

int part2() {
    fstream input;
    input.open("./inputs/day03.input");
    int priorities_total = 0;

    string line;
    while(!input.eof()) {
        getline(input, line);
        auto first = set<char>(line.begin(), line.end());
        getline(input, line);
        auto second = set<char>(line.begin(), line.end());
        getline(input, line);
        auto third = set<char>(line.begin(), line.end());

        set<char> overlap1;
        set_intersection(first.begin(), first.end(),
                         second.begin(), second.end(),
                         inserter(overlap1, overlap1.begin()));
        set<char> overlap2;
        set_intersection(overlap1.begin(), overlap1.end(),
                         third.begin(), third.end(),
                         inserter(overlap2, overlap2.begin()));

        for (auto c: overlap2) {
            priorities_total += priority(c);
        }
    }
    input.close();

    return priorities_total;
}


int main() {
    cout << "(Part 1) Total of priorities: " << part1() << "\n";
    cout << "(Part 2) Total of priorities for group badges: " << part2() << "\n";
}
