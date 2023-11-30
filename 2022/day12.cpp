#include <iostream>
#include <string>
#include <fstream>
#include <set>
#include <vector>


using namespace std;


struct point {
    int x;
    int y;
    int elevation;

    bool operator<(const point& other) const {
        return (x < other.x) || (x == other.x && y < other.y);
    }
    bool operator==(const point& other) const {
        return (x == other.x) && (y == other.y);
    }
};


struct path_node {
    path_node* parent;
    point p;
};



int main() {
    vector<vector<point>> elevation_grid;
    point start, goal;

    // parse input into grid of elevations and start/end points
    fstream input;
    input.open("./inputs/day12.input");
    string line;
    int y = 0;
    while (getline(input, line)) {
        elevation_grid.push_back({});
        int x = 0;
        for (auto c: line) {
            int height;
            if (c == 'S') {
                // starting pos, height 'a'
                start.x = x;
                start.y = y;
                start.elevation = 1;
                height = 1;
            } else if (c == 'E') {
                // goal, height 'z'
                goal.x = x;
                goal.y = y;
                goal.elevation = 26;
                height = 26;
            } else {
                height = c - 'a' + 1;
            }
            elevation_grid[y].push_back({x, y, height});
            ++x;
        }
        ++y;
    }

    { // part 1
        // construct a search tree, saving paths that reach the end
        vector<vector<point>> complete_paths;
        vector<path_node*> stack;
        path_node head;
        head.p = start;
        head.parent = nullptr;
        stack.push_back(&head);
        int max_x = elevation_grid[0].size() - 1;
        int max_y = elevation_grid.size() - 1;
        set<point> visited;

        while (!stack.empty()) {
            path_node* n = stack.front();
            stack.erase(stack.begin());

            if (n->p == goal) {
                vector<point> path_so_far;
                path_node* path = n;
                while (path != nullptr) {
                    path_so_far.push_back(path->p);
                    path = path->parent;
                }
                complete_paths.push_back(path_so_far);
                continue;
            }

            if (visited.count(n->p))
                continue;

            // consider possible paths based on:
            //    - adjacent (and in grid)
            //    - reachable (at most one higher (can be much lower))
            //    - not already in this path (walk parent pointers to make sure)
            point here = n->p;
            point up = {here.x, here.y-1};
            point down = {here.x, here.y+1};
            point left = {here.x-1, here.y};
            point right = {here.x+1, here.y};

            for (point p: {up, down, left, right}) {
                if (p.x < 0 || p.x > max_x || p.y < 0 || p.y > max_y) {
                    continue;
                }
                p.elevation = elevation_grid[p.y][p.x].elevation;
                if (p.elevation > n->p.elevation + 1) {
                    continue;
                }

                path_node* new_node = new path_node;
                new_node->p = p;
                new_node->parent = n;
                stack.push_back(new_node);
            }
            visited.insert(n->p);
        }

        int shortest_path = INT_MAX;
        for (auto p: complete_paths) {
            if (p.size() < shortest_path)
                shortest_path = p.size();
        }
        cout << "(Part 1) Shortest path to the top is " << shortest_path - 1 << ".\n";
    }

    { // part 2
        vector<point> possible_starts;
        for (auto row: elevation_grid) {
            for (auto p: row) {
                if (p.elevation == 1)
                    possible_starts.push_back(p);
            }
        }

        vector<vector<point>> complete_paths;

        for (point start: possible_starts) {
            vector<path_node*> stack;
            path_node head;
            head.p = start;
            head.parent = nullptr;
            stack.push_back(&head);
            int max_x = elevation_grid[0].size() - 1;
            int max_y = elevation_grid.size() - 1;
            set<point> visited;

            while (!stack.empty()) {
                path_node* n = stack.front();
                stack.erase(stack.begin());

                if (n->p == goal) {
                    vector<point> path_so_far;
                    path_node* path = n;
                    while (path != nullptr) {
                        path_so_far.push_back(path->p);
                        path = path->parent;
                    }
                    complete_paths.push_back(path_so_far);
                    continue;
                }

                if (visited.count(n->p))
                    continue;

                // consider possible paths based on:
                //    - adjacent (and in grid)
                //    - reachable (at most one higher (can be much lower))
                //    - not already in this path (walk parent pointers to make sure)
                point here = n->p;
                point up = {here.x, here.y-1};
                point down = {here.x, here.y+1};
                point left = {here.x-1, here.y};
                point right = {here.x+1, here.y};

                for (point p: {up, down, left, right}) {
                    if (p.x < 0 || p.x > max_x || p.y < 0 || p.y > max_y) {
                        continue;
                    }
                    p.elevation = elevation_grid[p.y][p.x].elevation;
                    if (p.elevation > n->p.elevation + 1) {
                        continue;
                    }

                    path_node* new_node = new path_node;
                    new_node->p = p;
                    new_node->parent = n;
                    stack.push_back(new_node);
                }
                visited.insert(n->p);
            }
        }

        int shortest_path = INT_MAX;
        for (auto p: complete_paths) {
            if (p.size() < shortest_path)
                shortest_path = p.size();
        }
        cout << "(Part 2) Shortest path to the top from any start is " << shortest_path - 1 << ".\n";
    }
}
