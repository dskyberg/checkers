import React from "react";
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import { headerMargin, NUM_SQUARES, MAX_ROW_COL, borderWidth } from '../constants'
import Point from '../classes/Point'
import Move from '../classes/Move'

import makeStyles from '@material-ui/styles/makeStyles';
import BoardSquare from './BoardSquare'

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        width: NUM_SQUARES * MAX_ROW_COL + borderWidth * 2,
        height: NUM_SQUARES * MAX_ROW_COL + borderWidth * 2,
        marginTop: headerMargin,
        backgroundColor: "black",//"#efefef",
    },
    frame: {
        borderStyle: 'solid',
        borderSize: 1,
    },
}));


const BoardView = observer(function BoardView() {
    const classes = useStyles()
    const { settings } = useStore()
    // TODO: figure out why I need this in order to render after black moves
    const [result, setResult] = React.useState(null)
    const { board, selected, superUser } = settings


    const handleSquareClick = (point) => {
        manageSelections(point)
    }

    const handleSuperUser = (point) => {
        settings.addSelected(point)
        settings.setOpenSuperUserDialog(true)
    }

    const manageSelections = (point) => {
        // If superUser mode is on, just do that
        if (superUser) {
            handleSuperUser(point)
            return
        }

        // Is this the beginning of a move?
        if (selected === undefined || selected === null) {
            // Nothing selected yet. Pick a checker
            if (settings.board.isPlayerChecker(settings.currentPlayer, point)) {
                settings.addSelected(point)
            }
        }

        // If the starting checker is clicked again, clear the selection
        else if (point.equals(selected[0])) {
            settings.clearSelected(undefined)
        }

        // If this is the last selected square, then commit the move
        else if (point.equals(selected[selected.length - 1])) {
            settings.makeMoves().then((result)=>{setResult(result)})
            settings.makeComputerMove().then((result) => {
                setResult(result)
            })
        }
        // Is the user adding a jump?
        else if (settings.board.isValidMove(settings.currentPlayer, new Move(selected[0], point))) {
            settings.addSelected(point)
        }
    }

    const buildGrid = (NUM_SQUARES, MAX_ROW_COL) => {
        const squares = []
        for (let row = 0; row < MAX_ROW_COL; row++) {
            for (let col = 0; col < MAX_ROW_COL; col++) {
                const id = `${row}_${col}`
                const point = new Point(col, row)
                squares.push(
                    <BoardSquare
                        key={id}
                        size={NUM_SQUARES}
                        point={point}
                        selected={point.in(selected)}
                        state={settings.board.getSquare(point)}
                        onClick={handleSquareClick}
                    />
                )
            }
        }
        return squares
    }

    return (
        <div id="BoardView" className={classes.root} >
            {buildGrid(NUM_SQUARES, MAX_ROW_COL)}
        </div>
    )
})
export default BoardView;