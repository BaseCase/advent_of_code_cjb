#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <vector>
#include <algorithm>


using namespace std;


struct directory {
    string name;
    int sz_contents;
    vector<directory> children;
    directory* parent;
    int sz_recursive_contents;
};


// calculate and store the size of contents of *this* dir plus all its children
int assign_recursive_content_sizes(directory* d) {
    int sum_children = 0;
    for (int i=0; i<d->children.size(); ++i) {
        directory* c = &d->children[i];
        sum_children += assign_recursive_content_sizes(c);
    }
    d->sz_recursive_contents = d->sz_contents + sum_children;
    return d->sz_recursive_contents;
}


int part1(directory* d) {
    int contribution = d->sz_recursive_contents <= 100000 ? d->sz_recursive_contents : 0;
    int sum_children = 0;
    for (auto c: d->children) {
        sum_children += part1(&c);
    }
    return contribution + sum_children;
}


vector<int> sizes_at_least(int min, directory* d) {
    vector<int> v;
    if (d->sz_recursive_contents >= min) {
        v.push_back(d->sz_recursive_contents);
    }
    for (auto c: d->children) {
        vector<int> w = sizes_at_least(min, &c);
        v.insert(v.end(), w.begin(), w.end());
    }
    return v;
}


int main() {
    fstream input;
    input.open("./inputs/day07.input");

    directory root;
    root.name = "/";
    root.parent = nullptr;
    root.sz_contents = 0;
    root.sz_recursive_contents = 0;

    directory* cur_dir = &root;
    string l;
    while (!input.eof()) {
        getline(input, l);
        auto line = stringstream(l);
        string token;

        getline(line, token, ' ');
        if (token == "$") {
            getline(line, token, ' ');
            if (token == "cd") {
                getline(line, token, ' ');

                // I *think* we can treat `cd`s as creating the directories?
                // it doesn't seem like we revisit the same place twice; hopefully I'm right about that.
                if (token == "..") {
                    cur_dir = cur_dir->parent;
                } else if (token == "/") {
                    cur_dir = &root;
                } else {
                    directory new_dir;
                    new_dir.name = token;
                    new_dir.sz_contents = 0;
                    new_dir.sz_recursive_contents = 0;
                    new_dir.parent = cur_dir;
                    cur_dir->children.push_back(new_dir);
                    cur_dir = &(cur_dir->children.back());
                }
            }
            else if (token == "ls") {
                // I don't think we need to do anything here?
            }
        }
        else if (token == "dir") {
            // meow
        }
        else if (!token.empty()){
            // it's a file listing
            int sz_file = stoi(token);
            cur_dir->sz_contents += sz_file;
        }
    }

    assign_recursive_content_sizes(&root);
    int part1_sum = part1(&root);

    int disk_capacity = 70000000;
    int target_space = 30000000;
    int unused_space = disk_capacity - root.sz_recursive_contents;
    int space_needed = target_space - unused_space;

    vector<int> candidates = sizes_at_least(space_needed, &root);
    int part2 = *min_element(candidates.begin(), candidates.end());

    cout << "(Part 1) Sum of contents <= 100000: " << part1_sum << "\n";
    cout << "(Part 2) Minimum size of dir we can delete to get enough space: " << part2 << "\n";
}
