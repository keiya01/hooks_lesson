import * as React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFocusInput } from '../hooks';

const { useState, useRef, useEffect, memo } = React

export default memo(function TodoItem(props) {
    const {
        completed,
        body,
        id,
        dispatch,
        type
    } = props
    const [animationFlags, setAimationFlags] = useState({
        complete: false,
        delete: false,
        check: false
    })
    const [, forceUpdate] = useState(false)
    const [editText, changeEditText] = useState(body)
    const [isEditMode, setIsEditMode] = useState(false)
    const editInput = useFocusInput(null)

    const handleFocusEditText = elem => {
        editInput.current = elem
        forceUpdate(update => !update)
    }

    const handleChangeEditText = event => {
        changeEditText(event.target.value)
    }

    // TODOアイテムをクリックされた時のアニメーションをフィルタリングタイプによって分ける
    const handleCompletedAnimation = () => {
        if (type === 'all') {
            setAimationFlags(flags => ({
                ...flags,
                complete: !completed
            }))
            dispatch({ type: 'TOGGLE_TODO', id })
        } else {
            setAimationFlags(flags => ({
                ...flags,
                check: true
            }))
            setTimeout(() => dispatch({ type: 'TOGGLE_TODO', id }), 300)
        }
    }

    const handleUpdateTodo = (event) => {
        if (event.keyCode === 13) {
            dispatch({ type: 'UPDATE_TODO', id, body: editText })
            setIsEditMode(false)
        }
    }

    const handleDeleteTodo = () => {
        setAimationFlags(flags => ({
            ...flags,
            delete: true
        }))
        setTimeout(() => dispatch({ type: 'DELETE_TODO', id }), 300)
    }

    const handleSetIsEditMode = () => {
        setIsEditMode(true)
    }

    const todoStyle = completed ? 'complete' : 'inComplete'
    const iconColor = completed ? 'blue' : '#ccc'
    const deleteAnimation = animationFlags.delete && 'deleteAnimation'
    const checkAnimation = animationFlags.check && 'checkAnimation'
    const completedAnimation = animationFlags.complete && 'completedAnimation'

    return (
        <div className={css(
            styles.todo,
            styles[todoStyle],
            styles[deleteAnimation],
            styles[checkAnimation]
        )}>
            {
                isEditMode
                    ?
                    <input
                        ref={handleFocusEditText}
                        className={css(styles.editText)}
                        value={editText}
                        onChange={handleChangeEditText}
                        onKeyDown={handleUpdateTodo} />
                    :
                    <>
                        <div
                            className={css(styles.todoItem)}
                            onClick={handleCompletedAnimation}>
                            <p className={css(styles.todoBody)}>
                                <FontAwesomeIcon
                                    icon='check-circle'
                                    className={css(styles[completedAnimation])}
                                    style={{ color: iconColor, marginRight: 10 }}
                                />
                                {body}
                            </p>
                        </div>
                        <div className={css(styles.toolsContainer)}>
                            <FontAwesomeIcon
                                icon='edit'
                                className={css(styles.editIcon)}
                                onClick={handleSetIsEditMode}
                            />
                            <FontAwesomeIcon
                                icon='trash-alt'
                                className={css(styles.trashBox)}
                                onClick={handleDeleteTodo}
                            />
                        </div>
                    </>
            }
        </div>
    )
})

const completedAnime = [
    {
        '0%': {
            transform: 'scale(0, 0)'
        },
        '20%': {
            transform: 'scale(1.3, 1.3)'
        },
        '40%': {
            transform: 'scale(1, 1)'
        },
        '80%': {
            transform: 'scale(1.1, 1.1)'
        },
        '100%': {
            transform: 'scale(1, 1)'
        }
    }
]

const deleteAnime = [
    {
        'from': {
            opacity: 1,
            transform: 'translateX(0)'
        },
        'to': {
            opacity: 0,
            display: 'none',
            transform: 'translateX(100%)'
        }
    }
]

const checkAnime = [
    {
        'from': {
            opacity: 1
        },
        'to': {
            opacity: 0
        }
    }
]

const styles = StyleSheet.create({
    todo: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        margin: '20px auto',
        ':hover': {
            backgroundColor: '#eee',
        }
    },
    inComplete: {
        borderLeft: '3px solid #FF3300',
    },
    complete: {
        borderLeft: '3px solid #136FFF',
    },
    completedAnimation: {
        animationDuration: '500ms',
        animationTimingFunction: 'easy',
        animationName: completedAnime,
    },
    todoItem: {
        display: 'flex',
        flex: 1,
        cursor: 'pointer',
        textAlign: 'left',
        padding: '10px 5px 10px 20px',
    },
    todoBody: {
        width: '100%',
        textIndent: '-1.6em',
        wordWrap: 'break-word',
        fontSize: 16,
        color: '#333',
        paddingLeft: '1em'
    },
    toolsContainer: {
        display: 'inline-block',
        cursor: 'pointer',
        marginTop: 13,
        marginRight: 10
    },
    trashBox: {
        color: '#ccc',
        marginLeft: 15,
        fontSize: 16,
        ':hover': {
            color: '#F08080'
        }
    },
    editIcon: {
        color: '#ccc',
        marginLeft: 8,
        fontSize: 16,
        ':hover': {
            color: '#90EE90'
        }
    },
    deleteAnimation: {
        animationDuration: '300ms',
        animationTimingFunction: 'ease-in-out',
        animationFillMode: 'forwards',
        animationName: deleteAnime,
    },
    checkAnimation: {
        animationDuration: '300ms',
        animationTimingFunction: 'ease',
        animationFillMode: 'forwards',
        animationName: checkAnime,
    },
    editText: {
        width: '100%',
        height: '100%',
        border: '1.5px solid #6088C6',
        padding: '5px',
        margin: '10px 10px 10px 20px',
        fontSize: 15,
        color: '#333',
        ':focus': {
            outline: 'none'
        }
    }
})
