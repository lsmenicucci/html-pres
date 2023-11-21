import { useState, useEffect, useContext } from 'preact/hooks'
import { createContext } from 'preact'
import classNames from 'classnames'

const ORIGINAL_WIDTH = 1920
const ORIGINAL_HEIGHT = 900
const DEFAULT_VH_MARGIN = 0.025

// load from local storage
const loadSlideDims = () => {
    const slideDims = JSON.parse(localStorage.getItem('slideDims'))
    if (slideDims) {
        return slideDims
    }

    return {
        scale: 1,
        xmargin: 0,
        ymargin: 0,
    }
}

// save to local storage 
const saveSlideDims = (slideDims) => {
    localStorage.setItem('slideDims', JSON.stringify(slideDims))
}


const useResponsiveSlide = () => {
    const [scale, setScale] = useState(loadSlideDims().scale)
    const [xmargin, setxMargin] = useState(loadSlideDims().xmargin)
    const [ymargin, setyMargin] = useState(loadSlideDims().ymargin)

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
        saveSlideDims({ scale, xmargin, ymargin })
    }, [scale, xmargin, ymargin])

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return { width, height, scale, xmargin, ymargin }
}

export default ({ children, className, title, ...props }) => {
    const { width, height, scale, xmargin, ymargin } = useResponsiveSlide()

    useEffect(() => {
        console.log('rendering slide')
    }, [children])

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
