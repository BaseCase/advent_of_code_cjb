#include <stdio.h>


typedef struct Step {
    char id;             // letter ID for this step
    int fulfilled;       // 0 if it hasn't happened yet, 1 if it has
    int being_worked_on; // 1 if a Worker is processing this. 0 otherwise.
    int prereqs[26];     // for each letter of the alphabet, 1 if it's a prereq, 0 if not
} Step;

typedef struct Worker {
    char current_task;   // letter ID of Step this Worker is working on. 0 or negative if currently idle.
    int work_remaining;  // number of seconds left on current task.
} Worker;


#define WORKER_COUNT 5
#define STEP_DURATION_BASELINE 60


int main(int argc, char** argv)
{
    Step steps[26] = {0};

    for (int i = 0; i < 26; ++i)
        steps[i].id = i + 'A';

    //
    // Parse input into a set of prerequisites
    //
    {
        char c, prereq, dependent;
        int finding_dependent = 0;
        int mid_line = 0;

        while ((c = getc(stdin)) != EOF)
        {
            switch(c)
            {
                case 'S': {
                    // beginning of a line
                    if (!mid_line) {
                        mid_line = 1;
                        continue;
                    }
                } // intentional fall-through

                case 'A': case 'B': case 'C': case 'D': case 'E': case 'F':
                case 'G': case 'H': case 'I': case 'J': case 'K': case 'L':
                case 'M': case 'N': case 'O': case 'P': case 'Q': case 'R':
                case 'T': case 'U': case 'V': case 'W': case 'X': case 'Y': case 'Z': {
                    // A Step ID, either as a prereq or the dependent Step
                    if (!finding_dependent) {
                        prereq = c;
                        finding_dependent = 1;
                    } else {
                        dependent = c;
                        steps[dependent - 'A'].prereqs[prereq - 'A'] = 1;

                        finding_dependent = 0;
                        mid_line = 0;
                    }
                } break;

                default: {
                    // other garbage
                }
            }
        }
    }

    //
    // Find the correct order of steps, such that all prerequisites are met.
    //
    {
        char steps_order[26];
        char candidates[26];
        char actual_next_step;
        int candidates_i, next_step, is_candidate, total_seconds_elapsed, available_workers;
        Worker workers[5] = {0};

        next_step = total_seconds_elapsed = 0;

        while (next_step < 26)
        {
            // workers work on stuff for 1 tick
            available_workers = 0;
            for (int i = 0; i < WORKER_COUNT; ++i) {
                --workers[i].work_remaining;

                if (workers[i].work_remaining <= 0)
                {
                    ++available_workers;

                    if (workers[i].current_task) {
                        // finished a task!
                        char finished_step = workers[i].current_task;
                        steps_order[next_step++] = finished_step;
                        steps[finished_step - 'A'].fulfilled = 1;
                        workers[i].current_task = 0;
                    }
                }
            }
            if (next_step < 26)
                ++total_seconds_elapsed;

            // If there are idle workers, then we can:
            // look for candidates, defined as Steps which are not yet fulfilled
            // and which have all prereqs fulfilled, and assign them to idle workers.
            if (!available_workers)
                continue;

            candidates_i = 0;
            for (int i = 0; i < 26; ++i)
            {
                if (steps[i].fulfilled || steps[i].being_worked_on)
                    continue;

                is_candidate = 1;

                for (int j = 0; j < 26; ++j)
                {
                    char potential_prereq = steps[i].prereqs[j];
                    if (potential_prereq) {
                        if (!steps[j].fulfilled) {
                            is_candidate = 0;
                            break;
                        }
                    }
                }
                if (!is_candidate)
                    continue;

                candidates[candidates_i++] = steps[i].id;
            }

            candidates[candidates_i] = 0;

            // Assign available tasks to idle workers
            for (int i = 0; i < candidates_i; ++i)
            {
                if (!available_workers) {
                    break;
                }

                actual_next_step = 'Z' + 1;
                for (int j = 0; j < candidates_i; ++j)
                {
                    if (candidates[j] < actual_next_step && !steps[candidates[j] - 'A'].being_worked_on) {
                        actual_next_step = candidates[j];
                    }
                }

                for (int j = 0; j < WORKER_COUNT; ++j)
                {
                    if (workers[j].work_remaining <= 0 && !workers[j].current_task) {
                        workers[j].current_task = actual_next_step;
                        workers[j].work_remaining = (actual_next_step - 'A' + 1 + STEP_DURATION_BASELINE);
                        steps[actual_next_step - 'A'].being_worked_on = 1;
                        --available_workers;
                        break;
                    }
                }
            }
        }

        steps_order[next_step] = 0;
        printf("Correct order of steps: %s\n", steps_order);
        printf("Total seconds elapsed: %d\n", total_seconds_elapsed);
    }
}
