#include <stdio.h>
#include <stdlib.h>


typedef struct node {
    int value;
    struct node* left_child;
    struct node* right_child;
} node;


node* new_node(value) {
    node* n = (node*) malloc(sizeof(node));
    n->value = value;
    n->left_child = NULL;
    n->right_child = NULL;

    return n;
}


void insert(int value, node* tree) {
    node* cur = tree;
    node* dest;

    for(;;) {
        if (value > cur->value) {
            dest = cur->right_child;
            if (dest == NULL) {
                cur->right_child = new_node(value);
                break;
            }
        } else if (value < cur->value) {
            dest = cur->left_child;
            if (dest == NULL) {
                cur->left_child = new_node(value);
                break;
            }
        }
        cur = dest;
    }
}


int contains(int value, node* tree) {
    node* cur = tree;

    for(;;) {
        if (cur == NULL) {
            return 0;
        }
        else if (value == cur->value) {
            return 1;
        }
        else if (value > cur->value) {
            cur = cur->right_child;
        }
        else if (value < cur->value) {
            cur = cur->left_child;
        }
    }
}


#define SEQ_LEN 1000


// Run this like so: `cc -Ofast freq.c && cat input.txt | ./a.out`
int main(int argc, char **argv) {
    char c;
    int parsed, buffer_i, sequence_i, totals_memo_i, current_total, single_total;
    char buffer[20];
    int sequence[SEQ_LEN];
    int totals_memo[SEQ_LEN * 1000];
    node* set = new_node(0);

    sequence_i = totals_memo_i = current_total = single_total = 0;

    // parse complete input into memory before starting the cycle
    for(;;) {
        buffer_i = 0;
        while((c = getc(stdin)) != '\n') {
            if (c == EOF) break;
            buffer[buffer_i++] = c;
        }
        if (c == EOF) break;
        buffer[buffer_i] = 0;
        parsed = atoi(buffer);

        sequence[sequence_i++] = parsed;
    }

    // loop over the sequence of numbers, breaking once we see a repeat sum
    for(;;) {
        if (sequence_i == SEQ_LEN) {
            sequence_i = 0;

            if (single_total == 0)
                single_total = current_total;
        }

        current_total += sequence[sequence_i++];

        if (contains(current_total, set))
            break;

        insert(current_total, set);
    }

    printf("Sum of sequence: %d\n", single_total);
    printf("First duped total: %d\n", current_total);

    return 0;
}
