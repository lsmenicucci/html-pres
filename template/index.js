// hot reload
if (window.location.hostname === 'localhost') {
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

    ws.addEventListener('open', () => {
        const stateStr = localStorage.getItem('state')
        if (stateStr) {
            const state = JSON.parse(stateStr)
            currentSlide = state.currentSlide
            currentSlide = Math.min(currentSlide, slides.length - 1)

            focusSlide(currentSlide)
        }
    })
}

const slides = [...document.querySelectorAll('presentation-slide')]
let currentSlide = 0

// load state from local storage
const saveState = () => {
    const state = {
        currentSlide,
        currentSlideStep: slides[currentSlide].currentStep,
    }

    localStorage.setItem('state', JSON.stringify(state))
}

// presentation driver
const nextSlide = () => {
    if (slides[currentSlide].hasNextStep()) {
        slides[currentSlide].nextStep()
        return
    }

    if (currentSlide < slides.length - 1) {
        slides[currentSlide + 1].reset()
        focusSlide(currentSlide + 1)
    }
}

const prevSlide = () => {
    if (currentSlide > 0) {
        slides[currentSlide].reset()
        focusSlide(currentSlide - 1)
    }
}

function focusSlide(index) {
    // scroll to slide
    slides[index].scrollIntoView({
        block: 'center',
        inline: 'nearest',
    })

    currentSlide = index

    // save state in local storage
    saveState()
}

// fix scrolling when resize
let scrollTimeout = null
window.addEventListener('resize', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout)
    }
    
    scrollTimeout = setTimeout(() => {
        slides[currentSlide].scrollIntoView({
            block: 'center', 
            inline: 'nearest', 
        })
    }, 501)
})

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

// setup touch navigation
const BACK_REGION = 0.3
document.addEventListener('touchstart', (e) => {
    const touch = e.touches[0]
    const x = touch.clientX

    const width = window.innerWidth

    if (x < width * BACK_REGION) {
        prevSlide()
    } else {
        nextSlide()
    }
})

// export slides as SVG
const exportSlides = () => {
    // TODO: TBI
    return
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = 1
})
