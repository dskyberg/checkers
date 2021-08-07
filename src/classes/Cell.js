/**
 * Every cell needs a proper object to describe it, even if i's not playable.
 * Note, and empty cell is not the same as a non playable cell.  A cell is one of
 *  *  nonplayable
 *  *  empty
 *  *  white ( or white king)
 *  *  black ( or black king)
 *
**/
import Player from './Player'


export default class Cell {

    static makeNonPlayable() {
        return new Cell()
    }
    static makeEmpty() {
        return new Cell(true, Player.EMPTY, false)
    }

    static makeWhite(){
        return new Cell(true, Player.WHITE, false )
    }
    static makeWhiteKing() {
        return Cell.makeWhiteCell(true)
    }
    static makeBlack() {
       return new Cell(true, Player.BLACK, false)
    }
    static makeBlackKing() {
        return Cell.makeBlack(true, Player.BLACK, false)
    }

    constructor(playable = false, side = Player.EMPTY, isKing = false){
        this.playable = playable
        this.side = side
        this.isKing = isKing
    }

    equals(cell) {
        if(!(cell instanceof Cell)) {
            return false
        }
        return this.playable === cell.playable && this.side === cell.side && this.isKing === cell.isKing
    }

    clone() {
        return new Cell(this.playable, this.side, this.isKing)
    }

    toString() {
        let c = this.side === Player.EMPTY ? ' ' : this.side === Player.WHITE ? 'w' : 'b'
        return this.isKing === true ? c.toUpperCase() : c
    }

}