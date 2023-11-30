#include <iostream>
#include <fstream>
#include <vector>
#include <string>


using namespace std;


struct instruction {
    char type; // 'n' for noop, 'a' for addx
    int value;
};


int main() {
    vector<instruction> instructions;
    vector<int> log;

    fstream input;
    input.open("./inputs/day10.input");
    string line;
    while (getline(input, line)) {
        if (line[0] == 'n')
            instructions.push_back({'n', 0});
        else {
            int val = stoi(line.substr(5));
            instructions.push_back({'a', val});
        }
    }

    int cur = 1;
    for (auto i: instructions) {
        log.push_back(cur);
        if (i.type == 'a')
            log.push_back(cur);
        cur += i.value;
    }

    int part1 =
        log[19] * 20
        + log[59] * 60
        + log[99] * 100
        + log[139] * 140
        + log[179] * 180
        + log[219] * 220;
    cout << "(Part 1) Sum of signals at times we care about: " << part1 << "\n";

    //
    // Part 2 (requires looking at output, not parsing letterforms programmatically)
    //
    for (int row=0; row<6; ++row) {
        for (int col=0; col<40; ++col) {
            int idx = (row * 40) + col;
            int cursor_mid = log[idx];

            if ((cursor_mid - 1 == col)
                || (cursor_mid == col)
                || (cursor_mid + 1 == col)) {
                cout << '#';
            } else {
                cout << ' ';
            }
        }
        cout << "\n";
    }
    cout << "\n";
}
