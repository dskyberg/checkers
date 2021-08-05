import React from "react";
import {observer} from 'mobx-react-lite'
import {useStore} from '../store'
import {headerMargin, NUM_SQUARES, MAX_ROW_COL, borderWidth} from '../constants'

import { makeStyles } from "@material-ui/core/styles";
import Point from '../classes/Point'
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
    const {board} = settings
    const [selected, setSelected] = React.useState()


    const handleCellClick = (point) => {
        manageSelections(point)
    }

    const manageSelections = (point) => {
        // Is this the beginning of a move?
        if(selected === undefined) {
            // Nothing selected yet. Pick a checker
            if(board.isPlayerChecker(point)) {
                setSelected([point])
                return
            }
        }
        // Is the user changing moves?
        if(board.isValidMove(selected[0], point)) {
            setSelected([...selected, point])
            console.log('selected:', selected)
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