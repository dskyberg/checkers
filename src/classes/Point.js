import {inRange} from '../utils/inRange'
import { MAX_ROW_COL } from '../constants'
export default class Point {

    static isPoint(point) {
        if(point === undefined) {
            throw new Error('point is not defined')
        }
        if (!(point instanceof Point)) {
            throw new Error('not a Point')
        }
        if(!inRange(point.x, -1, MAX_ROW_COL)) {
            throw new Error(`x is out of bounds: ${point.x}`)
        }
        if(!inRange(point.y, -1, MAX_ROW_COL)) {
            throw new Error(`xyis out of bounds: ${point.y}`)
        }
        return true
    }

    static testPoint(point) {
        return (point instanceof Point) &&
        inRange(point.x, -1, MAX_ROW_COL) &&
        inRange(point.y, -1, MAX_ROW_COL)
    }

    static fromRowCol(row, col) {
        return new Point(col, row)
    }

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    toRowCol() {
        return {row: this.y, col: this.x}
    }
    equals(point) {
        return point && (this.x === point.x && this.y === point.y)
    }
    in(points) {
        if(!points) return false
        let matched = false
        points.forEach(point => {if(this.equals(point)) matched = true})
        return matched
    }

    toString() {
        return `{x: ${this.x}, y: ${this.y}}`
    }
}
