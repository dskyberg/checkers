import { action, makeObservable, observable } from "mobx"
import Board from '../classes/Board'
import Player from '../classes/Player'
import Square from '../classes/Square'
import {SIDE_NAME} from '../classes/Player'


const depths = [-1, 1, 2, 3, 4]
export default class Settings {
    superUser = false
    depth = -1
    playerWhite = new Player(Player.WHITE)
    playerBlack = new Player(Player.BLACK)
    round = 1
    openDialog = false
    openSuperUserDialog = false
    openColorPicker = false
    selected = undefined
    board = new Board()
    starting = 0// 0 == human, 1 == AI
    currentPlayer = this.playerWhite
    banner = `${SIDE_NAME[this.currentPlayer.side]}'s turn`

    constructor() {
        makeObservable(this, {
            superUser: observable,
            depth: observable,
            starting: observable,
            round: observable,
            openDialog: observable,
            openSuperUserDialog: observable,
            openColorPicker: observable,
            banner: observable,
            selected: observable,
            board: observable,
            toggleSuperUser: action,
            getStorage: action,
            setDepth: action,
            setStarting: action,
            setRound: action,
            nextRound: action,
            setOpenDialog: action,
            setOpenSuperUserDialog: action,
            setOpenColorPicker: action,
            setBanner: action,
            addSelected: action,
            clearSelected: action,
            turnOver: action,
            reset: action,
            makeComputerMove: action,
            setSquare: action,
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

    toggleSuperUser() {
        if(!this.superUser) {
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

    setOpenDialog(value) {
        this.openDialog = value;
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
        this.superUser = false
        this.board = new Board()
        this.playerWhite = new Player(Player.WHITE)
        this.playerBlack = new Player(Player.BLACK)
        this.currentPlayer = this.starting === 0 ? this.playerWhite : this.playerBlack
        this.round = 1
        this.selected = undefined
        this.setBanner(`${SIDE_NAME[this.currentPlayer.side]}'s turn`)

    }
    //TODO: Figure out where to put this.  Should it be a class attribute?
    skippingPoint = null

    makeComputerMove() {
        /*
        const m = this.minimaxStart(this.board, this.depth, this.currentPlayer, true);
        const decision = this.board.makeMove(m, this.currentPlayer);
        if(decision === Board.Decision.ADDITIONAL_MOVE)
            this.skippingPoint = m.end

        //System.out.println("Pruned tree: " + pruned + " times");
        return decision;
        */
       this.currentPlayer.makeAIMove(this.board)
    }

    setSquare(point, side, isKing ){
        this.board.setSquare(new Square(point, true, side, isKing))
    }
}
