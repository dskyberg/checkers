import { inRange } from '../inRange'

test('in bound', () => {
    // now we have the original implementation,
    // even if we set the automocking in a jest configuration
    expect(inRange(2, 0, 3)).toBe(true);
});

test('x equals lower bound', () => {
    // now we have the original implementation,
    // even if we set the automocking in a jest configuration
    expect(inRange(0, 0, 3)).toBe(false);
});

test('x less than upper bound', () => {
    // now we have the original implementation,
    // even if we set the automocking in a jest configuration
    expect(inRange(0, 1, 3)).toBe(false);
});

test('x equals upper bound', () => {
    // now we have the original implementation,
    // even if we set the automocking in a jest configuration
    expect(inRange(3, 0, 3)).toBe(false);
});
test('x greater than upper bound', () => {
    // now we have the original implementation,
    // even if we set the automocking in a jest configuration
    expect(inRange(4, 0, 3)).toBe(false);
});
