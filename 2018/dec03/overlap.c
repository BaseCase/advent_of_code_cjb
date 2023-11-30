#include <stdio.h>
#include <stdlib.h>


typedef struct Claim {
    int id;
    int x;
    int y;
    int width;
    int height;
} Claim;


enum token_type {
    id_value,
    x_value,
    y_value,
    width_value,
    height_value
};


// lmao
#define grab_integer { \
    buffer[buffer_i] = 0; \
    value = atoi(buffer); \
    buffer_i = 0; \
}


#define ROW_SIZE 1000


int main(int argc, char** argv)
{
    Claim claims[1400];
    char buffer[10];
    char c;
    int buffer_i, value, claims_i, total_claims;
    enum token_type current_token;
    int arena_size = ROW_SIZE * ROW_SIZE;
    int* arena = calloc(arena_size, sizeof(int));

    //
    // Parse input stream into an array of Claim structs
    //
    buffer_i = claims_i = 0;
    while((c = getc(stdin)) != EOF)
    {
        switch(c)
        {
            case '#': {
                // Start of an ID
                current_token = id_value;
            } break;

            case '@': {
                // Between ID and coords
                current_token = x_value;
            } break;

            case ' ': {
                // context-dependent separator
                if (current_token == id_value) {
                    grab_integer;
                    claims[claims_i].id = value;
                }
            } break;

            case ',': {
                // Between x and y coord
                grab_integer;
                claims[claims_i].x = value;
                current_token = y_value;
            } break;

            case ':': {
                // Between coords and dimensions
                grab_integer;
                claims[claims_i].y = value;
                current_token = width_value;
            } break;

            case 'x': {
                // Between  x and y coord
                grab_integer;
                claims[claims_i].width = value;
                current_token = height_value;
            } break;

            case '\n': {
                // End of one entry
                grab_integer;
                claims[claims_i].height = value;

                ++claims_i;
            } break;

            default: {
                // an actual value
                buffer[buffer_i++] = c;
            }
        }
    }
    total_claims = claims_i;


    //
    // Make claims on the arena
    //
    {
        int claims_i, x, y, pos;

        for (claims_i = 0; claims_i < total_claims; ++claims_i)
        {
            Claim c = claims[claims_i];

            for (x = c.x; x < (c.x + c.width); ++x) {
                for (y = c.y; y < (c.y + c.height); ++y) {
                    pos = (ROW_SIZE * y) + x;
                    arena[pos]++;
                }
            }
        }
    }


    //
    // Count number of squares with claim count > 1
    //
    int total_overlaps = 0;
    for (int i = 0; i < arena_size; ++i) {
        if (arena[i] > 1) ++total_overlaps;
    }
    printf("Found %d overlapped squares.\n", total_overlaps);


    //
    // Re-run claims without actually making any, just looking for non-overlapped areas.
    //
    Claim uncontested_claim;
    {
        int claims_i, x, y, pos;

        for (claims_i = 0; claims_i < total_claims; ++claims_i)
        {
            Claim c = claims[claims_i];

            for (x = c.x; x < (c.x + c.width); ++x) {
                for (y = c.y; y < (c.y + c.height); ++y) {
                    pos = (ROW_SIZE * y) + x;
                    if (arena[pos] > 1) break;
                }
                if (arena[pos] > 1) break; // yikes!
            }
            if (arena[pos] > 1) continue; // oof owie

            // If we make it here, the full claim is uncontested in the arena
            uncontested_claim = c;
        }
    }
    printf("ID of uncontested claim: %d\n", uncontested_claim.id);
}
