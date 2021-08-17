
/**
 * A Checker board is an 8x8 grid of alternating dark and light squares.  The
 * origin of the board (0,0) is the lower left corner and must be dark.
 *
 * Thus, any square (m,n) in which m + n is even will be a dark square.  And,
 * subsequently, any square (m,n) in which m + n is odd will be a light square.
 *
 * It's also true that if m xor n is true, then the square is dark.
 */
import { inRange, arrayEquals, isEven } from '../utils'
import { MAX_ROW_COL } from '../constants'
import Point from './Point'
import Square from './Square'
import Player from './Player'
import Move from './Move'

const whiteRows = [0, 1, 2]
const blackRows = [5, 6, 7]

// Checkers is played on the diagonal black squares. Sin
const isValidSquare = (point) => inRange(point.x, -1, MAX_ROW_COL) && inRange(point.y, -1, MAX_ROW_COL)

const isDarkSquare = (point) => !isEven(point.x + point.y) //xor(isEven(point.y), isEven(point.x))

export const adjacentSquares = (point) => {
    if (!isDarkSquare(point)) {
        throw new Error('Not a valid square')
    }
    return [
        new Point(point.x - 1, point.y - 1),
        new Point(point.x + 1, point.y - 1),
        new Point(point.x - 1, point.y + 1),
        new Point(point.x + 1, point.y + 1)
    ].filter(point => isValidSquare(point))
}


/**
 * Test to see if the direction of the target square is legit for the starting
 * square.  Meaning, Player.WHITE squares go toward the top and Player.BLACK squares
 * go toward the bottom of the board.  Kings go either way
 */
const isDirectionalSquare = (square, startPoint, point) => {
    if (square.isKing === false) {
        // WHITE can only go up
        if (square.side === Player.WHITE && point.y < startPoint.y) {
            return false
        }
        // BLACK can only go down
        if (square.side === Player.BLACK && point.y > startPoint.y) {
            return false
        }
    }
    return true

}


/**
 * The Board class manages the squares, and checkers in squares
 * You can create 3 types of board.
 *  * Default setup with white checkers on rows 0-3 and back ckechers on rows 5-7
 *  * Empty board, to make testing easier
 *  * A clone of another board
 */
export default class Board {
    squares = []
    kings = [0, 0, 0]
    remaining = [0, 12, 12]

    static inRange(point) {
        return inRange(point.x, -1, MAX_ROW_COL) && inRange(point.y, -1, MAX_ROW_COL)
    }

    static minimax(board, depth, side, maximizingPlayer, alpha, beta) {
        if(depth == 0) {
            return board.calculate(side);
        }
        const possibleMoves = board.getAllValidMoves(side);

        let initial = 0.0;
        let tempBoard = null;
        if(maximizingPlayer)
        {
            initial = Number.NEGATIVE_INFINITY;
            for(let i = 0; i < possibleMoves.length; i++)
            {
                tempBoard = board.clone();
                tempBoard.makeMove(possibleMoves.get(i), side);

                const result = Board.minimax(tempBoard, depth - 1, Player.OpposingPlayer(side), !maximizingPlayer, alpha, beta);

                initial = Math.max(result, initial);
                alpha = Math.max(alpha, initial);

                if(alpha >= beta)
                    break;
            }
        }
        //minimizing
        else
        {
            initial = Number.POSITIVE_INFINITY;
            for(let i = 0; i < possibleMoves.size(); i++)
            {
                tempBoard = board.clone();
                tempBoard.makeMove(possibleMoves.get(i), side);

                const result = Board.minimax(tempBoard, depth - 1, Player.OpposingPlayer(side), !maximizingPlayer, alpha, beta);

                initial = Math.min(result, initial);
                alpha = Math.min(alpha, initial);

                if(alpha >= beta)
                    break;
            }
        }

        return initial;
    }

    constructor(board) {
        if(board instanceof Board) {
                this.copyFrom(board)
        }
        else if(Array.isArray(board) && board.length === 0) {
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
        this.squares = []
        this.kings = [0, 0, 0]
        this.remaining = [0, 0, 0]

        for (let row = 0; row < MAX_ROW_COL; row++) {
            this.squares.push([])
            for (let col = 0; col < MAX_ROW_COL; col++) {
                if (!isDarkSquare(new Point(col, row))) {
                    this.squares[row].push(Square.makeNonPlayable())
                }
                else {
                    this.squares[row].push(Square.makeEmpty())
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
        this.squares = []
        this.kings = [0, 0, 0]
        this.remaining = [0, 12, 12]

        for (let row = 0; row < MAX_ROW_COL; row++) {
            this.squares.push([])
            for (let col = 0; col < MAX_ROW_COL; col++) {
                if (!isDarkSquare(new Point(col, row))) {
                    this.squares[row].push(Square.makeNonPlayable())
                }
                else if (blackRows.includes(row)) {
                    this.squares[row].push(Square.makeBlack())
                }
                else if (whiteRows.includes(row)) {
                    this.squares[row].push(Square.makeWhite())
                }
                else {
                    this.squares[row].push(Square.makeEmpty())
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
        this.squares = board.squares.map(row => row.slice())
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
     * @param {number} side The side to calculate (either Payer.WHITE or Player.BLACk)
     * @returns {number} The calculated vaue
     */
    calculateSide(side) {
        return this.kings[side] * 1.2 + this.remaining[side]
    }

    /**
     * Return true if the square contains a checker for the current player
     * @param {Player} player - Player to test the square against
     * @param {Point} point - the location of the square to test
     * @returns {boolean} true if the square matches the player side
    **/
    isPlayerChecker(player, point) {
        return player.side === this.getSquare(point).side
    }


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
     * For expediency, we will assume that the starting square has ben verified
     */
    isValidMove(player, startPoint, endPoint) {
        const moves = this.getOpenMoves(player, startPoint)
        const ms = moves.filter(move => move.contains(endPoint))
        return ms.length > 0
    }


    getOpenMoves(player, startPoint) {
        const startSquare = this.getSquare(startPoint)
        // Get the adjascent squares, and look for open ones
        const availableSquares = adjacentSquares(startPoint)
        const moves = []
        availableSquares.forEach(point => {
            // filter for directionality
            if (!isDirectionalSquare(startSquare, startPoint, point)) {
                return
            }

            // Filter for open squares
            let square = this.getSquare(point)
            if (square.side === Player.EMPTY) {
                moves.push(new Move(startPoint, point));
                return
            }
            if (square.side === startSquare.side) {
                return
            }
        })

        return [...moves, ...this.getJumpMoves([], startSquare, startPoint)]

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
    getJumpMoves(moves, startSquare, startPoint, depth = 0) {

        if (Board.inRange(startPoint) === false) {
            return moves
        }

        const jumpSquares = this.getJumpSquares(startSquare, startPoint)
        jumpSquares.forEach(point => {
            const m = new Move(startPoint, point)
            if (moves.some(move => move.equals(m) || move.isReverse(m))) {
                // Looks like we doubled back.  Bail
                return moves
            }
            moves.push(m)

            if (depth < 5) {
                // recursively
                const nextMoves = this.getJumpMoves(moves, startSquare, point, depth + 1).filter(move => (
                    !moves.some(mm => mm.equals(move))
                ))
                moves = [...moves.slice(), ...nextMoves]
            }
        })
        return moves
    }

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
            Board.inRange(p) &&
            this.getSquare(p).side === Player.EMPTY &&
            this.isOpponentChecker(square, new Move(point, p).findMiddle())
        ))
    }

    makeMove(move) {
        const middle = move.findMiddle()
        // If there's a middle square, then this is a jump move.  Remove the piece
        if (middle !== null) {
            this.removeSquare(middle)
        }
        this.moveSquare(move.start, move.end)
    }


    /***
     * get the square by row, col
     * @param {Point} point
     * @returns {Square} square at point p
     */
    getSquare(point) {
        Point.isPoint(point)
        return this.squares[point.y][point.x]
    }

    setSquare(point, side, isKing = false) {
        Point.isPoint(point)
        const square = this.getSquare(point)
        square.side = side
        square.isKing = isKing
        this.remaining[side] += 1
        if (isKing) {
            this.kings[side] += 1
        }
    }

    moveSquare(startPoint, endPoint) {
        this.squares[endPoint.y][endPoint.x] = this.getSquare(startPoint).clone()
        this.squares[startPoint.y][startPoint.x] = Square.makeEmpty()
        const square = this.getSquare(endPoint)
        if ((endPoint.y === 0 || endPoint.y === MAX_ROW_COL - 1) && !square.isKing) {
            square.isKing = true
            this.kings[square.side] += 1

        }
    }

    removeSquare(point) {
        Point.isPoint(point)
        const square = this.getSquare(point)
        this.remaining[square.side] -= 1
        if (square.isKing) {
            this.kings[square.side] -= 1
        }
        this.squares[point.y][point.x] = Square.makeEmpty()
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