#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>
#include <cstdint>


using namespace std;


struct monke {
    vector<uint64_t> items;
    char operation;
    int operand;    // -1 is special: it means "old"
    int test_divisor;
    int test_true_dest;
    int test_false_dest;
    int inspection_count;
};


int main() {
    fstream input;
    input.open("./inputs/day11.input");

    vector<monke> monkae;
    int monkey_count = 8;

    for (int i=0; i<monkey_count; ++i) {
        monke m;
        m.inspection_count = 0;
        string line, buffer;
        getline(input, line); // discard monkey ID; just use vector index for this

        // starting items
        getline(input, line);
        auto x = line.find(":");
        line.erase(0, x+1);
        auto tokens = stringstream(line);
        while (getline(tokens, buffer, ',')) {
            int n = stoi(buffer);
            m.items.push_back(n);
        }

        // worry level update operation
        getline(input, line);
        x = line.find("=");
        line.erase(0, x+2);
        tokens = stringstream(line);
        getline(tokens, buffer, ' ');  // always "old". discard
        getline(tokens, buffer, ' ');  // the operation
        m.operation = buffer[0];
        getline(tokens, buffer, ' ');  // the rhs of the operation
        if (buffer == "old") {
            m.operand = -1;
        } else {
            m.operand = stoi(buffer);
        }

        // divisible by test
        getline(input, line);
        x = line.find("by");
        line.erase(0, x+3);
        m.test_divisor = stoi(line);

        // true side of test
        getline(input, line);
        x = line.find("monkey");
        line.erase(0, x+7);
        m.test_true_dest = stoi(line);

        // false side of test
        getline(input, line);
        x = line.find("monkey");
        line.erase(0, x+7);
        m.test_false_dest = stoi(line);

        getline(input, line); // discard newline in between monkae

        monkae.push_back(m);
    }

    vector<monke> part1_monkae = monkae;
    for (int round=0; round<20; ++round) {
        for (auto& m: part1_monkae) {
            for (int i=0; i<m.items.size(); ++i) {
                ++m.inspection_count;
                int worry = m.items[i];
                int op_rhs = m.operand == -1 ? worry : m.operand;

                switch (m.operation) {
                case '+':
                    worry += op_rhs;
                    break;
                case '*':
                    worry *= op_rhs;
                }
                worry /= 3;

                int dest_idx = (worry % m.test_divisor == 0)
                    ? m.test_true_dest
                    : m.test_false_dest;
                part1_monkae[dest_idx].items.push_back(worry);
            }
            m.items.clear();
        }
    }

    vector<monke> part2_monkae = monkae;
    int lcm = 1;
    for (auto& m: part2_monkae) {
        lcm *= m.test_divisor;
    }
    for (int round=0; round<10000; ++round) {
        for (auto& m: part2_monkae) {
            for (int i=0; i<m.items.size(); ++i) {
                ++m.inspection_count;
                uint64_t worry = m.items[i];
                uint64_t op_rhs = m.operand == -1 ? worry : m.operand;

                switch (m.operation) {
                case '+':
                    worry += op_rhs;
                    break;
                case '*':
                    worry = worry * op_rhs;
                }
                worry = worry % lcm;

                int dest_idx;
                if (worry % m.test_divisor == 0) {
                    dest_idx = m.test_true_dest;
                } else {
                    dest_idx = m.test_false_dest;
                }
                part2_monkae[dest_idx].items.push_back(worry);
            }
            m.items.clear();
        }
    }

    vector<uint64_t> move_counts;
    for (auto& m: part1_monkae) {
        move_counts.push_back(m.inspection_count);
    }
    sort(move_counts.begin(), move_counts.end());
    int part1 = move_counts[move_counts.size()-1] * move_counts[move_counts.size()-2];

    cout << "(Part 1) The Monkey Business level is " << part1 << "\n";

    move_counts.clear();
    for (auto& m: part2_monkae) {
        move_counts.push_back(m.inspection_count);
    }
    sort(move_counts.begin(), move_counts.end());
    uint64_t part2 = move_counts[move_counts.size()-1] * move_counts[move_counts.size()-2];

    cout << "(Part 2) The Monkey Business level is " << part2 << "\n";
}
