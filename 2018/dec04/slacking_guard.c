#include <stdio.h>
#include <stdlib.h>

// Unix command to find the number of guards:
//     `cat input.txt | grep Guard | cut -d '#' -f 2 | cut -d ' ' -f 1 | sort -n | uniq | wc -l`
#define GUARD_COUNT 23


typedef struct Guard {
    int id;
    int asleep_at_minute[60];
} Guard;


typedef enum parser_states {
    getting_guard_id,
    looking_for_sleep_time,
    looking_for_wake_time,
} parser_states;


Guard* get_or_create_guard(int guard_id);
void update_sleep_per_minutes(Guard* guard, int sleep_start, int sleep_end);


#define grab_parsed_int do { \
    buffer[buffer_i] = 0; \
    parsed_value = atoi(buffer); \
    buffer_i = 0; \
} while(0)


Guard guards[GUARD_COUNT];


// To run: cc slacking_guard.c && cat input.txt | sort -n | ./a.out
int main(int argc, char** argv)
{
    char c;
    char buffer[20];
    int buffer_i, parsed_value, sleep_start, sleep_end;
    parser_states parser_state;
    Guard *current_guard;


    //
    // Parse the (pre-sorted) input, counting each minute each guard sleeps during
    //
    buffer_i = 0;
    while((c = getc(stdin)) != EOF)
    {
        switch(c)
        {
            case '#': {
                // Start of Guard ID (and therefore new guard)
                parser_state = getting_guard_id;
            } break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9': {
                // digit
                buffer[buffer_i++] = c;
            } break;

            case '-':
            case ':': {
                // End of a number we don't actually care about saving.
                buffer_i = 0;
            } break;

            case ']': {
                // End of the minutes part of a timestamp, which we *usually* want.
                grab_parsed_int;

                if (parser_state == looking_for_sleep_time) {
                    sleep_start = parsed_value;
                    parser_state = looking_for_wake_time;
                } else if (parser_state == looking_for_wake_time) {
                    sleep_end = parsed_value;
                    parser_state = looking_for_sleep_time;

                    update_sleep_per_minutes(current_guard, sleep_start, sleep_end);
                }
            } break;

            case ' ': {
                // multi-purpose separator

                if (parser_state == getting_guard_id) {
                    grab_parsed_int;
                    current_guard = get_or_create_guard(parsed_value);
                    parser_state = looking_for_sleep_time;
                }
            } break;
        }
    }


    //
    // Find guard with most total minutes asleep
    //
    Guard sleepiest;
    {
        int max, i, sleep_sum;

        max = 0;
        for (i = 0; i < GUARD_COUNT; ++i)
        {
            sleep_sum = 0;
            for (int j = 0; j < 60; ++j)
                sleep_sum += guards[i].asleep_at_minute[j];

            if (sleep_sum > max) {
                max = sleep_sum;
                sleepiest = guards[i];
            }
        }
    }

    //
    // Find the sleepiest guard's sleepiest minute.
    //
    int sleepiest_minute;
    {
        int i, max;
        for (i = 0; i < 60; ++i)
            if (sleepiest.asleep_at_minute[i] > max) {
                sleepiest_minute = i;
                max = sleepiest.asleep_at_minute[i];
            }
    }
    printf("%d's sleepiest minute was %d, so our answer is %d.\n",
            sleepiest.id,
            sleepiest_minute,
            sleepiest.id * sleepiest_minute);


    //
    // Find the ID of the guard with the single sleepiest minute.
    //
    int global_sleepiest_minute_freq, global_sleepiest_minute, winner_id;
    global_sleepiest_minute_freq = global_sleepiest_minute = 0;
    {
        for (int i = 0; i < GUARD_COUNT; ++i)
            for (int j = 0; j < 60; ++j)
            {
                if (guards[i].asleep_at_minute[j] > global_sleepiest_minute_freq) {
                    global_sleepiest_minute_freq = guards[i].asleep_at_minute[j];
                    global_sleepiest_minute = j;
                    winner_id = guards[i].id;
                }
            }
    }
    printf("The guard with the single sleepiest minute (of freq %d) was %d, which means our answer is %d.\n",
            global_sleepiest_minute_freq,
            global_sleepiest_minute,
            (winner_id * global_sleepiest_minute));

    /***
    {
        //
        // Debug print parsed guards
        //
        for (int i = 0; i < GUARD_COUNT; ++i)
        {
            Guard g = guards[i];
            printf("Guard ID: %d\n", g.id);
            for (int j = 0; j < 60; ++j)
                printf("%02d  ", g.asleep_at_minute[j]);
            printf("\n\n");
        }
    }
    ***/
}


Guard* get_or_create_guard(int guard_id)
{
    static int next_guard = 0;
    Guard* guard;

    // look for existing guard first
    for (int i = 0; i < next_guard; ++i)
    {
        if (guards[i].id == guard_id)
            return &guards[i];
    }

    // didn't find one, so make a new guard
    guard = &guards[next_guard++];
    guard->id = guard_id;
    return guard;
}


void update_sleep_per_minutes(Guard* guard, int sleep_start, int sleep_end)
{
    for (int min = sleep_start; min < sleep_end; ++min) {
        guard->asleep_at_minute[min]++;
    }
}
