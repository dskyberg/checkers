/**
 * Checkers can be white or black and can be king or not king
 *
 */
import React from 'react'

const viewSize = 128
const xy = viewSize / 2

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
    for(let degrees = 0; degrees < 360; degrees += 20){
        rs.push(
            {
                start: findPoint(xy, xy, xy, degrees),
                end: findPoint(xy, xy, xy - 20, degrees)
            }
        )
    }
    return rs
}

const KingCrown = ({colorSecondary, colorPrimary}) => {
    return (
        <React.Fragment>
            <path
                d="M40,90 a40,40 0 0,1 48,0 l5,-30 l-15,15 l-14,-40 l-14,40 l-15,-15 z"
                strokeWidth={4}
                stroke={colorSecondary}
                fill="transparent"
            />
            <circle cx={35} cy={60} r={8} fill={colorSecondary} />
            <circle cx={64} cy={35} r={8} fill={colorSecondary} />
            <circle cx={93} cy={60} r={8} fill={colorSecondary} />
        </React.Fragment>
    )
}

const Checker = (props) => {
    const { player, svgStyle, isKing, colors} = props
    const colorPrimary = colors[player].primary
    const colorSecondary = colors[player].secondary

    return (
        <svg viewBox="0 0 128 128" style={svgStyle}>
            <circle
                cx={xy}
                cy={xy}
                r={xy - 2}
                fill={colorPrimary}
                stroke={colorSecondary}
                strokeWidth={2}
            />
            <circle
                cx={xy}
                cy={xy}
                r={xy - 20}
                stroke={colorSecondary}
                fill={colorPrimary}
                strokeWidth={4}
            />
            {rays().map((ray, idx) =>
                <line key={`ray-${idx}`}
                    x1={ray.start.x} y1={ray.start.y}
                    x2={ray.end.x} y2={ray.end.y}
                    strokeWidth={4}
                    stroke={colorSecondary}
                />
            )}
            {isKing && <KingCrown colorPrimary={colorPrimary} colorSecondary={colorSecondary} /> }
        </svg>
    )
}
export default Checker