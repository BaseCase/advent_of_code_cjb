#include <stdio.h>
#include <pthread.h>


#define GRID_AXIS_SIZE 300
#define GRID_SERIAL_NUMBER 4842 // generated puzzle input


typedef struct MaxFinderInput {
    int size;          // the size of the squares we're checking
    int* grid;         // the playing field. do not modify pls
    int upper_left_x;  // output field, upper left corner of the max sum square
    int upper_left_y;  // ^^
    int max_sum;       // output field, sum of the best square
} MaxFinderInput;


void* find_max_square_sum(void* arg);


int main(int argc, char** argv)
{
    //
    // build the grid in memory
    //
    int grid[GRID_AXIS_SIZE * GRID_AXIS_SIZE];

    {
        int pos, rack_id, power_level, hundreds_digit;

        for (int y = 1; y <= GRID_AXIS_SIZE; ++y) {
            for (int x = 1; x <= GRID_AXIS_SIZE; ++x)
            {
                // convert coords into flat array member
                pos = ((y - 1) * GRID_AXIS_SIZE) + (x - 1);

                // convoluted calculation from the problem description
                rack_id = x + 10;
                power_level = rack_id * y;
                power_level += GRID_SERIAL_NUMBER;
                power_level *= rack_id;
                hundreds_digit = (power_level / 100) % 10;

                grid[pos] = hundreds_digit - 5;
            }
        }
    }

    //
    // find the square of any size with the highest sum
    //
    int upper_left_x, upper_left_y, max, max_square_size;
    {
        pthread_t threads[GRID_AXIS_SIZE];
        MaxFinderInput inputs[GRID_AXIS_SIZE] = {0};

        // try each square size in a thread, then join them to find the max.
        for (int size = 1; size <= GRID_AXIS_SIZE; ++size)
        {
            int i = size - 1;
            inputs[i].size = size;
            inputs[i].grid = grid;
            inputs[i].max_sum = 0;

            pthread_create(&threads[i], NULL, &find_max_square_sum, &inputs[i]);
        }

        max = 0;
        for (int i = 0; i < GRID_AXIS_SIZE; ++i)
        {
            pthread_join(threads[i], NULL);

            if (inputs[i].max_sum > max) {
                max = inputs[i].max_sum;
                upper_left_x = inputs[i].upper_left_x;
                upper_left_y = inputs[i].upper_left_y;
                max_square_size = inputs[i].size;
            }
        }

    }

    printf("At a sum of %d, the %dx%d grid with the best score is at (%d, %d)\n",
            max,
            max_square_size,
            max_square_size,
            upper_left_x,
            upper_left_y);
}


void* find_max_square_sum(void* arg)
{
    MaxFinderInput* input = (MaxFinderInput*)arg;
    int sum, pos, max, upper_left_x, upper_left_y;

    max = 0;

    // loop over all possible upper-left-corners-of-AxA-squares, where A is the current size
    for (int y = 1; y <= (GRID_AXIS_SIZE - input->size + 1); ++y) {
        for (int x = 1; x <= (GRID_AXIS_SIZE - input->size + 1); ++x)
        {
            // and for each of those upper-left corners, sum up their AxA grid
            sum = 0;
            for (int yl = 0; yl < input->size; ++yl) {
                for (int xl = 0; xl < input->size; ++xl)
                {
                    pos = ((y - 1 + yl) * GRID_AXIS_SIZE) + (x - 1 + xl);
                    sum += input->grid[pos];
                }
            }
            if (sum > max) {
                max = sum;
                upper_left_x = x;
                upper_left_y = y;
            }
        }
    }

    input->upper_left_x = upper_left_x;
    input->upper_left_y = upper_left_y;
    input->max_sum = max;

    return NULL;
}
