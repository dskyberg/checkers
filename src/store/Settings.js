import { action, makeObservable, observable, values } from "mobx"
import Dexie from 'dexie';
import Board from '../classes/Board'
import Player from '../classes/Player'
import Square from '../classes/Square'
import Move from '../classes/Move'

import { SIDE_NAME } from '../classes/Player'

const IDB_SCHEMA = {
    db: 'checkers',
    version: 1,
    schema: '++id, starting, depth',
}

const depths = [-1, 1, 2, 3, 4]
export default class Settings {
    dexie = new Dexie(IDB_SCHEMA.db)

    superUser = false
    depth = -1
    playerWhite = new Player(Player.WHITE)
    playerBlack = new Player(Player.BLACK)
    round = 1
    openNewGameDialog = false
    openSettingsDialog = false
    openSuperUserDialog = false
    openColorPicker = false
    selected = undefined
    board = new Board()
    starting = 0// 0 == human, 1 == AI
    currentPlayer = this.playerWhite
    banner = `${SIDE_NAME[this.currentPlayer.side]}'s turn`
    history = []

    constructor() {
        makeObservable(this, {
            superUser: observable,
            depth: observable,
            starting: observable,
            round: observable,
            openNewGameDialog: observable,
            openSettingsDialog: observable,
            openSuperUserDialog: observable,
            openColorPicker: observable,
            banner: observable,
            selected: observable,
            board: observable,
            history: observable,
            toggleSuperUser: action,
            getStorage: action,
            setDepth: action,
            setStarting: action,
            setRound: action,
            nextRound: action,
            setOpenNewGameDialog: action,
            setOpenSettingsDialog: action,
            setOpenSuperUserDialog: action,
            setOpenColorPicker: action,
            setBanner: action,
            addSelected: action,
            clearSelected: action,
            turnOver: action,
            reset: action,
            makeMoves: action,
            makeComputerMove: action,
            setSquare: action,
        })
        this.dexie.version(IDB_SCHEMA.version).stores({ settings: IDB_SCHEMA.schema });
        this.getStorage()
    }

    async setStorage() {
        /*
        localStorage.setItem('settings', JSON.stringify({
            depth: this.depth,
            starting: this.starting
        }))
        */
        await this.dexie['settings'].put({ depth: this.depth, starting: this.starting }, 1)
        console.log('put IDB')
    }


    async getStorage() {
        /*
        const settingsTxt = localStorage.getItem('settings')
        if(settingsTxt !== null) {
            const settings = JSON.parse(settingsTxt)
            this.depth = settings.depth
            this.starting = settings.starting
        }
        */
        const js = await this.dexie['settings'].get(1)
        if (js === undefined) {
            console.log('IDB not found')
        } else {
            console.log('IDB found:', js)
            this.starting = js.starting
            this.depth = js.depth
        }
    }

    toggleSuperUser() {
        if (!this.superUser) {
            // Enabling superUser mode, to be able to place pieces manually
            console.log('Enable superuser')
            this.board = new Board([])
        }
        this.superUser = !this.superUser
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

    setOpenNewGameDialog(value) {
        this.openNewGameDialog = value;
    }

    setOpenSettingsDialog(value) {
        this.openSettingsDialog = value
    }

    setOpenSuperUserDialog(value) {
        this.openSuperUserDialog = value;
    }

    setOpenColorPicker(value) {
        this.openColorPicker = value
    }

    setBanner(val) {
        this.banner = val
    }

    addSelected(point) {
        if (this.selected === undefined) {
            this.selected = [point]
        }
        else {
            this.selected = [...this.selected, point]
        }
    }

    clearSelected() {
        this.selected = undefined
    }

    turnOver() {
        this.currentPlayer = this.currentPlayer.side === Player.WHITE ? this.playerBlack : this.playerWhite
        this.round += 1
        this.selected = undefined
        this.setBanner(`${SIDE_NAME[this.currentPlayer.side]}'s turn`)
        return this.currentPlayer.side
    }

    reset() {
        this.superUser = false
        this.board = new Board()
        this.playerWhite = new Player(Player.WHITE)
        this.playerBlack = new Player(Player.BLACK)
        this.currentPlayer = this.starting === 0 ? this.playerWhite : this.playerBlack
        this.round = 1
        this.selected = undefined
        this.setBanner(`${SIDE_NAME[this.currentPlayer.side]}'s turn`)

    }

    makeMoves() {
        return new Promise((resolve, reject) => {
            if (this.selected === undefined || this.selected === null || this.selected.length < 2) {
                // Nothing to do
                reject()
            }
            const history = []
            for (let i = 1; i < this.selected.length; i++) {
                const move = new Move(this.selected[i - 1], this.selected[i])
                history.push(this.board.makeMove(move))
            }
            this.history = [...this.history, history]
            const result = this.board.evaluate()
            this.clearSelected()
            this.turnOver()
            resolve(result)
        })
    }

    //TODO: Figure out where to put this.  Should it be a class attribute?
    skippingPoint = null
    makeComputerMove() {
        return new Promise(async (resolve, reject) => {
            await sleep(1000)
            this.currentPlayer.makeAIMove(this.board)
            this.turnOver()
            resolve()
        })
    }

    setSquare(point, side, isKing) {
        this.board.setSquare(new Square(point, true, side, isKing))
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}