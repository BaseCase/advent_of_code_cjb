#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <vector>


using namespace std;


int main() {
    fstream input;
    input.open("./inputs/day05.input");
    string line;
    int cols_count = 9;   // hard-coding because why not?
    vector<vector<char>> columns;

    for (int i=0; i<cols_count; ++i) {
        columns.push_back(vector<char>());
    }

    // parse boxes
    while (true) {
        getline(input, line);
        if (line.find("[") == std::string::npos)
            break;

        for (int i=0; i<line.size(); i+=4) {
            if (line[i] == '[') {
                char box = line[i+1];
                int col = i / 4;
                auto front = columns[col].begin();
                columns[col].insert(front, box);
            }
        }
    }

    getline(input, line);  // discard blank line separating move list

    // list of moves
    // [0] is number of boxes to move
    // [1] is source column (0-indexed)
    // [2] is dest column (0-indexed)
    vector<vector<int>> moves;

    // parse moves
    while (getline(input, line)) {
        auto ss = stringstream(line);
        string word;
        vector<string> words;
        while (getline(ss, word, ' '))
            words.push_back(word);

        int box_count = stoi(words[1]);
        int source_col = stoi(words[3]) - 1;
        int dest_col = stoi(words[5]) - 1;

        moves.push_back({box_count, source_col, dest_col});
    }

    // PART 1
    // execute moves
    vector<vector<char>> part1_columns = columns;
    for (auto move: moves) {
        for (int i=0; i<move[0]; ++i) {
            auto *src_col = &part1_columns[move[1]];
            auto *dest_col = &part1_columns[move[2]];
            dest_col->push_back(src_col->back());
            src_col->pop_back();
        }
    }

    // collect output
    string part1;
    for (auto c: part1_columns) {
        part1.push_back(c.back());
    }

    // PART 2
    // execute moves
    vector<vector<char>> part2_columns = columns;
    for (auto move: moves) {
        for (int i=move[0]; i>0; --i) {
            auto *src_col = &part2_columns[move[1]];
            auto *dest_col = &part2_columns[move[2]];
            int pos = src_col->size() - i;
            dest_col->push_back((*src_col)[pos]);
            src_col->erase(src_col->end() - i);
        }
    }

    // collect output
    string part2;
    for (auto c: part2_columns) {
        part2.push_back(c.back());
    }

    cout << "(Part 1): " << part1 << "\n";
    cout << "(Part 2): " << part2 << "\n";
}
