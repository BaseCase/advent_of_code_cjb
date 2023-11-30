#include <iostream>
#include <string>
#include <fstream>
#include <cstdint>
#include <vector>
#include <set>
#include <cmath>


using namespace std;


struct point {
    int x;
    int y;

    bool operator<(const point& other) const {
        return (x < other.x) || (x == other.x && y < other.y);
    }
};


struct range {
    int left;
    int right;

    bool operator<(const range& other) const {
        return (left < other.left) || (left == other.left && right < other.right);
    }
};


struct sensor {
    point position;
    point nearest_beacon;
};


int main() {
    vector<sensor> sensors;

    fstream input;
    input.open("./inputs/day15.input");
    string line;
    while (getline(input, line)) {
        sensor s;
        int p = line.find("=");
        // sensor
        s.position.x = stoi(line.substr(p+1));
        p = line.substr(p+1).find("=") + p + 1;
        s.position.y = stoi(line.substr(p+1));

        // beacon
        p = line.substr(p+1).find("=") + p + 1;
        s.nearest_beacon.x = stoi(line.substr(p+1));
        p = line.substr(p+1).find("=") + p + 1;
        s.nearest_beacon.y = stoi(line.substr(p+1));

        sensors.push_back(s);
    }

    {  // part 1; very stupid approach
        int row_of_concern = 2000000;
        set<point> sensor_coverage;
        for (sensor s: sensors) {
            int manhattan = abs(s.nearest_beacon.x - s.position.x) + abs(s.nearest_beacon.y - s.position.y);

            if ((s.position.y - manhattan <= row_of_concern)
                && (s.position.y + manhattan >= row_of_concern)) {
                int spread = manhattan - abs(row_of_concern - s.position.y);
                for (int x=s.position.x - spread; x<=s.position.x + spread; ++x)
                    sensor_coverage.insert({x, row_of_concern});
            }

        }
        int left_bound = INT_MAX;
        int right_bound = INT_MIN;
        int upper_bound = INT_MAX;
        int lower_bound = INT_MIN;
        for (point p: sensor_coverage) {
            if (p.x < left_bound) left_bound = p.x;
            if (p.x > right_bound) right_bound = p.x;
            if (p.y < upper_bound) upper_bound = p.y;
            if (p.y > lower_bound) lower_bound = p.y;
        }

        set<point> beacons_in_row;
        for (sensor s: sensors) {
            if (s.nearest_beacon.y == row_of_concern)
                beacons_in_row.insert(s.nearest_beacon);
        }
        int spaces_covered_in_row = 0;
        for (int x=left_bound; x<=right_bound; ++x) {
            point check = {x, row_of_concern};
            if (sensor_coverage.count(check) && !beacons_in_row.count(check))
                ++spaces_covered_in_row;
        }
        cout << "(Part 1) Number of empty spaces in row " << row_of_concern << ": " << spaces_covered_in_row << ".\n";
    }

    {  // part 2 - only moderately stupid approach
        int left_bound = 0;
        int right_bound = 4000000;
        int upper_bound = 0;
        int lower_bound = 4000000;

        bool found = false;
        for (int y=upper_bound; y<=lower_bound; ++y) {
            vector<range> coverage;

            for (sensor s: sensors) {
                int manhattan = abs(s.nearest_beacon.x - s.position.x) + abs(s.nearest_beacon.y - s.position.y);
                int top = s.position.y - manhattan;
                int bottom = s.position.y + manhattan;
                if ((top > y) || (bottom < y))
                    continue;

                int remainder = manhattan - abs(y - s.position.y);
                range r;
                r.left = max(s.position.x - remainder, left_bound);
                r.right = min(s.position.x + remainder, right_bound);

                coverage.push_back(r);
            }

            sort(coverage.begin(), coverage.end());
            range l = coverage[0];
            for (int i=1; i<coverage.size(); ++i) {
                range r = coverage[i];

                if (r.right <= l.right)
                    continue;

                if (r.left > (l.right + 1)) {
                    cout << "(Part 2) uh oh! <" << l.right+1 << ", " << y << "> seems to be empty!\n";
                    found = true;
                }

                l = r;
            }

            if (found) break;
        }
    }
}
