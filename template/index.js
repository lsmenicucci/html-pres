// hot reload
const ws = new WebSocket(`ws://${window.location.host}/ws`)
ws.addEventListener('message', (event) => {
    if (event.data === 'reload') {
        // save state in local storage
        const state = {
            currentSlide,
        }
        localStorage.setItem('state', JSON.stringify(state))

        window.location.reload()
    }
})

//const domToSvg = await import('https://cdn.skypack.dev/dom-to-svg')
//const pdfkit = await import('https://unpkg.com/pdfkit@0.13/js/pdfkit.standalone.js')
const slides = [...document.querySelectorAll('presentation-slide')]
let currentSlide = 0

// slide state

// load state from local storage
const saveState = () => {
    const state = {
        currentSlide, 
        currentSlideStep: slides[currentSlide].currentStep,
    }

    localStorage.setItem('state', JSON.stringify(state)) 
}

const stateStr = localStorage.getItem('state')
if (stateStr) {
    const state = JSON.parse(stateStr)
    currentSlide = state.currentSlide 
    currentSlide = Math.min(currentSlide, slides.length - 1)

    focusSlide(currentSlide)
}


// presentation driver
const nextSlide = () => {
    if (slides[currentSlide].hasNextStep()) {
        slides[currentSlide].nextStep()
        return 
    }

    if (currentSlide < slides.length - 1) {
        focusSlide(currentSlide + 1)
    }
}

const prevSlide = () => {
    if (currentSlide > 0) {
        focusSlide(currentSlide - 1)
        slides[currentSlide].reset()
    }
}

function focusSlide(index) {
    // scroll to slide
    slides[index].scrollIntoView({
        block: 'start',
        inline: 'nearest',
    })

    currentSlide = index

    // save state in local storage
    saveState()
}

// setup arrow navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        nextSlide()
    }

    // export slides as SVG
    if (e.key === 'e') {
        e.preventDefault()
        exportSlides()
    }
})

// export slides as SVG
const exportSlides = () => {
    // TODO: TBI
    return

    console.log('exportSlides')

    const slide = slides[currentSlide]
    const svg = domToSvg.elementToSVG(slide)
    const svgString = new XMLSerializer().serializeToString(svg)

    console.log(pdfkit)
}
