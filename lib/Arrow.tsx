import { useRef, useEffect } from 'preact/hooks'
import * as d3 from 'd3'

type Direction = 'up' | 'down' | 'left' | 'right'

interface Props {
    direction?: Direction
    angle?: number
    bodyLength?: number
    bodyWidth?: number
    headLength?: number
    headWidth?: number
    color?: string
    className?: string
    animated?: boolean
    cycle?: boolean
}

// draw arrow with triangular head
export default ({
    direction = 'up',
    angle = 0,
    bodyLength = 20,
    bodyWidth = 1,
    headLength = 3,
    headWidth = 8,
    className = '',
    color = 'black',
    animated = false, 
    cycle = false
}: Props) => {
    const svgHeight = bodyLength + 2*headLength
    const svgWidth = headWidth + bodyWidth
    const svgRef = useRef(null)

    useEffect(() => { 
        const svg = d3.select(svgRef.current)
        
        // append group to svg 
        const group = svg.append('g') 


        // create body on y = 0, x = 1/2
        const body = group.append('rect')
            .attr('width', bodyWidth)
            .attr('height', bodyLength)
            .attr('fill', color)
            .attr('transform', `translate(${(svgWidth - bodyWidth) / 2 }, ${headLength})`)

        // create head on y = -headLength, x = 0
        const head = group.append('path')
            .attr('fill', color)
            .attr('d', d3.symbol().type(d3.symbolTriangle).size(headLength * headWidth))
            .attr('transform', `translate(${svgWidth/2}, ${headLength + 2})`)

        // rotate arrow according to direction 
        let rotate = direction === 'up' ? 0 : direction === 'down' ? 180 : direction === 'left' ? -90 : 90 
        rotate += angle 

        let animTransform = `translate(0, -${svgHeight})` 
        let finalTrans = `rotate(${rotate}, ${svgWidth / 2}, ${svgHeight / 2})` 

        if (animated && cycle) { 
            finalTrans += ` translate(0, ${svgHeight})` 
        }

        if (animated) {
            const trans = group.attr('transform', animTransform + " " + finalTrans)
                .transition()
                .duration(1000)
                .attr('transform', finalTrans)

        }else { 
            group.attr('transform', finalTrans)
        }

        


    }, [direction, bodyLength, bodyWidth, headLength, headWidth, color])

    return ( 
        <svg 
            className={className}
            ref={svgRef}
            height={svgHeight}
            width={svgWidth} 
            ></svg>
            )
}
