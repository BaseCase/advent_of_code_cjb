#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <set>
#include <vector>


using namespace std;


struct space {
    int x;
    int y;

    bool operator<(const space& other) const {
        return (x < other.x) || (x == other.x && y < other.y);
    }
};


int main() {
    set<space> occupied_spaces;

    fstream input;
    input.open("./inputs/day14.input");
    string line;
    while (getline(input, line)) {
        vector<space> raw_coords;
        auto s = stringstream(line);
        string coords;
        while (getline(s, coords, '>')) {
            int split = coords.find(",");
            int x = stoi(coords.substr(0, split));
            int y = stoi(coords.substr(split+1));
            raw_coords.push_back({x, y});
        }

        for (int i=0; i<raw_coords.size()-1; ++i) {
            space a = raw_coords[i];
            space b = raw_coords[i+1];
            int left_x = a.x < b.x ? a.x : b.x;
            int right_x = a.x > b.x ? a.x : b.x;
            int top_y = a.y < b.y ? a.y : b.y;
            int bottom_y = a.y > b.y ? a.y : b.y;
            for (int y=top_y; y<=bottom_y; ++y)
                for (int x=left_x; x<=right_x; ++x)
                    occupied_spaces.insert({x, y});
        }
    }

    int number_of_rocks = occupied_spaces.size();
    int bottom = 0;
    for (space s: occupied_spaces) {
        if (s.y > bottom)
            bottom = s.y;
    }

    set<space> part2_spaces = occupied_spaces; // copy here so I don't have to rename anything lol

    // part 1 sandy time
    bool simulate = true;
    while (simulate) {
        bool falling = true;
        space sand = {500, 0};
        while (falling) {
            if (sand.y > bottom) {
                // flowing into the abyss. means the sand pile is full.
                falling = false;
                simulate = false;
            } else if (!occupied_spaces.count({sand.x, sand.y+1})) {
                // try to fall straight down
                ++sand.y;
            } else if (!occupied_spaces.count({sand.x-1, sand.y+1})) {
                // try down and left if straight down is blocked
                ++sand.y;
                --sand.x;
            } else if (!occupied_spaces.count({sand.x+1, sand.y+1})) {
                // try down and right if other two ways blocked
                ++sand.y;
                ++sand.x;
            } else {
                // can't proceed. come to rest here
                occupied_spaces.insert(sand);
                falling = false;
            }
        }
    }

    int number_of_sandus = occupied_spaces.size() - number_of_rocks;
    cout << "(Part 1) We got this much sand in 'ere: " << number_of_sandus << ".\n";

    // part 2 VERY sandy time
    int very_bottom = bottom + 2;
    simulate = true;
    while (simulate) {
        bool falling = true;
        space sand = {500, 0};
        while (falling) {
            if (sand.y == very_bottom - 1) {
                // come to rest on the floor
                falling = false;
                part2_spaces.insert(sand);
            } else if (!part2_spaces.count({sand.x, sand.y+1})) {
                // try to fall straight down
                ++sand.y;
            } else if (!part2_spaces.count({sand.x-1, sand.y+1})) {
                // try down and left if straight down is blocked
                ++sand.y;
                --sand.x;
            } else if (!part2_spaces.count({sand.x+1, sand.y+1})) {
                // try down and right if other two ways blocked
                ++sand.y;
                ++sand.x;
            } else {
                // can't proceed. come to rest here
                falling = false;
                part2_spaces.insert(sand);
                if (sand.x == 500 && sand.y == 0) {
                    simulate = false;
                }
            }
        }
    }

    int part2_number_of_sandus = part2_spaces.size() - number_of_rocks;
    cout << "(Part 2) Oh it's so much sand: " << part2_number_of_sandus << ".\n";
}
