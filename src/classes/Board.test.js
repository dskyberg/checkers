import Point from './Point'
import Player from './Player'
import Board from './Board'

const NOT_A_KING = false
const IS_A_KING = true

// Set up a board
const point = new Point(4,5)
const board = new Board()
board.setCell(point, Player.WHITE, NOT_A_KING)
//board.setCell({x:3, y:4}, Player.WHITE, NOT_A_KING)
board.setCell({x:5, y:4}, Player.BLACK, NOT_A_KING)

test(`open cells for {x:3, y:6}`, () => {
    const cells = board.getOpenMoves({x:4,y:5})
    console.log(cells)
    expect(true).toBe(true)
})