import React, { useEffect, useRef } from 'react'

export const useFocusInput = () => {
    const input = useRef(null)
    useEffect(() => {
        if (input.current) {
            input.current.focus()
        }
    }, [input.current])

    return input
}

export const useInterval = (callback, delay) => {
    const saveCallback = useRef()
    useEffect(() => {
        saveCallback.current = callback
    }, [callback])

    useEffect(() => {
        const handleCounter = () => {
            saveCallback.current()
        }
        if (delay !== null) {
            const clear = setInterval(handleCounter, delay)
            return () => clearInterval(clear)
        }
    }, [delay])
}