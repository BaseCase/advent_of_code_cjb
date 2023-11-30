#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>


typedef uint64_t u64;


#define PUZZLE_INPUT 580741


int found_search_sequence(int* scores, u64 n);


int main(int argc, char **argv)
{
    int new_score, found_sequence;
    u64 elf1_pos, elf2_pos, scores_n;

    int* scores = (int*)malloc(sizeof(int) * PUZZLE_INPUT * 50);

    // given setup
    scores[0] = 3;
    scores[1] = 7;
    scores_n = 2;
    elf1_pos = 0;
    elf2_pos = 1;

    while(1)
    {
        // combine recipes to make new one or two
        new_score = scores[elf1_pos] + scores[elf2_pos];
        if (new_score >= 10) {
            scores[scores_n++] = 1;

            // for part 2, we're looking for a chunk of scores[] that matches PUZZLE_INPUT digit-by-digit
            found_sequence = found_search_sequence(scores, scores_n);
            if (found_sequence) {
                printf("Got 'em. Position %llu is where.\n", scores_n - 6);
                break;
            }

            new_score = new_score - 10;
        }
        scores[scores_n++] = new_score;

        elf1_pos = (elf1_pos + scores[elf1_pos] + 1) % (scores_n);
        elf2_pos = (elf2_pos + scores[elf2_pos] + 1) % (scores_n);

        //
        // part 1 check
        //
        if (scores_n == PUZZLE_INPUT + 10) {
            printf("Part 1 answer: ");
            for (u64 i = PUZZLE_INPUT; i < scores_n; ++i)
            {
                printf("%d", scores[i]);
            }
            printf("\n");
        }


        // dupe of part 2 check above because I'm too lazy to refactor properly
        found_sequence = found_search_sequence(scores, scores_n);
        if (found_sequence) {
            printf("Got 'em. Position %llu is where.\n", scores_n - 6);
            break;
        }
    }
}


int found_search_sequence(int* scores, u64 n)
{
    u64 score_check;

    if (n < 7)
        return 0;

    score_check = 0
        + scores[n - 1] * 1
        + scores[n - 2] * 10
        + scores[n - 3] * 100
        + scores[n - 4] * 1000
        + scores[n - 5] * 10000
        + scores[n - 6] * 100000;

    return score_check == PUZZLE_INPUT;
}
