#include <iostream>
#include <fstream>
#include <string>
#include <map>


using namespace std;


// X = rock, Y = paper, Z = scissors
map<char, int> move_scores = {
    {'X', 1},
    {'Y', 2},
    {'Z', 3},
};

// X = lose, Y = draw, Z = win
map<char, int> outcome_scores = {
    {'X', 0},
    {'Y', 3},
    {'Z', 6},
};

// (part 1) key = opponent's play.
//        value = our play mapped to score for outcome
map<char, map<char, int>> outcomes_part1 = {
    {'A', {{'X', 3}, {'Y', 6}, {'Z', 0}}},
    {'B', {{'X', 0}, {'Y', 3}, {'Z', 6}}},
    {'C', {{'X', 6}, {'Y', 0}, {'Z', 3}}},
};

// (part 2) key = opponent's play.
//        value = left side is outcome instruction, right side is move (using XYZ meaning from part 1)
map<char, map<char, char>> part2_moves_to_play = {
    {'A', {{'X', 'Z'}, {'Y', 'X'}, {'Z', 'Y'}}},
    {'B', {{'X', 'X'}, {'Y', 'Y'}, {'Z', 'Z'}}},
    {'C', {{'X', 'Y'}, {'Y', 'Z'}, {'Z', 'X'}}},
};


int main() {
    int part1_total_score = 0;
    int part2_total_score = 0;
    fstream input;
    input.open("./inputs/day02.input");

    string line;
    while (getline(input, line)) {
        char opponent_play = line[0];

        char part1_my_play = line[2];
        part1_total_score += move_scores[part1_my_play];
        part1_total_score += outcomes_part1[opponent_play][part1_my_play];

        char part2_expected_outcome = line[2];
        char part2_my_play = part2_moves_to_play[opponent_play][part2_expected_outcome];
        part2_total_score += move_scores[part2_my_play];
        part2_total_score += outcome_scores[part2_expected_outcome];
    }

    cout << "(Part 1) Total score is " << part1_total_score << ".\n";
    cout << "(Part 2) Total score is " << part2_total_score << ".\n";
}
