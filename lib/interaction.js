import { createContext } from 'preact'

export const initialValue = () => ({
    isDone: true,
    slideIdx: 0,
})

export default createContext(initialValue())
