import { render } from 'preact'
import { useState, useEffect, useContext, useMemo } from 'preact/hooks'
import slides from '@entry'
import interactionCtx from './lib/interaction'

// check if is dev
const isDev = process.env.NODE_ENV !== 'production'

const useDevPersist = (key, val, setVal) => {
    useEffect(() => {
        if (isDev) {
            const state = JSON.parse(localStorage.getItem('state'))
            if (state) {
                setVal(state[key])
            }
        }
    }, [])

    useEffect(() => {
        if (isDev) {
            localStorage.setItem('state', JSON.stringify({ [key]: val }))
        }
    }, [val])
}

const App = () => {
    const interaction = useContext(interactionCtx)
    const [slideIdx, setSlideIdx] = useState(0)

    // load state if is dev
    useDevPersist('slideIdx', slideIdx, setSlideIdx)

    useEffect(() => {
        interaction.slideIdx = slideIdx 
        interaction.isDone = true
    }, [slideIdx])

    useEffect(() => {
        const next = () => {
            console.log('next', interaction.isDone)
            if (interaction.isDone && slideIdx < slides.length - 1) {
                setSlideIdx(slideIdx + 1)
            }
        }

        const prev = () => {
            if (slideIdx > 0) {
                setSlideIdx(slideIdx - 1)
            }
        }

        const handler = (e) => {
            if (e.key === 'ArrowRight') next()
            if (e.key === 'ArrowLeft') prev()
        }

        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [slideIdx])

    const Slide = useMemo(() => {
        const Slide = slides[slideIdx]
        return () => <Slide />
    })

    return <Slide />
}

console.log('rendering')
render(<App />, document.body)
