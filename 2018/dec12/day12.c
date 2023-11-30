#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>


int board_position_to_array_index(int b_pos);
int array_index_to_board_position(int i);
void print_board(int *board);


#define BUFFER_SIZE 1000
#define PART_1_ITERATIONS 20
#define PART_2_ITERATIONS 50000000000LL
#define ITERATIONS_UNTIL_STABLE 200


int main(int argc, char** argv)
{
    int *board = (int*)malloc(sizeof(int) * BUFFER_SIZE);
    memset(board, 0, sizeof(int) * BUFFER_SIZE);

    // Represent rules as an array, where the positions match the patterns
    // described in the input. A value of 1 is '#', 0 is '.' The indices match
    // the left side of the rules. Examples:
    // ..... == index 00000
    // ##### == index 11111
    // #.##. == index 10110
    //
    int rules[11112] = {0};

    //
    // parse initial state from input
    //
    {
        char c;
        int board_i = 0;
        while ((c = getc(stdin)) != '\n')
        {
            if (c == '#') {
                board[board_position_to_array_index(board_i)] = 1;
                ++board_i;
            }

            if (c == '.') {
                board[board_position_to_array_index(board_i)] = 0;
                ++board_i;
            }
        }
    }

    //
    // parse rules from input
    //
    {
        char c;
        int alive;
        int power_of_ten = 4;
        int index = 0;
        while ((c = getc(stdin)) != EOF)
        {
            if (!((c == '.') || (c == '#')))
                continue;

            if (c == '.')
                alive = 0;
            if (c == '#')
                alive = 1;

            if (power_of_ten >= 0) {
                index += pow(10, power_of_ten) * alive;
                --power_of_ten;
            } else {
                rules[index] = alive;
                power_of_ten = 4;
                index = 0;
            }
        }
    }

    //
    // Run simulation 200-ish times. It turns out that we don't have to do all 50 billion iterations,
    // because after about 200, the structure of the alive plants stabilizes and simply moves right
    // one cell per iteration. So, we can capture that stable structure, apply an offset to the pot numbers,
    // and that should be good enough to get our answer.
    //
    {
        int *temp_board = (int*)malloc(sizeof(int) * BUFFER_SIZE);
        memset(temp_board, 0, sizeof(int) * BUFFER_SIZE);
        int* tmp;
        int alive;
        int rule_index, i, j;

        for (i = 1; i <= ITERATIONS_UNTIL_STABLE; ++i)
        {
            for (j = 2; j <= BUFFER_SIZE - 3; ++j)
            {
                // Find the correct alive/dead rule based on current cell's neighbors left and right
                rule_index =
                    (board[j-2] * 10000) +
                    (board[j-1] * 1000) +
                    (board[j] * 100) +
                    (board[j+1] * 10) +
                    (board[j+2]);

                alive = rules[rule_index];
                temp_board[j] = alive;
            }

            tmp = board;
            board = temp_board;
            temp_board = tmp;

            if (i == PART_1_ITERATIONS)
            {
                {
                    int alive_pots_sum = 0;
                    for (int k = 0; k < BUFFER_SIZE; ++k)
                    {
                        if (board[k]) {
                            alive_pots_sum += array_index_to_board_position(k);
                        }
                    }
                    printf("Sum of alive pots numbers after %d iterations: %d\n", PART_1_ITERATIONS, alive_pots_sum);
                }
            }
        }

        // Now figure out our offset and our pattern of alive plants, then add up the sum as though we
        // were the full PART_2_ITERATIONS out.
        int done_iterations = i - 1;
        int alive_pattern[200] = {0};  // the structure that forms is about 200 pots wide...hard-coded because whatever
        int first_alive_pot;

        for (int i = 0; i < BUFFER_SIZE; ++i)
        {
            if (board[i]) {
                first_alive_pot = array_index_to_board_position(i);
                break;
            }
        }

        for (int board_i = board_position_to_array_index(first_alive_pot), pattern_i = 0;
             pattern_i < 200; // yikes!
             ++board_i)
        {
            if (board[board_i])
                alive_pattern[pattern_i] = 1;
            else
                alive_pattern[pattern_i] = 0;
            ++pattern_i;
        }

        unsigned long long remaining_iterations = PART_2_ITERATIONS - done_iterations;
        unsigned long long sum = 0;
        for (int i = 0; i < 200; ++i)
        {
            if (alive_pattern[i])
                sum += remaining_iterations + first_alive_pot + i;
        }

        printf("Sum after %llu iterations: %llu\n", PART_2_ITERATIONS, sum);
    }
}


int board_position_to_array_index(int b_pos)
{
    //-3 -2 -1  0  1  2  3  <-- board
    // 0  1  2  3  4  5  6  <-- array
    return b_pos + (BUFFER_SIZE / 2);
}

int array_index_to_board_position(int i)
{
    //-3 -2 -1  0  1  2  3  <-- board
    // 0  1  2  3  4  5  6  <-- array
    return i - (BUFFER_SIZE / 2);
}

void print_board(int *board)
{
    for (int i = 100; i < BUFFER_SIZE; ++i)
        if (board[i])
            printf("#");
        else
            printf(".");
    printf("\n");
}
