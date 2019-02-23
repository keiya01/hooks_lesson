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