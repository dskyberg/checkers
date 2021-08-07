import React from "react";
import clsx from 'clsx'
import { makeStyles } from "@material-ui/core/styles";
import {red, teal} from '@material-ui/core/colors'
import { isEven, isOdd } from '../utils/isEven'
import Checker from './Checker'
import {NUM_SQUARES, borderWidth} from '../constants'
import Player from "../classes/Player";

const playableCell = (point) => (isEven(point.y) && isOdd(point.x)) || (isOdd(point.y) && isEven(point.x))

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        backgroundColor: 'white',
    },
    odd: {
        backgroundColor: red[700],
    },
    selected: {
        backgroundColor: teal[300],
    },
}));


const BoardCell = (props) => {
    const { point, state, selected, onClick } = props
    const classes = useStyles()
    const playable = playableCell(point)
    const cls = clsx(classes.root, playable && classes.odd, selected && classes.selected)

    const svgStyle = {
        height: NUM_SQUARES - 10, width: NUM_SQUARES - 10,
        marginTop: 5, marginLeft: 5,
        pointerEvents: 'none'
    }

    const handleClick = event => {
        onClick(point)
    }
    return (
        <div
            id={`board_cell-${point.y}_${point.x}`}
            className={cls}
            style={{ width: NUM_SQUARES, height: NUM_SQUARES, top: point.y * NUM_SQUARES + borderWidth, left: point.x * NUM_SQUARES + borderWidth }}
            onClick={handleClick}
        >
            {(state && state.playable && state.side !== Player.EMPTY) &&
                <Checker player={state.side} isKing={state.isKing} svgStyle={svgStyle}/>
            }
        </div>

    )
}



export default BoardCell;