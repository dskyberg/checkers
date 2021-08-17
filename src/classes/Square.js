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

    static makeNonPlayable() {
        return new Square()
    }
    static makeEmpty() {
        return new Square(true, Player.EMPTY, false)
    }

    static makeWhite(){
        return new Square(true, Player.WHITE, false )
    }
    static makeWhiteKing() {
        return Square.makeWhiteSquare(true)
    }
    static makeBlack() {
       return new Square(true, Player.BLACK, false)
    }
    static makeBlackKing() {
        return Square.makeBlack(true, Player.BLACK, false)
    }

    constructor(playable = false, side = Player.EMPTY, isKing = false){
        this.playable = playable
        this.side = side
        this.isKing = isKing
    }

    equals(square) {
        if(!(square instanceof Square)) {
            return false
        }
        return this.playable === square.playable && this.side === square.side && this.isKing === square.isKing
    }

    clone() {
        return new Square(this.playable, this.side, this.isKing)
    }

    toString() {
        let c = this.side === Player.EMPTY ? ' ' : this.side === Player.WHITE ? 'w' : 'b'
        return this.isKing === true ? c.toUpperCase() : c
    }

}