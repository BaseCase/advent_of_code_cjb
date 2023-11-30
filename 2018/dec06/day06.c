#include <stdio.h>
#include <stdlib.h>
#include <string.h>


typedef struct Cell {
    int id;              // unique ID, only given to plotted cells (stays 0 for non-plotted)
    int x;               // x coord
    int y;               // y coord
    int claimed_by;      // ID of plotted cell that owns this one. 0 if never claimed. -1 if contested.
    int total_distance;  // sum of Manhattan Distances to all inputs
} Cell;


Cell* cell_at_coord(Cell* grid, int x, int y);
int manhattan_distance(int x1, int y1, int x2, int y2);


#define stride 400


// I should be fired for this...
#define set_add_claimant_id {                                            \
    claimant_id = cell_at_coord(arena, x, y)->claimed_by;                \
                                                                         \
    if (claimant_id == -1)                                               \
        continue;                                                        \
                                                                         \
    found = 0;                                                           \
    for (int i = 0; i < disqualified_i; ++i)                             \
    {                                                                    \
        if (claimant_id == disqualified[i]) {                            \
            found = 1;                                                   \
            break;                                                       \
        }                                                                \
    }                                                                    \
    if (!found) {                                                        \
        disqualified[disqualified_i++] = claimant_id;                    \
    }                                                                    \
}


int main(int argc, char** argv)
{
    Cell* arena;
    Cell inputs[50];
    int left_edge, right_edge, top_edge, bottom_edge, inputs_len;

    //
    // Create an arena of empty cells, then parse the input and mark those
    // cells as plotted. Lower right cell is at (353, 358), so let's just make
    // a 400x400 arena. Upper left is (40, 45), so we'll have a bunch of
    // wasted space, but it's easier to think about this way.
    //
    left_edge = top_edge = stride;
    right_edge = bottom_edge = inputs_len = 0;
    {
        char c;
        int i, x, y, next_cell_id;
        char buffer[5];
        Cell* newly_plotted_cell;

        arena = (Cell*) malloc(sizeof(Cell) * stride * stride);
        memset(arena, 0, sizeof(Cell) * stride * stride);

        next_cell_id = 1;

        while ((c = getc(stdin)) != EOF)
        {
            switch(c)
            {
                case ',': {
                    // end of x coord
                    buffer[i] = 0;
                    x = atoi(buffer);
                    i = 0;
                } break;

                case '\n': {
                    // end of y coord
                    buffer[i] = 0;
                    y = atoi(buffer);
                    i = 0;

                    if (x < left_edge) left_edge = x;
                    if (x > right_edge) right_edge = x;
                    if (y < top_edge) top_edge = y;
                    if (y > bottom_edge) bottom_edge = y;

                    newly_plotted_cell = cell_at_coord(arena, x, y);
                    newly_plotted_cell->id = next_cell_id;
                    newly_plotted_cell->x = x;
                    newly_plotted_cell->y = y;
                    newly_plotted_cell->claimed_by = 0;
                    ++next_cell_id;

                    // Save our plotted cells in their own array for easy comparison later.
                    inputs[inputs_len++] = *newly_plotted_cell;
                } break;

                case ' ': {
                    // just skip spaces
                } break;

                default: {
                    // part of a number
                    buffer[i++] = c;
                }
            }
        }
    }

    //
    // Next, we want to find out which plotted coord has a claim to each cell of the arena.
    // We'll actually look at everything inside the bounded rectangle we found during parsing,
    // PLUS a one-deep gutter ring around that rectangle, for reasons we'll see later.
    //
    {
        int x, y, shortest_distance, owner_id;
        Cell *cell_in_question;

        for (y = top_edge - 1; y <= bottom_edge + 1; ++y) {
            for (x = left_edge - 1; x <= right_edge + 1; ++x)
            {
                cell_in_question = cell_at_coord(arena, x, y);
                cell_in_question->total_distance = 0;

                shortest_distance = 10000;
                for (int i = 0; i < inputs_len; ++i)
                {
                    Cell cur = inputs[i];
                    int md = manhattan_distance(x, y, cur.x, cur.y);

                    cell_in_question->total_distance += md;

                    if (md == shortest_distance) {
                        owner_id = -1;
                    }

                    if (md < shortest_distance) {
                        shortest_distance = md;
                        owner_id = cur.id;
                    }
                }

                // plotted points claim themselves
                if (cell_in_question->id) {
                    cell_in_question->claimed_by = cell_in_question->id;
                } else {
                    cell_in_question->claimed_by = owner_id;
                }
            }
        }
    }

    //
    // Now that we've got the whole arena mapped out with claims on every cell,
    // we can calculate the areas. First, though, we look in that outer gutter
    // layer. Any input ID that appears in that gutter would have claim over
    // an infinite area, so we discard them. Only inputs with finite area are
    // candidates for the final answer.
    //
    {
        int x, y, disqualified_i, found, claimant_id;
        int disqualified[50];

        disqualified_i = 0;

        // top row of disqualifying gutter
        y = top_edge - 1;
        for (x = left_edge - 1; x <= right_edge + 1; ++x)
        {
            set_add_claimant_id;
        }

        // bottom row of disqualifying gutter
        y = bottom_edge + 1;
        for (x = left_edge - 1; x <= right_edge + 1; ++x)
        {
            set_add_claimant_id;
        }

        // left and right edges of disqualifying gutter
        for (y = top_edge; y <= bottom_edge; ++y)
        {
            x = left_edge - 1;
            set_add_claimant_id;
            x = right_edge + 1;
            set_add_claimant_id;
        }

        // Now sum up all the areas
        // We'll offset this array by 1 to match the input IDs.
        int scores[51] = {0};
        for (y = top_edge; y <= bottom_edge; ++y) {
            for (x = left_edge; x <= right_edge; ++x)
            {
                Cell* c = cell_at_coord(arena, x, y);

                if (c->claimed_by == -1)
                    continue;

                scores[c->claimed_by] += 1;
            }
        }

        // Set all the disqualified input scores to 0.
        for (int i = 1; i < 51; ++i) {
            for (int j = 0; j < disqualified_i; ++j)
            {
                if (i == disqualified[j]) {
                    scores[i] = 0;
                }
            }
        }

        // and now find the best score out of the remaining inputs.
        int winner_id = 0;
        int winner_score = 0;
        for (int i = 1; i < 51; ++i)
        {
            if (scores[i] > winner_score) {
                winner_score = scores[i];
                winner_id = i;
            }
        }

        printf("The largest area is %d (from input %d).\n", winner_score, winner_id);

    }

    //
    // Now, for part 2, we want the count of all cells with a total distance to all
    // inputs lower than 10,000.
    //
    {
        int total = 0;
        for (int y = top_edge; y <= bottom_edge; ++y) {
            for (int x = left_edge; x <= right_edge; ++x)
            {
                if (cell_at_coord(arena, x, y)->total_distance < 10000)
                    ++total;
            }
        }

        printf("We found %d regions with a distance sum less than 10000.\n", total);
    }
}


Cell* cell_at_coord(Cell* grid, int x, int y)
{
    int pos = (stride * y) + x;
    return &grid[pos];
}


int manhattan_distance(int x1, int y1, int x2, int y2)
{
    return abs(x1 - x2) + abs(y1 - y2);
}
