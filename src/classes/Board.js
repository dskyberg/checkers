
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
import { inRange } from '../utils/inRange'
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

export const jumpCell = (startPoint, jumpPoint) => {
    const x = jumpPoint.x < startPoint.x ? jumpPoint.x - 1 : jumpPoint.x + 1
    const y = jumpPoint.y < startPoint.y ? jumpPoint.y - 1 : jumpPoint.y + 1
    return new Point(x, y)
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
                this.clone(board)
            }
        }

    }

    emptyBoard(startingPlayer = Player.WHITE) {
        this.cells = []
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
        return cell.side === Player.EMPTY ? false : cell.side !== player.side
    }

    /**
     * For expediency, we will assume that the starting cell has ben verified
     */
    isValidMove(player, startPoint, endPoint) {
        // Is the player in startCell the right player?
        //if (!this.isPlayerChecker(player, startPoint)) {
        //    return false
        //}

        // Get adjoining cells for startCell
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

        return [...moves, ...this.getJumpMoves(startCell, startPoint)]

    }

    getJumpMoves(startCell, startPoint) {
        let moves = []

        const possibilities = [] // Possible points

        if (startCell.side === Player.WHITE || startCell.isKing) {
            possibilities.push(new Point(startPoint.x + 2, startPoint.y + 2))
            possibilities.push(new Point(startPoint.x - 2, startPoint.y + 2))
        }
        if (startCell.side === Player.BLACK || startCell.isKing) {
            possibilities.push(new Point(startPoint.x + 2, startPoint.y - 2))
            possibilities.push(new Point(startPoint.x - 2, startPoint.y - 2))
        }

        possibilities.forEach(point => {
            const m = new Move(startPoint, point)
            if (Board.inRange(point) && this.getCell(point).side === Player.EMPTY) {
                const midPoint = m.findMiddle()
                if(this.isOpponentChecker(startCell, midPoint) === true) {
                    moves.push(m)
                    moves = [...moves, ...this.getJumpMoves(startCell, point)]
                }
            }
        })
        return moves
    }


    makeMove(move) {
        console.log('Board.move:', move)
        const startCell = this.getCell(move.start)
        const middle = move.findMiddle()
        // If there's a middle cell, then this is a jump move.  Remove the piece
        if(middle !== null) {
            this.removeCell(middle)
        }
        this.setCell(move.end, startCell.side, startCell.isKing)
        this.removeCell(move.start)
    }


    /***
     * get the cell by row, col
     */
    getCell(point) {
        Point.testPoint(point)
        return this.cells[point.y][point.x]
    }

    setCell(point, side, isKing = false) {
        Point.testPoint(point)
        const cell = this.getCell(point)
        cell.side = side
        cell.isKing = isKing
    }


    removeCell(point) {
        Point.testPoint(point)
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
        if(board instanceof Board){
            for(let rIdx = 0; rIdx < 8; rIdx++) {
                for(let cIdx = 0; cIdx < 8; cIdx++) {
                    const p = new Point(cIdx, rIdx)
                    if(!this.getCell(p).equals(board.getCell(p))) {
                        return false
                    }
                }
            }
            return true
        }
        return false
    }
}