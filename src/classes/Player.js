import { randomInt } from '../utils'

export const SIDE_NAME = [
    "Empty",
    "Black",
    "White"
]

export default class Player {
    static EMPTY = 0
    static BLACK = 1
    static WHITE = 2

    /**
     * Used during minimax calculations, if an initial move  results in a possible
     * jump.
     */
    skippingPoint = null

    /**
     * Returns the opposite of the given side, or Player.EMPTY
     *
     * @param {number} side - either Player.WHITE or Player.BLACK
     * @returns {number} the opposite of the provided side
     */
    static OpposingPlayer(side) {
        return side === Player.EMPTY ? 0 : 3 - side
    }

    static isPlayer(player) {
        if ((player instanceof Player) && (player.side === Player.WHITE || player.side === Player.BLACK)) {
            return true
        }
        return false
    }

    static makeWhite() {
        return new Player(Player.WHITE)
    }

    static makeBlack() {
        return new Player(Player.BLACK)
    }

    /**
     * Construct a new player.  You can either provide an existing Player instance to clone from, or
     * provide a "side" with either Player.BLACK or Player.WHITE.
     *
     * @param {Player | number} player Either a valid player instance or one of Player.BLACK or Player.WHITE
     * @param {string} name Optional name.  If not provided, the name will match the player param
     */
    constructor(player, name) {
        // If no params parovided
        if (player === undefined) {
            throw new Error('player is undefined')
        }

        // If cloning from another Player instance
        if (player instanceof Player) {
            this.side = player.side
            this.name = player.name
        }

        // Creating from parameters
        else if (player === Player.BLACK || player === Player.WHITE) {
            this.side = player
            if (name === undefined) {
                this.name = SIDE_NAME[this.side]
            } else {
                this.name = name
            }
        }
        else {
            throw new Error('player must be either Player.WHITE or Player.BLACK')
        }
    }

    equals(player) {
        if (!(player instanceof Player)) {
            return false
        }
        return this.side === player.side && this.name === player.name
    }

    toString() {
        return `name: ${this.name}, side: ${SIDE_NAME[this.side]}`
    }

    opposing() {
        return 3 - this.side
    }


    /**
     *
     * @param {Board} board
     * @param {*} maximizingPlayer
     * @param {number} maxDepth
     * @returns {Move} Resulting move from the minimax algorithm
     */
    makeAIMove(board)
    {
        const alpha = Number.NEGATIVE_INFINITY
        const beta = Number.POSITIVE_INFINITY
        const maximizingPlayer = true

        let possibleMoves = []
        if(this.skippingPoint == null) {
            possibleMoves = board.getAllPlayerMoves(this);
        }
        else
        {
            possibleMoves = board.getJumpMoves([], board.getSquare(this.skippingPoint), this.skippingPoint)
            this.skippingPoint = null;
        }

        // Each possible move will result in a heuristic
        let calculatedMoves = []

        if(possibleMoves.length === 0)
            return null;
        let tempBoard = null;
        let maxHeuristic = Number.NEGATIVE_INFINITY
        for(const move of possibleMoves)
        {
            tempBoard = board.clone();
            tempBoard.makeMove(move);
            const heuristic = this.minimax(tempBoard, this.opposing(), !maximizingPlayer, alpha, beta)
            calculatedMoves.push({move, heuristic})
            if(heuristic >= maxHeuristic) {
                maxHeuristic = heuristic
            }
        }

        // Now that all possible moves have been calculated, find (set of) best move(s)
        calculatedMoves = calculatedMoves.filter((val, i) => val.heuristic >= maxHeuristic)
        console.log('calculatedMoves:', calculatedMoves)
        // If there is more than 1 possible move, randomly select one
        const move = calculatedMoves.length === 1 ? calculatedMoves[0] : calculatedMoves[randomInt(calculatedMoves.length)];

        board.makeMove(move.move)
    }


    /**
     *  Recursive minimax algorithm
     *
     * @param {Bozrd} board
     * @param {number} side Either Player.WHItE or Player.BLACK
     * @param {boolean} maximizingPlayer
     * @param {number} alpha
     * @param {number} beta
     * @param {number} [depth=0]
     * @param {number} [maxDepth=10]
     * @returns
     */
    minimax(board, side, maximizingPlayer, alpha, beta, depth = 0, maxDepth = 10) {
        if (depth === maxDepth) {
            return board.calculate(side);
        }
        const possibleMoves = board.getAllPlayerMoves(side);

        let initial = 0.0;
        let tempBoard = null;
        if (maximizingPlayer) {
            initial = Number.NEGATIVE_INFINITY;
            for (const move in possibleMoves) {
                tempBoard = board.clone();
                tempBoard.makeMove(move);
                const result = this.minimax(tempBoard, this.opposing(), !maximizingPlayer, alpha, beta, depth + 1, maxDepth);
                initial = Math.max(result, initial);
                alpha = Math.max(alpha, initial);

                if (alpha >= beta)
                    break;
            }
        }
        //minimizing
        else {
            initial = Number.POSITIVE_INFINITY;
            for (const move in possibleMoves) {
                tempBoard = board.clone();
                tempBoard.makeMove(move);

                const result = this.minimax(tempBoard, Player.opposing(), !maximizingPlayer, alpha, beta, depth + 1, maxDepth);

                initial = Math.min(result, initial);
                alpha = Math.min(alpha, initial);

                if (alpha >= beta)
                    break;
            }
        }

        return initial;
    }

}