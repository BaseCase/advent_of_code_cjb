#include <stdio.h>


typedef struct RingNode {
    long long value;
    struct RingNode* clockwise;
    struct RingNode* counterclockwise;
} RingNode;


RingNode* new_ring_node(unsigned long long value);
void insert_ring_node_between(RingNode* to_insert, RingNode* clockwise, RingNode* counterclockwise);
void remove_ring_node(RingNode* rn);


#define PLAYER_COUNT 491
#define LAST_MARBLE 7105800ULL


// example problem: 10 players; last marble is worth 1618 points: high score is 8317
// actual problem: 491 players; last marble is worth 71058 points
int main(int argc, char** argv)
{
    unsigned long long player_scores[PLAYER_COUNT] = {0};
    RingNode* current;

    //
    // play the first 2 turns manually
    //
    {
        RingNode* first = new_ring_node(0);
        RingNode* second = new_ring_node(1);

        first->counterclockwise = second;
        first->clockwise = second;
        second->counterclockwise = first;
        second->clockwise = first;

        current = second;
    }

    //
    // play the marble game
    //
    {
        int current_player = 3;
        unsigned long long next_marble_number = 2;
        RingNode *left, *right, *removee;

        while (next_marble_number < LAST_MARBLE)
        {
            if (next_marble_number % 23 == 0) {
                // special scoring marble
                player_scores[current_player] += next_marble_number;
                removee = current->counterclockwise->counterclockwise->counterclockwise->counterclockwise->counterclockwise->counterclockwise->counterclockwise; //lol
                player_scores[current_player] += removee->value;
                current = removee->clockwise;
                remove_ring_node(removee);
            } else {
                // normal flow of play
                left = current->clockwise->clockwise;
                right = current->clockwise;

                current = new_ring_node(next_marble_number);
                insert_ring_node_between(current, left, right);
            }

            ++next_marble_number;
            current_player = (current_player + 1) % PLAYER_COUNT;
        }
    }

    //
    // find high score
    //
    {
        unsigned long long high_score = 0;
        for (int i = 0; i < PLAYER_COUNT; ++i)
        {
            if (player_scores[i] > high_score)
                high_score = player_scores[i];
        }
        printf("High score is %llu.\n", high_score);
    }
}


#define POOL_SIZE 8000000ULL

RingNode* new_ring_node(unsigned long long value)
{
    static RingNode node_pool[POOL_SIZE];
    static unsigned long long next_node = 0;

    RingNode* rn = &node_pool[next_node++];
    rn->value = value;
    rn->counterclockwise = NULL;
    rn->clockwise = NULL;

    return rn;
}


void insert_ring_node_between(RingNode* to_insert, RingNode* clockwise, RingNode* counterclockwise)
{
    to_insert->clockwise = clockwise;
    to_insert->counterclockwise = counterclockwise;
    clockwise->counterclockwise = to_insert;
    counterclockwise->clockwise = to_insert;
}


void remove_ring_node(RingNode* rn)
{
    RingNode* left = rn->clockwise;
    RingNode* right = rn->counterclockwise;

    left->counterclockwise = right;
    right->clockwise = left;
}
