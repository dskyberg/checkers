import {jumpCell} from './Board'


test('{2,5} jumps {3,4}', () => {
    expect(jumpCell({x:2, y:5}, {x:3,y:4})).toEqual({x:4, y:3})
})

test('{4,3} jumps {3,4}', () => {
    expect(jumpCell({x:4, y:3}, {x:3,y:4})).toEqual({x:2, y:5})
})