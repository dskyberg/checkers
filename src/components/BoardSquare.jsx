import React from "react";
import makeStyles from '@material-ui/styles/makeStyles';
import { isEven, isOdd } from '../utils'
import Checker from './Checker'
import {NUM_SQUARES, borderWidth} from '../constants'
import Player from "../classes/Player";
import {observer} from 'mobx-react-lite'
import {useStore} from '../store'

const playableSquare = (point) => (isEven(point.y) && isOdd(point.x)) || (isOdd(point.y) && isEven(point.x))

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'absolute',
        display: 'flex',
        alignItems: "center",
        justifyContent: "center"
    },
}));


const BoardSquare = observer(function BoardSquare(props){
    const { point, state, selected, onClick } = props
    const {colors} = useStore()
    const classes = useStyles(colors)
    const playable = playableSquare(point)
    const bgColor = playable === false ? colors.lightSquare : selected === true ? colors.selectedSquare : colors.darkSquare
    const svgStyle = {
        height: NUM_SQUARES - 8 , width: NUM_SQUARES - 8,
        pointerEvents: 'none'
    }

    const handleClick = event => {
        onClick(point)
    }

    return (
        <div
            id={`board_square-${point.y}_${point.x}`}
            className={classes.root}
            style={{backgroundColor: bgColor, width: NUM_SQUARES, height: NUM_SQUARES, top: point.y * NUM_SQUARES + borderWidth, left: point.x * NUM_SQUARES + borderWidth }}
            onClick={handleClick}
        >
            {(state && state.playable && state.side !== Player.EMPTY) &&
                <Checker player={state.side} isKing={state.isKing} svgStyle={svgStyle}/>
            }
        </div>

    )
})



export default BoardSquare;