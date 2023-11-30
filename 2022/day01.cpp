#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    string line;
    fstream input;
    unsigned int current_total = 0;
    vector<unsigned int> totals;

    input.open("./inputs/day01.input");
    while (!input.eof()) {
        getline(input, line);
        if (line.empty()) {
            totals.push_back(current_total);
            current_total = 0;
        } else {
            current_total += stoul(line);
        }
    }

    sort(totals.begin(), totals.end(), greater<unsigned int>());

    cout << "(part 1) Biggest is: " << totals[0] << ".\n";
    cout << "(part 2) Sum of top 3 is: " << totals[0] + totals[1] + totals[2] << ".\n";
}
