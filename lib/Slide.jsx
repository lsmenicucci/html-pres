import { useState, useEffect } from 'preact/hooks'
import classNames from 'classnames'

const ORIGINAL_WIDTH = 1920
const ORIGINAL_HEIGHT = 900
const DEFAULT_VH_MARGIN = 0.025

const useResponsiveSlide = () => {
    const [scale, setScale] = useState(1)
    const [xmargin, setxMargin] = useState(0)
    const [ymargin, setyMargin] = useState(0)

    const height = ORIGINAL_HEIGHT * (1 - DEFAULT_VH_MARGIN * 2)
    const width = height * (4 / 3)

    const handleResize = () => {
        console.log('resize')

        let vw = Math.min(
            document.documentElement.clientWidth,
            screen.availWidth
        )
        let vh = Math.min(
            document.documentElement.clientHeight,
            screen.availHeight

        )

        let w = 0
        let h = 0
        let mx = 0
        let my = 0

        if (vw * (3 / 4) >= vh) {
            h = vh * (1 - DEFAULT_VH_MARGIN * 2)
            w = h * (4 / 3)
            my = DEFAULT_VH_MARGIN * vh
            mx = (vw - w) / 2
        } else {
            w = vw * (1 - DEFAULT_VH_MARGIN * 2)
            h = w * (3 / 4)
            mx = DEFAULT_VH_MARGIN * vw
            my = (vh - h) / 2
        }

        setxMargin(mx)
        setyMargin(my)
        setScale(h / height)
        console.log(vw, vh)

        console.log('resize', w, h, mx, my)
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return { width, height, scale, xmargin, ymargin }
}

export default ({ children, className, title, ...props }) => {
    const { width, height, scale, xmargin, ymargin } = useResponsiveSlide()

    return (
        <div
            className={classNames('slide', className)}
            style={{
                width, 
                height,
                transform: `scale(${scale})`,
                margin: `${ymargin}px ${xmargin}px`,
            }}
            {...props}
        >
                {title && <h2 className="-mt-8 -ml-4 pb-4">{title}</h2>}
            {children}
        </div>
    )
}
