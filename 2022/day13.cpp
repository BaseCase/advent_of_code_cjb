#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <algorithm>


using namespace std;


enum class which {
    number,
    list,
};

struct item {
    which tag;
    vector<item> list;
    int number;
};


void print_list(item i, int leading_spaces) {
    if (i.tag == which::number) {
        cout << i.number << " ";
    }
    if (i.tag == which::list) {
        for (int x=0; x<leading_spaces; ++x)
            cout << " ";
        cout << "[";
        for (auto j: i.list) {
            print_list(j, leading_spaces + 2);
        }
        cout << "]";
    }
}


enum class result {
    right,
    wrong,
    inconclusive,
};


result pair_is_in_order(item left, item right) {
    // both numbers
    if (left.tag == which::number && right.tag == which::number) {
        if (left.number < right.number)
            return result::right;
        if (left.number > right.number)
            return result::wrong;
        return result::inconclusive;
    }
    // both lists
    if (left.tag == which::list && right.tag == which::list) {
        for (int i=0; i<left.list.size(); ++i) {
            if (i >= right.list.size())
                return result::wrong;
            result res = pair_is_in_order(left.list[i], right.list[i]);
            if (res == result::inconclusive)
                continue;
            else
                return res;
        }
        if (left.list.size() < right.list.size())
            return result::right;
        else
            return result::inconclusive;
    }
    // one number one list
    if (left.tag == which::number) {
        item newitem;
        newitem.tag = which::number;
        newitem.number = left.number;
        left.tag = which::list;
        left.list = {newitem};
        return pair_is_in_order(left, right);
    }
    if (right.tag == which::number) {
        item newitem;
        newitem.tag = which::number;
        newitem.number = right.number;
        right.tag = which::list;
        right.list = {newitem};
        return pair_is_in_order(left, right);
    }

    // should never get here...
    return result::wrong;
}

struct {
    bool operator()(item a, item b) const {
        return pair_is_in_order(a, b) == result::right;
    }
} compare_items;


int main() {
    vector<vector<item>> pairs;

    fstream input;
    input.open("./inputs/day13.input");

    // parse input into pairs of item lists
    string line1, line2, scrap;
    while (!input.eof()) {
        getline(input, line1);
        getline(input, line2);
        getline(input, scrap);

        vector<item> pair;

        for (string line: {line1, line2}) {
            item first;
            first.tag = which::list;
            vector<item> stack = {first};
            for (int i=1; i<line.size(); ++i) {
                char c = line[i];
                switch(c) {
                case '[': {
                    item newlist;
                    newlist.tag = which::list;
                    stack.push_back(newlist);
                } break;
                case ']': {
                    item tmp = stack.back();
                    stack.pop_back();
                    if (stack.empty()) {
                        first = tmp;
                        break;
                    }
                    stack.back().list.push_back(tmp);
                } break;
                case ',': {
                } break;
                default: {
                    item newnum;
                    newnum.tag = which::number;
                    if (line[i+1] == '0') {
                        // disgusting hack since we know we've only got single-digit numbers or 10.
                        // lmao it's advent of code babyyyy
                        newnum.number = 10;
                        ++i;
                    } else {
                        newnum.number = c - 48;
                    }
                    stack.back().list.push_back(newnum);
                } break;
                }
            }

            pair.push_back(first);
        }
        pairs.push_back(pair);
    }

    int pair_index = 1;
    vector<int> idx_of_in_order_pairs;
    for (auto pair: pairs) {
        item left = pair[0];
        item right = pair[1];

        if (pair_is_in_order(left, right) == result::right)
            idx_of_in_order_pairs.push_back(pair_index);
        ++pair_index;
    }
    int part1 = 0;
    for (auto x: idx_of_in_order_pairs)
        part1 += x;
    cout << "(Part 1) Sum of indices of in-order pairs: " << part1 << "\n";


    // part 2
    vector<item> packets;
    for (auto pair: pairs)
        for (auto p: pair)
            packets.push_back(p);

    // include two divider packets [[2]] and [[6]]
    item d1, d2, d1_l1, d1_l2, d2_l1, d2_l2;
    d1.tag = which::list;
    d1_l1.tag = which::list;
    d1_l2.tag = which::number;
    d1_l2.number = 2;
    d1_l1.list = {d1_l2};
    d1.list = {d1_l1};
    d2.tag = which::list;
    d2_l1.tag = which::list;
    d2_l2.tag = which::number;
    d2_l2.number = 6;
    d2_l1.list = {d2_l2};
    d2.list = {d2_l1};
    packets.push_back(d1);
    packets.push_back(d2);

    sort(packets.begin(), packets.end(), compare_items);
    int idx_first_sentinel, idx_second_sentinel;
    for (int i=0; i<packets.size(); ++i) {
        if (pair_is_in_order(d1, packets[i]) == result::inconclusive) {
            idx_first_sentinel = i+1;
        }
        if (pair_is_in_order(d2, packets[i]) == result::inconclusive) {
            idx_second_sentinel = i+1;
        }
    }
    cout << "(Part 2) first at " << idx_first_sentinel;
    cout << ", second at " << idx_second_sentinel;
    cout << ", so answer is " << idx_first_sentinel * idx_second_sentinel << ".\n";
}
