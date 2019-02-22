import * as React from 'react';
import { StyleSheet, css } from 'aphrodite'
import TodoItem from './TodoItem'

const { useState, useEffect, useRef, useReducer, useLayoutEffect } = React

const Filters = [
  {
    type: 'all',
    name: 'すべて',
  },
  {
    type: 'incomplete',
    name: '未完了',
  },
  {
    type: 'completed',
    name: '完了',
  },
]

const initialState = {
  todos: []
}

let TodoID = 1
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO': {
      const {
        todos
      } = state
      const {
        text
      } = action
      if (text === '') {
        return {
          ...state,
          todos
        }
      }

      const todo = {
        id: TodoID,
        completed: false,
        body: text
      }

      ++TodoID

      return {
        ...state,
        todos: [
          todo,
          ...todos
        ]
      }
    }
    case 'TOGGLE_TODO': {
      const { todos } = state
      const { id } = action
      const nextTodos = todos.map(item => {
        if (item.id === id) {
          item.completed = !item.completed
        }
        return item
      })

      return {
        ...state,
        todos: nextTodos
      }
    }
    case 'UPDATE_TODO': {
      const { todos } = state
      const { id, body } = action
      const nextTodo = todos.map(item => {
        if (item.id === id) {
          item.body = body
        }
        return item
      })
      return {
        ...state,
        todos: nextTodo
      }
    }
    case 'DELETE_TODO': {
      const nextTodo = state.todos.filter(item => item.id !== action.id)
      return {
        ...state,
        todos: nextTodo
      }
    }
  }
}

const filterTodos = (todos, activeFilter) => {
  switch (activeFilter) {
    case 'completed':
      return todos.filter(todo => todo.completed === true)
    case 'incomplete':
      return todos.filter(todo => todo.completed === false)
    default:
      return todos
  }
}

export default function App() {
  const [text, changeText] = useState('')
  const [activeFilter, changeActiveFilter] = useState('all')
  const [isAddedTodo, setAddedTodo] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)
  const inputText = useRef(null)

  const {
    todos
  } = state

  const filteringTodos = filterTodos(todos, activeFilter)

  useLayoutEffect(() => {
    inputText.current.focus()
    return setAddedTodo(false)
  }, [isAddedTodo])

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.form)}>
        <input
          ref={inputText}
          className={css(styles.input)}
          placeholder='TODOを入力してEnterで追加'
          onChange={(e) => changeText(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              dispatch({ type: 'ADD_TODO', text })
              changeText('')
              setAddedTodo(true)
            }
          }}
          value={text} />
      </div>
      <div style={{ clear: 'left' }} />
      <div className={css(styles.selectContainer)}>
        {
          Filters.map(filter => {
            const backgroundColor = filter.type === activeFilter ? '#EB8686' : '#fff'
            const selected = filter.type === activeFilter && 'selected'
            const textStyle = filter.type === activeFilter ? 'selectedText' : 'selectText'
            return (
              <div
                key={filter.type}
                className={css(styles.filterBox, styles[selected])}
                style={{ backgroundColor }}
                onClick={() => changeActiveFilter(filter.type)}>
                <p className={css(styles[textStyle])}>{filter.name}</p>
              </div>
            )
          })
        }
        <div style={{ clear: 'left' }} />
      </div>
      <div className={css(styles.todosContainer)}>
        {
          filteringTodos.length === 0
            ?
            <div className={css(styles.noTodoContainer)}>
              <p>TODOがありません</p>
            </div>
            :
            <>
              {
                filteringTodos.map(todo => {
                  return (
                    <TodoItem
                      {...todo}
                      key={todo.id}
                      id={todo.id}
                      type={activeFilter}
                      dispatch={dispatch} />
                  )
                })
              }
            </>
        }
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: '100%',
    textAlign: 'center',
    margin: '20px auto',
  },
  form: {
    display: 'inline-block',
    marginTop: 100,
    width: '100%',
    height: 40,
    maxWidth: 480,
  },
  input: {
    float: 'left',
    height: '100%',
    padding: '5px 10px',
    width: '100%',
    border: '1.5px solid #AEC4E5',
    borderRadius: 6,
    fontSize: 15,
    color: '#333',
    ':focus': {
      outline: 'none',
      border: '1.5px solid #6088C6',
    },
    '::placeholder': {
      color: '#ccc',
    }
  },
  selectContainer: {
    display: 'inline-block',
    textAlign: 'center',
    margin: '0 auto',
    backgroundColor: '#fff',
    borderTop: '1px solid #EB8686',
    borderBottom: '1px solid #EB8686',
    marginTop: 50,
    marginBottom: 50,
    paddingLeft: 40,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15
  },
  filterMessage: {
    float: 'left',
    marginTop: 13,
    marginRight: 30,
    fontSize: 15,
    color: '#AEC4E5'
  },
  filterBox: {
    cursor: 'pointer',
    width: 55,
    height: 55,
    borderRadius: '50%',
    float: 'left',
    textAlign: 'center',
    marginRight: 30,
    border: '1px solid #eee',
    ':active': {
      boxShadow: 'none',
      marginTop: 0.3
    }
  },
  selected: {
    border: 'none',
    boxShadow: 'null',
  },
  selectText: {
    fontSize: 13,
    color: '#555',
    lineHeight: '55px',
  },
  selectedText: {
    fontSize: 13,
    color: '#fff',
    lineHeight: '55px',
  },
  todosContainer: {
    width: '100%',
    height: '100%',
    maxWidth: 480,
    margin: '0 auto',
  },
  noTodoContainer: {
    width: '100%',
    textAlign: 'center',
    marginTop: 50,
    ':nth-child(1n) > p': {
      color: '#c0c0c0',
      fontSize: 18
    }
  }
})