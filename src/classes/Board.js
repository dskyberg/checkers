
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
import Player from './Player'

const whiteRows = [0, 1, 2]
const blackRows = [5, 6, 7]

// Checkers is played on the diagonal black squares. Sin
const isValidCell = (point) => inRange(point.x, -1, MAX_ROW_COL) && inRange(point.y, -1, MAX_ROW_COL)

const isDarkCell = (point) =>  !isEven(point.x + point.y) //xor(isEven(point.y), isEven(point.x))

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
const isDirectionalCell = (checker, startPoint, point) => {
    if (checker.isKing === false) {
    // WHITE can only go up
        if (checker.player === Player.WHITE && point.y < startPoint.y) {
            return false
        }
        // BLACK can only go down
        if (checker.player === Player.BLACK && point.y > startPoint.y) {
            return false
        }
    }
    return true

}

/**
 * Every cell needs a proper object to describe it, even if i's not playable.
 * Note, and empty cell is not the same as a non playable cell.  A cell is one of
 *  *  nonplayable
 *  *  empty
 *  *  white ( or white king)
 *  *  black ( or black king)
 *
**/
const makeCell = (playable = false, player = Player.EMPTY, isKing = false) => ({ playable: playable, player: player, isKing: isKing })
const makeEmptyCell = () => makeCell(true, Player.EMPTY, false)
const makeWhiteCell = (isKing = false) => makeCell(true, Player.WHITE, isKing )
const makeBlackCell = (isKing = false) => makeCell(true, Player.BLACK, isKing)

/**
 * The Board class manages the cells, and checkers in cells
 * You can create 3 types of board.
 *  * Default setup with white checkers on rows 0-3 and back ckechers on rows 5-7
 *  * Empty board, to make testing easier
 *  * A clone of another board
 */
export default class Board {
    cells = []

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
        this.currentPlayer = startingPlayer
        for (let row = 0; row < MAX_ROW_COL; row++) {
            this.cells.push([])
            for (let col = 0; col < MAX_ROW_COL; col++) {
                if (!isDarkCell(new Point(col, row))) {
                    this.cells[row].push(makeCell())
                }
                else {
                    this.cells[row].push(makeEmptyCell())
                }
            }
        }

    }

    resetBoard(startingPlayer = Player.WHITE) {
        this.cells = []
        this.currentPlayer = startingPlayer
        for (let row = 0; row < MAX_ROW_COL; row++) {
            this.cells.push([])
            for (let col = 0; col < MAX_ROW_COL; col++) {
                if (!isDarkCell(new Point(col, row))) {
                    this.cells[row].push(makeCell())
                }
                else if (blackRows.includes(row)) {
                    this.cells[row].push(makeBlackCell())
                }
                else if (whiteRows.includes(row)) {
                    this.cells[row].push(makeWhiteCell())
                }
                else {
                    this.cells[row].push(makeEmptyCell())
                }
            }
        }
        console.log('Board:', this.cells)
    }

    /**
     * Return true if the cell contains a checker for the current player
    **/
    isPlayerChecker(point) {
        return this.currentPlayer === this.getCell(point).player
    }

    /**
     * For expediency, we will assume that the starting cell has ben verified
     */
    isValidMove(startPoint, endPoint) {
       // const startCell = this.getCell(startPoint)
       // const endCell = this.getCell(endPoint)

        // Is the player in startCell the right player?
        if (!this.isPlayerChecker(startPoint)) {
            throw new Error('isValidMove: bad starting cell')
        }

        // Get adjoining cells for startCell
        const isIn = endPoint.in(adjacentCells(startPoint))
        return isIn
    }

    getJumpPath(startPoint, endPoint){
        const path = []
        const jump = jumpCell(startPoint, endPoint)
        if (this.getCell(jump).player === Player.EMPTY) {
            // This jump works
            path.push(jump)

            // See if we can continue
            const attempts = adjacentCells(endPoint).filter(point => {
                // Can't go back to stating point
                if(point.equals(startPoint)) {
                    return false
                }
                // Only kings can go backward
                if(!isDirectionalCell(this.getCell(endPoint), endPoint, point)) {
                    return false
                }

                if(this.getCell(point).player !== Player.opposing(this.getCell(startPoint).player)) {
                    return false
                }
                return true
            })
            // attempts now has places to continue jumping to

            return path
        }

    }

    getOpenMoves(startPoint) {
        const checker = this.getCell(startPoint)
        // Get the adjascent cells, and look for open ones
        const availableCells = adjacentCells(startPoint)
        const openCells = []
        availableCells.forEach(point => {
            // filter for directionality
            if(!isDirectionalCell(checker, startPoint, point)) {
                return
            }

            // Filter for open squares
            let cell = this.getCell(point)
            if(cell.player === Player.EMPTY) {
                openCells.push(point);
                return
            }
            if (cell.player === checker.player) {
                return
            }
            // Check for jumps
            const jump = jumpCell(startPoint, point)
            if (this.getCell(jump).player === Player.EMPTY) {
                openCells.push(jump)
            }
        })

        // Open cells now contains all the adjacent cells that don't already
        // have a checker in them.

        // Filter for jumpable
        /*
        if (cell.player !== checker.player) {
            // Might be jumpable
            const jc = jumpCell(startPoint, point)
            if (jc.player === Player.EMPTY) {
                // This is a jumpable cell!
            }
        }
        */

        return openCells
    }

    move(startPoint, endPoint) {
        console.log('Board.move:', startPoint, endPoint)
    }

    isCell(point) {
        // Return by index
        if (point.x === undefined || point.y === undefined) {
            throw new Error(`Bad cell point`)
        }

        if (point.y < 0 || point.y >= 64) {
            throw new Error(`Cell row is out of bounds: ${point.y}`)
        }

        if (point.x < 0 || point.x >= MAX_ROW_COL) {
            throw new Error(`Cell col is out of bounds: ${point.x}`)
        }
        return true
    }

    /***
     * get the cell by row, col
     */
    getCell(point) {
        this.isCell(point)
        return this.cells[point.y][point.x]
    }

    setCell(point, player, isKing=false) {
        this.isCell(point)
        const cell = this.getCell(point)
        cell.player = player
        cell.isKing = isKing
    }

    clone(board) {
        if( board instanceof Board) {
            this.cells = board.cells.slice
        }
        else if(Array.isArray(board) ) {
            this.cells = board.slice()
        }
        else {
            throw new Error('Board.clone needs a board or array of cells')
        }
    }

    remove(point) {
        this.isCell(point)
        this.cells[point.y][point.x] = makeCell()
        return true
    }
}