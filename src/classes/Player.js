
export default class Player {
    static  EMPTY = 0
    static BLACK = 1
    static WHITE = 2

    constructor(player) {
        if(player) this.type = player
        else this.type = Player.BLACK
    }

   static opposing(type) {
        return type === Player.WHITE ? Player.BLACK : type === Player.BLACK ? Player.WHITE : Player.EMPTY
    }
}