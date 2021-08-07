import { action, makeObservable, observable } from "mobx"
import Board from '../classes/Board'
import Player from '../classes/Player'
import {SIDE_NAME} from '../classes/Player'


const depths = [-1, 1, 2, 3, 4]
export default class Settings {
    depth = -1
    starting = 1
    round = 1
    openDialog = false
    selected = undefined
    board = new Board()
    playerWhite = new Player(Player.WHITE)
    playerBlack = new Player(Player.BLACK)
    currentPlayer = this.playerWhite
    banner = `${SIDE_NAME[this.currentPlayer.side]}'s turn`

    constructor() {
        makeObservable(this, {
            depth: observable,
            starting: observable,
            round: observable,
            openDialog: observable,
            banner: observable,
            selected: observable,
            board: observable,
            setDepth: action,
            setStarting: action,
            setRound: action,
            nextRound: action,
            setOpenDialog: action,
            setBanner: action,
            setSelected: action,
            turnOver: action,
        })
    }

    setDepth(value) {
        if (value in depths) {
            this.depth = value
        }
    }

    setStarting(value) {
        if (value === 0 || value === 1) {
            this.starting = value
        }
    }

    setRound(round) {
        this.round = round
    }

    nextRound() {
        this.round += 1
        this.gameResult = `Round ${this.round}`
    }

    setOpenDialog(value) {
        this.openDialog = value;
    }

    setBanner(val) {
        this.banner = val
    }

    setSelected(point) {

    }

    turnOver() {
        this.currentPlayer = this.currentPlayer.side === Player.WHITE ? this.playerBlack : this.playerWhite
        console.log('turning side over to', SIDE_NAME[this.currentPlayer.side])
        this.setBanner(`${SIDE_NAME[this.currentPlayer.side]}'s turn`)
    }
}
