import { action, makeObservable, observable } from "mobx"
import Board from '../classes/Board'


const depths = [-1, 1, 2, 3, 4]
export default class Settings {
    depth = -1
    starting = 1
    round = 1
    openDialog = false
    banner = 'Round 1'
    selected = undefined
    board = new Board()

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
        this.gameResult = val
    }

    setSelected(point) {

    }
}
