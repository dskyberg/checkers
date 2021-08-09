import Point from './Point'
import Player from './Player'
import Board from './Board'
import Move from './Move'

const NOT_A_KING = false
const IS_A_KING = true

// Set up a board
test(`one white`, () => {
    const point = new Point(4, 5)
    const player = new Player(Player.WHITE)

    const expectedMoves = [
        new Move(new Point(4, 5), new Point(3, 6)),
        new Move(new Point(4, 5), new Point(5, 6))
    ]

    const board = new Board([])
    board.setCell(point, player.side, NOT_A_KING)

    const result = board.getOpenMoves(player, point)
    expect(result).toEqual(expectedMoves)
})

test(`one white on an edge`, () => {
    const point = new Point(7, 2)
    const player = new Player(Player.WHITE)

    const expectedMoves = [
        new Move(new Point(7, 2), new Point(6, 3))
    ]

    const board = new Board([])
    board.setCell(point, player.side, NOT_A_KING)

    const result = board.getOpenMoves(player, point)
    expect(result).toEqual(expectedMoves)
})

test(`one black`, () => {
    const point = new Point(4, 5)
    const player = new Player(Player.BLACK)
    const expectedMoves = [
        new Move(new Point(4, 5), new Point(3, 4)),
        new Move(new Point(4, 5), new Point(5, 4))
    ]
    const board = new Board([])
    board.setCell(point, player.side, NOT_A_KING)

    const result = board.getOpenMoves(player, point)
    expect(result).toEqual(expectedMoves)
})

test(`one white king`, () => {
    const point = new Point(4, 5)
    const player = new Player(Player.WHITE)

    const expectedMoves = [
        new Move(new Point(4, 5), new Point(3, 4)),
        new Move(new Point(4, 5), new Point(5, 4)),
        new Move(new Point(4, 5), new Point(3, 6)),
        new Move(new Point(4, 5), new Point(5, 6))
    ]

    const board = new Board([])
    board.setCell(point, player.side, IS_A_KING)

    const result = board.getOpenMoves(player, point)
    expect(result).toEqual(expectedMoves)
})

test(`one black king`, () => {
    const point = new Point(4, 5)
    const player = new Player(Player.BLACK)

    const expectedMoves = [
        new Move(new Point(4, 5), new Point(3, 4)),
        new Move(new Point(4, 5), new Point(5, 4)),
        new Move(new Point(4, 5), new Point(3, 6)),
        new Move(new Point(4, 5), new Point(5, 6))
    ]

    const board = new Board([])
    board.setCell(point, player.side, IS_A_KING)

    const result = board.getOpenMoves(player, point)
    expect(result).toEqual(expectedMoves)
})

test(`one white and one black, no kings`, () => {
    const whitePoint = new Point(3, 2)
    const blackPoint = new Point(4, 3)
    const player = new Player(Player.WHITE)
    const expectedMoves = [
        new Move(new Point(3, 2), new Point(2, 3)),
        new Move(new Point(3, 2), new Point(5, 4))
    ]
    const board = new Board([])
    board.setCell(whitePoint, Player.WHITE, NOT_A_KING)
    board.setCell(blackPoint, Player.BLACK, NOT_A_KING)
    //console.log(board.display())
    const result = board.getOpenMoves(player, whitePoint)
    //console.log(result)
    expect(result).toEqual(expectedMoves)
})


test('double jump with no king', () => {
    const whitePoint = new Point(3, 2)
    const blackPoint1 = new Point(4, 3)
    const jumpEnd1 = new Point(5,4)
    const blackPoint2 = new Point(6, 5)
    const jumpEnd2 = new Point(7,6)
    const player = new Player(Player.WHITE)
    const opponent = new Player(Player.BLACK)
    const expectedMoves = [
        new Move(whitePoint, new Point(2,3)),
        new Move(whitePoint, jumpEnd1),
        new Move(new Point(5,4), jumpEnd2)
    ]
    const board = new Board([])
    board.setCell(whitePoint, player.side, NOT_A_KING)
    board.setCell(blackPoint1, opponent.side, NOT_A_KING)
    board.setCell(blackPoint2, opponent.side, NOT_A_KING)
    console.log(board.display())
    const moves = board.getOpenMoves(player, whitePoint)
    //console.log(moves)
    expect(moves).toEqual(expectedMoves)

    //moves.forEach(move => {board.makeMove(move)})
    board.makeMove(moves[1])
    board.makeMove(moves[2])
    console.log(board.display())
    const resultingBoard = new Board([])
    resultingBoard.setCell(jumpEnd2, player.side, NOT_A_KING)
    expect(board.equals(resultingBoard)).toBe(true)
})