#include <stdio.h>
#include <stdlib.h>


// 11 is the largest number in our input. Whether that's a metadata number or a
// child node count I'm not sure, but at any rate, it's small enough that we
// can just make it our default child node allocation size and not run out of
// memory.
#define MAX_CHILDREN 11


typedef struct Node {
    int id;
    int wanted_metadata;     // the metadata count we got from the input. aspirational.
    int wanted_children;     // same as above but child nodes
    int possessed_metadata;  // how many metadata nodes we've actually gotten
    int possessed_children;  // same as above but children
    int metadata_values[MAX_CHILDREN];
    struct Node **children;
} Node;


typedef enum ParserState {
    getting_child_count,
    getting_metadata_count,
    getting_metadata,
} ParserState;


Node* new_node(int id, int metadata_count, int children_count);
int sum_tree_metadata(Node* tree);
int calculate_tree_value(Node* tree);


int main(int argc, char** argv)
{
    int metadata_sum, tree_value;
    Node* tree;


    //
    // Parse input and build tree at the same time
    //
    {
        Node* stack[500]; // no clue how deep the stack will get. this might not be enough? or maybe too much...
        char buffer[3];
        char c;
        int buffer_i, expected_children, expected_metadata, parsed_value;

        int next_node_id = 1;
        int stack_top = 0;
        int first_time = 1;   // omg no

        ParserState state = getting_child_count;

        buffer_i = 0;
        while ((c = getc(stdin)) != EOF)
        {
            switch (c)
            {
                case ' ': case '\n': {
                    buffer[buffer_i] = 0;
                    parsed_value = atoi(buffer);
                    buffer_i = 0;

                    switch (state)
                    {
                        case getting_child_count: {
                            expected_children = parsed_value;
                            state = getting_metadata_count;
                        } break;

                        case getting_metadata_count: {
                            expected_metadata = parsed_value;
                            Node* current_node = new_node(next_node_id++, expected_metadata, expected_children);

                            // add the newly created node to its parent, (skip first time since it's root)
                            if (!first_time) {
                                Node* top = stack[stack_top];
                                top->children[top->possessed_children++] = current_node;
                            }

                            // push the new node onto the processing stack.
                            if (first_time) {
                                first_time = 0;
                                stack[stack_top] = current_node;
                            } else {
                                stack[++stack_top] = current_node;
                            }

                            if (stack[stack_top]->possessed_children < stack[stack_top]->wanted_children) {
                                state = getting_child_count;
                            } else {
                                state = getting_metadata;
                            }
                        } break;

                        case getting_metadata: {
                            Node* top = stack[stack_top];
                            if (top->possessed_metadata < top->wanted_metadata) {
                                top->metadata_values[top->possessed_metadata++] = parsed_value;
                            }

                            while (top->possessed_metadata == top->wanted_metadata
                                    && top->possessed_children == top->wanted_children)
                            {
                                --stack_top;
                                if (stack_top < 0)
                                    break;
                                top = stack[stack_top];
                            }

                            if (top->possessed_children < top->wanted_children) {
                                state = getting_child_count;
                            } else {
                                state = getting_metadata;
                            }
                        } break;
                    }
                } break;

                default: {
                    buffer[buffer_i++] = c;
                }
            }
        }

        tree = stack[0];
    }


    metadata_sum = sum_tree_metadata(tree);
    tree_value = calculate_tree_value(tree);
    printf("The normal sum of all metadata fields is %d.\n", metadata_sum);
    printf("The weird part2 value for the tree is %d.\n", tree_value);
}


Node* new_node(int id, int metadata_count, int children_count)
{
    Node* n = (Node*) malloc(sizeof(Node));
    n->id = id;
    n->wanted_metadata = metadata_count;
    n->possessed_metadata = 0;
    n->wanted_children = children_count;
    n->possessed_children = 0;
    n->children = (Node**) malloc(sizeof(Node*) * MAX_CHILDREN); // overkill but whatever it's just 11

    return n;
}


int sum_tree_metadata(Node* tree)
{
    if (tree == NULL)
        return 0;

    int metadata_sum = 0;
    for (int i = 0; i < tree->possessed_metadata; ++i)
        metadata_sum += tree->metadata_values[i];

    for (int i = 0; i < tree->possessed_children; ++i)
        metadata_sum += sum_tree_metadata(tree->children[i]);

    return metadata_sum;
}


int calculate_tree_value(Node* tree)
{
    if (tree == NULL)
        return 0;

    int value = 0;
    if (tree->possessed_children == 0) {
        // this is a leaf, so its value is its metadata sum
        for (int i = 0; i < tree->possessed_metadata; ++i)
            value += tree->metadata_values[i];
    } else {
        // this is *not* a leaf, so its value is the sum of the values of its branches, indexed by #
        for (int i = 0; i < tree->possessed_metadata; ++i)
        {
            int child_position = tree->metadata_values[i] - 1;
            if (child_position >= tree->possessed_children)
                continue;

            value += calculate_tree_value(tree->children[child_position]);
        }
    }

    return value;
}
