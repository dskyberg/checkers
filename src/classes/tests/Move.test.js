import Move from '../Move'
import Point from '../Point'

test('no start in constructor', () => {

    expect(() => { new Move() }).toThrow('Move requires either points or a Move instance')
})

test('no end in constructor', () => {

    expect(() => { new Move(new Point(1, 0)) }).toThrow('Move requires two points')
})

test('constructor with Move', () => {
    const start = new Point(2, 3)
    const end = new Point(3, 2)
    const m1 = new Move(start, end)
    const m2 = new Move(m1)
    expect(m1.equals(m2)).toEqual(true)
})

test('equality', () => {
    const start = new Point(2, 3)
    const end = new Point(3, 2)
    const m1 = new Move(start, end)
    const m2 = new Move(start, end)
    expect(m1.equals(m2)).toEqual(true)
})

test('contains', () => {
    const start = new Point(2, 3)
    const end = new Point(3, 2)
    const m1 = new Move(start, end)
    expect(m1.contains(start)).toEqual(true)
    expect(m1.contains(end)).toEqual(true)
})

test('is reverse', () => {
    const start1 = new Point(2, 3)
    const end1 = new Point(3, 2)
    const m1 = new Move(start1, end1)
    const m2 = new Move(end1, start1)
    expect(m1.isReverse(m2)).toEqual(true)
})

test('is not reverse', () => {
    const start1 = new Point(2, 3)
    const end1 = new Point(3, 2)
    const end2 = new Point(5, 4)
    const m1 = new Move(start1, end1)
    const m2 = new Move(end2, start1)
    expect(m1.isReverse(m2)).toEqual(false)

})

test('find middle', () => {
    const start = new Point(2, 3)
    const end = new Point(4, 5)
    const middle = new Point(3, 4)
    const m1 = new Move(start, end)
    expect(m1.findMiddle()).toEqual(middle)
})

test('no middle - adjacent', () => {
    const start = new Point(2, 3)
    const end = new Point(3, 4)
    const m1 = new Move(start, end)
    expect(m1.findMiddle()).toEqual(null)
})

test('no middle - not adjacent', () => {
    const start = new Point(2, 3)
    const end = new Point(6, 7)
    const m1 = new Move(start, end)
    expect(m1.findMiddle()).toEqual(null)
})
