import { NextPage } from 'next'
import Error from 'next/error'
import React from 'react'
import { useAddtodoMutation, useGetTodosQuery } from '../generated/graphql'
import styles from './index.module.css'

const Index: NextPage = () => {
  const { data, loading, error, refetch } = useGetTodosQuery()
  const [title, setTitle] = React.useState('')
  const [disabled, setDisabled] = React.useState(false)
  const [addTodoMutation] = useAddtodoMutation()

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value)
    },
    [],
  )

  const handleSubmit = React.useCallback(
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

  if (loading) {
    return <p>...loading</p>
  }

  if (error) {
    return <Error statusCode={404} />
  }

  if (!data) {
    return <Error statusCode={404} />
  }

  return (
    <div className={styles.app}>
      <form onSubmit={handleSubmit}>
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
          <li className={styles.item} key={item.id}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Index
