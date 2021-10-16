/**
 * Every square needs a proper object to describe it, even if i's not playable.
 * Note, and empty square is not the same as a non playable square.  A square is one of
 *  *  nonplayable
 *  *  empty
 *  *  white ( or white king)
 *  *  black ( or black king)
 *
**/
import { inRange, isEven } from '../utils'

import Player from './Player'
import Point from './Point'

export default class Square {

    static makeNonPlayable(point) {
        return new Square(point)
    }
    static makeEmpty(point) {
        return new Square(point, true, Player.EMPTY, false)
    }

    static makeWhite(point) {
        return new Square(point, true, Player.WHITE, false)
    }
    static makeWhiteKing(point) {
        return Square.makeWhiteSquare(point, true)
    }
    static makeBlack(point) {
        return new Square(point, true, Player.BLACK, false)
    }
    static makeBlackKing(point) {
        return Square.makeBlack(point, true, Player.BLACK, false)
    }

    static isValid(point) {
        return inRange(point.x, -1, 8) && inRange(point.y, -1, 8)
    }

    static isDark(point) {
        return !isEven(point.x + point.y)
        //xor(isEven(point.y), isEven(point.x))
    }

    constructor(point, playable = false, side = Player.EMPTY, isKing = false) {
        this.point = point
        this.playable = playable
        this.side = side
        this.isKing = isKing
    }

    /**
 * Test to see if the direction of the target square is legit for the starting
 * square.  Meaning, Player.WHITE squares go toward the top and Player.BLACK squares
 * go toward the bottom of the board.  Kings go either way
 */
    isDirectional(point) {
        if (!this.playable) {
            return false
        }
        if (this.isKing === false) {
            // WHITE can only go up
            if (this.side === Player.WHITE && point.y < this.point.y) {
                return false
            }
            // BLACK can only go down
            if (this.side === Player.BLACK && point.y > this.point.y) {
                return false
            }
        }
        return true
    }

    getAdjacent() {
        return [
            new Point(this.point.x - 1, this.point.y - 1),
            new Point(this.point.x + 1, this.point.y - 1),
            new Point(this.point.x - 1, this.point.y + 1),
            new Point(this.point.x + 1, this.point.y + 1)
        ].filter(point => Square.isValid(point))
    }

    /**
     * Since squares are immutable, moving one results in a new Square instance
     *
     * @param {Point} point
     * @returns {Square} new square with the updated point
     */
    move(point, isKing) {
        const square = new Square(point, this.playable, this.side, isKing === undefined ? this.isKing : isKing)
        return square
    }

    /**
     * Calculate the  point that is relatively forward and left of this point.
     */
    getNE(spaces = 1) {
        const nx = this.point.x + spaces
        const ny =  this.point.y + Player.forward(this.side, spaces)
        return new Point(nx, ny)
    }
    getNW(spaces = 1) {
        const nx = this.point.x - spaces
        const ny =  this.point.y + Player.forward(this.side, spaces)
        return new Point(nx, ny)
    }
    getSE(spaces = 1) {
        const nx = this.point.x + spaces
        const ny =  this.point.y + Player.backward(this.side, spaces)
        return new Point(nx, ny)
    }
    getSW(spaces = 1) {
        const nx = this.point.x - spaces
        const ny =  this.point.y + Player.backward(this.side, spaces)
        return new Point(nx, ny)
    }

    equals(square) {
        if (!(square instanceof Square)) {
            return false
        }
        return this.point.equals(square.point) && this.playable === square.playable && this.side === square.side && this.isKing === square.isKing
    }

    clone() {
        return new Square(this.point, this.playable, this.side, this.isKing)
    }

    toString() {
        let c = this.side === Player.EMPTY ? ' ' : this.side === Player.WHITE ? 'w' : 'b'
        return this.isKing === true ? c.toUpperCase() : c
    }

}