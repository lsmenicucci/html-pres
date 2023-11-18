import { useEffect, useState } from 'preact/hooks'

export default function useSteps(generator, autoStart = true) {
    const [iterator, setIterator] = useState(generator())

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.key === 'ArrowRight') {
                const { done } = iterator.next()
                if (done) {
                    console.log('done')
                }
            }
        }

        document.addEventListener('keydown', handleKeydown)

        return () => document.removeEventListener('keydown', handleKeydown)
    }, [iterator])

    useEffect(() => {
        if (autoStart) {
            console.log('autoStart')
            const { done } = iterator.next()
            if (done) {
                console.log('done')
            }
        }
    }, [autoStart, iterator])
}
