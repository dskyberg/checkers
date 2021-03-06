import Point from '../Point'
import Player from '../Player'
import Board from '../Board'
import Square from '../Square'
import Move from '../Move'

const NOT_A_KING = false
const IS_A_KING = true


test(`one white only`, () => {
    const point = new Point(4, 5)
    const player = new Player(Player.WHITE)

    const expectedMoves = [
        new Move(new Point(4, 5), new Point(3, 6)),
        new Move(new Point(4, 5), new Point(5, 6))
    ]

    const board = new Board([])
    //console.log(board.display())

    board.setSquare(new Square(point, true, player.side))
    //console.log(board.display())
    const result = board.getOpenMoves(point)
    board.evaluate()
    expect(result).toEqual(expectedMoves)
})

test(`one white on an edge`, () => {
    const point = new Point(7, 2)
    const player = new Player(Player.WHITE)

    const expectedMoves = [
        new Move(new Point(7, 2), new Point(6, 3))
    ]

    const board = new Board([])
    board.setSquare(new Square(point, true, player.side))

    const result = board.getOpenMoves(point)
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
    board.setSquare(new Square(point, true, player.side))

    const result = board.getOpenMoves(point)
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
    board.setSquare(new Square(point, true, player.side, IS_A_KING))

    const result = board.getOpenMoves(point)
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
    board.setSquare(new Square(point, true, player.side, IS_A_KING))

    const result = board.getOpenMoves(point)
    expect(result).toEqual(expectedMoves)
})

test(`one white and one black, no kings`, () => {
    const whitePoint = new Point(3, 2)
    const blackPoint = new Point(4, 3)
    const player = Player.makeWhite()
    const opponent = Player.makeBlack()
    const expectedMoves = [
        new Move(new Point(3, 2), new Point(2, 3)),
        new Move(new Point(3, 2), new Point(5, 4))
    ]
    const board = new Board([])
    board.setSquare(new Square(whitePoint, true, player.side, NOT_A_KING))
    board.setSquare(new Square(blackPoint, true, opponent.side, NOT_A_KING))
    //console.log(board.display())
    const result = board.getOpenMoves(whitePoint)
    //console.log(result)
    expect(result).toEqual(expectedMoves)
})

test(`one black single jump, no kings`, () => {
    const blackPoint = new Point(0, 5)
    const whitePoint = new Point(1, 4)
    const player = Player.makeBlack()
    const opponent = Player.makeWhite()
    const expectedMoves = [
        new Move(new Point(0, 5), new Point(2, 3))
    ]
    const board = new Board([])
    board.setSquare(new Square(blackPoint, true, player.side, NOT_A_KING))
    board.setSquare(new Square(whitePoint, true, opponent.side, NOT_A_KING))
    //console.log(board.display())
    const result = board.getOpenMoves(blackPoint)
    //console.log('result:',result)
    expect(result).toEqual(expectedMoves)
})

test('triple jump with no king', () => {
    const whitePoint = new Point(1, 0)
    const blackPoint1 = new Point(2, 1)
    const jumpEnd1 = new Point(3,2)
    const blackPoint2 = new Point(4, 3)
    const jumpEnd2 = new Point(5,4)
    const blackPoint3 = new Point(6,5)
    const jumpEnd3 = new Point(7,6)
    const player = new Player(Player.WHITE)
    const opponent = new Player(Player.BLACK)

    const expectedMoves = [
        new Move(whitePoint, new Point(0,1)),
        new Move(whitePoint, jumpEnd1),
        new Move(jumpEnd1, jumpEnd2),
        new Move(jumpEnd2, jumpEnd3)
    ]
    const board = new Board([])
    board.setSquare(new Square(whitePoint, true, player.side, NOT_A_KING))
    board.setSquare(new Square(blackPoint1, true, opponent.side, NOT_A_KING))
    board.setSquare(new Square(blackPoint2, true, opponent.side, NOT_A_KING))
    board.setSquare(new Square(blackPoint3, true, opponent.side, NOT_A_KING))
    //console.log(board.display())
    const moves = board.getOpenMoves(whitePoint)
    //console.log(moves)
    expect(moves).toEqual(expectedMoves)


    board.makeMove(moves[1])
    board.makeMove(moves[2])
    board.makeMove(moves[3])
    //console.log(board.display())
    const resultingBoard = new Board([])
    resultingBoard.setSquare(new Square(jumpEnd3, true, player.side, NOT_A_KING))
    expect(board.equals(resultingBoard)).toBe(true)
})


test('double jump with  king', () => {
    const whitePoint = new Point(1, 0)
    const blackPoint1 = new Point(2, 1)
    const jumpEnd1 = new Point(3,2)
    const blackPoint2 = new Point(4, 3)
    const jumpEnd2 = new Point(5,4)
    const blackPoint3 = new Point(6,3)
    const jumpEnd3 = new Point(7,2)
    const player = new Player(Player.WHITE)
    const opponent = new Player(Player.BLACK)
    const expectedMoves = [
        new Move(whitePoint, new Point(0,1)),
        new Move(whitePoint, jumpEnd1),
        new Move(jumpEnd1, jumpEnd2),
        new Move(jumpEnd2, jumpEnd3)
    ]
    const board = new Board([])
    board.setSquare(new Square(whitePoint, true, player.side, IS_A_KING))
    board.setSquare(new Square(blackPoint1, true, opponent.side, NOT_A_KING))
    board.setSquare(new Square(blackPoint2, true, opponent.side, NOT_A_KING))
    board.setSquare(new Square(blackPoint3, true, opponent.side, NOT_A_KING))
    //console.log(board.display())
    const moves = board.getOpenMoves(whitePoint)
    //console.log(moves)
    expect(moves).toEqual(expectedMoves)

    board.makeMove(moves[1])
    board.makeMove(moves[2])
    board.makeMove(moves[3])
    //console.log(board.display())
    const resultingBoard = new Board([])
    resultingBoard.setSquare(new Square(jumpEnd3, true, player.side, IS_A_KING))
    expect(board.equals(resultingBoard)).toBe(true)
})

test('copy a board', () => {
    const whitePoint = new Point(1, 0)
    const blackPoint1 = new Point(2, 1)
    const blackPoint2 = new Point(4, 3)
    const blackPoint3 = new Point(6,3)
    const player = Player.makeWhite()
    const opponent = Player.makeBlack()

    const board = new Board([])
    board.setSquare(new Square(whitePoint, true, player.side, IS_A_KING))
    board.setSquare(new Square(blackPoint1, true, opponent.side, NOT_A_KING))
    board.setSquare(new Square(blackPoint2, true, opponent.side, NOT_A_KING))
    board.setSquare(new Square(blackPoint3, true, opponent.side, NOT_A_KING))
    //console.log(board.display())

    const copied = new Board()
    copied.copyFrom(board)
    //console.log(copied.display())
    expect(board.equals(copied)).toBe(true)
    expect(copied.equals(board)).toBe(true)
})
