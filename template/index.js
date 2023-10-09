//const domToSvg = await import('https://cdn.skypack.dev/dom-to-svg')
//const pdfkit = await import('https://unpkg.com/pdfkit@0.13/js/pdfkit.standalone.js')

const slides = [...document.querySelectorAll('section')]
let currentSlide = 0

const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
        focusSlide(currentSlide + 1)
    }
}

const prevSlide = () => {
    if (currentSlide > 0) {
        focusSlide(currentSlide - 1)
    }
}

function focusSlide(index) {
    console.log('focusSlide', index)

    // scroll to slide
    slides[index].scrollIntoView({
        block: 'start',
        inline: 'nearest',
    })

    currentSlide = index
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
