import Move from './Move'
import Point from './Point'

test('equality', () => {
    const m1 = new Move(new Point(2,3), new Point(3,2))
    const m2 = new Move(new Point(2,3), new Point(3,2))
    expect(m1.equals(m2)).toEqual(true)
})