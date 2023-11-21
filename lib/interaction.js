import { createContext } from 'preact'

export const initialValue = () => ({
    isDone: true,
    done: () => {
        this.isDone = true
        console.log('done')
    },
    reset: () => { 
        this.isDone = false
    } 
})

export default createContext(initialValue())
