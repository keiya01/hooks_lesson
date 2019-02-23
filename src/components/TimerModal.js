import * as React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useFocusInput } from '../hooks';

const { useState, useEffect, useRef } = React

const useResetDuration = (reset, timer, visible) => {
    // timer関連のアクションが起きたら入力値をリセット
    useEffect(() => {
        reset()
    }, [timer])

    // modalの表示・非表示が行われたらリセット
    useEffect(() => {
        reset()
    }, [visible])
}

const useTimer = (callback, isStart, delay) => {
    const saveCallback = useRef()
    useEffect(() => {
        saveCallback.current = callback
    }, [callback])

    useEffect(() => {
        const handleCounter = () => {
            saveCallback.current()
        }
        if (isStart) {
            const clear = setInterval(handleCounter, delay)
            return () => clearInterval(clear)
        }
    }, [isStart])
}

export default function TimerModal(props) {
    const {
        visible,
        setVisible
    } = props

    const [, forceUpdate] = useState(false)
    const [timer, setTimer] = useState({
        isStart: false,
        duration: 0,
    })
    const [duration, setDuration] = useState({
        value: '',
        error: {
            isError: false,
            message: ''
        }
    })
    const startButton = useRef(null)
    const settingInput = useFocusInput()

    useTimer(() => {
        setTimer({
            ...timer,
            duration: timer.duration - 1
        })

        if (timer.duration === 1) {
            setTimer({
                ...timer,
                isStart: false
            })
            return
        }
    }, timer.isStart, 60000)

    useResetDuration(() => {
        setDuration(prevDuration => ({
            ...prevDuration,
            value: '',
            error: {
                isError: false,
                message: ''
            }
        }))
    }, timer, visible)

    const handleOnInvisible = () => {
        setVisible(false)
    }

    const handleSetDuration = event => {
        const inputValue = event.target.value

        const nextDuration = parseInt(inputValue, 10)

        if (nextDuration > 60) {
            setDuration(prevDuration => ({
                ...prevDuration,
                value: prevDuration.value,
            }))
            return
        }

        setDuration(duration => ({
            ...duration,
            value: inputValue
        }))
    }

    const handleOnKeyDown = event => {
        if (event.keyCode === 13) {
            startButton.current.click()
        }
    }

    const handleOnStart = () => {
        const parsedDuration = parseInt(duration.value, 10)
        if (!parsedDuration) {
            setDuration(prevDuration => ({
                ...prevDuration,
                error: {
                    isError: true,
                    message: '制限時間を入力してください'
                }
            }))
            return
        }

        setTimer(timer => ({
            ...timer,
            isStart: true,
            duration: parsedDuration
        }))
    }

    const handleOnStop = () => {
        setTimer(timer => ({
            ...timer,
            isStart: false
        }))

    }

    const handleFocusInput = elem => {
        settingInput.current = elem
        forceUpdate(update => !update)
    }

    const setActiveStyle = (activeState) => (timer.isStart === activeState) && 'activeButton'
    const title = timer.isStart ? 'TODOを終えてください' : '制限時間を決める'

    if (!visible) {
        return null
    }
    return (
        <div className={css(styles.timerModalContainer)}>
            <div className={css(styles.hideContainer)} onClick={handleOnInvisible} />
            <div className={css(styles.timerModal)}>
                <h3 className={css(styles.timerModalTitle)}>{title}</h3>
                <div className={css(styles.timer)}>
                    {
                        timer.isStart
                            ?
                            <h3 className={css(styles.duration)}>{timer.duration}</h3>
                            :
                            <>
                                <div className={css(styles.errorContainer)}>
                                    <p style={{ fontSize: 16, color: '#999', letterSpacing: '0.1em' }}>60分以内で入力してください</p>
                                    {duration.error.isError && <p className={css(styles.errorMessage)}>{duration.error.message}</p>}
                                </div>
                                <input
                                    ref={handleFocusInput}
                                    className={css(styles.settingInput)}
                                    placeholder='制限時間'
                                    type='number'
                                    value={duration.value}
                                    onChange={handleSetDuration}
                                    onKeyDown={handleOnKeyDown} />
                            </>
                    }
                    <p className={css(styles.timerUnit)}>min</p>
                </div>
                <div className={css(styles.timerButtonContainer)}>
                    <button
                        className={css(styles.startButton, styles.timerButton, styles[setActiveStyle(true)])}
                        onClick={handleOnStart}
                        ref={startButton}>
                        スタート
                    </button>
                    <button
                        className={css(styles.stopButton, styles.timerButton, styles[setActiveStyle(false)])}
                        onClick={handleOnStop}>
                        ストップ
                    </button>
                </div>
            </div>
        </div>
    )
}

const modalSlideDown = [
    {
        '0%': {
            transform: 'translateY(-90%)'
        },
        '50%': {
            transform: 'translateY(5%)'
        },
        '100%': {
            transform: 'translateY(0%)'
        }
    }
]

const styles = StyleSheet.create({
    timerModalContainer: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    hideContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
    },
    timerModal: {
        display: 'inline-block',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '90%',
        maxWidth: 480,
        height: 500,
        margin: 'auto',
        backgroundColor: '#fff',
        padding: '10px 20px',
        borderRadius: 20,
        animationDuration: '800ms',
        animationTimingFunction: 'easy',
        animationName: modalSlideDown,
    },
    timerModalTitle: {
        textAlign: 'center',
        fontSize: 26,
        color: '#6088C6',
        marginTop: 50
    },
    errorContainer: {
        width: '100%',
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: 'tomato',
        letterSpacing: '0.1em'
    },
    timer: {
        height: 250,
        textAlign: 'center',
        paddingTop: 60
    },
    settingInput: {
        display: 'inline-block',
        width: 100,
        fontSize: 30,
        color: '#555',
        letterSpacing: '0.2em',
        borderBottom: '1px solid #c0c0c0',
        marginRight: 15,
        textAlign: 'center',
        padding: '20px 5px',
        '::placeholder': {
            color: '#ccc',
            textAlign: 'center',
            fontSize: 17
        },
        '::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
        },
        '::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
        },
    },
    duration: {
        display: 'inline-block',
        width: 120,
        textAlign: 'center',
        fontSize: 50,
        color: '#555',
        letterSpacing: '0.2em',
        marginTop: 40,
        marginRight: 15,
    },
    timerUnit: {
        display: 'inline-block',
        fontSize: 23,
        fontWeight: 'bold',
        color: '#999',
        marginLeft: 10
    },
    timerButtonContainer: {
        width: '100%',
        textAlign: 'center',
        marginTop: 30,
    },
    timerButton: {
        padding: '10px 20px',
        fontSize: 20,
        color: '#fff',
        borderRadius: 5,
        boxShadow: '0 0 5px #999',
        ':active': {
            boxShadow: 'none',
            transform: 'translateY(1px)'
        },
        '@media(max-width: 450px)': {
            padding: '8px 0',
            width: '100%',
            borderRadius: 50,
            margin: '0 auto',
            marginBottom: 20,
            display: 'block',
            fontSize: 16,
            boxShadow: 'none',
            ':active': {
                boxShadow: 'none',
                transform: 'none'
            },
        }
    },
    startButton: {
        backgroundColor: '#6699FF',
        marginRight: 60,
    },
    stopButton: {
        backgroundColor: '#EB8686'
    },
    activeButton: {
        backgroundColor: '#c0c0c0',
        boxShadow: 'none',
        transform: 'translateY(1px)'
    }
})