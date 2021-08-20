
/**
 * A Checker board is an 8x8 grid of alternating dark and light squares.  The
 * origin of the board (0,0) is the lower left corner and must be dark.
 *
 * Thus, any square (m,n) in which m + n is even will be a dark square.  And,
 * subsequently, any square (m,n) in which m + n is odd will be a light square.
 *
 * It's also true that if m xor n is true, then the square is dark.
 */
import { inRange, arrayEquals } from '../utils'
import { MAX_ROW_COL } from '../constants'
import Point from './Point'
import Square from './Square'
import Player from './Player'
import Move from './Move'

const whiteRows = [0, 1, 2]
const blackRows = [5, 6, 7]


/**
 * The Board class manages the squares, and checkers in squares
 * You can create 3 types of board.
 *  * Default setup with white checkers on rows 0-3 and back ckechers on rows 5-7
 *  * Empty board, to make testing easier
 *  * A clone of another board
 */
export default class Board {
    /** @type {Square[]} */
    squares = []
    kings = [0, 0, 0]
    remaining = [0, 12, 12]

    /**
     * Test to see if the point is on the board
     * @param {Point} point
     * @returns
     */
    static isvalidSquare(point) {
        return inRange(point.x, -1, MAX_ROW_COL) && inRange(point.y, -1, MAX_ROW_COL)
    }

    /**
     * Test to see if the point is on rows 0 or 7
     * @param {Point} point
     * @returns
     */
    static isKingRow = (point) => point.y === 0 || point.y === 7


    static minimax(board, depth, side, maximizingPlayer, alpha, beta) {
        if (depth === 0) {
            return board.calculate(side);
        }
        const possibleMoves = board.getAllValidMoves(side);

        let initial = 0.0;
        let tempBoard = null;
        if (maximizingPlayer) {
            initial = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < possibleMoves.length; i++) {
                tempBoard = board.clone();
                tempBoard.makeMove(possibleMoves.get(i), side);

                const result = Board.minimax(tempBoard, depth - 1, Player.opposingPlayer(side), !maximizingPlayer, alpha, beta);

                initial = Math.max(result, initial);
                alpha = Math.max(alpha, initial);

                if (alpha >= beta)
                    break;
            }
        }
        //minimizing
        else {
            initial = Number.POSITIVE_INFINITY;
            for (let i = 0; i < possibleMoves.length; i++) {
                tempBoard = board.clone();
                tempBoard.makeMove(possibleMoves.get(i), side);

                const result = Board.minimax(tempBoard, depth - 1, Player.OpposingPlayer(side), !maximizingPlayer, alpha, beta);

                initial = Math.min(result, initial);
                alpha = Math.min(alpha, initial);

                if (alpha >= beta)
                    break;
            }
        }

        return initial;
    }

    constructor(board) {
        if (board instanceof Board) {
            this.copyFrom(board)
        }
        else if (Array.isArray(board) && board.length === 0) {
            this.emptyBoard()
        }
        // If no template is provided, create a standard setup
        else {
            this.resetBoard()
        }
    }

    /**
     * Creates an empty board that can then have checkers individually added via
     * Board.setSquare().  This is only used for testing
     *
     * @returns {Board} this instance
     */
    emptyBoard() {
        /** @type {Square[]} */
        this.squares = []
        this.kings = [0, 0, 0]
        this.remaining = [0, 0, 0]

        for (let row = 0; row < MAX_ROW_COL; row++) {
            this.squares.push([])
            for (let col = 0; col < MAX_ROW_COL; col++) {
                const point = new Point(col, row)
                if (!Square.isDark(point)) {
                    this.squares[row][col] = Square.makeNonPlayable(point)
                }
                else {
                    this.squares[row][col] = Square.makeEmpty(point)
                }
            }
        }
        return this
    }

    /**
     * Sets the board up in the default configuration: 12 checkers per side, with
     * Player.WHITE checkers in rows 0-2 and Player.BLACK checkers in rows 5-7
     *
     * @returns {Board} returns this instance
     */
    resetBoard() {
        /** @type {Square[]} */
        this.squares = []
        this.kings = [0, 0, 0]
        this.remaining = [0, 12, 12]

        for (let row = 0; row < MAX_ROW_COL; row++) {
            this.squares.push([])
            for (let col = 0; col < MAX_ROW_COL; col++) {
                const point = new Point(col, row)
                if (!Square.isDark(point)) {
                    this.squares[row][col] = Square.makeNonPlayable(point)
                }
                else if (blackRows.includes(row)) {
                    this.squares[row][col] = Square.makeBlack(point)
                }
                else if (whiteRows.includes(row)) {
                    this.squares[row][col] = Square.makeWhite(point)
                }
                else {
                    this.squares[row][col] = Square.makeEmpty(point)
                }
            }
        }
        return this
    }

    /**
     *  Update this board from another board
     * @param {Board} board Either an instance of Board, or an array of square objects
     * @returns {Board} this instance
     */
    copyFrom(board) {
        if (!(board instanceof Board)) {
            throw new Error('Board.cloneFrom needs a Board ')
        }

        this.kings = board.kings.slice()
        this.remaining = board.remaining.slice()
        this.squares = board.squares.map(row => (row.map(square => square.clone())))
        return this
    }

    /**
     * Clone a new board from this board
     *
     * @returns {Board} the new board
     */
    clone() {
        const board = new Board()
        board.copyFrom(this)
        return board
    }
    /**
     * Calculates the current value of the board for the player based on the number
     * of pieces and kings vs the opponent's number of pieces and kings
     *
     * @param {number} side Either Player.WHITE or Player.BLACK
     * @returns nummber
     */
    calculate(side) {
        if (side === Player.WHITE) {
            return this.calculateSide(Player.WHITE) - this.calculateSide(Player.BLACK)
        }
        if (side === Player.BLACK) {
            return this.calculateSide(Player.BLACK) - this.calculateSide(Player.WHITE)
        }
        // Just in case
        console.log('Board.calculate - bad value for side:', side)
        return 0
    }

    /**
     * Only called by Board.calculate
     *
     * @param {number} side The side to calculate (either Payer.WHITE or Player.BLACk)
     * @returns {number} The calculated vaue
     */
    calculateSide(side) {
        return this.kings[side] * 1.2 + this.remaining[side]
    }

    /**
     * @typedef GameResult
     * @type {object}
     * @property {number[]} moves The count of available moves per player
     * @property {string} outcome The current state
     *
     */

    /**
     * Determine the game state.  Is it at a win, loss, draw yet? This should be
     * called after every move, to determine potential end state
     *
     * @returns {GameResult}
     */
    evaluate() {
        const result = {
            moves: [undefined, 0, 0],
            outcome: 'continue'
        }
        // See if the game is already over

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const point = new Point(col, row)
                const square = this.getSquare(point)
                if (square.side === Player.EMPTY) {
                    continue
                }
                const opens = this.getOpenSquares(square)
                if (opens.length > 0) {
                    result.moves[square.side] += opens.length
                }
                const jumps = this.getJumpSquares(square, point)
                if (jumps.length > 0) {
                    result.moves[square.side] += jumps.length
                }
            }
        }
        if (result.moves[Player.WHITE] === 0) {
            if (result.moves[Player.WHITE] !== 0) {
                result.outcome = 'White is out of moves. Black wins!'
            }
            else {
                result.outcome = "No more moves!"
            }
        }
        if (result.moves[Player.BLACK] === 0) {
            if (result.moves[Player.BLACK] !== 0) {
                result.outcome = 'Black is out of moves. White wins!'
            }
            else {
                result.outcome = "No more moves!"
            }
        }
        return result
    }


    /**
     * Return true if the square contains a checker for the current player
     *
     * @param {Player} player - Player to test the square against
     * @param {Point} point - the location of the square to test
     * @returns {boolean} true if the square matches the player side
    **/
    isPlayerChecker(player, point) {
        return player.side === this.getSquare(point).side
    }


    /**
     * Is the checker at the point an opponent's piece?
     *
     * @param {Player} player The asking player
     * @param {Point} point  The point to evaluate
     * @returns {boolean} True if is opposing. Else false
     */
    isOpponentChecker(player, point) {
        const square = this.getSquare(point)
        if (player.side === Player.WHITE && square.side === Player.BLACK) {
            return true
        }
        if (player.side === Player.BLACK && square.side === Player.WHITE) {
            return true
        }
        return false
    }

    /**
     * Do the two points represent a valid potential move for the player?
     * For expediency, we will assume that the starting square has ben verified
     *
     * @param {Player} player
     * @param {Point} startPoint
     * @param {Point} endPoint
     * @returns {boolean}
     */
    isValidMove(player, move) {
        const moves = this.getOpenMoves(move.start)
        //const ms = moves.filter(move => move.contains(endPoint))
        const ms = moves.filter(m => m.equals(move))
        return ms.length > 0
    }

    /**
 * Get all the open moves for this player
 *
 * @param {Player} player
 * @return {Move[]}
 */
    getAllPlayerMoves(player) {
        let moves = []
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const point = new Point(col, row)
                if (!Square.isDark(point)) {
                    continue
                }
                const square = this.getSquare(point)
                if (square.side !== player.side) {
                    continue
                }
                // This square has a checker for this player.  Get the moves
                moves = [...moves, ...this.getOpenMoves(point, 0)]
            }
        }
        return moves
    }


    /**
     * returns a set of valid potential moves for the piece at the given point.
     *
     * @param {Point} startPoint
     * @returns {Move[]}
     */
    getOpenMoves(startPoint, maxDepth = 10) {
        const startSquare = this.getSquare(startPoint)
        // Get the adjascent squares, and look for open ones
        const moves = []
        const adjacents = this.getOpenSquares(startSquare)
        adjacents.forEach(point => {
            moves.push(new Move(startPoint, point));
        })

        return [...moves, ...this.getJumpMoves([], startSquare, startPoint, maxDepth)]

    }

    /**
     * Find the open squares avalable for the piece at this point.  Calls
     * adjacentSquares, and filters for those that represent appropriate moves
     * (only kings can go backward) to empty squares
     *
     * @param {Square} square
     * @returns {Point[]} Valid adjacent points
     */
    getOpenSquares(square) {
        const points = []

        if (square.side === Player.EMPTY) {
            return points
        }

        const possible_points = square.getAdjacent()
        return possible_points.filter(point => {
            // filter for directionality
            if (square.isDirectional(point) &&
                this.getSquare(point).side === Player.EMPTY) {
                return true
            }
            return false
        })
    }

    /**
     *  Find avalable jump moves.  If the starting checker (square) is a king, then
     * be sure that the resulting set of potential moves doesn't include something
     * already in the moves path
     *
     * @param {*} moves
     * @param {*} startSquare
     * @param {*} startPoint
     * @param {*} depth
     * @returns
     */
    getJumpMoves(moves, startSquare, startPoint, maxDepth=10, depth = 0) {

        if (Board.isvalidSquare(startPoint) === false) {
            return moves
        }

        const jumpSquares = this.getJumpSquares(startSquare, startPoint)
        jumpSquares.forEach(point => {
            const m = new Move(startPoint, point)
            if (moves.some(move => move.equals(m) || move.isReverse(m))) {
                // Looks like we doubled back.  Bail
                return
            }
            moves.push(m)

            if (depth < maxDepth) {
                // recursively
                const nextMoves = this.getJumpMoves(moves, startSquare, point, maxDepth, depth + 1).filter(move => (
                    !moves.some(mm => mm.equals(move))
                ))
                moves = [...moves.slice(), ...nextMoves]
            }
        })
        return moves
    }

    /**
     *
     * @param {Square} square the starting square
     * @param {Point} point
     * @returns Point[] Set of potential jumpts from the point
     */
    getJumpSquares(square, point) {
        const points = [] // Possible points

        if (square.side === Player.WHITE || square.isKing) {
            points.push(new Point(point.x + 2, point.y + 2))
            points.push(new Point(point.x - 2, point.y + 2))
        }
        if (square.side === Player.BLACK || square.isKing) {
            points.push(new Point(point.x + 2, point.y - 2))
            points.push(new Point(point.x - 2, point.y - 2))
        }
        return points.filter(p => (
            Board.isvalidSquare(p) &&
            this.getSquare(p).side === Player.EMPTY &&
            this.isOpponentChecker(square, new Move(point, p).findMiddle())
        ))
    }

    /**
     * Move's a piece on the board.  If the move is a jump, then the jumped piece
     * is also removed.
     *
     * @param {Move} move  The move to make
     */
    makeMove(move) {
        const middle = move.findMiddle()
        // If there's a middle square, then this is a jump move.  Remove the piece
        if (middle !== null) {
            this.removeSquare(middle)
        }
        this.moveSquare(move.start, move.end)
    }


    /***
     * Get the square by row, col.  The row and col must be valid.
     *
     * @param {Point} point
     * @returns {Square} square at the provided point
     */
    getSquare(point) {
        Point.isPoint(point)
        return this.squares[point.y][point.x]
    }

    setSquare(square) {

        this.squares[square.point.y][square.point.x] = square
        this.remaining[square.side] += 1
        if (square.isKing) {
            this.kings[square.side] += 1
        }

    }
    /**
     * Move the square at startPoint to endPoint.  This will also obviously make
     * the endpoint enpty
     *
     * @param {Point} startPoint - Where moving from
     * @param {Point} endPoint - Where moving to
     */
    moveSquare(startPoint, endPoint) {
        const startSquare = this.getSquare(startPoint)

        // Grab some info about whether or not this piece is becoming a king
        const becomingKing = !startSquare.isKing && Board.isKingRow(endPoint)
        const isKing = becomingKing ? true : startSquare.isKing

        this.squares[endPoint.y][endPoint.x] = startSquare.move(endPoint, isKing)
        this.squares[startPoint.y][startPoint.x] = Square.makeEmpty(startPoint)

        if (becomingKing) {
            this.kings[startSquare.side] += 1
        }
    }

    removeSquare(point) {
        Point.isPoint(point)
        const square = this.getSquare(point)
        this.remaining[square.side] -= 1
        if (square.isKing) {
            this.kings[square.side] -= 1
        }
        this.squares[point.y][point.x] = Square.makeEmpty(point)
        return true
    }

    display() {
        const printSeparatorRow = () => '  |-----|-----|-----|-----|-----|-----|-----|-----|\n'
        const printColNums = () => '     0     1     2     3     4     5     6     7\n' + printSeparatorRow()
        const printRow = (idx, row) => (`${idx} |` + row.map((col, idx) => `  ${col.toString()}  |`).join('')) + '\n' + printSeparatorRow()

        return printColNums() + this.squares.map((row, idx) => printRow(idx, row)).join('')
    }

    toString() {
        return JSON.stringify(this.squares, null, 2)
    }

    equals(board) {
        if (board instanceof Board) {
            if (!arrayEquals(this.remaining, board.remaining)) {
                console.log('Board.equals: different remaining:', this.remaining, board.remaining)
                return false
            }
            if (!arrayEquals(this.kings, board.kings)) {
                console.log('Board.equals: different kings:', this.kings, board.kings)
                return false
            }
            const ret = this.squares.every((row, rIdx) => (
                row.every((square, cIdx) => {
                    if (!square.equals(board.getSquare(new Point(cIdx, rIdx)))) {
                        console.log('Board.equals: different squares', square, board.getSquare(new Point(cIdx, rIdx)))
                        return false
                    }
                    return true
                })
            ))
            return ret
        }
        else {
            console.log('Not a board')
            return false
        }
    }
}