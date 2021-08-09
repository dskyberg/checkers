
/**
 * A Checker board is an 8x8 grid of alternating dark and light squares.  The
 * origin of the board (0,0) is the lower left corner and must be dark.
 *
 * Thus, any square (m,n) in which m + n is even will be a dark square.  And,
 * subsequently, any square (m,n) in which m + n is odd will be a light square.
 *
 * It's also true that if m xor n is true, then the square is dark.
 */
import { isEven } from '../utils/isEven'
import { inRange, arrayEquals } from '../utils'
import { MAX_ROW_COL } from '../constants'
import Point from './Point'
import Cell from './Cell'
import Player from './Player'
import Move from './Move'

const whiteRows = [0, 1, 2]
const blackRows = [5, 6, 7]

// Checkers is played on the diagonal black squares. Sin
const isValidCell = (point) => inRange(point.x, -1, MAX_ROW_COL) && inRange(point.y, -1, MAX_ROW_COL)

const isDarkCell = (point) => !isEven(point.x + point.y) //xor(isEven(point.y), isEven(point.x))

export const adjacentCells = (point) => {
    if (!isDarkCell(point)) {
        throw new Error('Not a valid cell')
    }
    return [
        new Point(point.x - 1, point.y - 1),
        new Point(point.x + 1, point.y - 1),
        new Point(point.x - 1, point.y + 1),
        new Point(point.x + 1, point.y + 1)
    ].filter(point => isValidCell(point))
}


/**
 * Test to see if the direction of the target cell is legit for the starting
 * cell.  Meaning, Player.WHITE cells go toward the top and Player.BLACK cells
 * go toward the bottom of the board.  Kings go either way
 */
const isDirectionalCell = (cell, startPoint, point) => {
    if (cell.isKing === false) {
        // WHITE can only go up
        if (cell.side === Player.WHITE && point.y < startPoint.y) {
            return false
        }
        // BLACK can only go down
        if (cell.side === Player.BLACK && point.y > startPoint.y) {
            return false
        }
    }
    return true

}


/**
 * The Board class manages the cells, and checkers in cells
 * You can create 3 types of board.
 *  * Default setup with white checkers on rows 0-3 and back ckechers on rows 5-7
 *  * Empty board, to make testing easier
 *  * A clone of another board
 */
export default class Board {
    cells = []
    kings = [0, 0, 0]
    remaining = [0, 12, 12]

    static inRange(point) {
        return inRange(point.x, -1, MAX_ROW_COL) && inRange(point.y, -1, MAX_ROW_COL)
    }

    constructor(board) {
        // If no template is provided, create a standard setup
        if (board === undefined) {
            this.resetBoard()
        } else {
            if (board.length === 0) {
                // passing an empty array results in an empty board.
                // Each cells is populated correctly, with no checkers
                this.emptyBoard()
            } else {
                this.cloneFrom(board)
            }
        }

    }

    emptyBoard(startingPlayer = Player.WHITE) {
        this.cells = []
        this.kings = [0, 0, 0]
        this.remaining = [0, 0, 0]

        for (let row = 0; row < MAX_ROW_COL; row++) {
            this.cells.push([])
            for (let col = 0; col < MAX_ROW_COL; col++) {
                if (!isDarkCell(new Point(col, row))) {
                    this.cells[row].push(Cell.makeNonPlayable())
                }
                else {
                    this.cells[row].push(Cell.makeEmpty())
                }
            }
        }

    }

    resetBoard(startingPlayer = Player.WHITE) {
        this.cells = []
        this.kings = [0, 0, 0]
        this.remaining = [0, 12, 12]

        for (let row = 0; row < MAX_ROW_COL; row++) {
            this.cells.push([])
            for (let col = 0; col < MAX_ROW_COL; col++) {
                if (!isDarkCell(new Point(col, row))) {
                    this.cells[row].push(Cell.makeNonPlayable())
                }
                else if (blackRows.includes(row)) {
                    this.cells[row].push(Cell.makeBlack())
                }
                else if (whiteRows.includes(row)) {
                    this.cells[row].push(Cell.makeWhite())
                }
                else {
                    this.cells[row].push(Cell.makeEmpty())
                }
            }
        }
    }

    /**
 *  Creates a new Board instance from this
 * @param {Board, Array} board Either an instance of Board, or an array of cell objects
 */
    cloneFrom(board) {
        this.kings = board.kings.slice()
        this.remaining = board.remaining.slice()
        if (board instanceof Board) {
            this.cells = board.cells.map(cell => ({ ...cell }))
        }
        else if (Array.isArray(board)) {
            this.cells = board.map(cell => ({ ...cell }))
        }
        else {
            throw new Error('Board.cloneFrom needs a Board or array of cells')
        }
    }

    /**
     * Return true if the cell contains a checker for the current player
    **/
    isPlayerChecker(player, point) {
        return player.side === this.getCell(point).side
    }

    isOpponentChecker(player, point) {
        const cell = this.getCell(point)
        if(player.side === Player.WHITE && cell.side === Player.BLACK ) {
            return true
        } else if(player.side === Player.Black && cell.side === Player.WHITE) {
            return true
        }
        return false
    }

    /**
     * For expediency, we will assume that the starting cell has ben verified
     */
    isValidMove(player, startPoint, endPoint) {
        const moves = this.getOpenMoves(player, startPoint)
        const ms  = moves.filter(move => move.contains(endPoint))
        return ms.length > 0
    }


    getOpenMoves(player, startPoint) {
        const startCell = this.getCell(startPoint)
        // Get the adjascent cells, and look for open ones
        const availableCells = adjacentCells(startPoint)
        const moves = []
        availableCells.forEach(point => {
            // filter for directionality
            if (!isDirectionalCell(startCell, startPoint, point)) {
                return
            }

            // Filter for open squares
            let cell = this.getCell(point)
            if (cell.side === Player.EMPTY) {
                moves.push(new Move(startPoint, point));
                return
            }
            if (cell.side === startCell.side) {
                return
            }
        })

        return [...moves, ...this.getJumpMoves([], startCell, startPoint)]

    }

    /**
     *  Find avalable jump moves.  If the starting checker (cell) is a king, then
     * be sure that the resulting set of potential moves doesn't include something
     * already in the moves path
     *
     * @param {*} moves
     * @param {*} startCell
     * @param {*} startPoint
     * @param {*} depth
     * @returns
     */
    getJumpMoves(moves, startCell, startPoint, depth = 0) {

        if(Board.inRange(startPoint) === false) {
            return moves
        }

        const jumpCells =  this.getJumpCells(startCell, startPoint)
        jumpCells.forEach(point => {
            const m = new Move(startPoint, point)
            if(moves.some(move => move.equals(m) || move.isReverse(m))) {
                // Looks like we doubled back.  Bail
                return moves
            }
            moves.push(m)

            if( depth < 5 ) {
                // recursively
                const nextMoves = this.getJumpMoves(moves, startCell, point, depth + 1).filter(move => (
                    !moves.some(mm => mm.equals(move))
                ))
                moves = [...moves.slice(), ...nextMoves]
            }
        })
        return moves
    }

    getJumpCells(cell, point) {
        const points = [] // Possible points

        if (cell.side === Player.WHITE || cell.isKing) {
            points.push(new Point(point.x + 2, point.y + 2))
            points.push(new Point(point.x - 2, point.y + 2))
        }
        if (cell.side === Player.BLACK || cell.isKing) {
            points.push(new Point(point.x + 2, point.y - 2))
            points.push(new Point(point.x - 2, point.y - 2))
        }
        return points.filter(p => (
            Board.inRange(p) &&
            this.getCell(p).side === Player.EMPTY &&
            this.isOpponentChecker(cell, new Move(point, p).findMiddle())
        ))
    }

    makeMove(move) {
        const middle = move.findMiddle()
        // If there's a middle cell, then this is a jump move.  Remove the piece
        if(middle !== null) {
            this.removeCell(middle)
        }
        this.moveCell(move.start, move.end)
    }


    /***
     * get the cell by row, col
     * @param {Point} point
     * @returns {Cell} cell at point p
     */
    getCell(point) {
        Point.isPoint(point)
        return this.cells[point.y][point.x]
    }

    setCell(point, side, isKing = false) {
        Point.isPoint(point)
        const cell = this.getCell(point)
        cell.side = side
        cell.isKing = isKing
        this.remaining[side] += 1
        if(isKing){
            this.kings[side] += 1
        }
    }

    moveCell(startPoint, endPoint) {
        this.cells[endPoint.y][endPoint.x] = this.getCell(startPoint).clone()
        this.cells[startPoint.y][startPoint.x] = Cell.makeEmpty()
        const cell = this.getCell(endPoint)
        if((endPoint.y === 0 || endPoint.y === MAX_ROW_COL-1) && !cell.isKing) {
            cell.isKing = true
            this.kings[cell.side] += 1

        }
    }

    removeCell(point) {
        Point.isPoint(point)
        const cell = this.getCell(point)
        this.remaining[cell.side] -= 1
        if(cell.isKing) {
            this.kings[cell.side] -= 1
        }
        this.cells[point.y][point.x] = Cell.makeEmpty()
        return true
    }

    display() {
        const printSeparatorRow = () => '  |-----|-----|-----|-----|-----|-----|-----|-----|\n'
        const printColNums = () => '     0     1     2     3     4     5     6     7\n' + printSeparatorRow()
        const printRow = (idx, row) => (`${idx} |` + row.map((col, idx) => `  ${col.toString()}  |`).join('')) + '\n' + printSeparatorRow()

        return printColNums() + this.cells.map((row, idx) => printRow(idx, row)).join('')
    }

    toString() {
        return JSON.stringify(this.cells,null, 2)
    }

    equals(board) {
        if(board instanceof Board) {
            if(!arrayEquals(this.remaining, board.remaining)) {
                console.log('Board.equals: different remaining:', this.remaining, board.remaining)
                return false
            }
            if(!arrayEquals(this.kings, board.kings)) {
                console.log('Board.equals: different kings:', this.kings, board.kings)
                return false
            }
            const ret = this.cells.every( (row, rIdx) => (
                row.every((cell, cIdx) => {
                    if(!cell.equals(board.getCell(new Point(cIdx, rIdx)))) {
                        console.log('Board.equals: different cells', cell, board.getCell(new Point(cIdx, rIdx)))
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