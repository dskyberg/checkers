export default class Point {
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
    static fromRowCol(row, col) {
        return new Point(col, row)
    }
}
