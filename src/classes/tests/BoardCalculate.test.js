import Point from '../Point'
import Player from '../Player'
import Board from '../Board'
import Square from '../Square'
import Move from '../Move'

test('Forward 1', () => {
    expect(Player.forward(Player.WHITE)).toEqual(1)
    expect(Player.forward(Player.BLACK)).toEqual(-1)
})

test('Forward 2', () => {
    expect(Player.forward(Player.WHITE, 2)).toEqual(2)
    expect(Player.forward(Player.BLACK, 2)).toEqual(-2)
})

test('Backward 1', () => {
    expect(Player.backward(Player.WHITE)).toEqual(-1)
    expect(Player.backward(Player.BLACK)).toEqual(1)
})

test('Backward 2', () => {
    expect(Player.backward(Player.WHITE, 2)).toEqual(-2)
    expect(Player.backward(Player.BLACK, 2)).toEqual(2)
})

test('White, getNE', () => {
    const x = 3
    const y = 4
    const side = Player.WHITE
    const isKing = false
    const sq = new Square(new Point(x,y),true, side, isKing)
    const nep = sq.getNE()
    expect(nep.y).toEqual(y+1)
    expect(nep.x).toEqual(x+1)
})

test('White, getNE 2', () => {
    const x = 3
    const y = 4
    const side = Player.WHITE
    const isKing = false
    const sq = new Square(new Point(x,y),true, side, isKing)
    const nep = sq.getNE(2)
    expect(nep.y).toEqual(y+2)
    expect(nep.x).toEqual(x+2)
})

test('Black, getNE 2', () => {
    const x = 3
    const y = 4
    const side = Player.BLACK
    const isKing = false
    const sq = new Square(new Point(x,y),true, side, isKing)
    const nep = sq.getNE(2)
    expect(nep.y).toEqual(y-2)
    expect(nep.x).toEqual(x+2)
})

test('White, getNE 2 past edge', () => {
    const x = 3
    const y = 6
    const side = Player.WHITE
    const isKing = false
    const sq = new Square(new Point(x,y),true, side, isKing)
    const nep = sq.getNE(2)
    expect(nep.y).toEqual(y+2)
    expect(nep.x).toEqual(x+2)
    expect(Square.isValid(nep)).toEqual(false)
})