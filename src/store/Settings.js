import { action, makeObservable, observable } from "mobx"
import Board from '../classes/Board'
import Player from '../classes/Player'
import {SIDE_NAME} from '../classes/Player'


const depths = [-1, 1, 2, 3, 4]
export default class Settings {
    depth = -1
    playerWhite = new Player(Player.WHITE)
    playerBlack = new Player(Player.BLACK)
    round = 1
    openDialog = false
    openColorPicker = false
    selected = undefined
    board = new Board()
    starting = 0// 0 == human, 1 == AI
    currentPlayer = this.playerWhite
    banner = `${SIDE_NAME[this.currentPlayer.side]}'s turn`

    constructor() {
        makeObservable(this, {
            depth: observable,
            starting: observable,
            round: observable,
            openDialog: observable,
            openColorPicker: observable,
            banner: observable,
            selected: observable,
            board: observable,
            getStorage: action,
            setDepth: action,
            setStarting: action,
            setRound: action,
            nextRound: action,
            setOpenDialog: action,
            setOpenColorPicker: action,
            setBanner: action,
            addSelected: action,
            clearSelected: action,
            turnOver: action,
            reset: action,
        })
        this.getStorage()
    }

    setStorage() {
        localStorage.setItem('settings', JSON.stringify({
            depth: this.depth,
            starting: this.starting
        }))
    }

    getStorage() {
        const settingsTxt = localStorage.getItem('settings')
        if(settingsTxt !== null) {
            const settings = JSON.parse(settingsTxt)
            this.depth = settings.depth
            this.starting = settings.starting
        }
    }

    setDepth(value) {
        if (value in depths) {
            this.depth = value
        }
        this.setStorage()
    }

    /**
     * Determines whether the human player or the computer (AI) starts the game
     * @param {number} value Either 0 for human, or 1 for computer
     */
    setStarting(value) {
        if (value === 0 || value === 1) {
            this.starting = value
        }
        this.setStorage()
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

    setOpenColorPicker(value) {
        this.openColorPicker = value
    }

    setBanner(val) {
        this.banner = val
    }

    addSelected(point) {
        if(this.selected === undefined){
            this.selected = [point]
        }
        else {
            this.selected = [...this.selected, point]
        }
    }

    clearSelected(){
        this.selected = undefined
    }

    turnOver() {
        this.currentPlayer = this.currentPlayer.side === Player.WHITE ? this.playerBlack : this.playerWhite
        this.round += 1
        this.selected = undefined
        this.setBanner(`${SIDE_NAME[this.currentPlayer.side]}'s turn`)
    }

    reset() {
        this.board = new Board()
        this.playerWhite = new Player(Player.WHITE)
        this.playerBlack = new Player(Player.BLACK)
        this.currentPlayer = this.starting === 0 ? this.playerWhite : this.playerBlack
        this.round = 1
        this.selected = undefined
        this.setBanner(`${SIDE_NAME[this.currentPlayer.side]}'s turn`)

    }
}
