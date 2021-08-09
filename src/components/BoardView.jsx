import React from "react";
import {observer} from 'mobx-react-lite'
import {useStore} from '../store'
import {headerMargin, NUM_SQUARES, MAX_ROW_COL, borderWidth} from '../constants'
import Point from '../classes/Point'
import Move from '../classes/Move'

import { makeStyles } from "@material-ui/core/styles";
import BoardCell from './BoardCell'

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


const BoardView = observer(() => {
    const classes = useStyles()
    const {settings} = useStore()
    const {board, currentPlayer} = settings
    const [selected, setSelected] = React.useState()


    const handleCellClick = (point) => {
        manageSelections(point)
    }

    const manageSelections = (point) => {
        // Is this the beginning of a move?
        if(selected === undefined || selected === null) {
            // Nothing selected yet. Pick a checker
            if(board.isPlayerChecker(currentPlayer, point)) {
                setSelected([point])
            }
        }

        // If the starting checker is clicked again, clear the selection
        else if(point.equals(selected[0])) {
            setSelected(undefined)
        }

        // If this is the last selected cell, then commit the move
        else if(point.equals(selected[selected.length - 1])) {
            let lastPoint = null
            selected.forEach(point => {
                if(lastPoint === null) {
                    lastPoint = point
                    return
                }
                const move = new Move(lastPoint, point)
                lastPoint = point
                console.log('Making move:', move)
                board.makeMove(move)
            })
            setSelected(undefined)
            settings.turnOver()
        }
        // Is the user adding a jump?
        else if(board.isValidMove(currentPlayer, selected[0], point)) {
            const newSelected = [...selected, point]
            setSelected(newSelected)
        }
    }

    const buildGrid = (NUM_SQUARES, MAX_ROW_COL) => {
        const cells = []
        for (let row = 0; row < MAX_ROW_COL; row++) {
            for (let col = 0; col < MAX_ROW_COL; col++) {
                const id = `${row}_${col}`
                const point = new Point(col,row)
                cells.push(
                    <BoardCell
                        key={id}
                        size={NUM_SQUARES}
                        point={point}
                        selected={point.in(selected)}
                        state={board.getCell(new Point(col,row))}
                        onClick={handleCellClick}
                    />
                )
            }
        }
        return cells
    }

    return (
        <div id="BoardView" className={classes.root} >
            {buildGrid(NUM_SQUARES, MAX_ROW_COL)}
        </div>
    )
})
export default BoardView;