import Point from './Point'

export default class Move {

    /**
     *
     * @param {Point} start
     * @param {Point} end
     */
    constructor(start, end) {
        if (start === undefined || !(start instanceof Point) || !(end instanceof Point)) {
            throw new Error('Move requires two points')
        }

        this.start = start
        this.end = end
    }

    /**
     * Returns the middle square in a jump move.  A jump move is defined as any
     * move where the end row is +- 2 of the start row
     *
     * @returns {Point) middle Point
     */
    findMiddle() {
        if (this.start.y !== this.end.y + 2 && this.start.y !== this.end.y - 2) {
            // This isn't a jump move.  Return null
            return null
        }
        const x = (this.start.x + this.end.x) / 2
        const y = (this.start.y + this.end.y) / 2
        return new Point(x, y)
    }

    contains(point) {
        return this.start.equals(point) || this.end.equals(point)
    }

    isReverse(move) {
        return this.start.equals(move.end) && this.end.equals(move.start)
    }

    equals(move) {
        return this.start.equals(move.start) && this.end.equals(move.end)
    }

    clone() {
        return new Move(this.start.clone(), this.end.clone())
    }
}