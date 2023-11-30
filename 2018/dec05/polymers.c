#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>


typedef struct reduce_input {
    char* polymer;
    int polymer_len;
    char to_remove;
    int reduced_length;
} reduce_input;


int is_matched_pair(char a, char b);
void* reduce_sequence(void* arg);


int main(int argc, char** argv)
{
    char *original_polymer;
    int polymer_length, smallest_reduced_polymer_length;
    reduce_input inputs[27];

    {
        char c;
        int buffer_i;
        original_polymer = (char*) malloc(sizeof(char) * 50100); // input is about 50000 long

        buffer_i = 0;
        while ((c = getc(stdin)) != EOF && (c != '\n'))
        {
            original_polymer[buffer_i++] = c;
        }
        original_polymer[buffer_i] = 0;
        polymer_length = buffer_i;
    }

    //
    // Try the reduction 27 times: one against the raw input and one for each
    // letter of the alphabet, removing one letter from the raw input at a
    // time. The answer to part 1 is the length of the first result. The answer
    // to part 2 is the length of the shortest of the other runs.
    //
    {
        pthread_t threads[27];

        for (int removal_i = -1; removal_i < 26; ++removal_i)
        {
            char skipped_uppercase = removal_i + 'A';
            int i = removal_i + 1;

            inputs[i].polymer = original_polymer;
            inputs[i].polymer_len = polymer_length;
            inputs[i].to_remove = skipped_uppercase;
            inputs[i].reduced_length = 50000;

            pthread_create(&threads[i], NULL, &reduce_sequence, &inputs[i]);
        }

        for (int i = 0; i < 27; ++i)
            pthread_join(threads[i], NULL);

        smallest_reduced_polymer_length = 50000;
        for (int i = 0; i < 27; ++i)
        {
            int len = inputs[i].reduced_length;
            if (len < smallest_reduced_polymer_length)
                smallest_reduced_polymer_length = len;
        }
    }

    // We know that the first input didn't remove any letters, so it's the answer to part 1.
    printf("The full reduced polymer is length %d\n", inputs[0].reduced_length);
    printf("The smallest reduced polymer when stripping one letter at a time is length %d\n", smallest_reduced_polymer_length);
}


int is_matched_pair(char a, char b)
{
    if (a > b)
        return (a == (b + 32));
    else
        return (b == (a + 32));
}


void* reduce_sequence(void* arg)
{
    reduce_input* input = (reduce_input*)arg;
    char* original_polymer = input->polymer;
    int polymer_length = input->polymer_len;
    char uppercase_skip = input->to_remove;
    char lowercase_skip = uppercase_skip + 32;

    int src_i, dest_i, eliminations_count, src_len, reduced_polymer_length;
    char *src, *dest;

    src = (char*) malloc(sizeof(char) * polymer_length);
    dest = (char*) malloc(sizeof(char) * polymer_length);

    //
    // Copy the source string and trim out the unwanted characters before entering the main reduction process.
    //
    for (src_i = 0, dest_i = 0; src_i < polymer_length; ++src_i)
    {
        if (original_polymer[src_i] == uppercase_skip || original_polymer[src_i] == lowercase_skip)
            continue;

        src[dest_i++] = original_polymer[src_i];
    }
    src_len = dest_i;

    //
    // copy chars from src to dest, removing reactive pairs
    //
    for (src_i = 0, dest_i = 0; src_i < src_len; ++src_i)
    {
        if (!(src_i == src_len - 1) && is_matched_pair(src[src_i], src[src_i + 1])) {
            ++src_i;
            continue;
        } else if (is_matched_pair(src[src_i], dest[dest_i - 1])) {
            --dest_i;
            continue;
        }

        dest[dest_i++] = src[src_i];
    }

    reduced_polymer_length = dest_i;
    input->reduced_length = reduced_polymer_length;

    return NULL;
}
