import {adjacentSquares} from '../Board'
import Point from '../Point'
import Square from '../Square'

// Square isn't playale
const upperLeft = new Square(new Point(0,0))

const upperRight = new Square(new Point(7,0))
const goodUpperRight = [{x:6, y:1}]

const lowerLeft = new Square(new Point(0,7))
const goodLowerLeft = [{x:1, y:6}]

// lower right isn't playable
const lowerRight = new Square(new Point(7,7))

// Center square
const center = new Square(new Point(3,2))
const goodCenter = [
    {x:2,y:1},
    {x:4,y:1},
    {x:2,y:3},
    {x:4,y:3}
]

// first row, center
const firstCenter = new Square(new Point(3,0))
const goodFirstCenter = [
    {x:2, y:1},
    {x:4, y:1}
]

// Last row, center
const lastCenter = new Square(new Point(4,7))
const goodLastCenter = [
    {x:3, y:6},
    {x:5, y:6}
]

const centerFirst = new Square(new Point(0,3))
const goodCenterFirst = [
    {x:1, y:2},
    {x:1, y:4}
]

const centerLast = new Square(new Point(7,4))
const goodCenterLast = [
    {x:6, y:3},
    {x:6, y:5}
]

test( 'adjacentSquares - upper right', () => {
    expect(upperRight.getAdjacent()).toEqual(goodUpperRight)
})

test( 'adjacentSquares - lower left', () => {
    expect(lowerLeft.getAdjacent()).toEqual(goodLowerLeft)
})

test( 'adjacentSquares - center', () => {
    expect(center.getAdjacent()).toEqual(goodCenter)
})

test( 'adjacentSquares - first center', () => {
    expect(firstCenter.getAdjacent()).toEqual(goodFirstCenter)
})

test( 'adjacentSquares - last center', () => {
    expect(lastCenter.getAdjacent()).toEqual(goodLastCenter)
})

test( 'adjacentSquares - center first', () => {
    expect(centerFirst.getAdjacent()).toEqual(goodCenterFirst)
})

test( 'adjacentSquares - center last', () => {
    expect(centerLast.getAdjacent()).toEqual(goodCenterLast)
})