import Player from './Player'

test('toString', () => {
    const s = new Player().toString()
    expect(s).toEqual('name: Empty, side: Empty')
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