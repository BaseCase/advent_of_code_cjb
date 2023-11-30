#include <iostream>
#include <fstream>
#include <string>
#include <set>


using namespace std;


int main() {
    fstream input_file;
    string input;
    input_file.open("./inputs/day06.input");
    getline(input_file, input);
    set<char> check;
    int part1, part2;

    for (int i=0; i<input.size()-3; ++i) {
        for (int j=0; j<4; ++j)
            check.insert(input[i+j]);

        if (check.size() == 4) {
            part1 = i + 4;
            break;
        }
        check.clear();
    }

    check.clear();

    for (int i=0; i<input.size()-13; ++i) {
        for (int j=0; j<14; ++j)
            check.insert(input[i+j]);

        if (check.size() == 14) {
            part2 = i + 14;
            break;
        }
        check.clear();
    }

    cout << "(Part 1) The furthest we have to look for a start packet signal is position " << part1 << ".\n";
    cout << "(Part 2) The furthest we have to look for a start message signal is position " << part2 << ".\n";
}
