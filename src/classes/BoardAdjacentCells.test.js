import {adjacentCells} from './Board'
import Point from './Point'

// Cell isn't playale
const upperLeft = new Point(0,0)

const upperRight = new Point(7,0)
const goodUpperRight = [{x:6, y:1}]

const lowerLeft = new Point(0,7)
const goodLowerLeft = [{x:1, y:6}]

// lower right isn't playable
const lowerRight = new Point(7,7)

// Center square
const center = new Point(3,2)
const goodCenter = [
    {x:2,y:1},
    {x:4,y:1},
    {x:2,y:3},
    {x:4,y:3}
]

// first row, center
const firstCenter = new Point(3,0)
const goodFirstCenter = [
    {x:2, y:1},
    {x:4, y:1}
]

// Last row, center
const lastCenter = new Point(4,7)
const goodLastCenter = [
    {x:3, y:6},
    {x:5, y:6}
]

const centerFirst = new Point(0,3)
const goodCenterFirst = [
    {x:1, y:2},
    {x:1, y:4}
]

const centerLast = new Point(7,4)
const goodCenterLast = [
    {x:6, y:3},
    {x:6, y:5}
]

test( 'adjacentCells - upper left', () => {
    expect(() => {adjacentCells(upperLeft)}).toThrow('Not a valid cell');
})

test( 'adjacentCells - upper right', () => {
    expect(adjacentCells(upperRight)).toEqual(goodUpperRight)
})

test( 'adjacentCells - lower left', () => {
    expect(adjacentCells(lowerLeft)).toEqual(goodLowerLeft)
})

test( 'adjacentCells - lower right', () => {
    expect(() => {adjacentCells(lowerRight)}).toThrow('Not a valid cell')
})

test( 'adjacentCells - center', () => {
    expect(adjacentCells(center)).toEqual(goodCenter)
})

test( 'adjacentCells - first center', () => {
    expect(adjacentCells(firstCenter)).toEqual(goodFirstCenter)
})

test( 'adjacentCells - last center', () => {
    expect(adjacentCells(lastCenter)).toEqual(goodLastCenter)
})

test( 'adjacentCells - center first ', () => {
    expect(adjacentCells(centerFirst)).toEqual(goodCenterFirst)
})

test( 'adjacentCells - center last ', () => {
    expect(adjacentCells(centerLast)).toEqual(goodCenterLast)
})