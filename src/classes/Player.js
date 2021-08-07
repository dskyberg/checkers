
export const SIDE_NAME = [
    "Empty",
    "Black",
    "White"
]

export default class Player {
    static  EMPTY = 0
    static BLACK = 1
    static WHITE = 2

    constructor(side, name) {
        // If no params parovided
        if(side === undefined) {
            this.side = Player.EMPTY
            this.name = SIDE_NAME[this.side]
        }
        // If cloning from another Player instance
        else if (side instanceof Player) {
            this.side = side.side
            this.name = side.name
        }
        // Creating from parameters
        else {
            if(side < Player.EMPTY || side > Player.WHITE) {
                throw new Error('Player: bad side provided')
            }
            this.side = side
            if(name === undefined) {
                this.name = SIDE_NAME[this.side]
            } else {
                this.name = name
            }
        }
    }

    equals(player) {
        if(!(player instanceof Player)) {
            return false
        }
        return this.side === player.side && this.name === player.name
    }

    toString() {
        return `name: ${this.name}, side: ${SIDE_NAME[this.side]}`
    }

   static opposing(type) {
        return type === Player.WHITE ? Player.BLACK : type === Player.BLACK ? Player.WHITE : Player.EMPTY
    }
}