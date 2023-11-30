#include <stdio.h>

int main(int argc, char** argv)
{
    char input[10000];
    int i, j, k, total_strings, stride, diffs;
    char c;

    // read piped input into memory
    stride = i = 0;
    while ((c = getc(stdin)) != EOF) {
        if (c == '\n') {
            // stride is the length of each line of input.
            // This lets us put all the data in a single contiguous array.
            if (stride == 0) stride = i;
            continue;
        }
        input[i++] = c;
    }
    total_strings = i / stride;

    // check each string
    for (i = 0; i < total_strings; ++i) {
        // compare against every string after this one
        for (j = i + 1; j < total_strings; ++j) {
            // compare char by char, adding up the differences
            diffs = 0;
            for (k = 0; k < stride; ++k) {
                if (input[stride * i + k] != input[stride * j + k])
                    ++diffs;
            }

            if (diffs == 1) break;
        }
        if (diffs == 1) break;
    }

    // i and j hold the index of the first chars of the first and second answer strings
    for (k = 0; k < stride; ++k) {
        if (input[stride * i + k] == input[stride * j + k])
            printf("%c", input[stride * i + k]);
    }
    printf("\n");
}
