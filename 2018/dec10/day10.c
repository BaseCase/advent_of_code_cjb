#include <stdio.h>
#include <stdlib.h>
#include <curses.h>
#include <unistd.h>


typedef struct Point {
    long x;
    long y;
    int velocity_x;
    int velocity_y;
} Point;


enum ParserState {
    getting_position,
    getting_velocity,
};


int main(int argc, char** argv)
{
    Point points[400];
    int points_len;

    //
    // parse input file into Points array
    //
    {
        char c;
        char buffer[10];
        int buffer_i = 0;
        int points_i = 0;
        long parsed_value;
        enum ParserState state = getting_position;

        FILE* input_file = fopen("input.txt", "r");

        while ((c = fgetc(input_file)) != EOF)
        {
            switch (c)
            {
                case '0': case '1': case '2': case '3': case '4':
                case '5': case '6': case '7': case '8': case '9': {
                    // getting a number
                    buffer[buffer_i++] = c;
                } break;

                case '-': {
                    // a negative sign for a number
                    buffer[buffer_i++] = c;
                } break;

                case ',': {
                    // end of x or velocity_x
                    buffer[buffer_i] = 0;
                    parsed_value = atol(buffer);
                    buffer_i = 0;

                    if (state == getting_position)
                        points[points_i].x = parsed_value;
                    else
                        points[points_i].velocity_x = (int)parsed_value;
                } break;

                case '>': {
                    // end of y or velocity_y
                    buffer[buffer_i] = 0;
                    parsed_value = atol(buffer);
                    buffer_i = 0;

                    if (state == getting_position) {
                        points[points_i].y = parsed_value;
                        state = getting_velocity;
                    } else {
                        points[points_i].velocity_y = (int)parsed_value;
                        state = getting_position;
                        ++points_i;
                    }
                } break;

                default: {
                    // junk
                }
            }
        }
        fclose(input_file);
        points_len = points_i;
    }

    //
    // step forward in time. at some point, the points should converge close enough
    // that I can show them all in a single window. at that time, stop and allow me
    // to manually step forward while rendering them to the screen.
    //
    {
        int window_width, window_height, screen_midpoint_x, screen_midpoint_y;
        long leftmost, rightmost, topmost, bottommost,
             real_midpoint_x, real_midpoint_y,
             x, y, dist_x, dist_y;
        unsigned long long step = 1;
        int autopilot = 1;

        // curses!
        initscr();
        refresh();
        nodelay(stdscr, FALSE);
        noecho();

        getmaxyx(stdscr, window_height, window_width);
        screen_midpoint_x = window_width / 2;
        screen_midpoint_y = window_height / 2;

        while (1)
        {
            if (!autopilot)
                getch(); // wait for any keystroke to advance world

            clear();

            move(2, 2);
            printw("Step: %llu", step);

            leftmost = topmost = 1000;
            rightmost = bottommost = -1000;

            for (int i = 0; i < points_len; ++i)
            {
                if (points[i].x < leftmost)
                    leftmost = points[i].x;
                if (points[i].x > rightmost)
                    rightmost = points[i].x;
                if (points[i].y < topmost)
                    topmost = points[i].y;
                if (points[i].y > bottommost)
                    bottommost = points[i].y;

                points[i].x += points[i].velocity_x;
                points[i].y += points[i].velocity_y;
            }

            real_midpoint_x = (leftmost + rightmost) / 2L;
            real_midpoint_y = (topmost + bottommost) / 2L;

            for (int i = 0; i < points_len; ++i)
            {
                dist_x = labs(real_midpoint_x - points[i].x);
                if (points[i].x < real_midpoint_x)
                    x = -dist_x;
                else
                    x = +dist_x;

                dist_y = labs(real_midpoint_y - points[i].y);
                if (points[i].y < real_midpoint_y)
                    y = -dist_y;
                else
                    y = +dist_y;

                mvaddch(y + screen_midpoint_y, x + screen_midpoint_x, '#');

                // stop fast-forward if we're on the screen
                if (autopilot &&
                    (x + screen_midpoint_x) > 0 && (x + screen_midpoint_x) < window_width
                    && (y + screen_midpoint_y) > 0  &&   (y + screen_midpoint_y) < window_height)
                {
                    autopilot = 0;
                }
            }

            refresh();
            ++step;
        }

        endwin();
    }
}
