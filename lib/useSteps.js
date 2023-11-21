import { useEffect, useState, useContext } from 'preact/hooks'
import interactionCtx from './interaction'

export default function useSteps(generator, autoStart = true) {
    const [iterator, setIterator] = useState(generator())
    const interaction = useContext(interactionCtx) 

    useEffect(() => {
        interaction.reset()
    }, [])

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === 'ArrowRight') {
                if (iterator == null) {
                    return 
                }

                const { done } = iterator.next()
                if (done) {
                    interaction.done()
                    setIterator(null)
                }
            }
        }

        document.addEventListener('keydown', handleKeydown)

        return () => document.removeEventListener('keydown', handleKeydown)
    }, [iterator])

    useEffect(() => {
        if (autoStart) {
            if (iterator == null) {
                return 
            }

            const { done } = iterator.next()
            if (done) {
                interaction.done()
                setIterator(null)
            }
        }
    }, [autoStart, iterator])
}
