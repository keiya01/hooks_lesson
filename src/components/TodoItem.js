import * as React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const { useState, useRef, useLayoutEffect } = React

export default function TodoItem(props) {
    const {
        completed,
        body,
        id,
        dispatch,
        type
    } = props
    const [completedAnimation, setCompletedAnimation] = useState(false)
    const [deleteAnimation, setDeleteAnimation] = useState(false)
    const [checkAnimation, setCheckAnimation] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editText, changeEditText] = useState(body)
    const editInput = useRef(null)
    const setTodoStyle = completed => completed ? 'complete' : 'notComplete'
    const setIconColor = completed => completed ? 'blue' : '#ccc'

    useLayoutEffect(() => {
        isEditMode && editInput.current.focus()
    }, [isEditMode])

    return (
        <div className={css(
            styles.todo,
            styles[setTodoStyle(completed)],
            styles[deleteAnimation && 'deleteAnimation'],
            styles[checkAnimation && 'checkAnimation']
        )}>
            {
                isEditMode
                    ?
                    <input
                        className={css(styles.editText)}
                        value={editText}
                        onChange={e => changeEditText(e.target.value)}
                        ref={editInput}
                        onKeyDown={e => {
                            if (e.keyCode === 13) {
                                dispatch({ type: 'UPDATE_TODO', id, body: editText })
                                setIsEditMode(false)
                            }
                        }} />
                    :
                    <>
                        <div
                            className={css(styles.todoItem)}
                            onClick={() => {
                                if (type === 'all') {
                                    setCompletedAnimation(() => !completed && true)
                                    dispatch({ type: 'TOGGLE_TODO', id })
                                } else {
                                    setCheckAnimation(true)
                                    setTimeout(() => dispatch({ type: 'TOGGLE_TODO', id }), 300)
                                }
                            }}>
                            <p className={css(styles.todoBody)}>
                                <FontAwesomeIcon
                                    icon='check-circle'
                                    className={css(styles[completedAnimation && 'completedAnimation'])}
                                    style={{ color: setIconColor(completed), marginRight: 10 }}
                                />
                                {body}
                            </p>
                        </div>
                        <div className={css(styles.toolsContainer)}>
                            <FontAwesomeIcon
                                icon='edit'
                                className={css(styles.editIcon)}
                                onClick={() => setIsEditMode(true)}
                            />
                            <FontAwesomeIcon
                                icon='trash-alt'
                                className={css(styles.trashBox)}
                                onClick={() => {
                                    setDeleteAnimation(true)
                                    setTimeout(() => dispatch({ type: 'DELETE_TODO', id }), 300)
                                }}
                            />
                        </div>
                    </>
            }
        </div>
    )
}

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
        padding: '5px 0px 0px 20px',
        width: '100%',
        margin: '10px auto',
    },
    notComplete: {
        borderLeft: '3px solid tomato',
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
        marginTop: 2
    },
    trashBox: {
        color: '#c0c0c0',
        marginLeft: 15,
        fontSize: 16,
        ':hover': {
            color: '#F08080'
        }
    },
    editIcon: {
        color: '#c0c0c0',
        marginLeft: 8,
        fontSize: 16,
        ':hover': {
            color: '#90EE90'
        }
    },
    deleteAnimation: {
        animationDuration: '300ms',
        animationTimingFunction: 'ease-in',
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
        fontSize: 15,
        color: '#333',
        ':focus': {
            outline: 'none'
        }
    }
})
