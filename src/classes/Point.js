import { inRange } from '../utils/inRange'
import { MAX_ROW_COL } from '../constants'
export default class Point {

    static isPoint(point) {
        if (point === undefined) {
            throw new Error('point is not defined')
        }
        if (!(point instanceof Point)) {
            throw new Error('not a Point')
        }
        if (!inRange(point.x, -1, MAX_ROW_COL)) {
            throw new Error(`x is out of bounds: ${point.x}`)
        }
        if (!inRange(point.y, -1, MAX_ROW_COL)) {
            throw new Error(`y is out of bounds: ${point.y}`)
        }
        return true
    }

    /**
     * Ensure a point is within the range of an 8x8 board
     *
     * @param {Point} point
     * @returns {boolean} true if the point is in range
     */
    static testPoint(point) {
        return (point instanceof Point) &&
            inRange(point.x, -1, MAX_ROW_COL) &&
            inRange(point.y, -1, MAX_ROW_COL)
    }

    /**
     * Create a Point instance.  Requires both an x and y value.
     *
     * @param {Number} x The column value
     * @param {Number} y The row value
     */
    constructor(x, y) {
        if ((typeof x !== 'number') || (typeof y !== 'number')) {
            throw new Error('Point requires a number for x and y')
        }
        this.x = x
        this.y = y
    }

    /**
      * @typedef RowCol
      * @type {object}
      * @property {Number} row The row
      * @property {Number} col The col
      *
      */

    /**
     * Returns the x/y point values as an object with row and col attributes.
     *
      * @returns {RowCol} row and col
      */
    toRowCol() {
        return { row: this.y, col: this.x }
    }


    equals(point) {
        return point && point instanceof Point && (this.x === point.x && this.y === point.y)
    }

    /**
     * Check if a point is in an array of points.
     *
     * @param {Point[]} points
     * @returns {boolean} true if the point was found.  Otherwise false.
     */
    in(points) {
        if (!points || !Array.isArray(points)) return false
        let matched = false
        points.forEach(point => { if (this.equals(point)) matched = true })
        return matched
    }

    clone() {
        return new Point(this.x, this.y)
    }

    toString() {
        return `{x: ${this.x}, y: ${this.y}}`
    }
}
