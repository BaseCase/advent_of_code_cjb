#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <set>
#include <cstdlib>


using namespace std;


struct coords {
    int x;
    int y;

    bool operator<(const coords& other) const {
        return (x < other.x) || (x == other.x && y < other.y);
    }
};


struct head_move {
    char direction;
    int distance;
};


void catch_up(coords* head_pos, coords* tail_pos) {
    int x_dist = head_pos->x - tail_pos->x;
    int y_dist = head_pos->y - tail_pos->y;

    if (abs(x_dist) == 2 && abs(y_dist) == 2) {
        tail_pos->x += (x_dist / 2);
        tail_pos->y += (y_dist / 2);
    } else if (abs(x_dist) == 2) {
        tail_pos->x += (x_dist / 2);
        tail_pos->y += y_dist;
    } else if (abs(y_dist) == 2) {
        tail_pos->y += (y_dist / 2);
        tail_pos->x += x_dist;
    }
}


int spaces_touched_by_tail_given_moves_and_rope_size(vector<head_move> moves, int rope_size) {
    set<coords> visited_by_tail;
    vector<coords> rope;
    for (int i=0; i<rope_size; ++i)
        rope.push_back({0, 0});

    for (auto m: moves) {
        for (int i=m.distance; i>0; --i) {
            switch (m.direction) {
            case 'U':
                --(rope[0].y);
                break;

            case 'D':
                ++(rope[0].y);
                break;

            case 'L':
                --(rope[0].x);
                break;

            case 'R':
                ++(rope[0].x);
                break;
            }

            for (int r=0; r<rope.size(); ++r) {
                coords* head = &(rope[r]);
                coords* tail = &(rope[r+1]);
                catch_up(head, tail);
            }
            visited_by_tail.insert(rope.back());
        }
    }

    return visited_by_tail.size();
}


int main() {
    vector<head_move> moves;
    fstream input;
    input.open("./inputs/day09.input");
    string line;
    while (getline(input, line)) {
        head_move m;
        m.direction = line[0];
        m.distance = stoi(line.substr(2));
        moves.push_back(m);
    }

    // part 1
    int part1 = spaces_touched_by_tail_given_moves_and_rope_size(moves, 2);
    int part2 = spaces_touched_by_tail_given_moves_and_rope_size(moves, 10);

    cout << "(Part 1) Number of coords visited by tail: " << part1 << ".\n";
    cout << "(Part 2) Number of coords visited by longer rope's tail: " << part2 << ".\n";
}
