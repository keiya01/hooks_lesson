import * as React from 'react'
import { StyleSheet, css } from 'aphrodite'
import { useFocusInput } from '../hooks'
import TodoItem from './TodoItem'
import SelectItem from './SelectItem'
import TimerModal from './TimerModal'

const { useState, useReducer, memo } = React

const Filters = {
  ALL: 'all',
  INCOMPLETE: 'incomplete',
  COMPLETED: 'completed'
}

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

      if (body === '') {
        return {
          ...state
        }
      }

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

const AddTodoForm = memo((props) => {
  const {
    dispatch
  } = props
  const [text, changeText] = useState('')
  const inputBox = useFocusInput()

  const handleChangeText = (event) => {
    changeText(event.target.value)
  }

  const handleAddTodo = (event) => {
    if (event.keyCode === 13) {
      dispatch({ type: 'ADD_TODO', text })
      changeText('')
    }
  }

  return (
    <input
      ref={inputBox}
      className={css(styles.input)}
      placeholder='TODOを入力してEnterで追加'
      onChange={handleChangeText}
      onKeyDown={handleAddTodo}
      value={text} />
  )
})

export default function App() {
  const [activeFilter, changeActiveFilter] = useState('all')
  const [visible, setVisible] = useState(false)
  const [isStartingTimer, setIsStartingTimer] = useState(false)
  // TimerModalをHeaderに変更するフラグ
  const [isHeader, setIsHeader] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    todos
  } = state

  const onOpenModal = () => {
    if (!visible) {
      setVisible(true)
      return
    }
    setIsHeader(isHeader => !isHeader)
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

  const filteringTodos = filterTodos(todos, activeFilter)

  return (
    <>
      <TimerModal
        visible={visible}
        setVisible={setVisible}
        isStarting={isStartingTimer}
        setIsStarting={setIsStartingTimer}
        isHeader={isHeader}
        setIsHeader={setIsHeader} />
      <div className={css(styles.container)}>
        <div className={css(styles.form)}>
          <AddTodoForm dispatch={dispatch} />
        </div>
        <div className={css(styles.selectContainer)}>
          <SelectItem
            name='全て'
            color='#ddd'
            activeColor='#31444D'
            isActive={activeFilter === Filters.ALL}
            onClick={() => changeActiveFilter(Filters.ALL)}
          />
          <SelectItem
            name='未完了'
            color='#e5c2b8'
            activeColor='#FF3300'
            isActive={activeFilter === Filters.INCOMPLETE}
            onClick={() => changeActiveFilter(Filters.INCOMPLETE)}
          />
          <SelectItem
            name='完了'
            color='#b3d0ff'
            activeColor='#136FFF'
            isActive={activeFilter === Filters.COMPLETED}
            onClick={() => changeActiveFilter(Filters.COMPLETED)}
          />
          <SelectItem
            icon='clock'
            color='#ffdca8'
            activeColor='#FF9900'
            isActive={isStartingTimer}
            onClick={onOpenModal}
            iconSize={26}
          />
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
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    maxWidth: 700,
    height: '100%',
    textAlign: 'center',
    margin: '20px auto',
  },
  form: {
    display: 'inline-block',
    marginTop: 100,
    width: '100%',
    height: 40,
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
    borderTop: '1px solid #ccc',
    borderBottom: '1px solid #ccc',
    marginTop: 70,
    marginBottom: 30,
    paddingLeft: 40,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    '@media(max-width: 450px)': {
      paddingLeft: 30
    }
  },
  todosContainer: {
    width: '100%',
    height: '100%',
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
