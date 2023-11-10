import { render } from 'preact/compat'

const slideCfg = __SLIDES__

;(async () => {
    let slideMods = import.meta.globEager('@slides/*.jsx')
    let slideComps = Object.keys(slideMods).reduce((acc, slideName) => {
        const name = slideName.split('/').pop().split('.')[0] 
        acc[name] = slideMods[slideName].default 
        return acc 
    }, {})

    console.log("Loaded slides", slideComps)


    // check for slides not found 
    const slideNames = slideCfg.map(path => path.split('/').pop().split('.')[0])
    slideNames.forEach(slideName => {
        const name = slideName.split('/').pop().split('.')[0]
        console.log(name, slideComps)

        if (!slideComps[name]) {
            console.log(name)
            console.error(`Slide ${slideName} not found`)
        }
    })

    const App = () => {
        return (
            <>
            {slideNames.map((slideName, slide) => {
                const Slide = slideComps[slideName]
                return <Slide key={slide} />
            })}
    
            </>
        )
    }
    console.log('rendering')
    render(<App />, document.body)
})()
