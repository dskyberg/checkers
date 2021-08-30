/**
 * Checkers can be white or black and can be king or not king.
 * This is a reactive FC that just paints a simple SVG. The colors are observable
 * via the Colors store.  The state (isKing, etc) are passed down from the
 * BoardSquare class.
 *
 */
import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store'
import { CHECKER_VIEW_SIZE, CHECKER_STROKE } from '../constants'
const xy = CHECKER_VIEW_SIZE / 2


/**
 *
 * @param {number} cx The X coordinate of the center of the circle
 * @param {number} cy The Y coordinate of the center of the circle
 * @param {number} rad The radius of the circle
 * @param {number} cornerGrad The degrees from 0 where you want the point.
 * @returns
 */
const findPoint = (cx, cy, rad, cornerGrad) => {
    const cornerRad = cornerGrad * Math.PI / 180
    const nx = Math.cos(cornerRad) * rad + cx
    const ny = Math.sin(cornerRad) * rad + cy
    return { x: nx, y: ny }
}


/**
 *  Calculate start, stop points to draw lines around the edge of the checker
 */
const rays = () => {
    const rs = []
    for (let degrees = 0; degrees < 360; degrees += 20) {
        rs.push(
            {
                start: findPoint(xy, xy, xy - CHECKER_STROKE, degrees),
                end: findPoint(xy, xy, xy * 0.8 - CHECKER_STROKE, degrees)
            }
        )
    }
    return rs
}

/**
 *  Positioning the crown
 *  arc position (x:40, y:90}, (x:128-40, 90)
 *
 * @param {*} param0
 * @returns
 */
const KingCrown = ({ colorSecondary, colorPrimary }) => {
    return (
        <React.Fragment>
            <path
                d="M40,90 q 24,-15  48,0 l5,-30 l-15,10 l-14,-30 l-14,30 l-15,-10 z"
                strokeWidth={4}
                stroke={colorSecondary}
                fill="transparent"
            />
            <circle cx={32} cy={53} r={6} fill={colorSecondary} />
            <circle cx={64} cy={33} r={6} fill={colorSecondary} />
            <circle cx={95} cy={53} r={6} fill={colorSecondary} />
        </React.Fragment>
    )
}

const Checker = observer(function Checker(props) {
    const { player, svgStyle, isKing } = props
    const { colors } = useStore()
    const colorPrimary = colors.checker[player].primary
    const colorSecondary = colors.checker[player].secondary

    return (
        <svg viewBox={`0 0 ${CHECKER_VIEW_SIZE} ${CHECKER_VIEW_SIZE}`} style={svgStyle} xmlns="http://www.w3.org/2000/svg">
            <circle
                cx={xy}
                cy={xy}
                r={xy - CHECKER_STROKE}
                fill={colorPrimary}
                stroke={colorSecondary}
                strokeWidth={CHECKER_STROKE}
            />
            <circle
                cx={xy}
                cy={xy}
                r={xy * 0.8 - CHECKER_STROKE}
                stroke={colorSecondary}
                fill={colorPrimary}
                strokeWidth={CHECKER_STROKE}
            />
            {rays().map((ray, idx) =>
                <line key={`ray-${idx}`}
                    x1={ray.start.x} y1={ray.start.y}
                    x2={ray.end.x} y2={ray.end.y}
                    strokeWidth={CHECKER_STROKE}
                    stroke={colorSecondary}
                />
            )}
            {isKing && <KingCrown colorPrimary={colorPrimary} colorSecondary={colorSecondary} />}
        </svg>
    )
})
export default Checker