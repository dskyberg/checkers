import Player from '../Player'

test('constructor', () => {
    expect(() => {new Player()}).toThrow('player is undefined')
})

test('White', () => {
    const s = new Player(Player.WHITE).toString()
    expect(s).toEqual('name: White, side: White')
})

test('toString White, "Jay', () => {
    const p1 = new Player(Player.WHITE, 'Jay')
    const s = new Player(p1).toString()
    expect(s).toEqual('name: Jay, side: White')
})