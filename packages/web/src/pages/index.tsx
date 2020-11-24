import { NextPage } from 'next'
import Error from 'next/error'
import React, { ChangeEvent, useCallback, useState } from 'react'
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useIsCompletedTodoMutation,
  useIsIncompletedTodoMutation,
} from '../generated/graphql'
import styles from './index.module.css'

type Todo = {
  onClick: (
    action: 'delete' | 'isCompleted' | 'isIncompleted',
    todoId: number,
  ) => void
}
type Plan = '今日' | '今週' | '今月' | '来月' | '再来月'

const Index: NextPage = () => {
  const { data, loading, error, refetch } = useGetTodosQuery()
  const [title, setTitle] = useState('')
  const [plan, setPlan] = useState<Plan>('今日')
  const [disabled, setDisabled] = useState(false)
  const [addTodoMutation] = useAddTodoMutation()
  const [deleteTodoMutation] = useDeleteTodoMutation()
  const [isCompletedTodoMutation] = useIsCompletedTodoMutation()
  const [isIncompletedTodoMutation] = useIsIncompletedTodoMutation()

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }, [])

  const handleSelect = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === '今日') {
      setPlan(event.target.value)
    } else if (event.target.value === '今週') {
      setPlan(event.target.value)
    } else if (event.target.value === '今月') {
      setPlan(event.target.value)
    } else if (event.target.value === '来月') {
      setPlan(event.target.value)
    } else if (event.target.value === '再来月') {
      setPlan(event.target.value)
    }
  }, [])

  const handleAddTodoSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (title.length < 1) {
        return
      }
      setDisabled(true)
      const { data } = await addTodoMutation({
        variables: {
          title: title,
          plan: plan,
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
    [addTodoMutation, title, refetch, plan],
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

  const handleFilterCompleted = useCallback(() => {
    console.log('hello')
  }, [])

  const handleIsCompleteTodo = useCallback(
    async (id: number) => {
      const { data } = await isCompletedTodoMutation({
        variables: {
          id: id,
        },
      })

      if (data) {
        console.log(data)
        refetch()
      }
    },
    [isCompletedTodoMutation, refetch],
  )

  const handleIsIncompleteTodo = useCallback(
    async (id: number) => {
      const { data } = await isIncompletedTodoMutation({
        variables: {
          id: id,
        },
      })

      if (data) {
        console.log(data)
        refetch()
      }
    },
    [isIncompletedTodoMutation, refetch],
  )

  const handleClickTodo = useCallback<Todo['onClick']>(
    (action, todoId) => {
      switch (action) {
        case 'delete':
          handleDeleteTodo(todoId)
          break
        case 'isCompleted':
          handleIsCompleteTodo(todoId)
          break
        case 'isIncompleted':
          handleIsIncompleteTodo(todoId)
          break
      }
    },
    [handleDeleteTodo, handleIsCompleteTodo, handleIsIncompleteTodo],
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
        <select onChange={handleSelect}>
          <option value="今日">今日</option>
          <option value="今週">今週</option>
          <option value="今月">今月</option>
          <option value="来月">来月</option>
          <option value="再来月">再来月</option>
        </select>
        <p>{plan}</p>
        <button className={styles.button} type="submit" disabled={disabled}>
          Add
        </button>
      </form>
      <div>
        <p>全て</p>
        <p>完了のみ</p>
        <p>アクティブのみ</p>
      </div>
      <ul className={styles.lists}>
        {data.todos.map((item) => (
          <li className={styles.item} key={item.id}>
            <p onClick={() => handleClickTodo('delete', item.id)}>
              {item.title}
            </p>
            {item.isCompleted ? (
              <p onClick={() => handleClickTodo('isIncompleted', item.id)}>
                完了
              </p>
            ) : (
              <p onClick={() => handleClickTodo('isCompleted', item.id)}>
                未完了
              </p>
            )}
            <p>{item.plan}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Index
