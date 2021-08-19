/**
 * All the game colors, for enabling players to choose their own colors.
 * There are colors for the board itself, which includes light, dark, and
 * selected squares.  There are primary and secondary colors for white and
 * black checkers.
 */
import { action, makeObservable, observable, toJS } from "mobx"
import {
    red, pink, purple, deepPurple,
    indigo, blue, lightBlue, cyan, teal,
    green, lightGreen, lime, yellow, amber,
    orange, deepOrange, brown, grey
} from '@material-ui/core/colors'

export default class Colors {

    static colorSet = [
        Object.values(red),
        Object.values(pink),
        Object.values(purple),
        Object.values(deepPurple),
        Object.values(indigo),
        Object.values(blue),
        Object.values(lightBlue),
        Object.values(cyan),
        Object.values(teal),
        Object.values(green),
        Object.values(lightGreen),
        Object.values(lime),
        Object.values(yellow),
        Object.values(amber),
        Object.values(orange),
        Object.values(deepOrange),
        Object.values(brown),
        Object.values(grey),
        // Object.values(blueGrey)
    ]

    static NONE = 0
    static LIGHT_SQUARE = 1
    static DARK_SQUARE = 2
    static SELECTED_SQUARE = 3
    static WHITE_CHECKER_PRIMARY = 4
    static WHITE_CHECKER_SECONDARY = 5
    static BLACK_CHECKER_PRIMARY = 6
    static BLACK_CHECKER_SECONDARY = 7


    lightSquare = 'white'
    darkSquare = green[700]
    selectedSquare = teal[300]
    checker = [
        {},
        { primary: grey[800], secondary: grey[100] },
        { primary: grey[100], secondary: grey[800] }
    ]

    constructor() {
        makeObservable(this, {
            lightSquare: observable,
            darkSquare: observable,
            selectedSquare: observable,
            checker: observable,
            setColor: action,
            setLightSquare: action,
            setDarkSquare: action,
            setSelectedSquare: action,
            setLightChecker: action,
            setDarkChecker: action,
            checkerColors: action,
            reset: action,
        })
        const storedColorsTxt = localStorage.getItem('board-colors')
        if (storedColorsTxt != null) {
            const storedColors = JSON.parse(storedColorsTxt)
            this.lightSquare = storedColors.lightSquare
            this.darkSquare = storedColors.darkSquare
            this.selectedSquare = storedColors.selectedSquare
            this.checker = storedColors.checker
        }
    }

    storeColors() {
        const txt = JSON.stringify({
            lightSquare: toJS(this.lightSquare),
            darkSquare: toJS(this.darkSquare),
            selectedSquare: toJS(this.selectedSquare),
            checker: toJS(this.checker)
        })
        localStorage.setItem('board-colors', txt)
    }
    getColor(id) {
        if (Colors.LIGHT_SQUARE) { return this.lightSquare }
        else if (Colors.DARK_SQUARE) { return this.darkSquare }
        else if (Colors.SELECTED_SQUARE) { return this.selectedSquare }
        else if (Colors.WHITE_CHECKER_PRIMARY) { return this.checker[2].primary }
        else if (Colors.WHITE_CHECKER_SECONDARY) { return this.checker[2].secondary }
        else if (Colors.BLACK_CHECKER_PRIMARY) { return this.checker[1].primary }
        else if (Colors.BLACK_CHECKER_SECONDARY) { return this.checker[1].secondary }
        else { throw new Error(`Bad color id: ${id}`) }
    }

    setColor(id, hex) {
        if (id === Colors.LIGHT_SQUARE) { this.lightSquare = hex }
        else if (id === Colors.DARK_SQUARE) { this.darkSquare = hex }
        else if (id === Colors.SELECTED_SQUARE) { this.selectedSquare = hex }
        else if (id === Colors.WHITE_CHECKER_PRIMARY) { this.checker[2].primary = hex }
        else if (id === Colors.WHITE_CHECKER_SECONDARY) { this.checker[2].secondary = hex }
        else if (id === Colors.BLACK_CHECKER_PRIMARY) { this.checker[1].primary = hex }
        else if (id === Colors.BLACK_CHECKER_SECONDARY) { this.checker[1].secondary = hex }
        else { throw new Error(`Bad color id: ${id}`) }
    }

    setLightSquare(color) {
        this.lightSquare = color
        this.storeColors()
    }

    setDarkSquare(color) {
        this.darkSquare = color
        this.storeColors()
    }

    setSelectedSquare(color) {
        this.selectedSquare(color)
        this.storeColors()
    }

    setLightChecker(colors) {
        this.checker[2] = colors
        this.storeColors()
    }
    setDarkChecker(colors) {
        this.checker[1] = colors
        this.storeColors()
    }
    checkerColors() {
        return toJS(this.checker)
    }

    reset() {
        this.lightSquare = 'white'
        this.darkSquare = green[700]
        this.selectedSquare = teal[300]
        this.checker = [
            {},
            { primary: grey[800], secondary: grey[100] },
            { primary: grey[100], secondary: grey[800] }
        ]
        this.storeColors()
    }
}