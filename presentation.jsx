import { render, useEffect, useState } from 'preact/compat'
import slides from '@entry'

;(async () => {
    const [FistSlide, ...rest] = slides

    const App = () => {
        return <FistSlide />
    }

    console.log('rendering')
    render(<App />, document.body)
})()
