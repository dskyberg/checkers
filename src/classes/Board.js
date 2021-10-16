
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

/**
 * @module Board
 */
/**
 * @typedef GameResult
 * @type {object}
 * @property {number[]} moves The count of available moves per player
 * @property {string} outcome The current state
 *
 */

/*
* @typedef MoveHistory
* @type object
* @property {number} side
* @property {Move} move
* @property {boolean} becomingKing
* @property {Square} removed
*
*/


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

    static isValidPoint(point) {
        if(point instanceof Point) {
            return Point.testPoint(point)
        }
        return point >= 0 && point <= 7
    }

    /**
     * Test to see if the point is on rows or cols 0 or 7.  This can also be
     * used to test if a proposed point is greater than
     * @param {Point|number} point If a Point instance, point.y is tested. Else the point is tested.
     * @returns
     */
    static isEdgeRow = (point) => {
        const y = point instanceof Point ? point.y : point
        return y <= 0 || y >= 7
    }

    static isEdgeCol = (point) => {
        const x = point instanceof Point ? point.x : point
        return x <= 0 || x >= 7
    }

    static isEdge = (point) => Board.isEdgeRow(point) || Board.isEdgeCol(point)

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
     * Many thanks to https://github.com/dimitrijekaranfilovic/checkers for the
     * algorithm
     *
     * @param {number} side Either Player.WHITE or Player.BLACK
     * @returns nummber result
     */
    calculate(side) {

        let result = 0
        let mine = 0
        let opp = 0

        for (const row of this.squares) {
            for (const square of row) {
                if (square.side === side) {
                    mine += 1
                    result += 5

                    if (square.isKing) {
                        result += 5
                    }

                    // Is this checker on an end row?
                    if ([0, 7].includes(square.point.x) || [0, 7].includes(square.point.y)) {
                        result += 7
                    }

                    // If the checker can be jumped, subtract 3
                    result += this.calculateJumpableScore(square)

                    if (square.point.y + 2 > 7 || square.point.y - 2 < 0) {
                        continue
                    }

                    // If the square can jump, add 6
                    result += this.calculateJumpScore(square)
                }
                else if (square.side === Player.opposingPlayer(side)) {
                    opp += 1
                }
            }
        }
        return result + (mine - opp) * 1000
    }

    /**
     *  Calculate the potential for the checker in this square to jump an
     * opponent's piece. Add 6 for every potential jump
     *
     * @param {Square} square The square to evaluate
     * @returns {number} resulting score
     */
    calculateJumpScore(square) {
        let result = 0

        // Test if relative NorthEast is jumpable
        const nep = square.getNE(2)
        if(Square.isValid(nep)) {
            const ne = this.getSquare(nep)
            const nem = this.getSquare(square.getNE())
            if(ne.side === Player.EMPTY && nem.side === Player.opposingPlayer(square.side)) {
                result += 6
            }
        }
        // Test if relative NorthWest is jumpable
        const nwp = square.getNW(2)
        if(Square.isValid(nwp)){
            const nw = this.getSquare(nep)
            const nwm = this.getSquare(square.getNW())
            if(nw.side === Player.EMPTY && nwm.side === Player.opposingPlayer(square.side)) {
                result += 6
            }
        }

        if(square.isKing) {
            // Test if relative SouthEast is jumpable
            const sep = square.getSE(2)
            if(Square.isValid(sep)) {
                const se = this.getSquare(sep)
                const sem = this.getSquare(square.getSE())
                if(se.side === Player.EMPTY && sem.side === Player.opposingPlayer(square.side)) {
                    result += 6
                }
            }
            // Test if relative SouthWest is jumpable
            const swp = square.getSW(2)
            if(Square.isValid(swp)){
                const sw = this.getSquare(nep)
                const swm = this.getSquare(square.getSW())
                if(sw.side === Player.EMPTY && swm.side === Player.opposingPlayer(square.side)) {
                    result += 6
                }
            }
        }

        return result
    }

    /**
     * Calculate the potential scores if this square can be jumped by an
     * opponent checker. Each possible jump counts -3
     *
     * @param {Square} square Square to evaluate
     * @returns {number} resulting score
     */
    calculateJumpableScore(square) {
        if (Board.isEdge(square.point)) {
            // A cell on an edge can't be jumped
            return 0
        }

        let result = 0
        const ne = this.getSquare(square.getNE())
        const nw = this.getSquare(square.getNW())
        const se = this.getSquare(square.getSE())
        const sw = this.getSquare(square.getSW())

        const opp = Player.opposingPlayer(square.side)
        if (ne.side === opp && sw.side === Player.EMPTY) {
            result -= 3
        }
        if (nw.side === opp && se.side === Player.EMPTY) {
            result -= 3
        }
        if (se.side === opp && se.isKing && nw.side === Player.EMPTY) {
            result -= 3
        }
        if (sw.side === opp && sw.isKing && ne.side === Player.EMPTY) {
            result -= 3
        }

        return result
    }

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
    isOpponentChecker(startingSquare, point) {
        const square = this.getSquare(point)
        if (Player.opposingPlayer(startingSquare.side) === square.side) {
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
        const ms = moves.filter(m => move.contains(m.end))
        //const ms = moves.filter(m => move.equals(m))
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
        const side = player instanceof Player ? player.side : player
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const point = new Point(col, row)
                if (!Square.isDark(point)) {
                    continue
                }
                const square = this.getSquare(point)
                if (square.side !== side) {
                    continue
                }
                const openMoves = this.getOpenMoves(point, 10)
                // This square has a checker for this player.  Get the moves
                moves = [...moves, ...openMoves]
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
    getJumpMoves(moves, startSquare, startPoint, maxDepth = 10, depth = 0) {

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
     * Get all of the potential jumps from the provided point. A valid jump square is
     * defined as being an empty square that is +/- 2 rows and +/- 2 cols from
     * the point, and containing an opposing checker in the middle.
     *
     * @param {Square} square the starting square
     * @param {Point} point
     * @returns Point[] t
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
     * @returns {MoveHistory}
     */
    makeMove(move) {
        const history = {
            side: this.getSquare(move.start).side,
            move,
            becomingKing: false,
            removed: null,
        }
        const middle = move.findMiddle()
        // If there's a middle square, then this is a jump move.  Remove the piece
        if (middle !== null) {
            history.removed = this.getSquare(middle)
            this.removeSquare(middle)
        }
        history.becomingKing = this.moveSquare(move.start, move.end)
        return history
    }

    undoMove(history) {
        const move = history.move
        // Put the check back
        console.log('putting the piece back')
        this.moveSquare(move.end, move.start)
        if (history.removed !== null) {
            this.setSquare(history.removed)
        }
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
        const becomingKing = !startSquare.isKing && Board.isEdgeRow(endPoint)
        const isKing = becomingKing ? true : startSquare.isKing

        this.squares[endPoint.y][endPoint.x] = startSquare.move(endPoint, isKing)
        this.squares[startPoint.y][startPoint.x] = Square.makeEmpty(startPoint)

        if (becomingKing) {
            this.kings[startSquare.side] += 1
        }
        return becomingKing
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
        const printRow = (idx, row) => (`${idx} |` + row.map(col => `  ${col.toString()}  |`).join('')) + '\n' + printSeparatorRow()

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