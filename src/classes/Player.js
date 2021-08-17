
export const SIDE_NAME = [
    "Empty",
    "Black",
    "White"
]

export default class Player {
    static EMPTY = 0
    static BLACK = 1
    static WHITE = 2

    /**
     * Returns the opposite of the given side, or Player.EMPTY
     *
     * @param {number} side - either Player.WHITE or Player.BLACK
     * @returns {number} the opposed of the provided side
     */
    static OpposingPlayer(side) {
        return side === Player.EMPTY ? 0 : 3 - side
    }

    /**
     * Construct a new player.  You can either provide an existing Player instance to clone from, or
     * provide a "side" with either Player.BLACK or Player.WHITE.
     *
     * @param {Player | number} player Either a valid player instance or one of Player.BLACK or Player.WHITE
     * @param {string} name Optional name.  If not provided, the name will match the player param
     */
    constructor(player, name) {
        // If no params parovided
        if( player === undefined ) {
            throw new Error('player is undefined')
        }

        // If cloning from another Player instance
        if (player instanceof Player) {
            this.side = player.side
            this.name = player.name
        }
        // Creating from parameters
        else if(player === Player.BLACK || player === Player.WHITE) {
            this.side = player
            if(name === undefined) {
                this.name = SIDE_NAME[this.side]
            } else {
                this.name = name
            }
        }
        else {
            throw new Error('player must be either Player.WHITE or Player.BLACK')
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

    opposing() {
        return 3 - this.side
    }
}