import { NextPage } from 'next'
import Error from 'next/error'
import React, { useCallback, useState } from 'react'
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
} from '../generated/graphql'
import styles from './index.module.css'

type Todo = {
  onClick: (action: 'addTodo' | 'deleteTodo' | 'done', todoId: number) => any
}

const Index: NextPage = () => {
  const { data, loading, error, refetch } = useGetTodosQuery()
  const [title, setTitle] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [addTodoMutation] = useAddTodoMutation()
  const [deleteTodoMutation] = useDeleteTodoMutation()

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value)
    },
    [],
  )

  const handleAddTodoSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (title.length < 3) {
        return
      }
      setDisabled(true)
      const { data } = await addTodoMutation({
        variables: {
          title: title,
        },
      })

      if (data) {
        console.log(data)
        setTitle('')
        refetch()
        setDisabled(false)
      } else {
        console.log("Can't add todo")
      }
    },
    [addTodoMutation, title, refetch],
  )

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      const { data } = await deleteTodoMutation({
        variables: {
          id: id,
        },
      })

      if (data) {
        console.log(data)
        refetch()
      }
    },
    [deleteTodoMutation, refetch],
  )

  const handleClickTodo = useCallback<Todo['onClick']>(
    (action, todoId) => {
      switch (action) {
        case 'deleteTodo':
          handleDeleteTodo(todoId)
      }
    },
    [handleDeleteTodo],
  )

  if (loading) {
    return <p>...loading</p>
  }

  if (error) {
    return <Error statusCode={404} />
  }

  if (!data) {
    return <Error statusCode={404} />
  }

  console.log(data)

  return (
    <div className={styles.app}>
      <form onSubmit={handleAddTodoSubmit}>
        <input
          className={styles.input}
          type="text"
          value={title}
          onChange={handleChange}
        />
        <button className={styles.button} type="submit" disabled={disabled}>
          Add
        </button>
      </form>
      <ul className={styles.lists}>
        {data.todos.map((item) => (
          <li
            className={styles.item}
            key={item.id}
            onClick={() => handleClickTodo('deleteTodo', item.id)}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Index
