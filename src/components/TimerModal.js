import * as React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useFocusInput, useInterval } from '../hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { useState, useEffect, useRef, memo } = React

const useResetDuration = (reset, isStarting, visible) => {
    // timer関連のアクションが起きたら入力値をリセット
    useEffect(() => {
        reset()
    }, [isStarting])

    // modalの表示・非表示が行われたらリセット
    useEffect(() => {
        reset()
    }, [visible])
}

export default memo(function TimerModal(props) {
    const {
        visible,
        setVisible,
        setIsStarting,
        isStarting,
        isHeader,
        setIsHeader
    } = props

    const [, forceUpdate] = useState(false)
    const [time, setTime] = useState(0)
    const [delay, setDelay] = useState(null)
    const [duration, setDuration] = useState({
        value: '',
        error: {
            isError: false,
            message: ''
        }
    })
    const startButton = useRef(null)
    const settingInput = useFocusInput()

    useInterval(() => {
        setTime(time - 1)

        if (time === 1) {
            setIsHeader(false)
            setDelay(null)
            return
        }
    }, delay)

    useResetDuration(() => {
        setDuration(prevDuration => ({
            ...prevDuration,
            value: '',
            error: {
                isError: false,
                message: ''
            }
        }))
    }, isStarting, visible)

    const handleInvisibleModal = () => {
        if (isStarting) {
            if (time > 0) {
                setIsHeader(true)
                return
            }
            setIsStarting(false)
        }
        setVisible(false)
    }

    const handleHideHeader = () => {
        setIsHeader(false)
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

        setIsStarting(true)
        setDelay(60000)
        setTime(parsedDuration)
    }

    const handleOnStop = () => {
        setIsStarting(false)
    }

    const handleFocusInput = elem => {
        settingInput.current = elem
        forceUpdate(update => !update)
    }

    const setTitle = () => {
        if (isStarting) {
            return time < 1 ? '時間切れです' : 'TODOを始めてください'
        }
        return 'タイマーをセットする'
    }

    const setActiveStyle = (activeState) => (isStarting === activeState) && 'activeButton'
    let title = setTitle()

    if (!visible) {
        return null
    }
    return (
        <>
            {
                isHeader
                    ?
                    <div className={css(styles.timerHeader)} onClick={handleHideHeader}>
                        <p className={css(styles.timerMessage)}>残り時間</p>
                        <h3 className={css(styles.headerDuration)}>{time}</h3>
                        <p className={css(styles.timerUnit)}>min</p>
                    </div>
                    :
                    <>
                        <div className={css(styles.hideContainer)} onClick={handleInvisibleModal} />
                        <div className={css(styles.timerModal)}>
                            <FontAwesomeIcon
                                icon='times'
                                className={css(styles.timesIcon)}
                                onClick={handleInvisibleModal}
                            />
                            <h3 className={css(styles.timerModalTitle)}>{title}</h3>
                            <div className={css(styles.timer)}>
                                {
                                    isStarting
                                        ?
                                        <h3 className={css(styles.modalDuration)}>{time}</h3>
                                        :
                                        <>
                                            <div className={css(styles.errorContainer)}>
                                                <p style={{ fontSize: 16, color: '#999', letterSpacing: '0.1em' }}>60分以内で入力してください</p>
                                                {duration.error.isError && <p className={css(styles.errorMessage)}>{duration.error.message}</p>}
                                            </div>
                                            <input
                                                ref={handleFocusInput}
                                                className={css(styles.settingInput)}
                                                placeholder='時間'
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
                    </>
            }
        </>
    )
})

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

const fadeInOut = [
    {
        '0%': {
            opacity: 0.2
        },
        '50%': {
            opacity: 1
        },
        '100%': {
            opacity: 0.2
        }
    }
]

const styles = StyleSheet.create({
    timerHeader: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        boxShadow: '0 1px 8px #ccc',
        textAlign: 'center',
        padding: '15px 0',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#eee',
            boxShadow: '0 1px 3px #ccc',
        }
    },
    timerMessage: {
        fontSize: 13,
        color: '#999',
        marginBottom: 5
    },
    headerDuration: {
        display: 'inline-block',
        fontSize: 25,
        color: 'tomato',
        letterSpacing: '0.2em',
        animationDuration: '1s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationName: fadeInOut,
    },
    hideContainer: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    timerModal: {
        display: 'inline-block',
        position: 'fixed',
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
        zIndex: 2
    },
    modalDuration: {
        display: 'inline-block',
        fontSize: 50,
        color: 'tomato',
        letterSpacing: '0.2em',
        width: 120,
        textAlign: 'center',
        marginTop: 30,
        animationDuration: '1s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationName: fadeInOut,
    },
    timesIcon: {
        position: 'absolute',
        top: 20,
        left: 20,
        fontSize: 20,
        color: '#999',
        cursor: 'pointer'
    },
    timerModalTitle: {
        textAlign: 'center',
        fontSize: 26,
        color: '#FF9900',
        marginTop: 50,
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
        padding: '20px 5px 10px 5px',
        borderRadius: 0,
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
        cursor: 'pointer',
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