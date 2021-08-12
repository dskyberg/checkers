import Player from './Player'

test('toString', () => {
    expect(() => {new Player()}).toThrow('Player must be either a Player instance, Player.WHITE or Player.BLACK')
})

test('White', () => {
    const s = new Player(Player.WHITE).toString()
    expect(s).toEqual('name: White, side: White')
})

test('White, "Jay', () => {
    const s = new Player(Player.WHITE, 'Jay').toString()
    expect(s).toEqual('name: Jay, side: White')
})

test('Clone from White, "Jay', () => {
    const p1 = new Player(Player.WHITE, 'Jay')
    const s = new Player(p1).toString()
    expect(s).toEqual('name: Jay, side: White')
})