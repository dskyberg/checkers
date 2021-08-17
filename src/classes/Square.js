/**
 * Every square needs a proper object to describe it, even if i's not playable.
 * Note, and empty square is not the same as a non playable square.  A square is one of
 *  *  nonplayable
 *  *  empty
 *  *  white ( or white king)
 *  *  black ( or black king)
 *
**/
import Player from './Player'


export default class Square {

    static makeNonPlayable(point) {
        return new Square(point)
    }
    static makeEmpty(point) {
        return new Square(point, true, Player.EMPTY, false)
    }

    static makeWhite(point){
        return new Square(point, true, Player.WHITE, false )
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

    constructor(point, playable = false, side = Player.EMPTY, isKing = false){
        this.point = point
        this.playable = playable
        this.side = side
        this.isKing = isKing
    }

    move(point) {
        this.point = point
        return this
    }

    equals(square) {
        if(!(square instanceof Square)) {
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