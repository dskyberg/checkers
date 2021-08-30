import Point from '../Point'

test('no values in constructor', () => {
    expect(() => (new Point())).toThrow('Point requires a number for x and y')
})

test('constructor', () => {
    expect(() => (new Point(null, null))).toThrow('Point requires a number for x and y')
    expect(() => (new Point('2', '1'))).toThrow('Point requires a number for x and y')
    expect(new Point(1, 2) instanceof Point).toBeTruthy()
})

test('isPoint', () => {
    expect(() => (Point.isPoint())).toThrow('point is not defined')
    expect(() => (Point.isPoint(''))).toThrow('not a Point')
    expect(() => (Point.isPoint(new Point(-1, 2)))).toThrow('x is out of bounds: -1')
    expect(() => (Point.isPoint(new Point(8, 2)))).toThrow('x is out of bounds: 8')
    expect(() => (Point.isPoint(new Point(1, -1)))).toThrow('y is out of bounds: -1')
    expect(() => (Point.isPoint(new Point(1, 8)))).toThrow('y is out of bounds: 8')
    expect(Point.isPoint(new Point(1, 2))).toBeTruthy()

})

test('testPoint', () => {
    expect(Point.testPoint(new Point(1, 7))).toBeTruthy()
    expect(Point.testPoint(new Point(7, 1))).toBeTruthy()
    expect(Point.testPoint(new Point(-1, 7))).toBeFalsy()
    expect(Point.testPoint(new Point(8, 7))).toBeFalsy()
    expect(Point.testPoint(new Point(7, -1))).toBeFalsy()
    expect(Point.testPoint(new Point(7, 8))).toBeFalsy()
})

test('equals', () => {
    const p1 = new Point(1, 2)
    const p2 = new Point(1, 2)
    const p3 = new Point(2, 1)

    expect(p1.equals(p1)).toBeTruthy()
    expect(p1.equals(p2)).toBeTruthy()
    expect(p1.equals(p3)).toBeFalsy()
    expect(p1.equals('abc')).toBeFalsy()
})

test('toRowCol', () => {
    const point = new Point(1, 2)
    const expectedResult = { row: 2, col: 1 }
    expect(point.toRowCol()).toEqual(expectedResult)
})

test('in', () => {
    const testPoint = new Point(1,2)
    const emptySet = []
    const goodSet1 = [
        new Point(1,2),
        new Point(3,4),
        new Point(4,5)
    ]
    const goodSet2 = [
        new Point(3,4),
        new Point(4,5),
        new Point(1,2)
    ]
    const badSet = [
        new Point(3,4),
        new Point(4,5),
        new Point(5,6)
    ]

    expect(testPoint.in(goodSet1)).toBeTruthy()
    expect(testPoint.in(goodSet2)).toBeTruthy()
    expect(testPoint.in(emptySet)).toBeFalsy()
    expect(testPoint.in(badSet)).toBeFalsy()
})

test('clone', () => {
    const point = new Point(1,2)
    expect(point.clone().equals(point)).toBeTruthy()
})