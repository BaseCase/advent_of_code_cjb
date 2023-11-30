#include <stdio.h>
#include <assert.h>


#define BOARD_WIDTH 150
#define BOARD_HEIGHT 150


typedef enum TileType {
    empty,
    elbow_ul,
    elbow_ur,
    elbow_ll,
    elbow_lr,
    horizontal,
    vertical,
    intersection,
} TileType;


typedef enum Direction {
    up,
    right,
    down,
    left,
} Direction;
#define NUM_DIRECTIONS 4


typedef enum TurnDirection {
    left_turn,
    straight,
    right_turn,
} TurnDirection;


typedef struct Cart {
    int x;
    int y;
    Direction dir;
    TurnDirection last_turn;
    int destroyed;  // 1 if this cart has been in a crash
} Cart;


int coords_to_index(int x, int y);
void debug_print(TileType *board, Cart *carts, int cart_count);


int main(int argc, char** argv)
{
    TileType board[BOARD_WIDTH * BOARD_HEIGHT];
    Cart carts[2000] = {0};
    int cart_count = 0;

    //
    // parse track layout and minecart start position/direction from input
    //
    {
        char c;
        int x, y, board_index;

        x = y = 0;
        while ((c = getc(stdin)) != EOF)
        {
            board_index = coords_to_index(x, y);

            switch (c)
            {
                case '\n': {
                    while (x < BOARD_WIDTH) {
                        board[coords_to_index(x++, y)] = empty;
                    }
                    x = -1;
                    ++y;
                } break;

                // track segments
                case '/': {
                    // This is either a lower right elbow or an upper left one.
                    // I *think* that we just have to check one tile above this one to determine that.
                    if (y == 0) {
                        board[board_index] = elbow_ul;
                    } else if (board[coords_to_index(x, y-1)] == vertical
                               || board[coords_to_index(x, y-1)] == intersection) {
                        board[board_index] = elbow_lr;
                    } else {
                        board[board_index] = elbow_ul;
                    }
                } break;

                case '\\': {
                    // either an upper right elbow or a lower left.

                    if (y == 0) {
                        board[board_index] = elbow_ur;
                    } else if (board[coords_to_index(x, y-1)] == vertical
                               || board[coords_to_index(x, y-1)] == intersection) {
                        board[board_index] = elbow_ll;
                    } else {
                        board[board_index] = elbow_ur;
                    }
                } break;

                case '-': {
                    // horizontal track tile
                    board[board_index] = horizontal;
                } break;

                case '|': {
                    // vertical track tile
                    board[board_index] = vertical;
                } break;

                case '+': {
                    // track intersection
                    board[board_index] = intersection;
                } break;

                // minecart start positions
                case 'v': {
                    board[board_index] = vertical;
                    carts[cart_count].x = x;
                    carts[cart_count].y = y;
                    carts[cart_count].dir = down;
                    carts[cart_count].last_turn = right_turn;
                    ++cart_count;
                } break;

                case '^': {
                    board[board_index] = vertical;
                    carts[cart_count].x = x;
                    carts[cart_count].y = y;
                    carts[cart_count].dir = up;
                    carts[cart_count].last_turn = right_turn;
                    ++cart_count;
                } break;

                case '>': {
                    board[board_index] = horizontal;
                    carts[cart_count].x = x;
                    carts[cart_count].y = y;
                    carts[cart_count].dir = right;
                    carts[cart_count].last_turn = right_turn;
                    ++cart_count;
                } break;

                case '<': {
                    board[board_index] = horizontal;
                    carts[cart_count].x = x;
                    carts[cart_count].y = y;
                    carts[cart_count].dir = left;
                    carts[cart_count].last_turn = right_turn;
                    ++cart_count;
                } break;

                default: {
                    // I think only spaces should happen here?
                    board[board_index] = empty;
                }
            }

            ++x;
        }
    }

    //
    // Run simulation until there's a cart collision
    //
    {
        int cur, new, collision, remaining_cart_count;
        int move_order[2000];

        collision = 0;
        remaining_cart_count = cart_count;
        for (int turn = 1; turn <= 40000; ++turn)
        {
            // determine move order of the carts by sorting them by y, x.
            // bubble sort is totally fine here because there are only 17!
            // don't even worry about it.
            Cart tmp;
            for (int i = 0; i < cart_count; ++i) {
                for (int j = i + 1; j < cart_count; ++j) {
                    if ((carts[j].y < carts[i].y)
                        || ((carts[j].y == carts[i].y) && (carts[j].x < carts[i].x))) {
                        tmp = carts[j];
                        carts[j] = carts[i];
                        carts[i] = tmp;
                    }
                }
            }

            // in correct move order, move each cart in its current direction,
            // then check for collisions. Again, we can just check against all
            // other carts each turn because there are only 17.
            for (int i = 0; i < cart_count; ++i)
            {
                if (carts[i].destroyed)  // don't process carts that collided already this turn
                    continue;

                // move this cart
                switch (carts[i].dir)
                {
                    case up: {
                        carts[i].y -= 1;
                    } break;

                    case down: {
                        carts[i].y += 1;
                    } break;

                    case left: {
                        carts[i].x -= 1;
                    } break;

                    case right: {
                        carts[i].x += 1;
                    } break;
                }

                // turn this cart according to what tile it's on
                switch (board[coords_to_index(carts[i].x, carts[i].y)])
                {
                    case empty: {
                        printf("Somehow cart %d wound up at (%d, %d)!!\n", i, carts[i].x, carts[i].y);
                        debug_print(board, carts, cart_count);
                        assert(0); // a cart should not wind up here!
                    } break;

                    case elbow_ul: {
                        if (carts[i].dir == left)
                            carts[i].dir = down;
                        else
                            carts[i].dir = right;
                    } break;

                    case elbow_ur: {
                        if (carts[i].dir == right)
                            carts[i].dir = down;
                        else
                            carts[i].dir = left;
                    } break;

                    case elbow_ll: {
                        if (carts[i].dir == left)
                            carts[i].dir = up;
                        else
                            carts[i].dir = right;
                    } break;

                    case elbow_lr: {
                        if (carts[i].dir == right)
                            carts[i].dir = up;
                        else
                            carts[i].dir = left;
                    } break;

                    case horizontal: {
                    } break;

                    case vertical: {
                    } break;

                    case intersection: {
                        switch (carts[i].last_turn)
                        {
                            case left_turn: {
                                // after a left turn, go straight
                                carts[i].last_turn = straight;
                            } break;

                            case straight: {
                                // after going straight, turn right
                                cur = carts[i].dir;
                                new = (cur + 1) % NUM_DIRECTIONS;
                                carts[i].dir = new;
                                carts[i].last_turn = right_turn;
                            } break;

                            case right_turn: {
                                // after a right turn, turn left
                                cur = carts[i].dir;
                                new = (cur - 1) % NUM_DIRECTIONS;
                                if (new < 0)
                                    new = NUM_DIRECTIONS + new;
                                carts[i].dir = new;
                                carts[i].last_turn = left_turn;
                            } break;
                        }
                    } break;
                }

                // check collisions between this cart and all others
                int x = carts[i].x;
                int y = carts[i].y;

                for (int j = 0; j < cart_count; ++j)
                {
                    if (i == j || carts[j].destroyed)
                        continue;

                    if (carts[j].x == x && carts[j].y == y)
                    {
                        printf("COLLISION on turn %d at (%d, %d)!\n", turn, x, y);
                        collision = 1;

                        carts[i].destroyed = 1;
                        carts[j].destroyed = 1;

                        remaining_cart_count -= 2;
                    }
                }
            }

            if (remaining_cart_count == 1)
            {
                Cart last_cart;
                for (int z = 0; z < cart_count; ++z)
                {
                    if (!carts[z].destroyed) {
                        last_cart = carts[z];
                        break;
                    }
                }
                printf("Last cart standing! Turn %d, coords (%d,%d)\n", turn, last_cart.x, last_cart.y);
                break;
            }
        }
    }
}


int coords_to_index(int x, int y)
{
    return (y * BOARD_WIDTH) + x;
}


void debug_print(TileType *board, Cart *carts, int cart_count)
{
    //
    // debug print
    //
    {
        Cart *cart_here;

        for (int y = 0; y < BOARD_HEIGHT; ++y) {
            for (int x = 0; x < BOARD_WIDTH; ++x)
            {
                cart_here = NULL;
                for (int i = 0; i < cart_count; ++i)
                {
                    if (carts[i].x == x && carts[i].y == y) {
                        cart_here = &carts[i];
                        break;
                    }
                }

                if (cart_here != NULL) {
                    switch (cart_here->dir)
                    {
                        case up:
                            printf("^");
                            break;
                        case down:
                            printf("v");
                            break;
                        case left:
                            printf("<");
                            break;
                        case right:
                            printf(">");
                            break;
                    }
                    continue;
                }

                switch (board[coords_to_index(x, y)])
                {
                    case empty:
                        printf(" ");
                        break;
                    case elbow_ul:
                        printf("/");
                        break;
                    case elbow_ur:
                        printf("\\");
                        break;
                    case elbow_ll:
                        printf("\\");
                        break;
                    case elbow_lr:
                        printf("/");
                        break;
                    case horizontal:
                        printf("-");
                        break;
                    case vertical:
                        printf("|");
                        break;
                    case intersection:
                        printf("+");
                        break;
                }
            }
            printf("\n");
        }
    }
}
